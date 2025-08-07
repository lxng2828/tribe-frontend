import { useMessage } from '../contexts/MessageContext';

const ConversationItem = ({
    conversation,
    isSelected,
    onClick,
    avatar,
    name
}) => {
    const { onlineUsers, getTypingUsers } = useMessage();

    const formatTime = (timestamp) => {
        if (!timestamp) return '';

        const date = new Date(timestamp);
        const now = new Date();
        const diffInHours = (now - date) / (1000 * 60 * 60);

        if (diffInHours < 24) {
            return date.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            });
        } else if (diffInHours < 24 * 7) {
            return date.toLocaleDateString('en-US', { weekday: 'short' });
        } else {
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
            });
        }
    };

    const getLastMessagePreview = () => {
        const typingUsers = getTypingUsers(conversation.id);

        if (typingUsers.length > 0) {
            const names = typingUsers.map(user => user.userName).join(', ');
            return `${names} ${typingUsers.length === 1 ? 'is' : 'are'} typing...`;
        }

        if (!conversation.lastMessage) {
            return 'No messages yet';
        }

        // Handle different message types
        if (conversation.lastMessage.includes('sent an image')) {
            return '📷 Image';
        } else if (conversation.lastMessage.includes('sent a file')) {
            return '📎 File';
        } else if (conversation.lastMessage.includes('sent a video')) {
            return '🎥 Video';
        } else if (conversation.lastMessage.includes('sent an audio')) {
            return '🎵 Audio';
        }

        return conversation.lastMessage;
    };

    const isOnline = () => {
        if (conversation.type === 'GROUP') {
            return conversation.members?.some(member =>
                member.id !== conversation.currentUserId && onlineUsers.has(member.id)
            );
        } else {
            const otherMember = conversation.members?.find(member =>
                member.id !== conversation.currentUserId
            );
            return otherMember && onlineUsers.has(otherMember.id);
        }
    };

    const typingUsers = getTypingUsers(conversation.id);
    const isTyping = typingUsers.length > 0;

    return (
        <div
            className={`conversation-item ${isSelected ? 'selected' : ''} ${conversation.unreadCount > 0 ? 'unread' : ''}`}
            onClick={onClick}
        >
            <div className="conversation-avatar-container">
                <img
                    src={avatar}
                    alt={name}
                    className="conversation-avatar"
                />
                {isOnline() && <div className="online-indicator"></div>}
            </div>

            <div className="conversation-content">
                <div className="conversation-header-info">
                    <h4 className="conversation-name">{name}</h4>
                    <span className="conversation-time">
                        {formatTime(conversation.lastMessageTime)}
                    </span>
                </div>

                <div className="conversation-preview">
                    <p className={`conversation-last-message ${isTyping ? 'typing' : ''}`}>
                        {getLastMessagePreview()}
                    </p>

                    <div className="conversation-badges">
                        {conversation.unreadCount > 0 && (
                            <span className="unread-badge">
                                {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConversationItem;
