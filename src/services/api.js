import axios from 'axios';
import mockApi from './mockApi';

// Base URL cho API - thay đổi theo environment của bạn
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API !== 'false'; // Mặc định sử dụng mock API

// Tạo axios instance
const api = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - thêm token vào headers
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - handle errors và refresh token
api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Nếu token hết hạn (401) và chưa retry
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Thử refresh token
                const response = USE_MOCK_API
                    ? await mockApi.post('/auth/refresh')
                    : await api.post('/auth/refresh');

                const { token } = response.data;

                localStorage.setItem('token', token);
                originalRequest.headers.Authorization = `Bearer ${token}`;
                return api(originalRequest);
            } catch (refreshError) {
                // Refresh token thất bại, đăng xuất user
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

// Override post method để sử dụng mock API khi cần
const originalPost = api.post.bind(api);
api.post = function (url, data, config) {
    // Sử dụng mock API cho auth endpoints trong development
    if (USE_MOCK_API && url.startsWith('/auth/')) {
        return mockApi.post(url, data);
    }
    return originalPost(url, data, config);
};

export default api;
