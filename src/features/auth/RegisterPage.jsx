import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

// Validation schema với Yup
const validationSchema = Yup.object({
    displayName: Yup.string()
        .min(2, 'Họ tên phải có ít nhất 2 ký tự')
        .required('Vui lòng nhập họ tên'),
    email: Yup.string()
        .email('Email không hợp lệ')
        .required('Vui lòng nhập email'),
    password: Yup.string()
        .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
        .required('Vui lòng nhập mật khẩu'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Mật khẩu xác nhận không khớp')
        .required('Vui lòng xác nhận mật khẩu'),
    phoneNumber: Yup.string()
        .matches(/^\+?[0-9]{7,15}$/, 'Số điện thoại không hợp lệ')
        .required('Vui lòng nhập số điện thoại'),
    agreeTerms: Yup.boolean()
        .oneOf([true], 'Bạn phải đồng ý với điều khoản dịch vụ')
});

const RegisterPage = () => {
    const navigate = useNavigate();
    const { register } = useAuth();

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center py-5 register-page">
            <div className="container">
                <div className="row align-items-center justify-content-center">
                    {/* Left Side - Branding (giống LoginPage) */}
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
                                Kết nối với bạn bè và thế giới xung quanh bạn trên Tribe.
                            </p>
                            <div className="features-list">
                                <div className="feature-item">
                                    <div className="feature-icon">
                                        <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                        </svg>
                                    </div>
                                    <span>Chia sẻ khoảnh khắc với bạn bè</span>
                                </div>
                                <div className="feature-item">
                                    <div className="feature-icon">
                                        <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                        </svg>
                                    </div>
                                    <span>Khám phá những điều mới mẻ</span>
                                </div>
                                <div className="feature-item">
                                    <div className="feature-icon">
                                        <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                        </svg>
                                    </div>
                                    <span>Xây dựng cộng đồng của riêng bạn</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Register Form (giống LoginPage) */}
                    <div className="col-lg-4">
                        <div className="register-card animate-fade-in-right">
                            <div className="card-header text-center mb-4">
                                <h2 className="h3 fw-bold text-white mb-2">Tạo tài khoản mới</h2>
                                <p className="text-white opacity-75">Tham gia cộng đồng Tribe ngay hôm nay</p>
                            </div>
                            <Formik
                                initialValues={{
                                    displayName: '',
                                    email: '',
                                    password: '',
                                    confirmPassword: '',
                                    phoneNumber: '',
                                    agreeTerms: false
                                }}
                                validationSchema={validationSchema}
                                onSubmit={async (values, { setSubmitting, setStatus }) => {
                                    try {
                                        setStatus(null);
                                        const { confirmPassword, agreeTerms, ...registerData } = values;
                                        
                                        // Gọi API đăng ký nhưng không tự động đăng nhập
                                        const response = await api.post('/auth/register', registerData);
                                        const { status, data } = response.data;

                                        if (status?.success) {
                                            // Đăng ký thành công → chuyển đến trang đăng nhập
                                            navigate('/login', { 
                                                replace: true,
                                                state: { 
                                                    message: 'Đăng ký thành công! Vui lòng đăng nhập để tiếp tục.',
                                                    email: registerData.email 
                                                }
                                            });
                                        } else {
                                            setStatus(status?.displayMessage || 'Đăng ký thất bại. Vui lòng thử lại.');
                                        }
                                    } catch (error) {
                                        console.error('Register error:', error);
                                        const message = error.response?.data?.status?.displayMessage || error.message || 'Đăng ký thất bại. Vui lòng thử lại.';
                                        setStatus(message);
                                    } finally {
                                        setSubmitting(false);
                                    }
                                }}
                            >
                                {({ errors, touched, isSubmitting, status }) => (
                                    <Form>
                                        {/* Error Alert */}
                                        {status && (
                                            <div className="alert-custom alert-danger mb-4" role="alert">
                                                <div className="alert-icon">
                                                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                                    </svg>
                                                </div>
                                                <div className="alert-message">{status}</div>
                                            </div>
                                        )}

                                        {/* Full Name Field */}
                                        <div className="form-group mb-3">
                                            <div className="input-wrapper">
                                                <div className="input-icon">
                                                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                                                    </svg>
                                                </div>
                                                <Field
                                                    id="displayName"
                                                    name="displayName"
                                                    type="text"
                                                    placeholder="Nhập họ và tên"
                                                    className={`form-control-custom ${errors.displayName && touched.displayName ? 'is-invalid' : ''}`}
                                                />
                                            </div>
                                            <ErrorMessage name="displayName" component="div" className="error-message" />
                                        </div>

                                        {/* Email Field */}
                                        <div className="form-group mb-3">
                                            <div className="input-wrapper">
                                                <div className="input-icon">
                                                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                                                    </svg>
                                                </div>
                                                <Field
                                                    id="email"
                                                    name="email"
                                                    type="email"
                                                    placeholder="Nhập email của bạn"
                                                    className={`form-control-custom ${errors.email && touched.email ? 'is-invalid' : ''}`}
                                                />
                                            </div>
                                            <ErrorMessage name="email" component="div" className="error-message" />
                                        </div>

                                        {/* Password Field */}
                                        <div className="form-group mb-3">
                                            <div className="input-wrapper">
                                                <div className="input-icon">
                                                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                                                    </svg>
                                                </div>
                                                <Field
                                                    id="password"
                                                    name="password"
                                                    type="password"
                                                    placeholder="Nhập mật khẩu (ít nhất 6 ký tự)"
                                                    className={`form-control-custom ${errors.password && touched.password ? 'is-invalid' : ''}`}
                                                />
                                            </div>
                                            <ErrorMessage name="password" component="div" className="error-message" />
                                        </div>

                                        {/* Confirm Password Field */}
                                        <div className="form-group mb-3">
                                            <div className="input-wrapper">
                                                <div className="input-icon">
                                                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                                                    </svg>
                                                </div>
                                                <Field
                                                    id="confirmPassword"
                                                    name="confirmPassword"
                                                    type="password"
                                                    placeholder="Nhập lại mật khẩu"
                                                    className={`form-control-custom ${errors.confirmPassword && touched.confirmPassword ? 'is-invalid' : ''}`}
                                                />
                                            </div>
                                            <ErrorMessage name="confirmPassword" component="div" className="error-message" />
                                        </div>

                                        {/* Phone Number Field */}
                                        <div className="form-group mb-3">
                                            <div className="input-wrapper">
                                                <div className="input-icon">
                                                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                                                    </svg>
                                                </div>
                                                <Field
                                                    id="phoneNumber"
                                                    name="phoneNumber"
                                                    type="text"
                                                    placeholder="Nhập số điện thoại"
                                                    className={`form-control-custom ${errors.phoneNumber && touched.phoneNumber ? 'is-invalid' : ''}`}
                                                />
                                            </div>
                                            <ErrorMessage name="phoneNumber" component="div" className="error-message" />
                                        </div>

                                        {/* Terms Agreement */}
                                        <div className="form-group mb-4">
                                            <div className="terms-checkbox">
                                                <Field
                                                    id="agreeTerms"
                                                    name="agreeTerms"
                                                    type="checkbox"
                                                    className="form-check-input-custom"
                                                />
                                                <label className="form-check-label-custom" htmlFor="agreeTerms">
                                                    Tôi đồng ý với{' '}
                                                    <a href="#" className="terms-link">
                                                        Điều khoản dịch vụ
                                                    </a>{' '}
                                                    và{' '}
                                                    <a href="#" className="terms-link">
                                                        Chính sách bảo mật
                                                    </a>
                                                </label>
                                            </div>
                                            <ErrorMessage name="agreeTerms" component="div" className="error-message" />
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
                                                    Đang đăng ký...
                                                </>
                                            ) : (
                                                'Đăng ký'
                                            )}
                                        </button>

                                        {/* Divider */}
                                        <div className="divider mb-4">
                                            <span>hoặc</span>
                                        </div>

                                        {/* Login Link */}
                                        <div className="text-center">
                                            <span className="text-white opacity-75">
                                                Đã có tài khoản?{' '}
                                                <Link
                                                    to="/login"
                                                    className="btn-register"
                                                >
                                                    Đăng nhập ngay
                                                </Link>
                                            </span>
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

export default RegisterPage;
