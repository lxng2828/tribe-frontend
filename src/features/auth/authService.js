import { jwtDecode } from 'jwt-decode';
import api from '../../services/api';

class AuthService {
    // Đăng nhập
    async login(credentials) {
        try {
            const response = await api.post('/auth/login', credentials);
            const { status, data } = response.data;

            if (!status.success) {
                throw new Error(status.displayMessage || 'Đăng nhập thất bại');
            }

            const token = data.token || data;
            localStorage.setItem('token', token);

            const userInfo = await this.extractUserInfo(token, data.user);
            this.storeUserInfo(userInfo);

            return { token, user: userInfo };
        } catch (error) {
            const message = error.response?.data?.status?.displayMessage || error.message || 'Đăng nhập thất bại';
            throw new Error(message);
        }
    }

    // Đăng ký
    async register(userData) {
        try {
            const response = await api.post('/auth/register', userData);
            const { status, data } = response.data;

            if (!status.success) {
                throw new Error(status.displayMessage || 'Đăng ký thất bại');
            }

            // Nếu có token trả về ngay
            if (data.token) {
                const token = data.token;
                localStorage.setItem('token', token);

                const userInfo = await this.extractUserInfo(token, data.user);
                this.storeUserInfo(userInfo);

                return { token, user: userInfo };
            }

            // Nếu không có token → tự động đăng nhập lại
            return await this.login({
                email: userData.email,
                password: userData.password
            });
        } catch (error) {
            const message = error.response?.data?.status?.displayMessage || error.message || 'Đăng ký thất bại';
            throw new Error(message);
        }
    }

    // Đăng xuất
    async logout() {
        try {
            await api.post('/auth/logout');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('name');
            window.location.href = '/login';
        }
    }

    // Kiểm tra trạng thái đăng nhập
    isAuthenticated() {
        return !!localStorage.getItem('token');
    }

    // Lấy thông tin user từ localStorage
    getCurrentUser() {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    }

    // Gọi API lấy thông tin user
    async getCurrentUserInfo() {
        try {
            const response = await api.get('/auth/me');
            const { status, data } = response.data;

            if (status.success) {
                return data;
            } else {
                throw new Error(status.displayMessage || 'Không thể lấy thông tin user');
            }
        } catch (error) {
            console.error('Error getting user info:', error);
            return null;
        }
    }

    // Lấy token từ localStorage
    getToken() {
        return localStorage.getItem('token');
    }

    // Quên mật khẩu
    async forgotPassword(email) {
        try {
            const response = await api.post('/auth/forgot-password', { email });
            const { status } = response.data;

            if (status.success) {
                return status.displayMessage || 'Email đặt lại mật khẩu đã được gửi';
            } else {
                throw new Error(status.displayMessage || 'Gửi email thất bại');
            }
        } catch (error) {
            const message = error.response?.data?.status?.displayMessage || error.message || 'Gửi email thất bại';
            throw new Error(message);
        }
    }

    // Đặt lại mật khẩu
    async resetPassword(token, newPassword) {
        try {
            const response = await api.post('/auth/reset-password', { token, newPassword });
            const { status } = response.data;

            if (status.success) {
                return status.displayMessage || 'Mật khẩu đã được đặt lại thành công';
            } else {
                throw new Error(status.displayMessage || 'Đặt lại mật khẩu thất bại');
            }
        } catch (error) {
            const message = error.response?.data?.status?.displayMessage || error.message || 'Đặt lại mật khẩu thất bại';
            throw new Error(message);
        }
    }

  
    async extractUserInfo(token, fallbackUser = null) {
        try {
            const decoded = jwtDecode(token);
            return {
                id: decoded.id || decoded.userId || decoded.sub,
                username: decoded.username || decoded.name,
                email: decoded.email,
                fullName: decoded.fullName || decoded.displayName || decoded.name
            };
        } catch (e) {
            // fallback nếu token sai hoặc bị lỗi
            if (fallbackUser) return fallbackUser;
            return await this.getCurrentUserInfo();
        }
    }

   
    storeUserInfo(userInfo) {
        localStorage.setItem('user', JSON.stringify(userInfo));
        const name = userInfo.fullName || userInfo.displayName || userInfo.username || '';
        localStorage.setItem('name', name);
    }
}

const authService = new AuthService();
export default authService;
