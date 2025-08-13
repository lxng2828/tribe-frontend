import { useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import postService from '../features/posts/postService';
import { DEFAULT_AVATAR, getAvatarUrl } from '../utils/placeholderImages';

const CreatePost = ({ onPostCreate }) => {
    const [postText, setPostText] = useState('');
    const [selectedImages, setSelectedImages] = useState([]);
    const [showPostBox, setShowPostBox] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [visibility, setVisibility] = useState('PUBLIC');
    const fileInputRef = useRef(null);
    const { user } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!postText.trim() && selectedImages.length === 0) return;

        setIsSubmitting(true);
        try {
            const postData = {
                userId: user?.id,
                content: postText,
                images: selectedImages,
                visibility: visibility
            };

            const newPost = await postService.createPost(postData);
            onPostCreate?.(newPost);

            setPostText('');
            setSelectedImages([]);
            setVisibility('PUBLIC');
            setShowPostBox(false);
        } catch (error) {
            console.error('Error creating post:', error);
            alert(`Có lỗi xảy ra khi đăng bài viết: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleImageSelect = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            setSelectedImages(prev => [...prev, ...files]);
        }
    };

    const removeImage = (index) => {
        setSelectedImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleCancel = () => {
        setShowPostBox(false);
        setPostText('');
        setSelectedImages([]);
        setVisibility('PUBLIC');
    };

    const getVisibilityInfo = (vis) => {
        switch (vis) {
            case 'PUBLIC':
                return {
                    icon: <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>,
                    text: 'Công khai'
                };
            case 'FRIENDS':
                return {
                    icon: <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 8H17c-.8 0-1.54.37-2.01 1l-1.7 2.26A3.997 3.997 0 0 0 10 15c-2.21 0-4 1.79-4 4v2h14zm-8-2c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2z"/></svg>,
                    text: 'Bạn bè'
                };
            case 'PRIVATE':
                return {
                    icon: <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>,
                    text: 'Chỉ mình tôi'
                };
            default:
                return {
                    icon: <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>,
                    text: 'Công khai'
                };
        }
    };

    return (
        <div className="card-fb spacing-fb">
            <div className="card-body p-4">
                {/* Create Post Header */}
                <div className="d-flex align-items-center mb-4">
                    <img
                        src={getAvatarUrl(user)}
                        alt="Your Avatar"
                        className="profile-pic-fb me-3"
                        style={{ width: '48px', height: '48px', borderRadius: '50%' }}
                    />
                    <button
                        className="form-control-fb text-start flex-grow-1"
                        onClick={() => setShowPostBox(true)}
                        style={{
                            backgroundColor: 'var(--fb-gray)',
                            border: 'none',
                            cursor: 'pointer',
                            borderRadius: '24px',
                            padding: '12px 20px',
                            fontSize: '1rem'
                        }}
                    >
                        <span style={{ color: 'var(--fb-text-secondary)' }}>
                            {user?.fullName || user?.username}, bạn đang nghĩ gì?
                        </span>
                    </button>
                </div>

                {/* Expanded Post Creation */}
                {showPostBox && (
                    <form onSubmit={handleSubmit} className="border-top pt-4">
                        <div className="d-flex align-items-start">
                            <img
                                src={getAvatarUrl(user)}
                                alt="Your Avatar"
                                className="profile-pic-fb me-3"
                                style={{ width: '48px', height: '48px', borderRadius: '50%' }}
                            />
                            <div className="flex-grow-1">
                                <textarea
                                    className="form-control-fb w-100 mb-4"
                                    rows="4"
                                    placeholder={`${user?.fullName || user?.username}, bạn đang nghĩ gì?`}
                                    value={postText}
                                    onChange={(e) => setPostText(e.target.value)}
                                    autoFocus
                                    style={{
                                        resize: 'none',
                                        border: 'none',
                                        fontSize: '1.1rem',
                                        backgroundColor: 'transparent',
                                        outline: 'none'
                                    }}
                                />

                                {/* Visibility Selector */}
                                <div className="d-flex align-items-center mb-4">
                                    <div className="dropdown">
                                        <button
                                            className="btn btn-sm d-flex align-items-center gap-2"
                                            type="button"
                                            data-bs-toggle="dropdown"
                                            style={{
                                                backgroundColor: 'var(--fb-gray)',
                                                border: '1px solid var(--fb-border)',
                                                color: 'var(--fb-text)',
                                                borderRadius: '20px',
                                                padding: '8px 16px',
                                                fontSize: '0.9rem',
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            {getVisibilityInfo(visibility).icon}
                                            <span>{getVisibilityInfo(visibility).text}</span>
                                            <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M7 10l5 5 5-5z"/>
                                            </svg>
                                        </button>
                                        <ul className="dropdown-menu">
                                            <li>
                                                <button
                                                    className="dropdown-item d-flex align-items-center gap-2"
                                                    type="button"
                                                    onClick={() => setVisibility('PUBLIC')}
                                                >
                                                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                                                    </svg>
                                                    Công khai
                                                </button>
                                            </li>
                                            <li>
                                                <button
                                                    className="dropdown-item d-flex align-items-center gap-2"
                                                    type="button"
                                                    onClick={() => setVisibility('FRIENDS')}
                                                >
                                                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 8H17c-.8 0-1.54.37-2.01 1l-1.7 2.26A3.997 3.997 0 0 0 10 15c-2.21 0-4 1.79-4 4v2h14zm-8-2c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2z"/>
                                                    </svg>
                                                    Bạn bè
                                                </button>
                                            </li>
                                            <li>
                                                <button
                                                    className="dropdown-item d-flex align-items-center gap-2"
                                                    type="button"
                                                    onClick={() => setVisibility('PRIVATE')}
                                                >
                                                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                                                    </svg>
                                                    Chỉ mình tôi
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                {/* Selected Images Preview */}
                                {selectedImages.length > 0 && (
                                    <div className="mb-4">
                                        <div className="d-flex flex-wrap gap-3">
                                            {selectedImages.map((image, index) => (
                                                <div key={index} className="position-relative">
                                                    <img
                                                        src={URL.createObjectURL(image)}
                                                        alt={`Preview ${index + 1}`}
                                                        style={{
                                                            width: '120px',
                                                            height: '120px',
                                                            objectFit: 'cover',
                                                            borderRadius: '12px',
                                                            border: '2px solid var(--fb-border)'
                                                        }}
                                                    />
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm position-absolute top-0 end-0"
                                                        style={{
                                                            backgroundColor: 'rgba(0,0,0,0.8)',
                                                            color: 'white',
                                                            borderRadius: '50%',
                                                            width: '28px',
                                                            height: '28px',
                                                            border: 'none',
                                                            margin: '8px',
                                                            fontSize: '16px',
                                                            fontWeight: 'bold'
                                                        }}
                                                        onClick={() => removeImage(index)}
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Hidden File Input */}
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleImageSelect}
                                    style={{ display: 'none' }}
                                />

                                {/* Post Options */}
                                <div className="d-flex align-items-center justify-content-between p-4 mb-4"
                                    style={{
                                        backgroundColor: 'var(--fb-background)',
                                        borderRadius: '12px',
                                        border: '1px solid var(--fb-border)'
                                    }}>
                                    <span className="fw-medium" style={{ color: 'var(--fb-text-secondary)' }}>
                                        Thêm vào bài viết của bạn
                                    </span>
                                    <div className="d-flex gap-3">
                                        <button
                                            type="button"
                                            className="btn d-flex align-items-center gap-2"
                                            onClick={() => fileInputRef.current?.click()}
                                            style={{ 
                                                backgroundColor: 'transparent', 
                                                border: 'none',
                                                color: '#45bd62',
                                                padding: '8px 12px',
                                                borderRadius: '8px',
                                                transition: 'background-color 0.2s'
                                            }}
                                            onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(69, 189, 98, 0.1)'}
                                            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                                        >
                                            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                                <polyline points="8.5,8.5 12,12 18.5,8.5" />
                                                <circle cx="8.5" cy="8.5" r="1.5" />
                                            </svg>
                                            <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>Ảnh/Video</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="d-flex gap-3">
                                    <button
                                        type="button"
                                        className="btn flex-grow-1"
                                        onClick={handleCancel}
                                        disabled={isSubmitting}
                                        style={{
                                            backgroundColor: 'var(--fb-gray)',
                                            border: 'none',
                                            color: 'var(--fb-text)',
                                            borderRadius: '8px',
                                            padding: '12px 24px',
                                            fontWeight: '500',
                                            transition: 'background-color 0.2s'
                                        }}
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn flex-grow-1"
                                        disabled={(!postText.trim() && selectedImages.length === 0) || isSubmitting}
                                        style={{
                                            backgroundColor: '#1877f2',
                                            border: 'none',
                                            color: 'white',
                                            borderRadius: '8px',
                                            padding: '12px 24px',
                                            fontWeight: '600',
                                            transition: 'background-color 0.2s'
                                        }}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></div>
                                                Đang đăng...
                                            </>
                                        ) : (
                                            'Đăng bài'
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                )}

                {/* Quick Actions (when not expanded) */}
                {!showPostBox && (
                    <div className="d-flex justify-content-center border-top pt-4">
                        <button 
                            className="btn d-flex align-items-center gap-3"
                            style={{ 
                                backgroundColor: 'transparent', 
                                border: 'none',
                                color: '#45bd62',
                                padding: '12px 20px',
                                borderRadius: '8px',
                                transition: 'background-color 0.2s'
                            }}
                            onClick={() => {
                                setShowPostBox(true);
                                setTimeout(() => fileInputRef.current?.click(), 100);
                            }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(69, 189, 98, 0.1)'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                        >
                            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                <polyline points="8.5,8.5 12,12 18.5,8.5" />
                                <circle cx="8.5" cy="8.5" r="1.5" />
                            </svg>
                            <span className="fw-medium" style={{ fontSize: '1rem' }}>
                                Thêm ảnh hoặc video
                            </span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CreatePost;
