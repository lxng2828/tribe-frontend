import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useState, useEffect } from 'react';
import authService from './authService';

// Validation schema với Yup
const validationSchema = Yup.object({
    password: Yup.string()
        .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Mật khẩu phải chứa chữ hoa, chữ thường và số')
        .required('Vui lòng nhập mật khẩu mới'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Mật khẩu xác nhận không khớp')
        .required('Vui lòng xác nhận mật khẩu')
});

const ResetPasswordPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [email, setEmail] = useState(null);
    const [otp, setOtp] = useState(null);

    // Lấy email và OTP từ location state
    useEffect(() => {
        const emailFromState = location.state?.email;
        const otpFromState = location.state?.otp;
        
        if (!emailFromState || !otpFromState) {
            navigate('/forgot-password');
            return;
        }
        
        setEmail(emailFromState);
        setOtp(otpFromState);
    }, [location.state, navigate]);

    const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
        setIsSubmitting(true);
        try {
            const message = await authService.resetPasswordWithOTP(email, otp, values.password);
            
            // Chuyển hướng đến trang đăng nhập với thông báo thành công
            navigate('/login', { 
                state: { 
                    message: message || 'Đặt lại mật khẩu thành công! Vui lòng đăng nhập với mật khẩu mới.',
                    email: email
                } 
            });
        } catch (error) {
            setFieldError('password', error.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
        } finally {
            setIsSubmitting(false);
            setSubmitting(false);
        }
    };

    if (!email || !otp) {
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
                                Tạo mật khẩu mới an toàn cho tài khoản của bạn.
                            </p>
                            <div className="features-list">
                                <div className="feature-item">
                                    <div className="feature-icon">
                                        <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                        </svg>
                                    </div>
                                    <span>Mật khẩu mạnh và an toàn</span>
                                </div>
                                <div className="feature-item">
                                    <div className="feature-icon">
                                        <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                        </svg>
                                    </div>
                                    <span>Bảo vệ tài khoản tốt hơn</span>
                                </div>
                                <div className="feature-item">
                                    <div className="feature-icon">
                                        <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                        </svg>
                                    </div>
                                    <span>Đăng nhập ngay sau khi hoàn thành</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Reset Password Form */}
                    <div className="col-lg-4">
                        <div className="login-card animate-fade-in-right">
                            <div className="card-header text-center mb-4">
                                <h2 className="h3 fw-bold text-white mb-2">Đặt lại mật khẩu</h2>
                                <p className="text-white opacity-75">
                                    Tạo mật khẩu mới cho {email}
                                </p>
                            </div>

                            {/* Success Message */}
                            {location.state?.message && (
                                <div className="alert-custom alert-success mb-4" role="alert">
                                    <div className="alert-icon">
                                        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                        </svg>
                                    </div>
                                    <div className="alert-message">
                                        {location.state.message}
                                    </div>
                                </div>
                            )}

                            <Formik
                                initialValues={{
                                    password: '',
                                    confirmPassword: ''
                                }}
                                validationSchema={validationSchema}
                                onSubmit={handleSubmit}
                            >
                                {({ errors, touched }) => (
                                    <Form>
                                        {/* New Password Field */}
                                        <div className="form-group mb-3">
                                            <div className="input-wrapper">
                                                <div className="input-icon">
                                                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                                                    </svg>
                                                </div>
                                                <Field
                                                    type={showPassword ? "text" : "password"}
                                                    name="password"
                                                    className={`form-control-custom ${errors.password && touched.password ? 'is-invalid' : ''}`}
                                                    placeholder="Mật khẩu mới"
                                                />
                                                <button
                                                    type="button"
                                                    className="password-toggle"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                >
                                                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                                                        {showPassword ? (
                                                            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                                                        ) : (
                                                            <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
                                                        )}
                                                    </svg>
                                                </button>
                                            </div>
                                            <ErrorMessage name="password" component="div" className="error-message" />
                                        </div>

                                        {/* Confirm Password Field */}
                                        <div className="form-group mb-4">
                                            <div className="input-wrapper">
                                                <div className="input-icon">
                                                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                                                    </svg>
                                                </div>
                                                <Field
                                                    type={showConfirmPassword ? "text" : "password"}
                                                    name="confirmPassword"
                                                    className={`form-control-custom ${errors.confirmPassword && touched.confirmPassword ? 'is-invalid' : ''}`}
                                                    placeholder="Xác nhận mật khẩu mới"
                                                />
                                                <button
                                                    type="button"
                                                    className="password-toggle"
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                >
                                                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                                                        {showConfirmPassword ? (
                                                            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                                                        ) : (
                                                            <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
                                                        )}
                                                    </svg>
                                                </button>
                                            </div>
                                            <ErrorMessage name="confirmPassword" component="div" className="error-message" />
                                        </div>

                                        {/* Password Requirements */}
                                        <div className="password-requirements mb-4">
                                            <p className="text-white opacity-75 mb-2">Mật khẩu phải có:</p>
                                            <ul className="requirements-list">
                                                <li className={errors.password && touched.password ? 'invalid' : ''}>
                                                    Ít nhất 8 ký tự
                                                </li>
                                                <li className={errors.password && touched.password ? 'invalid' : ''}>
                                                    Chứa chữ hoa và chữ thường
                                                </li>
                                                <li className={errors.password && touched.password ? 'invalid' : ''}>
                                                    Chứa ít nhất 1 số
                                                </li>
                                            </ul>
                                        </div>

                                        {/* Submit Button */}
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="btn-login w-100 mb-4"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <div className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></div>
                                                    Đang đặt lại mật khẩu...
                                                </>
                                            ) : (
                                                'Đặt lại mật khẩu'
                                            )}
                                        </button>

                                        {/* Back to Login */}
                                        <div className="text-center">
                                            <Link
                                                to="/login"
                                                className="forgot-link"
                                            >
                                                ← Quay lại đăng nhập
                                            </Link>
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordPage; 