import api from '../../services/api';

class AuthService {
    // Đăng nhập
    async login(credentials) {
        try {
            const response = await api.post('/auth/login', credentials);
            const { status, data } = response.data;

            if (status.success) {
                const token = data.token || data;

                // Lưu token vào localStorage
                localStorage.setItem('token', token);

                // Lấy thông tin user từ API hoặc decode JWT
                let userInfo;
                if (data.user) {
                    userInfo = data.user;
                } else {
                    // Giải mã phần payload của JWT (Base64URL Decode)
                    try {
                        const payloadBase64 = token.split('.')[1];
                        const payloadJson = atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'));
                        const decoded = JSON.parse(payloadJson);

                        userInfo = {
                            id: decoded.id || decoded.userId || decoded.sub,
                            username: decoded.name || decoded.username,
                            email: decoded.email,
                            fullName: decoded.fullName || decoded.displayName || decoded.name
                        };
                    } catch (jwtError) {
                        // Nếu không decode được JWT, lấy thông tin từ API
                        userInfo = await this.getCurrentUserInfo();
                    }
                }

                // Lưu user info vào localStorage
                localStorage.setItem('user', JSON.stringify(userInfo));

                return { token, user: userInfo };
            } else {
                throw new Error(status.displayMessage || 'Đăng nhập thất bại');
            }
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

            if (status.success) {
                // Nếu đăng ký trả về token luôn
                if (data.token) {
                    const token = data.token;
                    localStorage.setItem('token', token);

                    let userInfo = data.user;
                    if (!userInfo) {
                        // Giải mã JWT hoặc lấy từ API
                        try {
                            const payloadBase64 = token.split('.')[1];
                            const payloadJson = atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'));
                            const decoded = JSON.parse(payloadJson);

                            userInfo = {
                                id: decoded.id || decoded.userId || decoded.sub,
                                username: decoded.name || decoded.username,
                                email: decoded.email,
                                fullName: decoded.fullName || decoded.displayName || decoded.name
                            };
                        } catch (jwtError) {
                            userInfo = await this.getCurrentUserInfo();
                        }
                    }

                    localStorage.setItem('user', JSON.stringify(userInfo));
                    return { token, user: userInfo };
                } else {
                    // Đăng ký thành công → Tự động đăng nhập
                    return await this.login({
                        email: userData.email,
                        password: userData.password
                    });
                }
            } else {
                throw new Error(status.displayMessage || 'Đăng ký thất bại');
            }
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
            // Xóa token & user khỏi localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('user');

            // Chuyển về trang login
            window.location.href = '/login';
        }
    }

    // Kiểm tra có đang đăng nhập không
    isAuthenticated() {
        return !!localStorage.getItem('token');
    }

    // Lấy user từ localStorage
    getCurrentUser() {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    }

    // Lấy user info từ server (nếu cần)
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
}

const authService = new AuthService();
export default authService;
