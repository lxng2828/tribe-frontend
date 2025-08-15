import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Formik, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useState, useEffect } from 'react';
import authService from './authService';
import { authToasts } from '../../utils/toast';

import OTPInput from '../../components/OTPInput';
import SuccessMessage from '../../components/SuccessMessage';

// Validation schema với Yup
const validationSchema = Yup.object({
    otp: Yup.string()
        .matches(/^\d{6}$/, 'Mã OTP phải có 6 số')
        .required('Vui lòng nhập mã OTP')
});

const VerifyOTPPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [countdown, setCountdown] = useState(0);

    const email = location.state?.email;
    const message = location.state?.message;
    const isEmailSent = location.state?.isEmailSent;

    // Redirect nếu không có email hoặc email chưa được gửi
    useEffect(() => {
        if (!email || !isEmailSent) {
            navigate('/forgot-password');
        }
    }, [email, isEmailSent, navigate]);

    // Countdown timer cho resend
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    const handleSubmit = async (values, { setSubmitting }) => {
        setIsSubmitting(true);
        try {
            await authService.verifyOTP(email, values.otp);
            
            // Chuyển hướng đến trang đặt lại mật khẩu
            navigate('/reset-password', { 
                state: { 
                    email: email,
                    otp: values.otp,
                    message: 'Mã OTP hợp lệ. Vui lòng nhập mật khẩu mới.'
                } 
            });
        } catch (error) {
            // Error đã được xử lý trong authService
        } finally {
            setIsSubmitting(false);
            setSubmitting(false);
        }
    };

    const handleResendOTP = async () => {
        setIsResending(true);
        try {
            await authService.forgotPassword(email);
            setCountdown(60); // 60 giây countdown
    
        } catch (error) {
            // Error đã được xử lý trong authService
        } finally {
            setIsResending(false);
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
                                Nhập mã OTP để xác thực và đặt lại mật khẩu.
                            </p>
                            <div className="features-list">
                                <div className="feature-item">
                                    <div className="feature-icon">
                                        <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                        </svg>
                                    </div>
                                    <span>Mã OTP 6 số an toàn</span>
                                </div>
                                <div className="feature-item">
                                    <div className="feature-icon">
                                        <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                        </svg>
                                    </div>
                                    <span>Có hiệu lực trong 5 phút</span>
                                </div>
                                <div className="feature-item">
                                    <div className="feature-icon">
                                        <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                        </svg>
                                    </div>
                                    <span>Xác thực nhanh chóng</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - OTP Verification Form */}
                    <div className="col-lg-4">
                        <div className="login-card animate-fade-in-right">
                            <div className="card-header text-center mb-4">
                                <h2 className="h3 fw-bold text-white mb-2">Xác thực OTP</h2>
                                <p className="text-white opacity-75">
                                    Nhập mã OTP đã được gửi đến <strong>{email}</strong>
                                </p>
                            </div>

                            {/* Success Message */}
                            {message && (
                                <SuccessMessage message={message} />
                            )}

                            <Formik
                                initialValues={{
                                    otp: ''
                                }}
                                validationSchema={validationSchema}
                                onSubmit={handleSubmit}
                                enableReinitialize={false}
                            >
                                {({ errors, touched, setFieldValue, setFieldTouched, values }) => (
                                    <Form>
                                        {/* OTP Field */}
                                        <div className="form-group mb-4">
                                            <OTPInput
                                                value={values.otp}
                                                onChange={(value) => {
                                                    setFieldValue('otp', value);
                                                    setFieldTouched('otp', true);
                                                }}
                                                onComplete={(value) => {
                                                    setFieldValue('otp', value);
                                                    setFieldTouched('otp', true);
                                                }}
                                                disabled={isSubmitting}
                                                error={errors.otp && touched.otp}
                                            />
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

                                        {/* Resend OTP Button */}
                                        <div className="text-center mb-4">
                                            <button
                                                type="button"
                                                onClick={handleResendOTP}
                                                disabled={isResending || countdown > 0}
                                                className="btn btn-outline-light"
                                            >
                                                {isResending ? (
                                                    <>
                                                        <div className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></div>
                                                        Đang gửi lại...
                                                    </>
                                                ) : countdown > 0 ? (
                                                    `Gửi lại sau ${countdown}s`
                                                ) : (
                                                    'Gửi lại mã OTP'
                                                )}
                                            </button>
                                        </div>

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

                            {/* Instructions */}
                            <div className="instructions mt-4">
                                <h6 className="text-white mb-3">Hướng dẫn:</h6>
                                <ol className="text-white opacity-75">
                                    <li>Kiểm tra hộp thư email của bạn</li>
                                    <li>Nhập mã OTP 6 số từ email</li>
                                    <li>Nhấn "Xác thực OTP" để tiếp tục</li>
                                    <li>Nhập mật khẩu mới khi được chuyển hướng</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerifyOTPPage; 