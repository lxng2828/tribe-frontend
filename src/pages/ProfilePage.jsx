import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { DEFAULT_AVATAR } from '../utils/placeholderImages';
import PostList from '../features/posts/PostList';
import CreatePost from '../components/CreatePost';
import Loading from '../components/Loading';
import profileService from '../services/profileService';

const ProfilePage = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('posts');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State cho dữ liệu profile
    const [profileData, setProfileData] = useState(null);
    const [userStats, setUserStats] = useState({
        friends: 0,
        followers: 0,
        following: 0
    });
    const [friends, setFriends] = useState([]);
    const [photos, setPhotos] = useState([]);

    // Load dữ liệu profile khi component mount
    useEffect(() => {
        const loadProfileData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Load profile data, stats, friends và photos song song
                const [profileResponse, statsResponse, friendsResponse, photosResponse] = await Promise.all([
                    profileService.getCurrentUserProfile(),
                    profileService.getUserStats(),
                    profileService.getFriends(null, 0, 9), // Lấy 9 bạn bè đầu tiên
                    profileService.getUserPhotos(null, 0, 9) // Lấy 9 ảnh đầu tiên
                ]);

                setProfileData(profileResponse);
                setUserStats(statsResponse);
                setFriends(friendsResponse.content || friendsResponse.data || []);
                setPhotos(photosResponse.content || photosResponse.data || []);

            } catch (err) {
                console.error('Error loading profile data:', err);
                setError('Không thể tải thông tin profile. Vui lòng thử lại.');
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            loadProfileData();
        }
    }, [user]);

    // Handle update avatar
    const handleUpdateAvatar = async (file) => {
        try {
            const formData = new FormData();
            formData.append('avatar', file);

            const response = await profileService.updateAvatar(formData);
            setProfileData(prev => ({ ...prev, avatar: response.avatarUrl }));
        } catch (err) {
            console.error('Error updating avatar:', err);
            setError('Không thể cập nhật ảnh đại diện.');
        }
    };

    // Handle update cover photo
    const handleUpdateCoverPhoto = async (file) => {
        try {
            const formData = new FormData();
            formData.append('cover', file);

            const response = await profileService.updateCoverPhoto(formData);
            setProfileData(prev => ({ ...prev, coverPhoto: response.coverPhotoUrl }));
        } catch (err) {
            console.error('Error updating cover photo:', err);
            setError('Không thể cập nhật ảnh bìa.');
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
                <Loading />
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mt-5">
                <div className="alert alert-danger" role="alert">
                    <h4 className="alert-heading">Lỗi!</h4>
                    <p>{error}</p>
                    <button
                        className="btn btn-outline-danger"
                        onClick={() => window.location.reload()}
                    >
                        Thử lại
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid px-0" style={{ backgroundColor: 'var(--fb-bg)', minHeight: '100vh' }}>
            {/* Cover Photo và Profile Section */}
            <div className="position-relative">
                {/* Cover Photo */}
                <div
                    className="w-100"
                    style={{
                        height: '348px',
                        backgroundColor: '#4267B2',
                        backgroundImage: profileData?.coverPhoto
                            ? `url(${profileData.coverPhoto})`
                            : `linear-gradient(135deg, #4267B2, #365899, #42b883)`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}
                >
                    <div className="position-absolute bottom-0 end-0 p-3">
                        <input
                            type="file"
                            id="coverPhotoInput"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={(e) => {
                                if (e.target.files[0]) {
                                    handleUpdateCoverPhoto(e.target.files[0]);
                                }
                            }}
                        />
                        
                    </div>
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
                                        src={profileData?.avatar || user?.avatar || DEFAULT_AVATAR}
                                        alt={profileData?.fullName || user?.fullName || 'User'}
                                        className="rounded-circle border border-4 border-white"
                                        style={{
                                            width: '168px',
                                            height: '168px',
                                            objectFit: 'cover'
                                        }}
                                    />
                                    <input
                                        type="file"
                                        id="avatarInput"
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                        onChange={(e) => {
                                            if (e.target.files[0]) {
                                                handleUpdateAvatar(e.target.files[0]);
                                            }
                                        }}
                                    />
                                    <button
                                        className="btn btn-light position-absolute"
                                        style={{
                                            bottom: '8px',
                                            right: '8px',
                                            borderRadius: '50%',
                                            width: '36px',
                                            height: '36px',
                                            padding: '0',
                                            border: '3px solid white'
                                        }}
                                        onClick={() => document.getElementById('avatarInput').click()}
                                    >
                                        <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 3a3 3 0 1 1 0 6 3 3 0 0 1 0-6zm0 14.2a7.2 7.2 0 0 1-6-3.22c.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08a7.2 7.2 0 0 1-6 3.22z" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Name and Actions */}
                                <div className="flex-grow-1 ms-md-3 text-center text-md-start">
                                    <h1 className="mb-1 fw-bold" style={{ fontSize: '2rem' }}>
                                        {user?.fullName || user?.displayName || user?.username || localStorage.getItem('name') || profileData?.fullName || 'Người dùng'}
                                    </h1>
                                    <p className="text-muted mb-2">{userStats.friends} bạn bè</p>

                                    {/* Friend avatars preview */}
                                    <div className="d-flex justify-content-center justify-content-md-start">
                                        {friends.slice(0, 6).map((friend, i) => (
                                            <img
                                                key={friend.id || i}
                                                src={friend.avatar || `https://i.pravatar.cc/32?img=${i + 1}`}
                                                alt={friend.fullName || `Friend ${i}`}
                                                className="rounded-circle border border-2 border-white"
                                                style={{
                                                    width: '32px',
                                                    height: '32px',
                                                    marginLeft: i > 0 ? '-8px' : '0'
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                               
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="container mt-3">
                <div className="border-bottom">
                    <nav className="d-flex">
                        <button
                            className={`nav-link border-0 bg-transparent px-4 py-3 fw-semibold ${activeTab === 'posts' ? 'text-primary border-bottom border-primary border-3' : 'text-muted'}`}
                            onClick={() => setActiveTab('posts')}
                        >
                            Bài viết
                        </button>
                        <button
                            className={`nav-link border-0 bg-transparent px-4 py-3 fw-semibold ${activeTab === 'about' ? 'text-primary border-bottom border-primary border-3' : 'text-muted'}`}
                            onClick={() => setActiveTab('about')}
                        >
                            Giới thiệu
                        </button>
                        <button
                            className={`nav-link border-0 bg-transparent px-4 py-3 fw-semibold ${activeTab === 'friends' ? 'text-primary border-bottom border-primary border-3' : 'text-muted'}`}
                            onClick={() => setActiveTab('friends')}
                        >
                            Bạn bè
                        </button>
                        <button
                            className={`nav-link border-0 bg-transparent px-4 py-3 fw-semibold ${activeTab === 'photos' ? 'text-primary border-bottom border-primary border-3' : 'text-muted'}`}
                            onClick={() => setActiveTab('photos')}
                        >
                            Ảnh
                        </button>
                        <button
                            className={`nav-link border-0 bg-transparent px-4 py-3 fw-semibold ${activeTab === 'videos' ? 'text-primary border-bottom border-primary border-3' : 'text-muted'}`}
                            onClick={() => setActiveTab('videos')}
                        >
                            Video
                        </button>
                    </nav>
                </div>
            </div>

            {/* Content Area */}
            <div className="container mt-4">
                <div className="row">
                    {/* Left Sidebar */}
                    <div className="col-12 col-lg-5">
                        {/* Intro Card */}
                        {/* <div className="card mb-4" style={{ border: '1px solid var(--fb-border)', borderRadius: '8px' }}>
                            <div className="card-body">
                                <h5 className="fw-bold mb-3">Giới thiệu</h5>
                                <div className="mb-3">
                                    <p className="mb-2">{profileData?.bio || "Chưa có thông tin giới thiệu"}</p>
                                </div>

                                {profileData?.location && (
                                    <div className="d-flex align-items-center mb-3 text-muted">
                                        <svg width="16" height="16" className="me-3" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                                        </svg>
                                        Sống tại <strong>{profileData.location}</strong>
                                    </div>
                                )}

                                {profileData?.work && (
                                    <div className="d-flex align-items-center mb-3 text-muted">
                                        <svg width="16" height="16" className="me-3" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M20 6h-2.18c.11-.31.18-.65.18-1a2.996 2.996 0 0 0-5.5-1.65l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-2 .89-2 2v11c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm6 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1z" />
                                        </svg>
                                        Làm việc tại <strong>{profileData.work}</strong>
                                    </div>
                                )}

                                {profileData?.education && (
                                    <div className="d-flex align-items-center mb-3 text-muted">
                                        <svg width="16" height="16" className="me-3" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 3l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                        </svg>
                                        Học tại <strong>{profileData.education}</strong>
                                    </div>
                                )}

                                {profileData?.joinDate && (
                                    <div className="d-flex align-items-center mb-3 text-muted">
                                        <svg width="16" height="16" className="me-3" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                        </svg>
                                        {new Date(profileData.joinDate).toLocaleDateString('vi-VN', {
                                            year: 'numeric',
                                            month: 'long'
                                        })}
                                    </div>
                                )}

                                <button className="btn btn-secondary w-100 mt-3">
                                    Chỉnh sửa chi tiết
                                </button>
                            </div>
                        </div> */}

                        {/* Photos Card */}
                        <div className="card mb-4" style={{ border: '1px solid var(--fb-border)', borderRadius: '8px' }}>
                            <div className="card-body">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h5 className="fw-bold mb-0">Ảnh</h5>
                                    <a href="#" className="text-primary text-decoration-none">Xem tất cả ảnh</a>
                                </div>
                                <p className="text-muted small mb-3">{photos.length} ảnh</p>

                                <div className="row g-2">
                                    {photos.slice(0, 9).map((photo, index) => (
                                        <div key={photo.id || index} className="col-4">
                                            <img
                                                src={photo.url || photo.imageUrl || `https://picsum.photos/300/300?random=${index + 1}`}
                                                alt={photo.description || `Photo ${index + 1}`}
                                                className="img-fluid rounded"
                                                style={{
                                                    aspectRatio: '1',
                                                    objectFit: 'cover',
                                                    cursor: 'pointer'
                                                }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Friends Card */}
                        <div className="card" style={{ border: '1px solid var(--fb-border)', borderRadius: '8px' }}>
                            <div className="card-body">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h5 className="fw-bold mb-0">Bạn bè</h5>
                                    <a href="#" className="text-primary text-decoration-none">Xem tất cả bạn bè</a>
                                </div>
                                <p className="text-muted small mb-3">{userStats.friends} bạn bè</p>

                                <div className="row g-3">
                                    {friends.slice(0, 9).map((friend, i) => (
                                        <div key={friend.id || i} className="col-4">
                                            <div className="text-center">
                                                <img
                                                    src={friend.avatar || `https://i.pravatar.cc/120?img=${i + 1}`}
                                                    alt={friend.fullName || `Friend ${i}`}
                                                    className="img-fluid rounded"
                                                    style={{
                                                        aspectRatio: '1',
                                                        objectFit: 'cover',
                                                        cursor: 'pointer'
                                                    }}
                                                />
                                                <p className="small mt-1 mb-0 fw-semibold">
                                                    {friend.fullName || `Bạn bè ${i + 1}`}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Content */}
                    <div className="col-12 col-lg-7 mt-4 mt-lg-0">
                        {activeTab === 'posts' && (
                            <>
                                {/* Create Post */}
                                <CreatePost />

                                {/* Posts List */}
                                <PostList />
                            </>
                        )}

                        {activeTab === 'about' && (
                            <div className="card" style={{ border: '1px solid var(--fb-border)', borderRadius: '8px' }}>
                                <div className="card-body">
                                    <h5 className="fw-bold mb-4">Giới thiệu chi tiết</h5>

                                    <div className="mb-4">
                                        <h6 className="fw-semibold mb-3">Thông tin cơ bản</h6>
                                        <div className="row">
                                            {profileData?.location && (
                                                <div className="col-6 mb-3">
                                                    <div className="d-flex align-items-center">
                                                        <svg width="16" height="16" className="me-3 text-muted" fill="currentColor" viewBox="0 0 24 24">
                                                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                                                        </svg>
                                                        <div>
                                                            <div className="small text-muted">Sống tại</div>
                                                            <div className="fw-semibold">{profileData.location}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            {profileData?.work && (
                                                <div className="col-6 mb-3">
                                                    <div className="d-flex align-items-center">
                                                        <svg width="16" height="16" className="me-3 text-muted" fill="currentColor" viewBox="0 0 24 24">
                                                            <path d="M20 6h-2.18c.11-.31.18-.65.18-1a2.996 2.996 0 0 0-5.5-1.65l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-2 .89-2 2v11c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2z" />
                                                        </svg>
                                                        <div>
                                                            <div className="small text-muted">Công việc</div>
                                                            <div className="fw-semibold">{profileData.work}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <h6 className="fw-semibold mb-3">Liên hệ</h6>
                                        <div className="d-flex align-items-center mb-2">
                                            <svg width="16" height="16" className="me-3 text-muted" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                                            </svg>
                                            <span>{profileData?.email || user?.email}</span>
                                        </div>
                                        {profileData?.website && (
                                            <div className="d-flex align-items-center">
                                                <svg width="16" height="16" className="me-3 text-muted" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                                                </svg>
                                                <a href={profileData.website} className="text-primary text-decoration-none">
                                                    {profileData.website}
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'friends' && (
                            <div className="card" style={{ border: '1px solid var(--fb-border)', borderRadius: '8px' }}>
                                <div className="card-body">
                                    <h5 className="fw-bold mb-4">Bạn bè ({userStats.friends})</h5>

                                    <div className="row g-3">
                                        {friends.map((friend, i) => (
                                            <div key={friend.id || i} className="col-6 col-md-4 col-lg-3">
                                                <div className="card border-0">
                                                    <img
                                                        src={friend.avatar || `https://i.pravatar.cc/200?img=${i + 1}`}
                                                        alt={friend.displayName || `Friend ${i + 1}`}
                                                        className="card-img-top rounded"
                                                        style={{ aspectRatio: '1', objectFit: 'cover' }}
                                                    />
                                                    <div className="card-body p-2 text-center">
                                                        <h6 className="card-title small mb-0">
                                                            {friend.fullName || `Bạn bè ${i + 1}`}
                                                        </h6>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'photos' && (
                            <div className="card" style={{ border: '1px solid var(--fb-border)', borderRadius: '8px' }}>
                                <div className="card-body">
                                    <h5 className="fw-bold mb-4">Ảnh ({photos.length})</h5>

                                    <div className="row g-2">
                                        {photos.map((photo, index) => (
                                            <div key={photo.id || index} className="col-6 col-md-4">
                                                <img
                                                    src={photo.url || photo.imageUrl || `https://picsum.photos/300/300?random=${index + 1}`}
                                                    alt={photo.description || `Photo ${index + 1}`}
                                                    className="img-fluid rounded"
                                                    style={{
                                                        aspectRatio: '1',
                                                        objectFit: 'cover',
                                                        cursor: 'pointer'
                                                    }}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'videos' && (
                            <div className="card" style={{ border: '1px solid var(--fb-border)', borderRadius: '8px' }}>
                                <div className="card-body">
                                    <h5 className="fw-bold mb-4">Video</h5>
                                    <div className="text-center py-5">
                                        <svg width="64" height="64" className="text-muted mb-3" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M8 5v14l11-7z" />
                                        </svg>
                                        <p className="text-muted">Chưa có video nào</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage; 