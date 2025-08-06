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
        <div className="min-vh-100 d-flex align-items-center justify-content-center py-5"
            style={{ backgroundColor: 'var(--fb-background)' }}>
            <div className="container">
                <div className="row align-items-center justify-content-center">
                    {/* Left Side - Branding */}
                    <div className="col-lg-6 mb-5 mb-lg-0">
                        <div className="text-center text-lg-start">
                            <h1 className="display-4 fw-bold mb-3" style={{ color: 'var(--fb-blue)' }}>
                                tribe
                            </h1>
                            <p className="lead fs-2 mb-4" style={{ color: 'var(--fb-text)' }}>
                                Tribe giúp bạn kết nối và chia sẻ với mọi người trong cuộc sống của bạn.
                            </p>
                        </div>
                    </div>

                    {/* Right Side - Login Form */}
                    <div className="col-lg-4">
                        <div className="card-fb p-4">
                            <Formik
                                initialValues={{
                                    email: '',
                                    password: '',
                                    rememberMe: false
                                }}
                                validationSchema={validationSchema}
                                onSubmit={async (values, { setSubmitting, setFieldError }) => {
                                    try {
                                        await login(values.email, values.password);
                                        navigate(from, { replace: true });
                                    } catch (error) {
                                        setFieldError('password', 'Email hoặc mật khẩu không chính xác');
                                    } finally {
                                        setSubmitting(false);
                                    }
                                }}
                            >
                                {({ isSubmitting, errors, touched }) => (
                                    <Form>
                                        {/* Email Field */}
                                        <div className="mb-3">
                                            <Field
                                                type="email"
                                                name="email"
                                                className={`form-control-fb ${errors.email && touched.email ? 'is-invalid' : ''}`}
                                                placeholder="Email hoặc số điện thoại"
                                                style={{ fontSize: '17px', padding: '14px 16px' }}
                                            />
                                            <ErrorMessage name="email" component="div" className="invalid-feedback" />
                                        </div>

                                        {/* Password Field */}
                                        <div className="mb-3">
                                            <Field
                                                type="password"
                                                name="password"
                                                className={`form-control-fb ${errors.password && touched.password ? 'is-invalid' : ''}`}
                                                placeholder="Mật khẩu"
                                                style={{ fontSize: '17px', padding: '14px 16px' }}
                                            />
                                            <ErrorMessage name="password" component="div" className="invalid-feedback" />
                                        </div>

                                        {/* Login Button */}
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="btn btn-fb-primary w-100 mb-3"
                                            style={{
                                                fontSize: '20px',
                                                fontWeight: 'bold',
                                                padding: '12px'
                                            }}
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

                                        {/* Forgot Password */}
                                        <div className="text-center mb-4">
                                            <Link
                                                to="/forgot-password"
                                                className="text-decoration-none"
                                                style={{ color: 'var(--fb-blue)', fontSize: '14px' }}
                                            >
                                                Quên mật khẩu?
                                            </Link>
                                        </div>

                                        {/* Divider */}
                                        <hr style={{ margin: '20px 0' }} />

                                        {/* Create Account Button */}
                                        <div className="text-center">
                                            <Link
                                                to="/register"
                                                className="btn btn-fb-success"
                                                style={{
                                                    fontSize: '17px',
                                                    fontWeight: 'bold',
                                                    padding: '12px 16px'
                                                }}
                                            >
                                                Tạo tài khoản mới
                                            </Link>
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        </div>

                        {/* Create Page Link */}
                        <div className="text-center mt-4">
                            <p style={{ color: 'var(--fb-text)', fontSize: '14px' }}>
                                <strong>Tạo Trang</strong> dành cho người nổi tiếng, thương hiệu hoặc doanh nghiệp.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
