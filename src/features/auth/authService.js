import api from '../../services/api';

class AuthService {
    // Đăng nhập
    async login(credentials) {
        try {
            const response = await api.post('/auth/login', credentials);
            const { status, data } = response.data;

            if (status.success) {
                // Lưu token vào localStorage
                localStorage.setItem('token', data);
                
                // Lấy thông tin user từ token hoặc gọi API riêng
                const userInfo = await this.getCurrentUserInfo();
                localStorage.setItem('user', JSON.stringify(userInfo));

                return { token: data, user: userInfo };
            } else {
                throw new Error(status.displayMessage || 'Đăng nhập thất bại');
            }
        } catch (error) {
            if (error.response?.data?.status) {
                throw new Error(error.response.data.status.displayMessage || 'Đăng nhập thất bại');
            }
            throw new Error(error.message || 'Đăng nhập thất bại');
        }
    }

    // Đăng ký
    async register(userData) {
        try {
            const response = await api.post('/auth/register', userData);
            const { status, data } = response.data;

            if (status.success) {
                // Sau khi đăng ký thành công, tự động đăng nhập
                return await this.login({
                    email: userData.email,
                    password: userData.password
                });
            } else {
                throw new Error(status.displayMessage || 'Đăng ký thất bại');
            }
        } catch (error) {
            if (error.response?.data?.status) {
                throw new Error(error.response.data.status.displayMessage || 'Đăng ký thất bại');
            }
            throw new Error(error.message || 'Đăng ký thất bại');
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
            // Redirect to login page
            window.location.href = '/login';
        }
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

    // Lấy thông tin user từ server
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

    // Lấy token
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
            if (error.response?.data?.status) {
                throw new Error(error.response.data.status.displayMessage || 'Gửi email thất bại');
            }
            throw new Error(error.message || 'Gửi email thất bại');
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
            if (error.response?.data?.status) {
                throw new Error(error.response.data.status.displayMessage || 'Đặt lại mật khẩu thất bại');
            }
            throw new Error(error.message || 'Đặt lại mật khẩu thất bại');
        }
    }
}

const authService = new AuthService();
export default authService;
