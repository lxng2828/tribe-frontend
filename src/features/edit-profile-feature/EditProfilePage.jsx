// EditProfilePage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import editProfileService from './editProfileService';

// Validation schema cho đổi mật khẩu
const passwordValidationSchema = Yup.object({
    currentPassword: Yup.string()
        .required('Vui lòng nhập mật khẩu cũ'),
    newPassword: Yup.string()
        .min(6, 'Mật khẩu mới phải có ít nhất 6 ký tự')
        .required('Vui lòng nhập mật khẩu mới'),
    confirmNewPassword: Yup.string()
        .oneOf([Yup.ref('newPassword'), null], 'Mật khẩu xác nhận không khớp')
        .required('Vui lòng xác nhận mật khẩu mới')
});

function EditProfilePage() {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('profile'); // 'profile' hoặc 'password'
    const [message, setMessage] = useState({ type: '', content: '' });

    // Load profile khi component mount
    useEffect(() => {
        const loadProfile = async () => {
            try {
                setLoading(true);
                const profileData = await editProfileService.getCurrentProfile();
                setProfile(profileData);
            } catch (error) {
                setMessage({ type: 'error', content: error.message });
            } finally {
                setLoading(false);
            }
        };
        loadProfile();
    }, []);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="alert alert-danger" role="alert">
                Không thể lấy thông tin profile. Vui lòng thử lại.
            </div>
        );
    }

    return (
        <div className="container py-4">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="card shadow">
                        <div className="card-header">
                            <h3 className="card-title mb-0">Thông tin cá nhân và mật khẩu</h3>
                        </div>
                        <div className="card-body">
                            {message.content && (
                                <div className={`alert alert-${message.type === 'error' ? 'danger' : 'success'} alert-dismissible fade show`} role="alert">
                                    {message.content}
                                    <button type="button" className="btn-close" onClick={() => setMessage({ type: '', content: '' })}></button>
                                </div>
                            )}

                            <ul className="nav nav-tabs mb-4" role="tablist">
                                <li className="nav-item">
                                    <button
                                        className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`}
                                        onClick={() => setActiveTab('profile')}
                                    >
                                        Thông tin cá nhân
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button
                                        className={`nav-link ${activeTab === 'password' ? 'active' : ''}`}
                                        onClick={() => setActiveTab('password')}
                                    >
                                        Đổi mật khẩu
                                    </button>
                                </li>
                            </ul>

                            {activeTab === 'profile' && (
                                <Formik
                                    initialValues={{
                                        displayName: profile.displayName || '',
                                        email: profile.email || '',
                                        phoneNumber: profile.phoneNumber || '',
                                        birthday: profile.birthday ? profile.birthday.split('T')[0] : ''
                                    }}
                                    validationSchema={Yup.object({
                                        displayName: Yup.string()
                                            .min(2, 'Tên hiển thị phải có ít nhất 2 ký tự')
                                            .required('Vui lòng nhập tên hiển thị'),
                                        email: Yup.string()
                                            .email('Email không hợp lệ')
                                            .required('Vui lòng nhập email'),
                                        phoneNumber: Yup.string()
                                            .matches(/^[0-9]{7,15}$/, 'Số điện thoại không hợp lệ')
                                            .nullable(),
                                        birthday: Yup.string()
                                            .matches(/^\d{4}-\d{2}-\d{2}$/, 'Ngày sinh không hợp lệ')
                                            .nullable(),
                                    })}
                                    onSubmit={async (values, { setSubmitting }) => {
                                        try {
                                            setMessage({ type: '', content: '' });
                                            const updatedProfile = await editProfileService.updateProfile(values);
                                            setProfile(updatedProfile);
                                            setMessage({ type: 'success', content: 'Cập nhật thông tin thành công!' });
                                            setTimeout(() => navigate('/'), 1200);
                                        } catch (error) {
                                            setMessage({ type: 'error', content: error.message });
                                        } finally {
                                            setSubmitting(false);
                                        }
                                    }}
                                    enableReinitialize
                                >
                                    {({ errors, touched, isSubmitting }) => (
                                        <Form>
                                            <div className="mb-3">
                                                <label htmlFor="displayName" className="form-label">Tên hiển thị</label>
                                                <Field name="displayName" type="text" className={`form-control ${errors.displayName && touched.displayName ? 'is-invalid' : ''}`} />
                                                <ErrorMessage name="displayName" component="div" className="invalid-feedback" />
                                            </div>

                                            <div className="mb-3">
                                                <label htmlFor="email" className="form-label">Email</label>
                                                <Field name="email" type="email" className={`form-control ${errors.email && touched.email ? 'is-invalid' : ''}`} />
                                                <ErrorMessage name="email" component="div" className="invalid-feedback" />
                                            </div>

                                            <div className="mb-3">
                                                <label htmlFor="phoneNumber" className="form-label">Số điện thoại</label>
                                                <Field name="phoneNumber" type="text" className={`form-control ${errors.phoneNumber && touched.phoneNumber ? 'is-invalid' : ''}`} />
                                                <ErrorMessage name="phoneNumber" component="div" className="invalid-feedback" />
                                            </div>

                                            <div className="mb-3">
                                                <label htmlFor="birthday" className="form-label">Ngày sinh</label>
                                                <Field name="birthday" type="date" className={`form-control ${errors.birthday && touched.birthday ? 'is-invalid' : ''}`} />
                                                <ErrorMessage name="birthday" component="div" className="invalid-feedback" />
                                            </div>

                                            <div className="d-grid">
                                                <button type="submit" disabled={isSubmitting} className="btn btn-primary">
                                                    {isSubmitting ? 'Đang cập nhật...' : 'Cập nhật thông tin'}
                                                </button>
                                            </div>
                                        </Form>
                                    )}
                                </Formik>
                            )}

                            {activeTab === 'password' && (
                                <Formik
                                    initialValues={{ currentPassword: '', newPassword: '', confirmNewPassword: '' }}
                                    validationSchema={passwordValidationSchema}
                                    onSubmit={async (values, { setSubmitting, resetForm }) => {
                                        try {
                                            setMessage({ type: '', content: '' });
                                            const successMessage = await editProfileService.changePassword(values.currentPassword, values.newPassword);
                                            setMessage({ type: 'success', content: successMessage });
                                            resetForm();
                                            setTimeout(() => navigate('/'), 1200); // Redirect after 1.2s
                                        } catch (error) {
                                            setMessage({ type: 'error', content: error.message });
                                        } finally {
                                            setSubmitting(false);
                                        }
                                    }}
                                >
                                    {({ errors, touched, isSubmitting }) => (
                                        <Form>
                                            <div className="mb-3">
                                                <label htmlFor="currentPassword" className="form-label">Mật khẩu cũ</label>
                                                <Field name="currentPassword" type="password" className={`form-control ${errors.currentPassword && touched.currentPassword ? 'is-invalid' : ''}`} />
                                                <ErrorMessage name="currentPassword" component="div" className="invalid-feedback" />
                                            </div>

                                            <div className="mb-3">
                                                <label htmlFor="newPassword" className="form-label">Mật khẩu mới</label>
                                                <Field name="newPassword" type="password" className={`form-control ${errors.newPassword && touched.newPassword ? 'is-invalid' : ''}`} />
                                                <ErrorMessage name="newPassword" component="div" className="invalid-feedback" />
                                            </div>

                                            <div className="mb-3">
                                                <label htmlFor="confirmNewPassword" className="form-label">Xác nhận mật khẩu mới</label>
                                                <Field name="confirmNewPassword" type="password" className={`form-control ${errors.confirmNewPassword && touched.confirmNewPassword ? 'is-invalid' : ''}`} />
                                                <ErrorMessage name="confirmNewPassword" component="div" className="invalid-feedback" />
                                            </div>

                                            <div className="d-grid">
                                                <button type="submit" disabled={isSubmitting} className="btn btn-warning">
                                                    {isSubmitting ? 'Đang thực hiện...' : 'Đổi mật khẩu'}
                                                </button>
                                            </div>
                                        </Form>
                                    )}
                                </Formik>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditProfilePage;