// EditProfilePage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import editProfileService from './editProfileService';

// Validation schema với Yup
const validationSchema = Yup.object({
    displayName: Yup.string()
        .min(2, 'Tên hiển thị phải có ít nhất 2 ký tự')
        .required('Vui lòng nhập tên hiển thị'),
    phone: Yup.string()
        .matches(/^\+?[0-9]{7,15}$/, 'Số điện thoại không hợp lệ')
        .nullable(),
    dob: Yup.string()
        .matches(/^\d{4}-\d{2}-\d{2}$/, 'Ngày sinh phải đúng định dạng yyyy-MM-dd')
        .nullable(),
    gender: Yup.string()
        .oneOf(['MALE', 'FEMALE', 'OTHER', ''], 'Giới tính không hợp lệ')
        .nullable(),
    bio: Yup.string()
        .max(500, 'Giới thiệu không được vượt quá 500 ký tự')
        .nullable()
});

// Validation schema cho đổi mật khẩu
const passwordValidationSchema = Yup.object({
    oldPassword: Yup.string()
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
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [selectedAvatar, setSelectedAvatar] = useState(null);
    const [activeTab, setActiveTab] = useState('profile'); // 'profile' hoặc 'password'
    const [message, setMessage] = useState({ type: '', content: '' });

    // Load profile khi component mount
    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            setLoading(true);
            const profileData = await editProfileService.getCurrentProfile();
            setProfile(profileData);
            setAvatarPreview(profileData?.avatarUrl);
        } catch (error) {
            setMessage({ type: 'error', content: error.message });
        } finally {
            setLoading(false);
        }
    };

    // Xử lý chọn file avatar
    const handleAvatarChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedAvatar(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setAvatarPreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Xử lý upload avatar
    const handleUploadAvatar = async () => {
        if (!selectedAvatar) return;

        try {
            const newAvatarUrl = await editProfileService.uploadAvatar(selectedAvatar);
            setProfile(prev => ({ ...prev, avatarUrl: newAvatarUrl }));
            setAvatarPreview(newAvatarUrl);
            setSelectedAvatar(null);
            setMessage({ type: 'success', content: 'Cập nhật avatar thành công!' });
        } catch (error) {
            setMessage({ type: 'error', content: error.message });
        }
    };

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
                            <h3 className="card-title mb-0">Chỉnh sửa thông tin cá nhân</h3>
                        </div>
                        <div className="card-body">
                            {/* Message Alert */}
                            {message.content && (
                                <div className={`alert alert-${message.type === 'error' ? 'danger' : 'success'} alert-dismissible fade show`} role="alert">
                                    {message.content}
                                    <button type="button" className="btn-close" onClick={() => setMessage({ type: '', content: '' })}></button>
                                </div>
                            )}

                            {/* Tabs */}
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

                            {/* Tab Content */}
                            {activeTab === 'profile' && (
                                <div>
                                    {/* Avatar Section */}
                                    <div className="text-center mb-4">
                                        <div className="position-relative d-inline-block">
                                            <img
                                                src={avatarPreview || '/default-avatar.png'}
                                                alt="Avatar"
                                                className="rounded-circle"
                                                style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                                            />
                                            <label
                                                htmlFor="avatar-input"
                                                className="btn btn-sm btn-primary position-absolute bottom-0 end-0 rounded-circle"
                                                style={{ width: '32px', height: '32px' }}
                                            >
                                                <i className="fas fa-camera"></i>
                                            </label>
                                            <input
                                                id="avatar-input"
                                                type="file"
                                                accept="image/*"
                                                onChange={handleAvatarChange}
                                                className="d-none"
                                            />
                                        </div>
                                        {selectedAvatar && (
                                            <div className="mt-2">
                                                <button
                                                    className="btn btn-success btn-sm me-2"
                                                    onClick={handleUploadAvatar}
                                                >
                                                    Lưu avatar
                                                </button>
                                                <button
                                                    className="btn btn-secondary btn-sm"
                                                    onClick={() => {
                                                        setSelectedAvatar(null);
                                                        setAvatarPreview(profile.avatarUrl);
                                                    }}
                                                >
                                                    Hủy
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {/* Profile Form */}
                                    <Formik
                                        initialValues={{
                                            displayName: profile.displayName || '',
                                            phoneNumber: profile.phoneNumber || '',
                                            birthday: profile.birthday || ''
                                        }}
                                        validationSchema={Yup.object({
                                            displayName: Yup.string()
                                                .min(2, 'Tên hiển thị phải có ít nhất 2 ký tự')
                                                .required('Vui lòng nhập tên hiển thị'),
                                            phoneNumber: Yup.string()
                                                .matches(/^[0-9]{7,15}$/, 'Số điện thoại không hợp lệ')
                                                .nullable(),
                                            birthday: Yup.string()
                                                .matches(/^$|^\d{4}-\d{2}-\d{2}$/, 'Ngày sinh phải đúng định dạng yyyy-MM-dd')
                                                .nullable(),
                                        })}
                                        onSubmit={async (values, { setSubmitting }) => {
                                            try {
                                                setMessage({ type: '', content: '' });
                                                // Chỉ gửi các trường đúng với API docs
                                                const updateData = {
                                                    displayName: values.displayName,
                                                    phoneNumber: values.phoneNumber,
                                                    birthday: values.birthday
                                                };
                                                const updatedProfile = await editProfileService.updateProfile(updateData);
                                                setProfile(updatedProfile);
                                                setMessage({ type: 'success', content: 'Cập nhật thông tin thành công!' });
                                                setTimeout(() => {
                                                    navigate('/');
                                                }, 1200); // Chờ 1.2s để user thấy thông báo
                                            } catch (error) {
                                                setMessage({ type: 'error', content: error.message });
                                            } finally {
                                                setSubmitting(false);
                                            }
                                        }}
                                    >
                                        {({ errors, touched, isSubmitting }) => (
                                            <Form>
                                                {/* Tên hiển thị */}
                                                <div className="mb-3">
                                                    <label htmlFor="displayName" className="form-label">Tên hiển thị</label>
                                                    <Field
                                                        id="displayName"
                                                        name="displayName"
                                                        type="text"
                                                        className={`form-control ${errors.displayName && touched.displayName ? 'is-invalid' : ''}`}
                                                        placeholder="Nhập tên hiển thị"
                                                    />
                                                    <ErrorMessage name="displayName" component="div" className="invalid-feedback" />
                                                </div>

                                                {/* Số điện thoại */}
                                                <div className="mb-3">
                                                    <label htmlFor="phoneNumber" className="form-label">Số điện thoại</label>
                                                    <Field
                                                        id="phoneNumber"
                                                        name="phoneNumber"
                                                        type="text"
                                                        className={`form-control ${errors.phoneNumber && touched.phoneNumber ? 'is-invalid' : ''}`}
                                                        placeholder="Nhập số điện thoại"
                                                    />
                                                    <ErrorMessage name="phoneNumber" component="div" className="invalid-feedback" />
                                                </div>

                                                {/* Ngày sinh */}
                                                <div className="mb-3">
                                                    <label htmlFor="birthday" className="form-label">Ngày sinh</label>
                                                    <Field
                                                        id="birthday"
                                                        name="birthday"
                                                        type="date"
                                                        className={`form-control ${errors.birthday && touched.birthday ? 'is-invalid' : ''}`}
                                                    />
                                                    <ErrorMessage name="birthday" component="div" className="invalid-feedback" />
                                                </div>



                                                {/* Submit Button */}
                                                <div className="d-grid">
                                                    <button
                                                        type="submit"
                                                        disabled={isSubmitting}
                                                        className="btn btn-primary"
                                                    >
                                                        {isSubmitting ? (
                                                            <>
                                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                                Đang cập nhật...
                                                            </>
                                                        ) : (
                                                            'Cập nhật thông tin'
                                                        )}
                                                    </button>
                                                </div>
                                            </Form>
                                        )}
                                    </Formik>
                                </div>
                            )}

                            {/* Change Password Tab */}
                            {activeTab === 'password' && (
                                <Formik
                                    initialValues={{
                                        oldPassword: '',
                                        newPassword: '',
                                        confirmNewPassword: ''
                                    }}
                                    validationSchema={passwordValidationSchema}
                                    onSubmit={async (values, { setSubmitting, resetForm }) => {
                                        try {
                                            setMessage({ type: '', content: '' });
                                            await editProfileService.changePassword(values.oldPassword, values.newPassword);
                                            setMessage({ type: 'success', content: 'Đổi mật khẩu thành công!' });
                                            resetForm();
                                        } catch (error) {
                                            setMessage({ type: 'error', content: error.message });
                                        } finally {
                                            setSubmitting(false);
                                        }
                                    }}
                                >
                                    {({ errors, touched, isSubmitting }) => (
                                        <Form>
                                            {/* Mật khẩu cũ */}
                                            <div className="mb-3">
                                                <label htmlFor="oldPassword" className="form-label">Mật khẩu cũ</label>
                                                <Field
                                                    id="oldPassword"
                                                    name="oldPassword"
                                                    type="password"
                                                    className={`form-control ${errors.oldPassword && touched.oldPassword ? 'is-invalid' : ''}`}
                                                    placeholder="Nhập mật khẩu cũ"
                                                />
                                                <ErrorMessage name="oldPassword" component="div" className="invalid-feedback" />
                                            </div>

                                            {/* Mật khẩu mới */}
                                            <div className="mb-3">
                                                <label htmlFor="newPassword" className="form-label">Mật khẩu mới</label>
                                                <Field
                                                    id="newPassword"
                                                    name="newPassword"
                                                    type="password"
                                                    className={`form-control ${errors.newPassword && touched.newPassword ? 'is-invalid' : ''}`}
                                                    placeholder="Nhập mật khẩu mới"
                                                />
                                                <ErrorMessage name="newPassword" component="div" className="invalid-feedback" />
                                            </div>

                                            {/* Xác nhận mật khẩu mới */}
                                            <div className="mb-3">
                                                <label htmlFor="confirmNewPassword" className="form-label">Xác nhận mật khẩu mới</label>
                                                <Field
                                                    id="confirmNewPassword"
                                                    name="confirmNewPassword"
                                                    type="password"
                                                    className={`form-control ${errors.confirmNewPassword && touched.confirmNewPassword ? 'is-invalid' : ''}`}
                                                    placeholder="Nhập lại mật khẩu mới"
                                                />
                                                <ErrorMessage name="confirmNewPassword" component="div" className="invalid-feedback" />
                                            </div>

                                            {/* Submit Button */}
                                            <div className="d-grid">
                                                <button
                                                    type="submit"
                                                    disabled={isSubmitting}
                                                    className="btn btn-warning"
                                                >
                                                    {isSubmitting ? (
                                                        <>
                                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                            Đang đổi mật khẩu...
                                                        </>
                                                    ) : (
                                                        'Đổi mật khẩu'
                                                    )}
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