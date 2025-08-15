import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { DEFAULT_AVATAR, getPostAuthorAvatar, getCommentAuthorAvatar, getAvatarUrl } from '../../utils/placeholderImages';
import postService from './postService';
import PostReactionPicker from './PostReactionPicker';

const PostItem = ({ post, onLike, onDelete, onAddComment }) => {
    const [showComments, setShowComments] = useState(true);
    const [showOptions, setShowOptions] = useState(false);
    const [replyingTo, setReplyingTo] = useState(null);
    const [commentText, setCommentText] = useState('');
    const [isLiking, setIsLiking] = useState(false);
    const [postReaction, setPostReaction] = useState(post.liked ? { reactionType: 'LIKE' } : null);
    
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

    const handleLike = async () => {
        if (isLiking) return;
        
        try {
            setIsLiking(true);
            const result = await postService.toggleReaction(post.id, 'LIKE');
            
            if (onLike) {
                onLike(post.id);
            }
            
            console.log('Reaction result:', result);
        } catch (error) {
            console.error('Error toggling reaction:', error);
        } finally {
            setIsLiking(false);
        }
    };

    const handlePostReactionChange = async (result) => {
        if (isLiking) return;
        
        try {
            setIsLiking(true);
            
            if (result) {
                if (postReaction && postReaction.reactionType === result.reactionType) {
                    const apiResult = await postService.toggleReaction(post.id, result.reactionType);
                    setPostReaction(null);
                } else {
                    const apiResult = await postService.toggleReaction(post.id, result.reactionType);
                    setPostReaction(result);
                }
            } else {
                const apiResult = await postService.toggleReaction(post.id, 'LIKE');
                setPostReaction(null);
            }
            
            if (onLike) {
                onLike(post.id);
            }
        } catch (error) {
            console.error('Error toggling post reaction:', error);
        } finally {
            setIsLiking(false);
        }
    };

    useEffect(() => {
        setPostReaction(post.liked ? { reactionType: 'LIKE' } : null);
    }, [post.liked]);

    const handleReply = (commentId) => {
        setReplyingTo(commentId);
        setCommentText('');
    };

    const handleCancelReply = () => {
        setReplyingTo(null);
        setCommentText('');
    };

    const handleSubmitComment = async () => {
        if (commentText.trim()) {
            try {
                if (replyingTo) {
                    if (onAddComment) {
                        await onAddComment(post.id, commentText, replyingTo);
                    }
                    setReplyingTo(null);
                } else {
                    if (onAddComment) {
                        await onAddComment(post.id, commentText);
                    }
                }
                setCommentText('');
            } catch (error) {
                console.error('Error submitting comment:', error);
            }
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            await postService.deleteComment(post.id, commentId);
            if (onAddComment) {
                await onAddComment(post.id, null, null, true);
            }
        } catch (error) {
            console.error('Error deleting comment:', error);
            alert('Không thể xóa comment: ' + error.message);
        }
    };

    // Check if user can delete a comment - CHÍNH XÁC THEO YÊU CẦU
    const canDeleteComment = (comment) => {
        // Nếu không có user, không thể xóa comment
        if (!user || !user.id) {
            console.log('No user context, cannot delete comment');
            return false;
        }

        // Debug logging
        console.log('Checking delete permission for comment:', {
            commentId: comment.id,
            commentUser: comment.user,
            commentAuthor: comment.author,
            postAuthor: post.author,
            currentUser: user,
            commentAuthorId: comment.user?.id || comment.author?.id,
            postAuthorId: post.author?.id,
            currentUserId: user?.id
        });

        // Logic phân quyền chính xác:
        // 1. Nếu là chủ bài viết: có thể xóa tất cả comment
        // 2. Nếu không phải chủ bài viết: chỉ có thể xóa comment của chính mình
        
        // Hỗ trợ cả comment.user.id và comment.author.id
        const commentAuthorId = comment.user?.id || comment.author?.id;
        const postAuthorId = post.author?.id;
        const currentUserId = user?.id;
        
        const isCommentAuthor = commentAuthorId === currentUserId;
        const isPostAuthor = postAuthorId === currentUserId;
        
        const canDelete = isCommentAuthor || isPostAuthor;
        
        console.log('Delete permission result:', {
            canDelete,
            commentAuthorId,
            postAuthorId,
            currentUserId,
            isCommentAuthor,
            isPostAuthor,
            reason: isCommentAuthor ? 'Comment author' : isPostAuthor ? 'Post author' : 'No permission'
        });
        
        return canDelete;
    };

    return (
        <div className="post-fb spacing-fb fade-in-fb" style={{
            transform: showComments ? 'translateY(-4px)' : 'translateY(0)',
            boxShadow: showComments ? '0 8px 24px rgba(0, 0, 0, 0.15), 0 4px 12px rgba(0, 0, 0, 0.1)' : '0 2px 8px rgba(0, 0, 0, 0.08)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            borderRadius: '12px',
            position: 'relative',
            zIndex: showComments ? 2 : 1
        }}>
            {/* Post Header */}
            <div className="post-header-fb">
                <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                        <img
                            src={getPostAuthorAvatar(post)}
                            alt={post.author?.displayName || post.author?.fullName || post.author?.name || 'User'}
                            className="profile-pic-fb me-3"
                            title={post.author?.displayName || post.author?.fullName || post.author?.name || 'User'}
                        />
                        <div>
                            <h6 className="mb-0 fw-bold" style={{ color: 'var(--fb-text)' }}>
                                {post.author?.displayName || post.author?.fullName || post.author?.name || 'Người dùng'}
                            </h6>
                            <div className="d-flex align-items-center">
                                <small style={{ color: 'var(--fb-text-secondary)' }}>
                                    {formatDate(post.createdAt)}
                                </small>
                                <svg className="mx-1" width="4" height="4" fill="currentColor"
                                    style={{ color: 'var(--fb-text-secondary)' }}>
                                    <circle cx="2" cy="2" r="2" />
                                </svg>
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

                {/* Reactions Display */}
                {post.reactions && post.reactions.length > 0 && (
                    <div className="px-3 mb-3">
                        <div className="d-flex align-items-center">
                            <div className="d-flex me-3" style={{ position: 'relative' }}>
                                {post.reactions.slice(0, 3).map((reaction, index) => (
                                    <div key={index} 
                                        style={{
                                            width: '20px',
                                            height: '20px',
                                            borderRadius: '50%',
                                            background: reaction.type === 'LIKE' ? 'linear-gradient(135deg, #1877f2 0%, #42a5f5 100%)' :
                                                       reaction.type === 'LOVE' ? 'linear-gradient(135deg, #e41e3f 0%, #ff6b9d 100%)' :
                                                       reaction.type === 'WOW' ? 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)' :
                                                       reaction.type === 'HAHA' ? 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)' :
                                                       reaction.type === 'SAD' ? 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)' :
                                                       reaction.type === 'ANGRY' ? 'linear-gradient(135deg, #ff6b35 0%, #ff8a65 100%)' : 
                                                       'linear-gradient(135deg, #1877f2 0%, #42a5f5 100%)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '12px',
                                            marginRight: index < 2 ? '-6px' : '0',
                                            border: '2px solid white',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.15), 0 1px 3px rgba(0,0,0,0.1)',
                                            zIndex: 3 - index,
                                            position: 'relative',
                                            transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.transform = 'scale(1.2)';
                                            e.target.style.zIndex = '10';
                                            e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.25), 0 2px 6px rgba(0,0,0,0.15)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.transform = 'scale(1)';
                                            e.target.style.zIndex = 3 - index;
                                            e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15), 0 1px 3px rgba(0,0,0,0.1)';
                                        }}
                                    >
                                        {reaction.type === 'LIKE' ? '👍' : 
                                         reaction.type === 'LOVE' ? '❤️' : 
                                         reaction.type === 'WOW' ? '😮' : 
                                         reaction.type === 'HAHA' ? '😂' : 
                                         reaction.type === 'SAD' ? '😢' : 
                                         reaction.type === 'ANGRY' ? '😠' : '👍'}
                                    </div>
                                ))}
                                
                                <div style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    background: 'radial-gradient(circle, rgba(24, 119, 242, 0.1) 0%, transparent 70%)',
                                    zIndex: -1
                                }} />
                            </div>
                            
                            <div className="d-flex align-items-center">
                                <span style={{ 
                                    color: '#65676b', 
                                    fontSize: '13px',
                                    fontWeight: '500',
                                    cursor: 'pointer',
                                    transition: 'color 0.2s ease'
                                }}
                                onMouseEnter={(e) => e.target.style.color = '#1877f2'}
                                onMouseLeave={(e) => e.target.style.color = '#65676b'}
                                >
                                    {post.reactions.length === 1 ? (
                                        post.reactions[0].user.name
                                    ) : post.reactions.length === 2 ? (
                                        `${post.reactions[0].user.name} và ${post.reactions[1].user.name}`
                                    ) : post.reactions.length === 3 ? (
                                        `${post.reactions[0].user.name}, ${post.reactions[1].user.name} và ${post.reactions[2].user.name}`
                                    ) : (
                                        `${post.reactions[0].user.name}, ${post.reactions[1].user.name} và ${post.reactions.length - 2} người khác`
                                    )}
                                </span>
                                
                                {post.commentsCount > 0 && (
                                    <>
                                        <span style={{ 
                                            color: '#65676b', 
                                            fontSize: '13px',
                                            margin: '0 12px'
                                        }}>
                                            •
                                        </span>
                                        <span style={{ 
                                            color: '#65676b', 
                                            fontSize: '13px',
                                            fontWeight: '500',
                                            cursor: 'pointer',
                                            transition: 'color 0.2s ease'
                                        }}
                                        onMouseEnter={(e) => e.target.style.color = '#1877f2'}
                                        onMouseLeave={(e) => e.target.style.color = '#65676b'}
                                        >
                                            {post.commentsCount} bình luận
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            <div className="post-actions-fb">
                {postReaction ? (
                    <div className="post-action-btn flex-grow-1 d-flex justify-content-center">
                        <PostReactionPicker
                            postId={post.id}
                            currentReaction={postReaction}
                            onReactionChange={handlePostReactionChange}
                        />
                    </div>
                ) : (
                   <button
                       className="post-action-btn flex-grow-1"
                       onClick={() => handlePostReactionChange({ reactionType: 'LIKE' })}
                       disabled={isLiking}
                       style={{
                           backgroundColor: 'transparent',
                           border: 'none',
                           color: '#65676b',
                           fontSize: '14px',
                           fontWeight: '600',
                           cursor: 'pointer'
                       }}
                       onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                       onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                   >
                       <span>{isLiking ? 'Đang xử lý...' : 'Thích'}</span>
                   </button>
               )}

               <button
                   className="post-action-btn flex-grow-1"
                   onClick={() => setShowComments(!showComments)}
               >
                   <span className="icon">💬</span>
                   <span>Bình luận</span>
               </button>

               <button
                   className="post-action-btn flex-grow-1"
               >
                   <span className="icon">📤</span>
                   <span>Chia sẻ</span>
               </button>
           </div>

            {/* Comments Section */}
            {showComments && (
                <div className="border-top px-4 py-3" style={{ 
                    backgroundColor: '#f8f9fa'
                }}>
                    {/* Comment Input */}
                    <div className="comment-input-container d-flex align-items-center">
                        <img
                            src={getAvatarUrl(user)}
                            alt="Your avatar"
                            className="profile-pic-sm-fb me-3"
                            style={{ width: '32px', height: '32px', borderRadius: '50%' }}
                        />
                        <div className="flex-grow-1 position-relative">
                            <input
                                type="text"
                                className="form-control-fb w-100 pe-5 comment-input-field"
                                placeholder={replyingTo ? "Viết phản hồi..." : "Bình luận dưới tên Bùi Văn Long"}
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                style={{
                                    borderRadius: '20px',
                                    backgroundColor: '#f0f2f5',
                                    border: '1px solid #e4e6ea',
                                    fontSize: '14px',
                                    padding: '8px 50px 8px 12px',
                                    outline: 'none'
                                }}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        handleSubmitComment();
                                    }
                                }}
                            />
                            <div className="position-absolute end-0 top-50 translate-middle-y me-2 d-flex align-items-center">
                                <button 
                                    className="send-btn"
                                    onClick={handleSubmitComment}
                                    style={{ 
                                        backgroundColor: 'transparent', 
                                        border: 'none', 
                                        color: '#1877f2',
                                        fontWeight: 'bold',
                                        fontSize: '16px'
                                    }}
                                >
                                    ➤
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Comments Filter */}
                    <div className="comments-filter mb-3" style={{ 
                        fontSize: '13px', 
                        color: '#65676b',
                        cursor: 'pointer'
                    }}>
                        <span>Phù hợp nhất</span>
                        <span className="dropdown-arrow ms-1">▼</span>
                    </div>
                    
                    {/* Comments List */}
                    <div className="comments-container">
                        {post.comments && post.comments.map((comment) => (
                            <div key={comment.id} className="comment-item mb-3">
                                <div className="d-flex">
                                    <img
                                        src={getCommentAuthorAvatar(comment)}
                                        alt={comment.author?.name || comment.author?.displayName || comment.author?.fullName || 'User'}
                                        className="profile-pic-sm-fb me-3"
                                        style={{ 
                                            width: '32px', 
                                            height: '32px', 
                                            borderRadius: '50%',
                                            flexShrink: 0
                                        }}
                                    />
                                    <div className="flex-grow-1">
                                        {/* Main Comment */}
                                        <div className="comment-bubble"
                                            style={{
                                                backgroundColor: '#f0f2f5',
                                                borderRadius: '16px',
                                                padding: '8px 12px',
                                                position: 'relative'
                                            }}>
                                            <div className="fw-bold mb-1"
                                                style={{ 
                                                    color: '#1c1e21', 
                                                    fontSize: '13px',
                                                    fontWeight: '600'
                                                }}>
                                                {comment.author?.name || 'Người dùng'}
                                            </div>
                                            <div style={{ 
                                                color: '#1c1e21', 
                                                fontSize: '14px',
                                                lineHeight: '1.33'
                                            }}>
                                                {comment.content}
                                            </div>
                                        </div>
                                       
                                        {/* Comment Actions */}
                                        <div className="d-flex align-items-center mt-1 ms-2">
                                            <small style={{ 
                                                color: '#65676b', 
                                                fontSize: '12px',
                                                fontWeight: '500',
                                                marginRight: '12px'
                                            }}>
                                                {formatDate(comment.createdAt)}
                                            </small>
                                            <button className="comment-action-btn"
                                                style={{
                                                    backgroundColor: 'transparent',
                                                    border: 'none',
                                                    color: '#65676b',
                                                    fontSize: '12px',
                                                    fontWeight: '600',
                                                    cursor: 'pointer',
                                                    marginRight: '12px'
                                                }}
                                                onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                                                onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                                            >
                                                Thích
                                            </button>
                                            <button 
                                                className="comment-action-btn"
                                                style={{
                                                    backgroundColor: 'transparent',
                                                    border: 'none',
                                                    color: '#65676b',
                                                    fontSize: '12px',
                                                    fontWeight: '600',
                                                    cursor: 'pointer',
                                                    marginRight: '12px'
                                                }}
                                                onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                                                onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                                                onClick={() => handleReply(comment.id)}
                                            >
                                                Trả lời
                                            </button>
                                            {/* CHỈ HIỂN THỊ NÚT XÓA KHI CÓ QUYỀN */}
                                            {canDeleteComment(comment) && (
                                                <button 
                                                    className="comment-action-btn"
                                                    style={{
                                                        backgroundColor: 'transparent',
                                                        border: 'none',
                                                        color: '#e74c3c',
                                                        fontSize: '12px',
                                                        fontWeight: '600',
                                                        cursor: 'pointer'
                                                    }}
                                                    onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                                                    onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                                                    onClick={() => {
                                                        if (window.confirm('Bạn có chắc chắn muốn xóa comment này?')) {
                                                            handleDeleteComment(comment.id);
                                                        }
                                                    }}
                                                >
                                                    Xóa
                                                </button>
                                            )}
                                        </div>

                                        {/* Replies */}
                                        {comment.replies && comment.replies.length > 0 && (
                                            <div className="replies-container mt-3">
                                                {comment.replies.map((reply) => (
                                                    <div key={reply.id} className="reply-item d-flex mb-2">
                                                        <img
                                                            src={getCommentAuthorAvatar(reply)}
                                                            alt={reply.author?.name || 'User'}
                                                            className="profile-pic-sm-fb me-2"
                                                            style={{ 
                                                                width: '28px', 
                                                                height: '28px', 
                                                                borderRadius: '50%',
                                                                flexShrink: 0
                                                            }}
                                                        />
                                                        <div className="flex-grow-1">
                                                            <div className="reply-bubble"
                                                                style={{
                                                                    backgroundColor: '#f0f2f5',
                                                                    borderRadius: '16px',
                                                                    padding: '10px 14px',
                                                                    border: '1px solid #e4e6ea',
                                                                    position: 'relative'
                                                                }}>
                                                                <div className="fw-bold mb-1"
                                                                    style={{ 
                                                                        color: '#1c1e21', 
                                                                        fontSize: '12px',
                                                                        fontWeight: '600'
                                                                    }}>
                                                                    {reply.author?.name || 'Người dùng'}
                                                                </div>
                                                                <div style={{ 
                                                                    color: '#1c1e21', 
                                                                    fontSize: '13px',
                                                                    lineHeight: '1.4'
                                                                }}>
                                                                    {reply.content}
                                                                </div>
                                                            </div>
                                                            
                                                            {/* Reply Actions */}
                                                            <div className="d-flex align-items-center mt-1 ms-2">
                                                                <small style={{ 
                                                                    color: '#65676b', 
                                                                    fontSize: '11px',
                                                                    fontWeight: '500'
                                                                }}>
                                                                    {formatDate(reply.createdAt)}
                                                                </small>
                                                                <button className="btn btn-sm ms-2 p-0 comment-action-btn"
                                                                    style={{
                                                                        backgroundColor: 'transparent',
                                                                        border: 'none',
                                                                        color: '#65676b',
                                                                        fontSize: '11px',
                                                                        fontWeight: '600',
                                                                        transition: 'color 0.2s'
                                                                    }}
                                                                    onMouseEnter={(e) => e.target.style.color = '#1877f2'}
                                                                    onMouseLeave={(e) => e.target.style.color = '#65676b'}
                                                                >
                                                                    Thích
                                                                </button>
                                                                <button 
                                                                    className="btn btn-sm ms-1 p-0 comment-action-btn"
                                                                    style={{
                                                                        backgroundColor: 'transparent',
                                                                        border: 'none',
                                                                        color: '#65676b',
                                                                        fontSize: '11px',
                                                                        fontWeight: '600',
                                                                        transition: 'color 0.2s'
                                                                    }}
                                                                    onMouseEnter={(e) => e.target.style.color = '#1877f2'}
                                                                    onMouseLeave={(e) => e.target.style.color = '#65676b'}
                                                                    onClick={() => handleReply(reply.id)}
                                                                >
                                                                    Phản hồi
                                                                </button>
                                                                {/* CHỈ HIỂN THỊ NÚT XÓA KHI CÓ QUYỀN */}
                                                                {canDeleteComment(reply) && (
                                                                    <button 
                                                                        className="btn btn-sm ms-1 p-0 comment-action-btn"
                                                                        style={{
                                                                            backgroundColor: 'transparent',
                                                                            border: 'none',
                                                                            color: '#e74c3c',
                                                                            fontSize: '11px',
                                                                            fontWeight: '600',
                                                                            transition: 'color 0.2s'
                                                                        }}
                                                                        onMouseEnter={(e) => e.target.style.color = '#c0392b'}
                                                                        onMouseLeave={(e) => e.target.style.color = '#e74c3c'}
                                                                        onClick={() => {
                                                                            if (window.confirm('Bạn có chắc chắn muốn xóa phản hồi này?')) {
                                                                                handleDeleteComment(reply.id);
                                                                            }
                                                                        }}
                                                                    >
                                                                        Xóa
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                   {/* No Comments Message */}
                   {(!post.comments || post.comments.length === 0) && (
                       <div className="text-center py-4">
                           <div style={{ color: '#65676b', fontSize: '14px' }}>
                               Chưa có bình luận nào. Hãy là người đầu tiên bình luận!
                           </div>
                       </div>
                   )}
               </div>
           )}
       </div>
   );
};

export default PostItem;
