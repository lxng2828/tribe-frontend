import { useState } from 'react';
import './ReactionPicker.css';

const ReactionPicker = ({ onReaction, currentReaction, postId }) => {
    const [showPicker, setShowPicker] = useState(false);

    const reactions = [
        { type: 'LIKE', emoji: '👍', label: 'Thích', color: '#1877f2' },
        { type: 'LOVE', emoji: '❤️', label: 'Yêu thích', color: '#e31a1a' },
        { type: 'HAHA', emoji: '😂', label: 'Haha', color: '#ffd96a' },
        { type: 'WOW', emoji: '😮', label: 'Wow', color: '#ffd96a' },
        { type: 'SAD', emoji: '😢', label: 'Buồn', color: '#ffd96a' },
        { type: 'ANGRY', emoji: '😠', label: 'Giận', color: '#e31a1a' }
    ];

    const handleReaction = (reactionType) => {
        onReaction(postId, reactionType);
        setShowPicker(false);
    };

    const getCurrentReaction = () => {
        if (!currentReaction) return null;
        return reactions.find(r => r.type === currentReaction);
    };

    const currentReactionData = getCurrentReaction();

    return (
        <div className="reaction-picker-container">
            <div className="reaction-button-wrapper">
                <button
                    className={`reaction-button ${currentReactionData ? 'has-reaction' : ''}`}
                    onClick={() => setShowPicker(!showPicker)}
                    onMouseEnter={() => setShowPicker(true)}
                    style={{
                        backgroundColor: currentReactionData ? currentReactionData.color : 'transparent',
                        color: currentReactionData ? 'white' : '#65676b'
                    }}
                >
                    {currentReactionData ? (
                        <span className="current-reaction">{currentReactionData.emoji}</span>
                    ) : (
                        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/>
                        </svg>
                    )}
                </button>

                {showPicker && (
                    <div 
                        className="reaction-picker"
                        onMouseLeave={() => setShowPicker(false)}
                    >
                        {reactions.map((reaction) => (
                            <button
                                key={reaction.type}
                                className={`reaction-option ${currentReaction === reaction.type ? 'active' : ''}`}
                                onClick={() => handleReaction(reaction.type)}
                                title={reaction.label}
                            >
                                <span className="reaction-emoji">{reaction.emoji}</span>
                                <span className="reaction-label">{reaction.label}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReactionPicker;

