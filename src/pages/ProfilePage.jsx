import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { DEFAULT_AVATAR, getFullUrl, getAvatarUrl } from '../utils/placeholderImages';
import { useAvatarSync } from '../hooks/useAvatarSync';
import PostList from '../features/posts/PostList';
import CreatePost from '../components/CreatePost';
import Loading from '../components/Loading';
import FriendshipButton from '../components/FriendshipButton';
import profileService from '../services/profileService';
import userService from '../services/userService';

const ProfilePage = () => {
    const { userId: urlUserId } = useParams(); // Lấy userId từ URL
    const { user, refreshUserInfo } = useAuth();
    const { forceRefreshAvatar } = useAvatarSync();
    
    // Ref để refresh PostList
    const postListRef = useRef();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);

    // State cho dữ liệu profile
    const [profileData, setProfileData] = useState(null);

    // Kiểm tra xem có phải profile của mình không
    const isOwnProfile = !urlUserId || urlUserId === user?.id;
    const targetUserId = urlUserId || user?.id;

    // Load dữ liệu profile khi component mount
    useEffect(() => {
        const loadProfileData = async () => {
            try {
                setLoading(true);
                setError(null);

                if (isOwnProfile) {
                    // Load profile của bản thân
                    const profileResponse = await profileService.getCurrentUserProfile();

                    console.log('Profile response for own user:', profileResponse); // Debug log

                    if (profileResponse?.status?.success === true) {
                        setProfileData(profileResponse.data);
                    } else if (profileResponse?.status?.code === '00') {
                        // Fallback cho format khác của response
                        setProfileData(profileResponse.data);
                    } else {
                        setProfileData(profileResponse || user);
                    }
                } else {
                    // Load profile của người khác
                    const profileResponse = await userService.getUserById(targetUserId);

                    console.log('Profile response for other user:', profileResponse); // Debug log

                    if (profileResponse?.status?.success === true) {
                        setProfileData(profileResponse.data);
                    } else if (profileResponse?.status?.code === '00') {
                        // Fallback cho format khác của response
                        setProfileData(profileResponse.data);
                    } else if (profileResponse?.data) {
                        // Nếu có data nhưng status format khác
                        setProfileData(profileResponse.data);
                    } else {
                        throw new Error('Không thể tải thông tin người dùng');
                    }
                }
            } catch (error) {
                console.error('Error loading profile data:', error);
                console.error('Error details:', {
                    message: error.message,
                    response: error.response?.data,
                    status: error.response?.status
                });

                // Thông báo lỗi chi tiết hơn
                let errorMessage = 'Không thể tải thông tin trang cá nhân';
                if (error.response?.status === 404) {
                    errorMessage = 'Không tìm thấy người dùng';
                } else if (error.response?.status === 401) {
                    errorMessage = 'Bạn không có quyền truy cập trang này';
                } else if (error.response?.status >= 500) {
                    errorMessage = 'Lỗi server, vui lòng thử lại sau';
                }

                setError(error.message || errorMessage);
            } finally {
                setLoading(false);
            }
        };

        if (user?.id) {
            loadProfileData();
        }
    }, [user, isOwnProfile, targetUserId]);

    // Validate file upload
    const validateFile = (file) => {
        // Kiểm tra định dạng file
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
            throw new Error('Chỉ chấp nhận file ảnh (JPEG, PNG, GIF)');
        }

        // Kiểm tra kích thước file (tối đa 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            throw new Error('Kích thước file không được vượt quá 5MB');
        }

        return true;
    };

    // Handle update avatar
    const handleUpdateAvatar = async (file) => {
        try {
            // Validate file trước khi upload
            validateFile(file);
            
            setUploadingAvatar(true);
            const formData = new FormData();
            formData.append('file', file); // Sử dụng field name 'file' theo API docs

            const response = await profileService.updateAvatar(formData);
            if (response?.status === 'success') {
                setProfileData(prev => ({
                    ...prev,
                    avatarUrl: response.data.avatarUrl
                }));
                // Đồng bộ avatar ngay lập tức
                await forceRefreshAvatar();
                // Refresh PostList để cập nhật avatar trong bài đăng
                if (postListRef.current) {
                    postListRef.current.refreshPosts();
                }
                // Thông báo thành công
                alert('Cập nhật ảnh đại diện thành công!');
            } else {
                alert(response?.message || 'Không thể cập nhật ảnh đại diện');
            }
        } catch (error) {
            console.error('Error updating avatar:', error);
            
            // Hiển thị thông báo lỗi chi tiết hơn
            let errorMessage = 'Lỗi khi cập nhật ảnh đại diện';
            
            if (error.response?.status === 401) {
                errorMessage = 'Bạn cần đăng nhập lại để thực hiện thao tác này';
            } else if (error.response?.status === 500) {
                errorMessage = 'Lỗi server, vui lòng thử lại sau';
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            alert(errorMessage);
        } finally {
            setUploadingAvatar(false);
        }
    };

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return (
            <div className="container mt-5">
                <div className="alert alert-danger text-center">
                    <h5>Lỗi tải trang cá nhân</h5>
                    <p>{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="btn btn-outline-danger"
                    >
                        Thử lại
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={{ backgroundColor: 'var(--fb-background)', minHeight: '100vh' }}>
            {/* Cover Photo */}
            <div className="position-relative" style={{ height: '320px', backgroundColor: 'var(--fb-gray)' }}>
                <div
                    className="w-100 h-100"
                    style={{
                        backgroundImage: profileData?.coverPhoto ? `url(${getFullUrl(profileData.coverPhoto)})` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}
                />
            </div>

            {/* Profile Info Section */}
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="d-flex flex-column flex-md-row align-items-center align-items-md-end px-3"
                            style={{ transform: 'translateY(-50px)' }}>
                            {/* Profile Picture */}
                            <div className="position-relative mb-3 mb-md-0">
                                <img
                                    src={getAvatarUrl(profileData) || getAvatarUrl(user)}
                                    alt={profileData?.displayName || profileData?.fullName || user?.displayName || 'User'}
                                    className="rounded-circle border border-4 border-white"
                                    style={{
                                        width: '168px',
                                        height: '168px',
                                        objectFit: 'cover'
                                    }}
                                />
                                {isOwnProfile && (
                                    <>
                                        <input
                                            type="file"
                                            id="avatarInput"
                                            className="d-none"
                                            accept="image/*"
                                            onChange={(e) => {
                                                if (e.target.files[0]) {
                                                    handleUpdateAvatar(e.target.files[0]);
                                                    // Reset input để có thể chọn lại file cùng tên
                                                    e.target.value = '';
                                                }
                                            }}
                                        />
                                        <button
                                            className="btn btn-light btn-sm rounded-circle position-absolute bottom-0 end-0"
                                            style={{ width: '40px', height: '40px' }}
                                            onClick={() => document.getElementById('avatarInput').click()}
                                            disabled={uploadingAvatar}
                                            title="Thay đổi ảnh đại diện"
                                        >
                                            {uploadingAvatar ? (
                                                <div className="spinner-border spinner-border-sm" role="status">
                                                    <span className="visually-hidden">Đang tải...</span>
                                                </div>
                                            ) : (
                                                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 3a3 3 0 1 1 0 6 3 3 0 0 1 0-6zm0 14.2a7.2 7.2 0 0 1-6-3.22c.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08a7.2 7.2 0 0 1-6 3.22z" />
                                                </svg>
                                            )}
                                        </button>
                                    </>
                                )}
                            </div>

                            {/* Name and Actions */}
                            <div className="flex-grow-1 ms-md-3 text-center text-md-start">
                                <h1 className="mb-1 fw-bold" style={{ fontSize: '2rem' }}>
                                    {isOwnProfile
                                        ? (profileData?.displayName || user?.displayName || user?.fullName || user?.username || 'Người dùng')
                                        : (profileData?.displayName || profileData?.fullName || profileData?.username || 'Người dùng')
                                    }
                                </h1>

                                {/* Action Buttons */}
                                <div className="d-flex gap-2 justify-content-center justify-content-md-start mt-3">
                                    {!isOwnProfile && (
                                        // Chỉ hiển thị nút kết bạn cho profile người khác
                                        <div style={{ minWidth: '200px' }}>
                                            <FriendshipButton
                                                targetUserId={targetUserId}
                                                targetUserName={profileData?.displayName || profileData?.fullName || profileData?.username || 'Người dùng'}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Area - chỉ hiển thị posts */}
            <div className="container mt-4">
                <div className="row">
                    {/* Left Sidebar - có thể thêm thông tin khác sau */}
                    <div className="col-12 col-lg-5">
                        {/* Intro Card placeholder */}
                        <div className="card mb-4" style={{ border: '1px solid var(--fb-border)', borderRadius: '8px' }}>
                            <div className="card-body">
                                <h5 className="fw-bold mb-3">Giới thiệu</h5>
                                <p className="text-muted">{profileData?.bio || "Chưa có thông tin giới thiệu"}</p>
                                {profileData?.email && (
                                    <div className="d-flex align-items-center mb-2 text-muted">
                                        <svg width="16" height="16" className="me-2" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                                        </svg>
                                        {profileData.email}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Content - chỉ hiển thị posts */}
                    <div className="col-12 col-lg-7">
                        {/* Create Post nếu là profile của mình */}
                        {isOwnProfile && (
                            <div className="mb-4">
                                <CreatePost />
                            </div>
                        )}

                        {/* Posts */}
                        <PostList ref={postListRef} userId={targetUserId} isUserPosts={true} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
