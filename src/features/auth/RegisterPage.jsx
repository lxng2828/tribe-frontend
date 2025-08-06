import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../contexts/AuthContext';

// Validation schema với Yup
const validationSchema = Yup.object({
    fullName: Yup.string()
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
    agreeTerms: Yup.boolean()
        .oneOf([true], 'Bạn phải đồng ý với điều khoản dịch vụ')
});

const RegisterPage = () => {
    const navigate = useNavigate();
    const { register } = useAuth();

    return (
        <div className="min-vh-100 bg-gradient-custom d-flex align-items-center justify-content-center py-5">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-6 col-lg-5">
                        {/* Logo và Header */}
                        <div className="text-center mb-4">
                            <div className="mx-auto bg-primary rounded-3 d-flex align-items-center justify-content-center mb-3"
                                style={{ width: '64px', height: '64px' }}>
                                <img
                                    className="img-fluid"
                                    src="/src/assets/images/primary_logo.png"
                                    alt="Tribe"
                                    style={{ filter: 'brightness(0) invert(1)', height: '40px' }}
                                />
                            </div>
                            <h2 className="h3 fw-bold text-dark mb-2">
                                Tạo tài khoản mới
                            </h2>
                            <p className="text-muted">
                                Tham gia cộng đồng Tribe ngay hôm nay
                            </p>
                        </div>

                        {/* Form Card */}
                        <div className="card card-custom animate-fade-in-up">
                            <div className="card-body p-4">
                                <Formik
                                    initialValues={{
                                        fullName: '',
                                        email: '',
                                        password: '',
                                        confirmPassword: '',
                                        agreeTerms: false
                                    }}
                                    validationSchema={validationSchema}
                                    onSubmit={async (values, { setSubmitting, setStatus }) => {
                                        try {
                                            setStatus(null);
                                            const { confirmPassword, agreeTerms, ...registerData } = values;
                                            const result = await register(registerData);

                                            if (result.success) {
                                                navigate('/', { replace: true });
                                            } else {
                                                setStatus(result.error);
                                            }
                                        } catch (error) {
                                            setStatus('Đăng ký thất bại. Vui lòng thử lại.');
                                        } finally {
                                            setSubmitting(false);
                                        }
                                    }}
                                >
                                    {({ errors, touched, isSubmitting, status }) => (
                                        <Form>
                                            {/* Error Alert */}
                                            {status && (
                                                <div className="alert alert-danger d-flex align-items-center mb-4" role="alert">
                                                    <svg className="me-2" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                                        <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                                                    </svg>
                                                    <div>{status}</div>
                                                </div>
                                            )}

                                            {/* Full Name Field */}
                                            <div className="mb-3">
                                                <label htmlFor="fullName" className="form-label fw-semibold">
                                                    Họ và tên <span className="text-danger">*</span>
                                                </label>
                                                <Field
                                                    id="fullName"
                                                    name="fullName"
                                                    type="text"
                                                    placeholder="Nhập họ và tên"
                                                    className={`form-control form-control-custom ${errors.fullName && touched.fullName ? 'form-control-error' : ''
                                                        }`}
                                                />
                                                <ErrorMessage name="fullName" component="div" className="invalid-feedback d-block">
                                                </ErrorMessage>
                                            </div>

                                            {/* Email Field */}
                                            <div className="mb-3">
                                                <label htmlFor="email" className="form-label fw-semibold">
                                                    Email <span className="text-danger">*</span>
                                                </label>
                                                <Field
                                                    id="email"
                                                    name="email"
                                                    type="email"
                                                    placeholder="Nhập email của bạn"
                                                    className={`form-control form-control-custom ${errors.email && touched.email ? 'form-control-error' : ''
                                                        }`}
                                                />
                                                <ErrorMessage name="email" component="div" className="invalid-feedback d-block">
                                                </ErrorMessage>
                                            </div>

                                            {/* Password Field */}
                                            <div className="mb-3">
                                                <label htmlFor="password" className="form-label fw-semibold">
                                                    Mật khẩu <span className="text-danger">*</span>
                                                </label>
                                                <Field
                                                    id="password"
                                                    name="password"
                                                    type="password"
                                                    placeholder="Nhập mật khẩu (ít nhất 6 ký tự)"
                                                    className={`form-control form-control-custom ${errors.password && touched.password ? 'form-control-error' : ''
                                                        }`}
                                                />
                                                <ErrorMessage name="password" component="div" className="invalid-feedback d-block">
                                                </ErrorMessage>
                                            </div>

                                            {/* Confirm Password Field */}
                                            <div className="mb-3">
                                                <label htmlFor="confirmPassword" className="form-label fw-semibold">
                                                    Xác nhận mật khẩu <span className="text-danger">*</span>
                                                </label>
                                                <Field
                                                    id="confirmPassword"
                                                    name="confirmPassword"
                                                    type="password"
                                                    placeholder="Nhập lại mật khẩu"
                                                    className={`form-control form-control-custom ${errors.confirmPassword && touched.confirmPassword ? 'form-control-error' : ''
                                                        }`}
                                                />
                                                <ErrorMessage name="confirmPassword" component="div" className="invalid-feedback d-block">
                                                </ErrorMessage>
                                            </div>

                                            {/* Terms Agreement */}
                                            <div className="form-check mb-3">
                                                <Field
                                                    id="agreeTerms"
                                                    name="agreeTerms"
                                                    type="checkbox"
                                                    className="form-check-input"
                                                />
                                                <label className="form-check-label" htmlFor="agreeTerms">
                                                    Tôi đồng ý với{' '}
                                                    <a href="#" className="text-primary text-decoration-none fw-medium">
                                                        Điều khoản dịch vụ
                                                    </a>{' '}
                                                    và{' '}
                                                    <a href="#" className="text-primary text-decoration-none fw-medium">
                                                        Chính sách bảo mật
                                                    </a>
                                                </label>
                                                <ErrorMessage name="agreeTerms" component="div" className="invalid-feedback d-block">
                                                </ErrorMessage>
                                            </div>

                                            {/* Submit Button */}
                                            <div className="d-grid mb-4">
                                                <button
                                                    type="submit"
                                                    disabled={isSubmitting}
                                                    className="btn btn-gradient btn-custom"
                                                >
                                                    {isSubmitting ? (
                                                        <>
                                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                            Đang đăng ký...
                                                        </>
                                                    ) : (
                                                        'Đăng ký'
                                                    )}
                                                </button>
                                            </div>

                                            {/* Login Link */}
                                            <div className="text-center pt-3 border-top">
                                                <span className="text-muted">
                                                    Đã có tài khoản?{' '}
                                                    <Link
                                                        to="/login"
                                                        className="text-primary text-decoration-none fw-semibold"
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
        </div>
    );
};

export default RegisterPage;
