import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import LoginPage from './features/auth/LoginPage';
import RegisterPage from './features/auth/RegisterPage';
import ForgotPasswordPage from './features/auth/ForgotPasswordPage';
import VerifyOTPPage from './features/auth/VerifyOTPPage';
import ResetPasswordPage from './features/auth/ResetPasswordPage';
import NewsFeed from './pages/NewsFeed';
import ChatPage from './features/messages/ChatPage';
import ProfilePage from './pages/ProfilePage';
import NotificationsPage from './pages/NotificationsPage';
import SearchResultsPage from './pages/SearchResultsPage';
import FriendsPage from './pages/FriendsPage';
import MainLayout from './layouts/MainLayout';

// Component ProtectedRoute để bảo vệ các route yêu cầu đăng nhập
const ProtectedRoute = () => {
    const { isAuthenticated, loading } = useAuth();
    const location = useLocation();

    // Hiển thị loading khi đang check authentication
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    // Nếu chưa đăng nhập, redirect về login với location hiện tại
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return (
        <MainLayout>
            <Outlet />
        </MainLayout>
    );
};

// Component PublicRoute cho các trang không cần đăng nhập
const PublicRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    // Hiển thị loading khi đang check authentication
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    // Nếu đã đăng nhập, redirect về trang chủ
    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return children;
};

const AppRoutes = () => {
    return (
        <Routes>
            {/* Route công khai */}
            <Route
                path="/login"
                element={
                    <PublicRoute>
                        <LoginPage />
                    </PublicRoute>
                }
            />
            <Route
                path="/register"
                element={
                    <PublicRoute>
                        <RegisterPage />
                    </PublicRoute>
                }
            />
            <Route
                path="/forgot-password"
                element={
                    <PublicRoute>
                        <ForgotPasswordPage />
                    </PublicRoute>
                }
            />
            <Route
                path="/verify-otp"
                element={
                    <PublicRoute>
                        <VerifyOTPPage />
                    </PublicRoute>
                }
            />
            <Route
                path="/reset-password"
                element={
                    <PublicRoute>
                        <ResetPasswordPage />
                    </PublicRoute>
                }
            />

            {/* Route yêu cầu đăng nhập */}
            <Route element={<ProtectedRoute />}>
                <Route path="/" element={<NewsFeed />} />
                <Route path="/messages" element={<ChatPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/profile/:userId" element={<ProfilePage />} />
                <Route path="/notifications" element={<NotificationsPage />} />
                <Route path="/search" element={<SearchResultsPage />} />
                <Route path="/friends" element={<FriendsPage />} />
            </Route>

            {/* Route fallback - redirect về trang chủ */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default AppRoutes;
