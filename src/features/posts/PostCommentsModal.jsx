import { useState, useEffect } from 'react';
import { usePostManager } from './PostManager';
import { getAvatarUrl } from '../../utils/placeholderImages';
import commentReactionService from './commentReactionService';
import CommentReactionPicker from './CommentReactionPicker';

const PostCommentsModal = () => {
    const {
        showCommentsModal,
        closeCommentsModal,
        selectedPost,
        addComment,
        deleteComment,
        loading
    } = usePostManager();

    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState('');
    const [replyingTo, setReplyingTo] = useState(null);
    const [commentReactions, setCommentReactions] = useState({});
    const [reactionLoading, setReactionLoading] = useState({});

    // Load comments when modal opens
    useEffect(() => {
        if (showCommentsModal && selectedPost) {
            setComments(selectedPost.comments || []);
            // Load reaction status for each comment
            loadCommentReactions(selectedPost.comments || []);
        }
    }, [showCommentsModal, selectedPost?.id]);

    // Sync comments with PostManager state
    useEffect(() => {
        if (showCommentsModal && selectedPost) {
            setComments(selectedPost.comments || []);
        }
    }, [selectedPost?.comments, selectedPost?.id, showCommentsModal]);

    // Force update comments when selectedPost changes
    useEffect(() => {
        if (showCommentsModal && selectedPost) {
            setComments(selectedPost.comments || []);
        }
    }, [selectedPost, showCommentsModal]);

    // Load reaction status for comments and replies
    const loadCommentReactions = async (commentsList) => {
        const reactions = {};

        // Helper function to load reaction for a single comment/reply
        const loadReactionForComment = async (comment) => {
            try {
                const userReaction = await commentReactionService.getUserReaction(comment.id);
                const reactionCount = await commentReactionService.getReactionCount(comment.id);
                reactions[comment.id] = {
                    userReaction: userReaction,
                    count: reactionCount
                };
            } catch (error) {
                console.error(`Error loading reaction for comment ${comment.id}:`, error);
                reactions[comment.id] = {
                    userReaction: null,
                    count: 0
                };
            }
        };

        // Load reactions for main comments
        for (const comment of commentsList) {
            await loadReactionForComment(comment);

            // Load reactions for replies if they exist
            if (comment.replies && comment.replies.length > 0) {
                for (const reply of comment.replies) {
                    await loadReactionForComment(reply);
                }
            }
        }

        setCommentReactions(reactions);
    };

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

    const handleSubmitComment = async (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;

        try {
            await addComment(selectedPost.id, commentText, replyingTo);

            // Reset form
            setCommentText('');
            setReplyingTo(null);
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    const handleReply = (commentId) => {
        setReplyingTo(commentId);
    };

    const handleCancelReply = () => {
        setReplyingTo(null);
    };

    const handleDeleteComment = async (commentId) => {
        try {
            await deleteComment(selectedPost.id, commentId);
            // Comments sẽ được cập nhật tự động thông qua useEffect sync
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    // Handle comment reaction change
    const handleCommentReactionChange = (commentId, result) => {
        // Update reaction state
        setCommentReactions(prev => {
            const currentReaction = prev[commentId];
            const wasReacted = currentReaction?.userReaction;
            const isReacted = result !== null;

            // Calculate new count
            let newCount = currentReaction?.count || 0;
            if (wasReacted && !isReacted) {
                // Removed reaction
                newCount = Math.max(0, newCount - 1);
            } else if (!wasReacted && isReacted) {
                // Added reaction
                newCount = newCount + 1;
            } else if (wasReacted && isReacted && wasReacted.reactionType !== result.reactionType) {
                // Changed reaction type - count stays the same
                newCount = newCount;
            }

            return {
                ...prev,
                [commentId]: {
                    userReaction: result,
                    count: newCount
                }
            };
        });
    };

    const canDeleteComment = (comment) => {
        // Kiểm tra xem user hiện tại có thể xóa comment này không
        const currentUserId = comment.user?.id || comment.author?.id;
        const commentUserId = comment.user?.id || comment.author?.id;

        // User có thể xóa comment của chính mình hoặc comment có isOwner = true
        return comment.isOwner || currentUserId === commentUserId;
    };

    const handleCancel = () => {
        setCommentText('');
        setReplyingTo(null);
        closeCommentsModal();
    };

    if (!showCommentsModal || !selectedPost) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="modal-backdrop fade show"
                onClick={handleCancel}
                style={{ zIndex: 1040 }}
            ></div>

            {/* Modal */}
            <div
                className="modal fade show"
                style={{ display: 'block', zIndex: 1050 }}
                tabIndex="-1"
            >
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">
                                Bình luận ({selectedPost?.commentsCount || comments.length})
                            </h5>
                            <button
                                type="button"
                                className="btn-close"
                                onClick={closeCommentsModal}
                                disabled={loading}
                            ></button>
                        </div>

                        <div className="modal-body" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                            {/* Comments list */}
                            {comments.length === 0 ? (
                                <div className="text-center py-4">
                                    <p className="text-muted">Chưa có bình luận nào</p>
                                </div>
                            ) : (
                                <div className="comments-list">
                                    {comments.map((comment) => (
                                        <div key={comment.id} className="comment-item mb-3">
                                            <div className="d-flex">
                                                <img
                                                    src={comment.user?.avatar || comment.author?.avatar || getAvatarUrl({ displayName: 'Người dùng' })}
                                                    alt={comment.user?.name || comment.author?.name || 'User'}
                                                    className="rounded-circle me-3"
                                                    style={{ width: '40px', height: '40px' }}
                                                />
                                                <div className="flex-grow-1">
                                                    <div className="comment-content">
                                                        <div className="d-flex align-items-center mb-1">
                                                            <strong className="me-2">
                                                                {comment.user?.name || comment.author?.name || 'Người dùng'}
                                                            </strong>
                                                            <small className="text-muted">
                                                                {formatDate(comment.createdAt)}
                                                            </small>
                                                        </div>
                                                        <p className="mb-2">{comment.content}</p>

                                                        <div className="comment-actions">
                                                            {commentReactions[comment.id]?.userReaction ? (
                                                                <CommentReactionPicker
                                                                    commentId={comment.id}
                                                                    currentReaction={commentReactions[comment.id]?.userReaction}
                                                                    onReactionChange={(result) => handleCommentReactionChange(comment.id, result)}
                                                                />
                                                            ) : (
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-link btn-sm p-0 me-3"
                                                                    onClick={() => handleCommentReactionChange(comment.id, { reactionType: 'LIKE' })}
                                                                    style={{
                                                                        backgroundColor: 'transparent',
                                                                        border: 'none',
                                                                        color: '#65676b',
                                                                        fontSize: '12px',
                                                                        fontWeight: '600',
                                                                        cursor: 'pointer'
                                                                    }}
                                                                    onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                                                                    onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                                                                >
                                                                    Thích
                                                                </button>
                                                            )}

                                                            {commentReactions[comment.id]?.count > 0 && (
                                                                <span className="badge bg-light text-dark me-3">
                                                                    {commentReactions[comment.id].count}
                                                                </span>
                                                            )}

                                                            <button
                                                                type="button"
                                                                className="btn btn-link btn-sm p-0 me-3"
                                                                onClick={() => handleReply(comment.id)}
                                                            >
                                                                Trả lời
                                                            </button>

                                                            {canDeleteComment(comment) && (
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-link btn-sm p-0 text-danger"
                                                                    onClick={() => handleDeleteComment(comment.id)}
                                                                >
                                                                    Xóa
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Replies */}
                                                    {comment.replies && comment.replies.length > 0 && (
                                                        <div className="replies-container mt-3 ms-4">
                                                            {comment.replies.map((reply) => (
                                                                <div key={reply.id} className="reply-item mb-2">
                                                                    <div className="d-flex">
                                                                        <img
                                                                            src={reply.user?.avatar || reply.author?.avatar || getAvatarUrl({ displayName: 'Người dùng' })}
                                                                            alt={reply.user?.name || reply.author?.name || 'User'}
                                                                            className="rounded-circle me-2"
                                                                            style={{ width: '32px', height: '32px' }}
                                                                        />
                                                                        <div className="flex-grow-1">
                                                                            <div className="reply-content">
                                                                                <div className="d-flex align-items-center mb-1">
                                                                                    <strong className="me-2" style={{ fontSize: '14px' }}>
                                                                                        {reply.user?.name || reply.author?.name || 'Người dùng'}
                                                                                    </strong>
                                                                                    <small className="text-muted">
                                                                                        {formatDate(reply.createdAt)}
                                                                                    </small>
                                                                                </div>
                                                                                <p className="mb-2" style={{ fontSize: '14px' }}>{reply.content}</p>

                                                                                <div className="reply-actions">
                                                                                    {commentReactions[reply.id]?.userReaction ? (
                                                                                        <CommentReactionPicker
                                                                                            commentId={reply.id}
                                                                                            currentReaction={commentReactions[reply.id]?.userReaction}
                                                                                            onReactionChange={(result) => handleCommentReactionChange(reply.id, result)}
                                                                                        />
                                                                                    ) : (
                                                                                        <button
                                                                                            type="button"
                                                                                            className="btn btn-link btn-sm p-0 me-3"
                                                                                            onClick={() => handleCommentReactionChange(reply.id, { reactionType: 'LIKE' })}
                                                                                            style={{
                                                                                                backgroundColor: 'transparent',
                                                                                                border: 'none',
                                                                                                color: '#65676b',
                                                                                                fontSize: '12px',
                                                                                                fontWeight: '600',
                                                                                                cursor: 'pointer'
                                                                                            }}
                                                                                            onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                                                                                            onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                                                                                        >
                                                                                            Thích
                                                                                        </button>
                                                                                    )}

                                                                                    {commentReactions[reply.id]?.count > 0 && (
                                                                                        <span className="badge bg-light text-dark me-3">
                                                                                            {commentReactions[reply.id].count}
                                                                                        </span>
                                                                                    )}

                                                                                    <button
                                                                                        type="button"
                                                                                        className="btn btn-link btn-sm p-0 me-3"
                                                                                        onClick={() => handleReply(reply.id)}
                                                                                    >
                                                                                        Trả lời
                                                                                    </button>

                                                                                    {canDeleteComment(reply) && (
                                                                                        <button
                                                                                            type="button"
                                                                                            className="btn btn-link btn-sm p-0 text-danger"
                                                                                            onClick={() => handleDeleteComment(reply.id)}
                                                                                        >
                                                                                            Xóa
                                                                                        </button>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}

                                                    {/* Reply form */}
                                                    {replyingTo === comment.id && (
                                                        <div className="reply-form mt-3">
                                                            <form onSubmit={handleSubmitComment}>
                                                                <div className="input-group">
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        placeholder="Viết trả lời..."
                                                                        value={commentText}
                                                                        onChange={(e) => setCommentText(e.target.value)}
                                                                        disabled={loading}
                                                                    />
                                                                    <button
                                                                        type="submit"
                                                                        className="btn btn-primary"
                                                                        disabled={loading || !commentText.trim()}
                                                                    >
                                                                        Gửi
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-secondary"
                                                                        onClick={handleCancelReply}
                                                                        disabled={loading}
                                                                    >
                                                                        Hủy
                                                                    </button>
                                                                </div>
                                                            </form>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Add comment form */}
                        <div className="modal-footer">
                            <form onSubmit={handleSubmitComment} className="w-100">
                                <div className="input-group">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Viết bình luận..."
                                        value={commentText}
                                        onChange={(e) => setCommentText(e.target.value)}
                                        disabled={loading}
                                    />
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={loading || !commentText.trim()}
                                    >
                                        {loading ? (
                                            <>
                                                <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                                                Đang gửi...
                                            </>
                                        ) : (
                                            'Gửi'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PostCommentsModal;
