import api from '../../services/api';

class AuthService {
    // Đăng nhập
    async login(credentials) {
        try {
            const response = await api.post('/auth/login', credentials);
            const { token, user } = response.data;

            // Lưu token vào localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            return { token, user };
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Đăng nhập thất bại');
        }
    }

    // Đăng ký
    async register(userData) {
        try {
            const response = await api.post('/auth/register', userData);
            const { token, user } = response.data;

            // Lưu token vào localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            return { token, user };
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Đăng ký thất bại');
        }
    }

    // Đăng xuất
    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Redirect to login page
        window.location.href = '/login';
    }

    // Kiểm tra trạng thái đăng nhập
    isAuthenticated() {
        const token = localStorage.getItem('token');
        return !!token;
    }

    // Lấy thông tin user hiện tại
    getCurrentUser() {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    }

    // Lấy token
    getToken() {
        return localStorage.getItem('token');
    }

    // Làm mới token
    async refreshToken() {
        try {
            const response = await api.post('/auth/refresh');
            const { token } = response.data;

            localStorage.setItem('token', token);
            return token;
        } catch (error) {
            this.logout();
            throw new Error('Phiên đăng nhập đã hết hạn');
        }
    }

    // Quên mật khẩu
    async forgotPassword(email) {
        try {
            await api.post('/auth/forgot-password', { email });
            return 'Email đặt lại mật khẩu đã được gửi';
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Gửi email thất bại');
        }
    }

    // Đặt lại mật khẩu
    async resetPassword(token, newPassword) {
        try {
            await api.post('/auth/reset-password', { token, password: newPassword });
            return 'Mật khẩu đã được đặt lại thành công';
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Đặt lại mật khẩu thất bại');
        }
    }

    // Thay đổi mật khẩu
    async changePassword(currentPassword, newPassword) {
        try {
            await api.post('/auth/change-password', {
                currentPassword,
                newPassword
            });
            return 'Mật khẩu đã được thay đổi thành công';
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Thay đổi mật khẩu thất bại');
        }
    }
}

const authService = new AuthService();
export default authService;
