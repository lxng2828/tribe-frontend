import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../contexts/AuthContext';

// Validation schema với Yup - phù hợp với API backend
const validationSchema = Yup.object({
    displayName: Yup.string()
        .min(2, 'Họ tên phải có ít nhất 2 ký tự')
        .max(100, 'Họ tên không được quá 100 ký tự')
        .required('Vui lòng nhập họ tên'),
    email: Yup.string()
        .email('Email không hợp lệ')
        .required('Vui lòng nhập email'),
    password: Yup.string()
        .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
        .max(100, 'Mật khẩu không được quá 100 ký tự')
        .required('Vui lòng nhập mật khẩu'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Mật khẩu xác nhận không khớp')
        .required('Vui lòng xác nhận mật khẩu'),
    phoneNumber: Yup.string()
        .matches(/^\+?[0-9]{7,15}$/, 'Số điện thoại không hợp lệ')
        .required('Vui lòng nhập số điện thoại'),
    birthday: Yup.string()
        .matches(/^\d{4}-\d{2}-\d{2}$/, 'Ngày sinh phải đúng định dạng yyyy-MM-dd')
        .nullable()
        .optional(),
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
                                    birthday: '',
                                    agreeTerms: false
                                }}
                                validationSchema={validationSchema}
                                                                onSubmit={async (values, { setSubmitting }) => {
                                    try {
                                        const { confirmPassword, agreeTerms, ...registerData } = values;
                                        
                                        // Chuẩn bị dữ liệu theo format API backend
                                        const dataToSend = {
                                            email: registerData.email,
                                            password: registerData.password,
                                            displayName: registerData.displayName,
                                            phoneNumber: registerData.phoneNumber,
                                            birthday: registerData.birthday || null,
                                            avatarUrl: null // Có thể thêm sau
                                        };

                                        // Loại bỏ các trường rỗng
                                        Object.keys(dataToSend).forEach(key => {
                                            if (!dataToSend[key]) delete dataToSend[key];
                                        });

                                        const result = await register(dataToSend);
                                        
                                        // Kiểm tra nếu đăng ký thành công
                                        if (result && result.success) {
                                            navigate('/login', {
                                                replace: true,
                                                state: {
                                                    message: result.message || 'Đăng ký thành công! Vui lòng đăng nhập để tiếp tục.',
                                                    email: registerData.email
                                                }
                                            });
                                        }
                                    } catch (error) {
                                        console.error('Registration error:', error);
                                        // Error đã được xử lý trong authService qua toast
                                    } finally {
                                        setSubmitting(false);
                                    }
                                }}
                            >
                                {({ errors, touched, isSubmitting }) => (
                                    <Form>


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
                                                        <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
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

                                        {/* Birthday Field */}
                                        <div className="form-group mb-3">
                                            <div className="input-wrapper">
                                                <div className="input-icon">
                                                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11zm0-13H5V6h14v1z"/>
                                                    </svg>
                                                </div>
                                                <Field
                                                    id="birthday"
                                                    name="birthday"
                                                    type="date"
                                                    placeholder="Chọn ngày sinh"
                                                    className={`form-control-custom ${errors.birthday && touched.birthday ? 'is-invalid' : ''}`}
                                                />
                                            </div>
                                            <ErrorMessage name="birthday" component="div" className="error-message" />
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
