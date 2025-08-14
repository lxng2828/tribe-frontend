import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getAvatarUrl } from '../../utils/placeholderImages';
import ReactionPicker from './ReactionPicker';

const PostItemNew = ({ 
    post, 
    onLike, 
    onReaction,
    onEdit, 
    onDelete, 
    onViewComments, 
    onViewReactions 
}) => {
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

    const handleReaction = (postId, reactionType) => {
        if (onReaction) {
            onReaction(postId, reactionType);
        } else {
            onLike(postId); // Fallback to like if onReaction not provided
        }
    };

    const handleEdit = () => {
        onEdit(post);
        setShowOptions(false);
    };

    const handleDelete = () => {
        onDelete(post);
        setShowOptions(false);
    };

    const handleViewComments = () => {
        onViewComments(post);
    };

    const handleViewReactions = () => {
        onViewReactions(post);
    };

    const visibilityInfo = getVisibilityInfo(post.visibility);

    return (
        <div className="post-fb spacing-fb fade-in-fb" style={{
            borderRadius: '12px',
            position: 'relative',
            zIndex: 1
        }}>
            {/* Post Header */}
            <div className="post-header-fb">
                <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                        <img
                            src={getAvatarUrl(post.author)}
                            alt={post.author?.displayName || post.author?.fullName || post.author?.name || 'User'}
                            className="profile-pic-fb me-3"
                            style={{ width: '48px', height: '48px', borderRadius: '50%' }}
                        />
                        <div className="flex-grow-1">
                            <div className="d-flex align-items-center mb-1">
                                <h6 className="mb-0 me-2">
                                    {post.author?.displayName || post.author?.fullName || post.author?.name || 'Người dùng'}
                                </h6>
                                <span className="visibility-badge d-flex align-items-center" 
                                      style={{ 
                                          fontSize: '12px', 
                                          color: 'var(--fb-text-secondary)',
                                          backgroundColor: 'var(--fb-gray)',
                                          padding: '2px 6px',
                                          borderRadius: '10px'
                                      }}>
                                    {visibilityInfo.icon}
                                    <span className="ms-1">{visibilityInfo.text}</span>
                                </span>
                            </div>
                            <small className="text-muted">{formatDate(post.createdAt)}</small>
                        </div>
                    </div>
                    
                    {/* Options menu */}
                    {canModify && (
                        <div className="position-relative">
                            <button
                                className="btn btn-link p-0"
                                onClick={() => setShowOptions(!showOptions)}
                                style={{ color: 'var(--fb-text-secondary)' }}
                            >
                                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                                </svg>
                            </button>
                            
                            {showOptions && (
                                <div className="position-absolute end-0 mt-2" style={{ zIndex: 1000 }}>
                                    <div className="card shadow-sm" style={{ minWidth: '150px' }}>
                                        <div className="card-body p-0">
                                            <button
                                                className="btn btn-link w-100 text-start p-2"
                                                onClick={handleEdit}
                                            >
                                                <svg className="me-2" width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                                                </svg>
                                                Chỉnh sửa
                                            </button>
                                            <button
                                                className="btn btn-link w-100 text-start p-2 text-danger"
                                                onClick={handleDelete}
                                            >
                                                <svg className="me-2" width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                                                </svg>
                                                Xóa
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Post Content */}
            <div className="post-content-fb">
                {post.content && (
                    <p className="mb-3" style={{ fontSize: '16px', lineHeight: '1.5' }}>
                        {post.content}
                    </p>
                )}

                {/* Post Images */}
                {post.mediaUrls && post.mediaUrls.length > 0 && (
                    <div className="post-images mb-3">
                        {post.mediaUrls.length === 1 ? (
                            <img
                                src={post.mediaUrls[0]}
                                alt="Post image"
                                className="img-fluid rounded"
                                style={{ maxHeight: '500px', width: '100%', objectFit: 'cover' }}
                            />
                        ) : (
                            <div className="row g-2">
                                {post.mediaUrls.map((image, index) => (
                                    <div key={index} className={post.mediaUrls.length === 2 ? 'col-6' : 'col-4'}>
                                        <img
                                            src={image}
                                            alt={`Post image ${index + 1}`}
                                            className="img-fluid rounded"
                                            style={{ height: '200px', width: '100%', objectFit: 'cover' }}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Post Actions */}
            <div className="post-actions-fb">
                <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                        <ReactionPicker
                            onReaction={handleReaction}
                            currentReaction={post.currentReaction}
                            postId={post.id}
                        />
                        <span className="ms-2 text-muted" style={{ fontSize: '14px' }}>
                            {post.likesCount || 0}
                        </span>
                        
                        <button
                            className="btn btn-link p-0 me-3 text-muted"
                            onClick={handleViewComments}
                        >
                            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M21.99 4c0-1.1-.89-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18zM18 14H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
                            </svg>
                            <span className="ms-1">{post.commentsCount || 0}</span>
                        </button>
                    </div>
                    
                    {post.likesCount > 0 && (
                        <button
                            className="btn btn-link p-0 text-muted small"
                            onClick={handleViewReactions}
                        >
                            Xem phản ứng
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PostItemNew;
