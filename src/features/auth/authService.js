import { jwtDecode } from 'jwt-decode';
import api from '../../services/api';


class AuthService {
    // Đăng nhập
    async login(credentials) {
        try {
            const response = await api.post('/auth/login', credentials);
            const { status, data } = response.data;

            if (status.code === '00' && status.success) {
                const token = data.token || data;
                localStorage.setItem('token', token);

                // Lấy thông tin user đầy đủ từ API profile
                const userInfo = await this.getCurrentUserInfo();
                if (userInfo) {
                    this.storeUserInfo(userInfo);
                    return { token, user: userInfo };
                } else {
                    // Fallback nếu không lấy được thông tin đầy đủ
                    const fallbackUserInfo = await this.extractUserInfo(token, data.user);
                    this.storeUserInfo(fallbackUserInfo);
                    return { token, user: fallbackUserInfo };
                }
            } else {
                throw new Error(status.displayMessage || status.message || 'Đăng nhập thất bại');
            }
        } catch (error) {
            const message = error.response?.data?.status?.displayMessage || 
                           error.response?.data?.status?.message || 
                           error.message || 
                           'Đăng nhập thất bại';

            throw new Error(message);
        }
    }

    // Đăng ký
    async register(userData) {
        try {
            // Chuẩn bị dữ liệu theo format API backend
            const dataToSend = {
                email: userData.email,
                password: userData.password,
                displayName: userData.displayName || userData.fullName,
                phoneNumber: userData.phoneNumber,
                birthday: userData.birthday,
                avatarUrl: userData.avatarUrl
            };

            // Loại bỏ các trường rỗng
            Object.keys(dataToSend).forEach(key => {
                if (!dataToSend[key]) delete dataToSend[key];
            });

            const response = await api.post('/auth/register', dataToSend);
            const { status, data } = response.data;

            if (status.code === '00' && status.success) {

                return { 
                    success: true, 
                    message: status.displayMessage || 'Đăng ký thành công',
                    data: data 
                };
            } else {
                throw new Error(status.displayMessage || status.message || 'Đăng ký thất bại');
            }
        } catch (error) {
            const message = error.response?.data?.status?.displayMessage || 
                           error.response?.data?.status?.message || 
                           error.message || 
                           'Đăng ký thất bại';

            throw new Error(message);
        }
    }

    // Đăng xuất
    async logout() {
        try {
            await api.post('/auth/logout');

        } catch (error) {
            console.error('Logout error:', error.message);
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
            const response = await api.get('/users/profile');
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

    // Quên mật khẩu - Gửi OTP
    async forgotPassword(email) {
        try {
            const response = await api.post('/auth/forgot-password', { email });
            const { status, data } = response.data;

            if (status.code === '00') {

                return data || 'Nếu email tồn tại, mã OTP đã được gửi.';
            } else {
                throw new Error(status.message || 'Gửi OTP thất bại');
            }
        } catch (error) {
            const message = error.response?.data?.status?.message || error.response?.data?.status?.displayMessage || error.message || 'Gửi OTP thất bại';

            throw new Error(message);
        }
    }

    // Xác thực OTP
    async verifyOTP(email, otp) {
        try {
            const response = await api.post('/auth/verify-otp', { email, otp });
            const { status, data } = response.data;

            if (status.code === '00') {

                return data || 'Mã OTP hợp lệ';
            } else {
                throw new Error(status.message || 'Mã OTP không hợp lệ');
            }
        } catch (error) {
            const message = error.response?.data?.status?.message || error.response?.data?.status?.displayMessage || error.message || 'Xác thực OTP thất bại';

            throw new Error(message);
        }
    }

    // Đặt lại mật khẩu với OTP
    async resetPasswordWithOTP(email, otp, newPassword) {
        try {
            const response = await api.post('/auth/reset-password-otp', { 
                email, 
                otp, 
                newPassword 
            });
            const { status, data } = response.data;

            if (status.code === '00') {

                return data || 'Mật khẩu đã được đặt lại thành công';
            } else {
                throw new Error(status.message || 'Đặt lại mật khẩu thất bại');
            }
        } catch (error) {
            const message = error.response?.data?.status?.message || error.response?.data?.status?.displayMessage || error.message || 'Đặt lại mật khẩu thất bại';

            throw new Error(message);
        }
    }

    // Đặt lại mật khẩu (API cũ - giữ lại để tương thích)
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
