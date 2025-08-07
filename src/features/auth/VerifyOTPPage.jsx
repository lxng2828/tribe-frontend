import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useState, useEffect } from 'react';

// Validation schema với Yup
const validationSchema = Yup.object({
    otp: Yup.string()
        .length(6, 'Mã OTP phải có 6 chữ số')
        .matches(/^[0-9]+$/, 'Mã OTP chỉ được chứa số')
        .required('Vui lòng nhập mã OTP')
});

const VerifyOTPPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [countdown, setCountdown] = useState(60);
    const [canResend, setCanResend] = useState(false);

    const email = location.state?.email;
    const message = location.state?.message;

    // Redirect nếu không có email
    useEffect(() => {
        if (!email) {
            navigate('/forgot-password');
        }
    }, [email, navigate]);

    // Countdown timer
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setCanResend(true);
        }
    }, [countdown]);

    const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
        setIsSubmitting(true);
        try {
            // Giả lập API call để verify OTP
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Chuyển hướng đến trang đặt lại mật khẩu
            navigate('/reset-password', { 
                state: { 
                    email: email,
                    otp: values.otp,
                    message: 'Xác thực thành công! Vui lòng đặt lại mật khẩu mới.'
                } 
            });
        } catch (error) {
            setFieldError('otp', 'Mã OTP không chính xác. Vui lòng thử lại.');
        } finally {
            setIsSubmitting(false);
            setSubmitting(false);
        }
    };

    const handleResendOTP = async () => {
        setCanResend(false);
        setCountdown(60);
        try {
            // Giả lập API call để gửi lại OTP
            await new Promise(resolve => setTimeout(resolve, 1000));
            // Có thể hiển thị thông báo thành công ở đây
        } catch (error) {
            // Xử lý lỗi
        }
    };

    if (!email) {
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
                                Xác thực email để bảo vệ tài khoản của bạn.
                            </p>
                            <div className="features-list">
                                <div className="feature-item">
                                    <div className="feature-icon">
                                        <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                        </svg>
                                    </div>
                                    <span>Bảo mật 2 lớp</span>
                                </div>
                                <div className="feature-item">
                                    <div className="feature-icon">
                                        <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                        </svg>
                                    </div>
                                    <span>Xác thực nhanh chóng</span>
                                </div>
                                <div className="feature-item">
                                    <div className="feature-icon">
                                        <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                        </svg>
                                    </div>
                                    <span>Bảo vệ tài khoản an toàn</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - OTP Form */}
                    <div className="col-lg-4">
                        <div className="login-card animate-fade-in-right">
                            <div className="card-header text-center mb-4">
                                <h2 className="h3 fw-bold text-white mb-2">Nhập mã OTP</h2>
                                <p className="text-white opacity-75">
                                    Mã đã được gửi đến <strong>{email}</strong>
                                </p>
                            </div>

                            {/* Success Message */}
                            {message && (
                                <div className="alert-custom alert-success mb-4" role="alert">
                                    <div className="alert-icon">
                                        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                        </svg>
                                    </div>
                                    <div className="alert-message">{message}</div>
                                </div>
                            )}

                            <Formik
                                initialValues={{
                                    otp: ''
                                }}
                                validationSchema={validationSchema}
                                onSubmit={handleSubmit}
                            >
                                {({ errors, touched }) => (
                                    <Form>
                                        {/* OTP Field */}
                                        <div className="form-group mb-4">
                                            <div className="input-wrapper">
                                                <div className="input-icon">
                                                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                                    </svg>
                                                </div>
                                                <Field
                                                    type="text"
                                                    name="otp"
                                                    className={`form-control-custom ${errors.otp && touched.otp ? 'is-invalid' : ''}`}
                                                    placeholder="Nhập mã 6 chữ số"
                                                    maxLength="6"
                                                />
                                            </div>
                                            <ErrorMessage name="otp" component="div" className="error-message" />
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
                                                    Đang xác thực...
                                                </>
                                            ) : (
                                                'Xác thực OTP'
                                            )}
                                        </button>

                                        {/* Resend OTP */}
                                        <div className="text-center mb-3">
                                            {canResend ? (
                                                <button
                                                    type="button"
                                                    onClick={handleResendOTP}
                                                    className="forgot-link"
                                                >
                                                    Gửi lại mã OTP
                                                </button>
                                            ) : (
                                                <p className="text-white opacity-75">
                                                    Gửi lại mã sau {countdown}s
                                                </p>
                                            )}
                                        </div>

                                        {/* Back to Forgot Password */}
                                        <div className="text-center">
                                            <Link
                                                to="/forgot-password"
                                                className="forgot-link"
                                            >
                                                ← Quay lại
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

export default VerifyOTPPage; 