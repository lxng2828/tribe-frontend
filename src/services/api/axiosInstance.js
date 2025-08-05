import axios from 'axios';
// import { getCurrentUserToken } from '../services/authService';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:3001',
});

// axiosInstance.interceptors.request.use(
//     async (config) => {
//         const token = await getCurrentUserToken();
//         if (token) {
//             config.headers['Authorization'] = `Bearer ${token}`;
//         }
//         return config;
//     },
//     (error) => {
//         return Promise.reject(error);
//     }
// );

export default axiosInstance;