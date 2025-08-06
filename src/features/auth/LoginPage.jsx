import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../contexts/AuthContext';

// Validation schema với Yup
const validationSchema = Yup.object({
    email: Yup.string()
        .email('Email không hợp lệ')
        .required('Vui lòng nhập email'),
    password: Yup.string()
        .required('Vui lòng nhập mật khẩu')
});

const LoginPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    // Redirect path sau khi đăng nhập thành công
    const from = location.state?.from?.pathname || '/';

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

                    {/* Right Side - Login Form */}
                    <div className="col-lg-4">
                        <div className="login-card animate-fade-in-right">
                            <div className="card-header text-center mb-4">
                                <h2 className="h3 fw-bold text-white mb-2">Đăng nhập</h2>
                                <p className="text-white opacity-75">Chào mừng bạn trở lại!</p>
                            </div>

                            <Formik
                                initialValues={{
                                    email: '',
                                    password: '',
                                    rememberMe: false
                                }}
                                validationSchema={validationSchema}
                                onSubmit={async (values, { setSubmitting, setFieldError }) => {
                                    try {
                                        await login({ email: values.email, password: values.password });
                                        navigate(from, { replace: true });
                                    } catch (error) {
                                        setFieldError('password', error.message || 'Email hoặc mật khẩu không chính xác');
                                    } finally {
                                        setSubmitting(false);
                                    }
                                }}
                            >
                                {({ isSubmitting, errors, touched }) => (
                                    <Form>
                                        {/* Email Field */}
                                        <div className="form-group mb-3">
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
                                                    placeholder="Email hoặc số điện thoại"
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
                                                    type="password"
                                                    name="password"
                                                    className={`form-control-custom ${errors.password && touched.password ? 'is-invalid' : ''}`}
                                                    placeholder="Mật khẩu"
                                                />
                                            </div>
                                            <ErrorMessage name="password" component="div" className="error-message" />
                                        </div>

                                        {/* Remember Me & Forgot Password */}
                                        <div className="d-flex justify-content-between align-items-center mb-4">
                                            <div className="form-check">
                                                <Field
                                                    type="checkbox"
                                                    name="rememberMe"
                                                    className="form-check-input-custom"
                                                    id="rememberMe"
                                                />
                                                <label className="form-check-label-custom" htmlFor="rememberMe">
                                                    Ghi nhớ đăng nhập
                                                </label>
                                            </div>
                                            <Link
                                                to="/forgot-password"
                                                className="forgot-link"
                                            >
                                                Quên mật khẩu?
                                            </Link>
                                        </div>

                                        {/* Login Button */}
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="btn-login w-100 mb-4"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <div className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></div>
                                                    Đang đăng nhập...
                                                </>
                                            ) : (
                                                'Đăng nhập'
                                            )}
                                        </button>

                                        {/* Divider */}
                                        <div className="divider mb-4">
                                            <span>hoặc</span>
                                        </div>

                                        {/* Create Account Button */}
                                        <div className="text-center">
                                            <Link
                                                to="/register"
                                                className="btn-register"
                                            >
                                                Tạo tài khoản mới
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

export default LoginPage;
