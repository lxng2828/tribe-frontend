import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

const VerifyOTPPage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const email = location.state?.email;
    const message = location.state?.message;
    const isEmailSent = location.state?.isEmailSent;

    // Redirect nếu không có email hoặc email chưa được gửi
    useEffect(() => {
        if (!email || !isEmailSent) {
            navigate('/forgot-password');
        }
    }, [email, isEmailSent, navigate]);

    const handleResendEmail = async () => {
        try {
            // Có thể thêm logic gửi lại email ở đây nếu cần
            navigate('/forgot-password');
        } catch (error) {
            console.error('Error resending email:', error);
        }
    };

    if (!email || !isEmailSent) {
        return null;
    }

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center py-5 login-page">
            <div className="container">
                <div className="row align-items-center justify-content-center">
                    {/* Left Side - Branding */}
                    <div className="col-lg-6 mb-5 mb-lg-0">
                        <div className="text-center text-lg-start animate-fade-in-left">
                            <div className="brand-section mb-4">
                                <div className="logo-container mb-3">
                                    <div className="logo-circle">
                                        <span className="logo-text">T</span>
                                    </div>
                                </div>
                                <h1 className="display-3 fw-bold mb-3 text-gradient">
                                    tribe
                                </h1>
                            </div>
                            <p className="lead fs-3 mb-4 text-white opacity-90">
                                Kiểm tra email của bạn để hoàn tất quá trình đặt lại mật khẩu.
                            </p>
                            <div className="features-list">
                                <div className="feature-item">
                                    <div className="feature-icon">
                                        <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                        </svg>
                                    </div>
                                    <span>Email đã được gửi thành công</span>
                                </div>
                                <div className="feature-item">
                                    <div className="feature-icon">
                                        <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                        </svg>
                                    </div>
                                    <span>Liên kết có hiệu lực trong 30 phút</span>
                                </div>
                                <div className="feature-item">
                                    <div className="feature-icon">
                                        <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                        </svg>
                                    </div>
                                    <span>Bảo mật và an toàn</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Email Sent Confirmation */}
                    <div className="col-lg-4">
                        <div className="login-card animate-fade-in-right">
                            <div className="card-header text-center mb-4">
                                <h2 className="h3 fw-bold text-white mb-2">Kiểm tra email</h2>
                                <p className="text-white opacity-75">
                                    Chúng tôi đã gửi liên kết đặt lại mật khẩu đến <strong>{email}</strong>
                                </p>
                            </div>

                            {/* Success Message */}
                            <div className="alert-custom alert-success mb-4" role="alert">
                                <div className="alert-icon">
                                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                    </svg>
                                </div>
                                <div className="alert-message">
                                    {message || 'Email đặt lại mật khẩu đã được gửi thành công!'}
                                </div>
                            </div>

                            {/* Instructions */}
                            <div className="instructions mb-4">
                                <h6 className="text-white mb-3">Hướng dẫn:</h6>
                                <ol className="text-white opacity-75">
                                    <li>Kiểm tra hộp thư email của bạn</li>
                                    <li>Nhấn vào liên kết "Đặt lại mật khẩu" trong email</li>
                                    <li>Nhập mật khẩu mới khi được chuyển hướng</li>
                                    <li>Đăng nhập với mật khẩu mới</li>
                                </ol>
                            </div>

                            {/* Action Buttons */}
                            <div className="d-grid gap-3">
                                <button
                                    type="button"
                                    onClick={handleResendEmail}
                                    className="btn btn-outline-light"
                                >
                                    Gửi lại email
                                </button>

                                <Link
                                    to="/login"
                                    className="btn btn-outline-light"
                                >
                                    Quay lại đăng nhập
                                </Link>
                            </div>

                            {/* Additional Info */}
                            <div className="text-center mt-4">
                                <p className="text-white opacity-75 small">
                                    Không nhận được email? Kiểm tra thư mục spam hoặc 
                                    <button 
                                        type="button" 
                                        onClick={handleResendEmail}
                                        className="btn-link text-white"
                                    >
                                        gửi lại
                                    </button>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerifyOTPPage; 