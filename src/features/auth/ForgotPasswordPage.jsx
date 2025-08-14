import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';
import authService from './authService';


// Validation schema với Yup
const validationSchema = Yup.object({
    email: Yup.string()
        .email('Email không hợp lệ')
        .required('Vui lòng nhập email')
});

const ForgotPasswordPage = () => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (values, { setSubmitting }) => {
        setIsSubmitting(true);
        try {
            const message = await authService.forgotPassword(values.email);
            
            // Chuyển hướng sau khi gửi OTP thành công
            navigate('/verify-otp', { 
                state: { 
                    email: values.email,
                    message: message,
                    isEmailSent: true
                } 
            });
        } catch (error) {
            // Error đã được xử lý trong authService
        } finally {
            setIsSubmitting(false);
            setSubmitting(false);
        }
    };

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
                                Khôi phục mật khẩu của bạn một cách an toàn và nhanh chóng.
                            </p>
                            <div className="features-list">
                                <div className="feature-item">
                                    <div className="feature-icon">
                                        <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                        </svg>
                                    </div>
                                    <span>Bảo mật thông tin cá nhân</span>
                                </div>
                                <div className="feature-item">
                                    <div className="feature-icon">
                                        <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                        </svg>
                                    </div>
                                    <span>Xác thực qua mã OTP</span>
                                </div>
                                <div className="feature-item">
                                    <div className="feature-icon">
                                        <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                        </svg>
                                    </div>
                                    <span>Quy trình đơn giản và nhanh chóng</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Forgot Password Form */}
                    <div className="col-lg-4">
                        <div className="login-card animate-fade-in-right">
                            <div className="card-header text-center mb-4">
                                <h2 className="h3 fw-bold text-white mb-2">Quên mật khẩu?</h2>
                                <p className="text-white opacity-75">Nhập email để nhận mã OTP đặt lại mật khẩu</p>
                            </div>

                            <Formik
                                initialValues={{
                                    email: ''
                                }}
                                validationSchema={validationSchema}
                                onSubmit={handleSubmit}
                            >
                                {({ errors, touched }) => (
                                    <Form>
                                        {/* Email Field */}
                                        <div className="form-group mb-4">
                                            <div className="input-wrapper">
                                                <div className="input-icon">
                                                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                                                    </svg>
                                                </div>
                                                <Field
                                                    type="email"
                                                    name="email"
                                                    className={`form-control-custom ${errors.email && touched.email ? 'is-invalid' : ''}`}
                                                    placeholder="Nhập email của bạn"
                                                />
                                            </div>
                                            <ErrorMessage name="email" component="div" className="error-message" />
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
                                                    Đang gửi OTP...
                                                </>
                                            ) : (
                                                'Gửi mã OTP'
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

export default ForgotPasswordPage; 