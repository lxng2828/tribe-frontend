import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../features/auth/authService';

// Tạo AuthContext
const AuthContext = createContext(null);

// Custom hook để sử dụng AuthContext
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// AuthProvider component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Kiểm tra authentication khi component mount
    useEffect(() => {
        checkAuth();
    }, []);

    // Refresh user info khi component mount nếu đã đăng nhập
    useEffect(() => {
        if (isAuthenticated && user) {
            refreshUserInfo();
        }
    }, [isAuthenticated]);

    const checkAuth = () => {
        try {
            const token = authService.getToken();
            const userData = authService.getCurrentUser();

            if (token && userData) {
                setUser(userData);
                setIsAuthenticated(true);
            } else {
                setUser(null);
                setIsAuthenticated(false);
            }
        } catch (error) {
            console.error('Error checking auth:', error);
            setUser(null);
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    };

    // Đăng nhập
    const login = async (credentials) => {
        try {
            const { token, user: userData } = await authService.login(credentials);
            setUser(userData);
            setIsAuthenticated(true);
            return { success: true, user: userData };
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: error.message };
        }
    };

    // Đăng ký
    const register = async (userData) => {
        try {
            const result = await authService.register(userData);
            // Đăng ký thành công nhưng không tự động đăng nhập
            // User sẽ cần đăng nhập riêng
            return result;
        } catch (error) {
            console.error('Register error:', error);
            return { success: false, error: error.message };
        }
    };

    // Đăng xuất
    const logout = () => {
        // Gọi authService.logout() sẽ tự động xử lý delay và chuyển hướng
        authService.logout();
        // Cập nhật state ngay lập tức để UI phản hồi
        setUser(null);
        setIsAuthenticated(false);
    };

    // Cập nhật thông tin user
    const updateUser = (userData) => {
        setUser(userData);
        console.log('User updated:', userData);
        
        localStorage.setItem('user', JSON.stringify(userData));
    };

    // Refresh thông tin user từ API
    const refreshUserInfo = async () => {
        try {
            const userData = await authService.getCurrentUserInfo();
            if (userData) {
                setUser(userData);
                localStorage.setItem('user', JSON.stringify(userData));
                return userData;
            }
        } catch (error) {
            console.error('Error refreshing user info:', error);
        }
        return null;
    };

    // Value để provide cho children components
    const value = {
        user,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
        updateUser,
        refreshUserInfo,
        checkAuth
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
