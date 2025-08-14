import { useState, useEffect } from 'react';
import { usePostManager } from './PostManager';
import { getAvatarUrl } from '../../utils/placeholderImages';

const PostReactionsModal = () => {
    const { 
        showReactionsModal, 
        closeReactionsModal, 
        selectedPost 
    } = usePostManager();
    
    const [reactions, setReactions] = useState([]);
    const [loading, setLoading] = useState(false);

    // Load reactions when modal opens
    useEffect(() => {
        if (showReactionsModal && selectedPost) {
            setReactions(selectedPost.reactions || []);
        }
    }, [showReactionsModal, selectedPost]);

    const getReactionIcon = (type) => {
        switch (type) {
            case 'LIKE':
                return (
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24" style={{ color: '#1877f2' }}>
                        <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/>
                    </svg>
                );
            case 'LOVE':
                return (
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24" style={{ color: '#ed5167' }}>
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                );
            case 'WOW':
                return (
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24" style={{ color: '#ffd83d' }}>
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                );
            case 'HAHA':
                return (
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24" style={{ color: '#ffd83d' }}>
                        <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>
                    </svg>
                );
            case 'SAD':
                return (
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24" style={{ color: '#ffd83d' }}>
                        <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c-2.33 0-4.31-1.46-5.11-3.5h10.22c-.8 2.04-2.78 3.5-5.11 3.5z"/>
                    </svg>
                );
            case 'ANGRY':
                return (
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24" style={{ color: '#e74c3c' }}>
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                    </svg>
                );
            default:
                return (
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/>
                    </svg>
                );
        }
    };

    const getReactionText = (type) => {
        switch (type) {
            case 'LIKE': return 'Thích';
            case 'LOVE': return 'Yêu thích';
            case 'WOW': return 'Wow';
            case 'HAHA': return 'Haha';
            case 'SAD': return 'Buồn';
            case 'ANGRY': return 'Giận';
            default: return 'Thích';
        }
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

    // Group reactions by type
    const groupedReactions = reactions.reduce((acc, reaction) => {
        const type = reaction.type || reaction.reactionType;
        if (!acc[type]) {
            acc[type] = [];
        }
        acc[type].push(reaction);
        return acc;
    }, {});

    if (!showReactionsModal || !selectedPost) return null;

    return (
        <>
            {/* Backdrop */}
            <div 
                className="modal-backdrop fade show" 
                onClick={closeReactionsModal}
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
                                Phản ứng ({reactions.length})
                            </h5>
                            <button 
                                type="button" 
                                className="btn-close" 
                                onClick={closeReactionsModal}
                            ></button>
                        </div>
                        
                        <div className="modal-body" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                            {reactions.length === 0 ? (
                                <div className="text-center py-4">
                                    <p className="text-muted">Chưa có phản ứng nào</p>
                                </div>
                            ) : (
                                <div>
                                    {/* Reaction type summary */}
                                    <div className="mb-4">
                                        <h6>Thống kê phản ứng:</h6>
                                        <div className="d-flex flex-wrap gap-2">
                                            {Object.entries(groupedReactions).map(([type, typeReactions]) => (
                                                <div key={type} className="d-flex align-items-center p-2 border rounded">
                                                    {getReactionIcon(type)}
                                                    <span className="ms-2">
                                                        {getReactionText(type)} ({typeReactions.length})
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Reactions list */}
                                    <div>
                                        <h6>Danh sách phản ứng:</h6>
                                        <div className="reactions-list">
                                            {reactions.map((reaction) => (
                                                <div key={reaction.id} className="reaction-item d-flex align-items-center mb-3 p-2 border rounded">
                                                    <img
                                                        src={getAvatarUrl(reaction.user)}
                                                        alt={reaction.user?.name || 'User'}
                                                        className="rounded-circle me-3"
                                                        style={{ width: '40px', height: '40px' }}
                                                    />
                                                    <div className="flex-grow-1">
                                                        <div className="d-flex align-items-center">
                                                            <strong className="me-2">
                                                                {reaction.user?.name || 'Người dùng'}
                                                            </strong>
                                                            <span className="me-2">
                                                                {getReactionIcon(reaction.type || reaction.reactionType)}
                                                            </span>
                                                            <small className="text-muted">
                                                                {formatDate(reaction.createdAt)}
                                                            </small>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={closeReactionsModal}
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PostReactionsModal;
