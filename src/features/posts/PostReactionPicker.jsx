import React, { useState } from 'react';
import postService from './postService';
import './CommentReactionPicker.css';

const PostReactionPicker = ({ postId, currentReaction, onReactionChange }) => {
    const [showPicker, setShowPicker] = useState(false);
    const [loading, setLoading] = useState(false);

    const reactions = [
        { type: 'LIKE', emoji: '👍', label: 'Thích', color: '#1877f2' },
        { type: 'LOVE', emoji: '❤️', label: 'Yêu thích', color: '#e31a1a' },
        { type: 'HAHA', emoji: '😂', label: 'Haha', color: '#ffd96a' },
        { type: 'WOW', emoji: '😮', label: 'Wow', color: '#ffd96a' },
        { type: 'SAD', emoji: '😢', label: 'Buồn', color: '#ffd96a' },
        { type: 'ANGRY', emoji: '😠', label: 'Giận', color: '#e31a1a' }
    ];

    const handleReaction = async (reactionType) => {
        if (loading) return;
        
        console.log('PostReactionPicker handleReaction called with:', reactionType);
        console.log('Current reaction:', currentReaction);
        
        setLoading(true);
        try {
            // If clicking on the current reaction, remove it (pass null)
            if (currentReaction && currentReaction.reactionType === reactionType) {
                console.log('Removing current post reaction');
                const result = await postService.toggleReaction(postId, reactionType);
                onReactionChange(null); // Remove reaction
            } else {
                // If clicking on a different reaction, change to it
                console.log('Changing to new post reaction');
                const result = await postService.toggleReaction(postId, reactionType);
                onReactionChange({ reactionType });
            }
            setShowPicker(false);
        } catch (error) {
            console.error('Error toggling post reaction:', error);
        } finally {
            setLoading(false);
        }
    };

    const getCurrentReactionEmoji = () => {
        if (!currentReaction) return '👍';
        const reaction = reactions.find(r => r.type === currentReaction.reactionType);
        return reaction ? reaction.emoji : '👍';
    };

    const getCurrentReactionLabel = () => {
        if (!currentReaction) return 'Thích';
        const reaction = reactions.find(r => r.type === currentReaction.reactionType);
        return reaction ? reaction.label : 'Thích';
    };

    const getCurrentReactionColor = () => {
        if (!currentReaction) return '#1877f2';
        const reaction = reactions.find(r => r.type === currentReaction.reactionType);
        return reaction ? reaction.color : '#1877f2';
    };

    return (
        <div className="comment-reaction-picker position-relative">
            {/* Main reaction button */}
            <button
                type="button"
                className={`reaction-main-btn ${currentReaction ? 'has-reaction' : ''}`}
                onClick={() => setShowPicker(!showPicker)}
                disabled={loading}
                onMouseEnter={() => setShowPicker(true)}
                style={{
                    color: currentReaction ? getCurrentReactionColor() : '#65676b'
                }}
            >
                {loading ? (
                    <div className="reaction-loading">
                        <div className="spinner-border spinner-border-sm" role="status"></div>
                    </div>
                ) : (
                    <>
                        <span className="reaction-emoji">{getCurrentReactionEmoji()}</span>
                        <span className="reaction-label">{getCurrentReactionLabel()}</span>
                    </>
                )}
            </button>

            {/* Reaction picker popup */}
            {showPicker && (
                <div 
                    className="reaction-picker-popup"
                    onMouseLeave={() => setShowPicker(false)}
                >
                    <div className="reaction-picker-content">
                        {reactions.map((reaction, index) => (
                            <button
                                key={reaction.type}
                                type="button"
                                className={`reaction-emoji-btn ${currentReaction?.reactionType === reaction.type ? 'active' : ''}`}
                                onClick={() => handleReaction(reaction.type)}
                                disabled={loading}
                                style={{
                                    animationDelay: `${index * 50}ms`
                                }}
                                title={reaction.label}
                            >
                                <span className="emoji">{reaction.emoji}</span>
                                <span className="tooltip">{reaction.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PostReactionPicker;
