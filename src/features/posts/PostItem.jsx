import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getUserAvatar } from '../../utils/placeholderImages';

const PostItem = ({ post, onLike, onDelete }) => {
    const [showComments, setShowComments] = useState(false);
    const [showOptions, setShowOptions] = useState(false);
    const { user } = useAuth();

    // Check if current user can edit/delete this post
    const canModify = post.author?.id === user?.id || post.isOwner;

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

        if (diffInHours < 1) {
            return 'Vừa xong';
        } else if (diffInHours < 24) {
            return `${diffInHours} giờ trước`;
        } else {
            const diffInDays = Math.floor(diffInHours / 24);
            return `${diffInDays} ngày trước`;
        }
    };

    const getVisibilityInfo = (visibility) => {
        switch (visibility) {
            case 'PUBLIC':
                return {
                    icon: <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>,
                    text: 'Công khai'
                };
            case 'FRIENDS':
                return {
                    icon: <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24"><path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 8H17c-.8 0-1.54.37-2.01 1l-1.7 2.26A3.997 3.997 0 0 0 10 15c-2.21 0-4 1.79-4 4v2h14zm-8-2c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2z"/></svg>,
                    text: 'Bạn bè'
                };
            case 'PRIVATE':
                return {
                    icon: <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>,
                    text: 'Chỉ mình tôi'
                };
            default:
                return {
                    icon: <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>,
                    text: 'Công khai'
                };
        }
    };

    const handleLike = () => {
        onLike(post.id);
    };



    return (
        <div className="post-fb spacing-fb fade-in-fb">
            {/* Post Header */}
            <div className="post-header-fb">
                <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                        <img
                            src={post.author?.id === user?.id ? getUserAvatar(user) : getUserAvatar(post.author)}
                            alt={post.author?.name || 'User'}
                            className="profile-pic-fb me-3"
                        />
                        <div>
                            <h6 className="mb-0 fw-bold" style={{ color: 'var(--fb-text)' }}>
                                {post.author?.name || 'Người dùng'}
                            </h6>
                            <div className="d-flex align-items-center">
                                <small style={{ color: 'var(--fb-text-secondary)' }}>
                                    {formatDate(post.createdAt)}
                                </small>
                                <svg className="mx-1" width="4" height="4" fill="currentColor"
                                    style={{ color: 'var(--fb-text-secondary)' }}>
                                    <circle cx="2" cy="2" r="2" />
                                </svg>
                                {/* Visibility Indicator */}
                                <div className="d-flex align-items-center" style={{ color: 'var(--fb-text-secondary)' }}>
                                    {getVisibilityInfo(post.visibility).icon}
                                    <span className="ms-1" style={{ fontSize: '0.75rem' }}>
                                        {getVisibilityInfo(post.visibility).text}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Options Menu */}
                    <div className="dropdown">
                        <button
                            className="btn"
                            onClick={() => setShowOptions(!showOptions)}
                            style={{
                                backgroundColor: 'transparent',
                                border: 'none',
                                borderRadius: '50%',
                                width: '36px',
                                height: '36px',
                                color: 'var(--fb-text-secondary)'
                            }}
                        >
                            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                            </svg>
                        </button>

                        {showOptions && (
                            <div className="dropdown-menu show position-absolute end-0"
                                style={{
                                    border: '1px solid var(--fb-border)',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
                                    minWidth: '200px',
                                    zIndex: 1000
                                }}>
                                <button className="dropdown-item" style={{ borderRadius: '6px', margin: '4px 8px' }}>
                                    <svg className="me-2" width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                                    </svg>
                                    Lưu bài viết
                                </button>
                                {canModify && (
                                    <>
                                        <button className="dropdown-item" style={{ borderRadius: '6px', margin: '4px 8px' }}>
                                            <svg className="me-2" width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                                <path d="m18.5 2.5-8 8v4h4l8-8" />
                                            </svg>
                                            Chỉnh sửa bài viết
                                        </button>
                                        <hr className="my-1" />
                                        <button
                                            className="dropdown-item text-danger"
                                            onClick={() => onDelete(post.id)}
                                            style={{ borderRadius: '6px', margin: '4px 8px' }}
                                        >
                                            <svg className="me-2" width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M3 6h18m-2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                            </svg>
                                            Xóa bài viết
                                        </button>
                                    </>
                                )}
                                {!canModify && (
                                    <button className="dropdown-item" style={{ borderRadius: '6px', margin: '4px 8px' }}>
                                        <svg className="me-2" width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M3 5a2 2 0 0 1 2-2h3.28a1 1 0 0 1 .948.684l1.498 4.493a1 1 0 0 1-.502 1.21l-2.257 1.13a11.042 11.042 0 0 0 5.516 5.516l1.13-2.257a1 1 0 0 1 1.21-.502l4.493 1.498a1 1 0 0 1 .684.949V19a2 2 0 0 1-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                        Báo cáo bài viết
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Post Content */}
            <div className="post-content-fb">
                <p className="mb-3" style={{
                    color: 'var(--fb-text)',
                    fontSize: '15px',
                    lineHeight: '1.33',
                    whiteSpace: 'pre-wrap'
                }}>
                    {post.content}
                </p>

                {/* Post Images */}
                {post.images && post.images.length > 0 && (
                    <div className="mb-3">
                        {post.images.length === 1 ? (
                            <div className="single-image-container">
                                <img
                                    src={post.images[0]}
                                    alt="Post content"
                                    className="post-image-single"
                                    style={{
                                        width: '100%',
                                        maxHeight: '500px',
                                        objectFit: 'cover',
                                        borderRadius: '12px',
                                        cursor: 'pointer',
                                        transition: 'transform 0.2s ease-in-out'
                                    }}
                                    onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
                                    onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                                />
                            </div>
                        ) : post.images.length === 2 ? (
                            <div className="two-images-container" style={{ display: 'flex', gap: '4px' }}>
                                {post.images.map((image, index) => (
                                    <div key={index} style={{ flex: 1 }}>
                                        <img
                                            src={image}
                                            alt={`Post content ${index + 1}`}
                                            className="post-image-multiple"
                                            style={{
                                                width: '100%',
                                                height: '250px',
                                                objectFit: 'cover',
                                                borderRadius: '12px',
                                                cursor: 'pointer',
                                                transition: 'transform 0.2s ease-in-out'
                                            }}
                                            onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
                                            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : post.images.length === 3 ? (
                            <div className="three-images-container">
                                <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                                    <img
                                        src={post.images[0]}
                                        alt="Post content 1"
                                        className="post-image-multiple"
                                        style={{
                                            width: '50%',
                                            height: '200px',
                                            objectFit: 'cover',
                                            borderRadius: '12px',
                                            cursor: 'pointer',
                                            transition: 'transform 0.2s ease-in-out'
                                        }}
                                        onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
                                        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                                    />
                                    <div style={{ width: '50%', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        <img
                                            src={post.images[1]}
                                            alt="Post content 2"
                                            className="post-image-multiple"
                                            style={{
                                                width: '100%',
                                                height: '98px',
                                                objectFit: 'cover',
                                                borderRadius: '12px',
                                                cursor: 'pointer',
                                                transition: 'transform 0.2s ease-in-out'
                                            }}
                                            onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
                                            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                                        />
                                        <img
                                            src={post.images[2]}
                                            alt="Post content 3"
                                            className="post-image-multiple"
                                            style={{
                                                width: '100%',
                                                height: '98px',
                                                objectFit: 'cover',
                                                borderRadius: '12px',
                                                cursor: 'pointer',
                                                transition: 'transform 0.2s ease-in-out'
                                            }}
                                            onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
                                            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                                        />
                                    </div>
                                </div>
                            </div>
                        ) : post.images.length === 4 ? (
                            <div className="four-images-container">
                                <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                                    {post.images.slice(0, 2).map((image, index) => (
                                        <img
                                            key={index}
                                            src={image}
                                            alt={`Post content ${index + 1}`}
                                            className="post-image-multiple"
                                            style={{
                                                width: '50%',
                                                height: '150px',
                                                objectFit: 'cover',
                                                borderRadius: '12px',
                                                cursor: 'pointer',
                                                transition: 'transform 0.2s ease-in-out'
                                            }}
                                            onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
                                            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                                        />
                                    ))}
                                </div>
                                <div style={{ display: 'flex', gap: '4px' }}>
                                    {post.images.slice(2, 4).map((image, index) => (
                                        <img
                                            key={index + 2}
                                            src={image}
                                            alt={`Post content ${index + 3}`}
                                            className="post-image-multiple"
                                            style={{
                                                width: '50%',
                                                height: '150px',
                                                objectFit: 'cover',
                                                borderRadius: '12px',
                                                cursor: 'pointer',
                                                transition: 'transform 0.2s ease-in-out'
                                            }}
                                            onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
                                            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                                        />
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="multiple-images-container">
                                <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                                    {post.images.slice(0, 3).map((image, index) => (
                                        <img
                                            key={index}
                                            src={image}
                                            alt={`Post content ${index + 1}`}
                                            className="post-image-multiple"
                                            style={{
                                                width: '33.33%',
                                                height: '150px',
                                                objectFit: 'cover',
                                                borderRadius: '12px',
                                                cursor: 'pointer',
                                                transition: 'transform 0.2s ease-in-out'
                                            }}
                                            onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
                                            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                                        />
                                    ))}
                                </div>
                                {post.images.length > 4 && (
                                    <div style={{ display: 'flex', gap: '4px' }}>
                                        {post.images.slice(3, 6).map((image, index) => (
                                            <div key={index + 3} style={{ position: 'relative', width: '33.33%' }}>
                                                <img
                                                    src={image}
                                                    alt={`Post content ${index + 4}`}
                                                    className="post-image-multiple"
                                                    style={{
                                                        width: '100%',
                                                        height: '150px',
                                                        objectFit: 'cover',
                                                        borderRadius: '12px',
                                                        cursor: 'pointer',
                                                        transition: 'transform 0.2s ease-in-out'
                                                    }}
                                                    onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
                                                    onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                                                />
                                                {index === 2 && post.images.length > 6 && (
                                                    <div style={{
                                                        position: 'absolute',
                                                        top: 0,
                                                        left: 0,
                                                        right: 0,
                                                        bottom: 0,
                                                        backgroundColor: 'rgba(0, 0, 0, 0.6)',
                                                        borderRadius: '12px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        color: 'white',
                                                        fontSize: '18px',
                                                        fontWeight: 'bold'
                                                    }}>
                                                        +{post.images.length - 6}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Post Stats */}
                {(post.likesCount > 0 || post.commentsCount > 0) && (
                    <div className="d-flex align-items-center justify-content-between mb-2">
                        <div className="d-flex align-items-center">
                            {post.likesCount > 0 && (
                                <div className="d-flex align-items-center">
                                    <div className="d-flex me-2">
                                        <div className="d-flex align-items-center justify-content-center me-1"
                                            style={{
                                                width: '18px',
                                                height: '18px',
                                                backgroundColor: 'var(--fb-blue)',
                                                borderRadius: '50%'
                                            }}>
                                            <svg width="10" height="10" fill="white" viewBox="0 0 24 24">
                                                <path d="M7.493 18.75c-.425 0-.82-.236-.975-.632A7.48 7.48 0 0 1 6 15.125c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V3a.75.75 0 0 1 .75-.75A2.25 2.25 0 0 1 16.25 4.5c0 1.152-.26 2.243-.723 3.218-.266.558-.611 1.05-1.05 1.426A3.625 3.625 0 0 0 14.25 12v2.25c0 .085.002.17.005.253a2.25 2.25 0 0 1-2.505 2.247H7.493Z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <small style={{ color: 'var(--fb-text-secondary)' }}>
                                        {post.likesCount}
                                    </small>
                                </div>
                            )}
                        </div>
                        <div className="d-flex align-items-center">
                            {post.commentsCount > 0 && (
                                <small style={{ color: 'var(--fb-text-secondary)' }}>
                                    {post.commentsCount} bình luận
                                </small>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            <div className="post-actions-fb">
                <button
                    className={`post-action-btn flex-grow-1 ${post.liked ? 'text-primary' : ''}`}
                    onClick={handleLike}
                >
                    <svg className="me-2" width="16" height="16" fill={post.liked ? 'var(--fb-blue)' : 'currentColor'} viewBox="0 0 24 24">
                        <path d="M7.493 18.75c-.425 0-.82-.236-.975-.632A7.48 7.48 0 0 1 6 15.125c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V3a.75.75 0 0 1 .75-.75A2.25 2.25 0 0 1 16.25 4.5c0 1.152-.26 2.243-.723 3.218-.266.558-.611 1.05-1.05 1.426A3.625 3.625 0 0 0 14.25 12v2.25c0 .085.002.17.005.253a2.25 2.25 0 0 1-2.505 2.247H7.493Z" />
                    </svg>
                    <span style={{ color: post.liked ? 'var(--fb-blue)' : 'inherit' }}>
                        {post.liked ? 'Thích' : 'Thích'}
                    </span>
                </button>

                <button
                    className="post-action-btn flex-grow-1"
                    onClick={() => setShowComments(!showComments)}
                >
                    <svg className="me-2" width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
                    </svg>
                    Bình luận
                </button>
            </div>

            {/* Comments Section */}
            {showComments && (
                <div className="border-top px-4 py-3">
                    {/* Comment Input */}
                    <div className="d-flex align-items-center mb-3">
                        <img
                            src={getUserAvatar(user)}
                            alt="Your avatar"
                            className="profile-pic-sm-fb me-2"
                        />
                        <div className="flex-grow-1 position-relative">
                            <input
                                type="text"
                                className="form-control-fb w-100 pe-5"
                                placeholder="Viết bình luận..."
                                style={{
                                    borderRadius: '20px',
                                    backgroundColor: 'var(--fb-gray)',
                                    border: 'none',
                                    fontSize: '14px'
                                }}
                            />
                            <button className="btn position-absolute end-0 top-50 translate-middle-y me-2"
                                style={{ backgroundColor: 'transparent', border: 'none', padding: '4px' }}>
                                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"
                                    style={{ color: 'var(--fb-text-secondary)' }}>
                                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Sample Comments */}
                    {post.comments && post.comments.map((comment) => (
                        <div key={comment.id} className="d-flex mb-3">
                            <img
                                src={comment.author?.id === user?.id ? getUserAvatar(user) : getUserAvatar(comment.author)}
                                alt={comment.author?.name || 'User'}
                                className="profile-pic-sm-fb me-2"
                            />
                            <div className="flex-grow-1">
                                <div className="p-2 rounded"
                                    style={{
                                        backgroundColor: 'var(--fb-gray)',
                                        borderRadius: '16px'
                                    }}>
                                    <div className="fw-bold small"
                                        style={{ color: 'var(--fb-text)', fontSize: '13px' }}>
                                        {comment.author?.name || 'Người dùng'}
                                    </div>
                                    <div style={{ color: 'var(--fb-text)', fontSize: '14px' }}>
                                        {comment.content}
                                    </div>
                                </div>
                                <div className="d-flex align-items-center mt-1 ms-2">
                                    <small style={{ color: 'var(--fb-text-secondary)', fontSize: '12px' }}>
                                        {formatDate(comment.createdAt)}
                                    </small>
                                    <button className="btn btn-sm ms-3 p-0"
                                        style={{
                                            backgroundColor: 'transparent',
                                            border: 'none',
                                            color: 'var(--fb-text-secondary)',
                                            fontSize: '12px',
                                            fontWeight: 'bold'
                                        }}>
                                        Thích
                                    </button>
                                    <button className="btn btn-sm ms-2 p-0"
                                        style={{
                                            backgroundColor: 'transparent',
                                            border: 'none',
                                            color: 'var(--fb-text-secondary)',
                                            fontSize: '12px',
                                            fontWeight: 'bold'
                                        }}>
                                        Phản hồi
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PostItem;
