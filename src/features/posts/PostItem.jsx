import { useState } from 'react';

const PostItem = ({ post, onLike, onDelete }) => {
    const [showComments, setShowComments] = useState(false);
    const [showOptions, setShowOptions] = useState(false);

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

    const handleLike = () => {
        onLike(post.id);
    };

    const handleShare = () => {
        // Implement share functionality
        console.log('Share post:', post.id);
    };

    return (
        <div className="post-fb spacing-fb fade-in-fb">
            {/* Post Header */}
            <div className="post-header-fb">
                <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                        <img
                            src={post.author?.avatar || 'https://via.placeholder.com/40'}
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
                                <svg width="12" height="12" fill="currentColor"
                                    style={{ color: 'var(--fb-text-secondary)' }}>
                                    <path d="M12 2.04C12 .92 11.08.006 10 .006 8.92.006 8 .92 8 2.04c0 1.12.92 2.034 2 2.034 1.08 0 2-.914 2-2.034zM8.5 8.5a.5.5 0 0 0-.5.5v.5a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-.5a.5.5 0 0 0-.5-.5h-3z" />
                                </svg>
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
                                        <path d="M5 12h14" />
                                    </svg>
                                    Lưu bài viết
                                </button>
                                {post.isOwner && (
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
                            <img
                                src={post.images[0]}
                                alt="Post content"
                                className="w-100 rounded"
                                style={{ maxHeight: '500px', objectFit: 'cover' }}
                            />
                        ) : (
                            <div className="row g-2">
                                {post.images.map((image, index) => (
                                    <div key={index} className={`col-${post.images.length === 2 ? '6' : '4'}`}>
                                        <img
                                            src={image}
                                            alt={`Post content ${index + 1}`}
                                            className="w-100 rounded"
                                            style={{ height: '200px', objectFit: 'cover' }}
                                        />
                                    </div>
                                ))}
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
                                <small style={{ color: 'var(--fb-text-secondary)' }} className="me-3">
                                    {post.commentsCount} bình luận
                                </small>
                            )}
                            <small style={{ color: 'var(--fb-text-secondary)' }}>
                                2 lượt chia sẻ
                            </small>
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

                <button
                    className="post-action-btn flex-grow-1"
                    onClick={handleShare}
                >
                    <svg className="me-2" width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.935-2.186 2.25 2.25 0 0 0-3.935 2.186Z" />
                    </svg>
                    Chia sẻ
                </button>
            </div>

            {/* Comments Section */}
            {showComments && (
                <div className="border-top px-4 py-3">
                    {/* Comment Input */}
                    <div className="d-flex align-items-center mb-3">
                        <img
                            src="https://via.placeholder.com/32"
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
                                src={comment.author?.avatar || 'https://via.placeholder.com/32'}
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
