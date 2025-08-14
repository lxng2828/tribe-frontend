import { useState, useEffect } from 'react';
import { usePostManager } from './PostManager';
import { getAvatarUrl } from '../../utils/placeholderImages';

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

    // Load comments when modal opens
    useEffect(() => {
        if (showCommentsModal && selectedPost) {
            setComments(selectedPost.comments || []);
        }
    }, [showCommentsModal, selectedPost]);

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
            const newComment = await addComment(selectedPost.id, commentText, replyingTo);
            
            // Add new comment to the list
            setComments(prev => [...prev, newComment]);
            
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
            
            // Remove comment from the list
            setComments(prev => prev.filter(comment => comment.id !== commentId));
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    const canDeleteComment = (comment) => {
        // Add logic to check if user can delete this comment
        return true; // For now, allow all users to delete
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
                                Bình luận ({comments.length})
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
                                                    src={getAvatarUrl(comment.user)}
                                                    alt={comment.user?.name || 'User'}
                                                    className="rounded-circle me-3"
                                                    style={{ width: '40px', height: '40px' }}
                                                />
                                                <div className="flex-grow-1">
                                                    <div className="comment-content">
                                                        <div className="d-flex align-items-center mb-1">
                                                            <strong className="me-2">
                                                                {comment.user?.name || 'Người dùng'}
                                                            </strong>
                                                            <small className="text-muted">
                                                                {formatDate(comment.createdAt)}
                                                            </small>
                                                        </div>
                                                        <p className="mb-2">{comment.content}</p>
                                                        
                                                        <div className="comment-actions">
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
