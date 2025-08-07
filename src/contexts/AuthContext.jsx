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
            const { token, user: newUser } = await authService.register(userData);
            setUser(newUser);
            setIsAuthenticated(true);
            return { success: true, user: newUser };
        } catch (error) {
            console.error('Register error:', error);
            return { success: false, error: error.message };
        }
    };

    // Đăng xuất
    const logout = () => {
        authService.logout();
        setUser(null);
        setIsAuthenticated(false);
    };

    // Cập nhật thông tin user
    const updateUser = (userData) => {
        setUser(userData);
        console.log('User updated:', userData);
        
        localStorage.setItem('user', JSON.stringify(userData));
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
        checkAuth
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
