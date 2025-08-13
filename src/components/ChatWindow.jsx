import { useState, useEffect, useRef } from 'react';
import { useMessage } from '../contexts/MessageContext';
import { useAuth } from '../contexts/AuthContext';
import { getUserAvatar } from '../utils/placeholderImages';
import MessageItem from './MessageItem';
import MessageInput from './MessageInput';
import TypingIndicator from './TypingIndicator';
import './ChatWindow.css';

const ChatWindow = ({ conversationId }) => {
    const {
        currentConversation,
        messages,
        loading,
        sendMessage,
        getTypingUsers,
        onlineUsers
    } = useMessage();
    const { user } = useAuth();
    const messagesEndRef = useRef(null);
    const [showScrollToBottom, setShowScrollToBottom] = useState(false);
    const messagesContainerRef = useRef(null);

    // Auto scroll to bottom when new messages arrive
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Handle scroll to show/hide scroll-to-bottom button
    useEffect(() => {
        const container = messagesContainerRef.current;
        if (!container) return;

        const handleScroll = () => {
            const { scrollTop, scrollHeight, clientHeight } = container;
            const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
            setShowScrollToBottom(!isNearBottom && messages.length > 0);
        };

        container.addEventListener('scroll', handleScroll);
        return () => container.removeEventListener('scroll', handleScroll);
    }, [messages.length]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSendMessage = async (messageData, files) => {
        try {
            await sendMessage({
                ...messageData,
                conversationId: currentConversation.id
            }, files);
        } catch (error) {
            console.error('Error sending message:', error);
            // You could show an error toast here
        }
    };

    const getConversationName = () => {
        if (!currentConversation) return '';

        if (currentConversation.type === 'GROUP') {
            return currentConversation.name || 'Group Chat';
        }

        const otherMember = currentConversation.members?.find(member => member.id !== user?.id);
        return otherMember?.displayName || 'Unknown User';
    };

    const getConversationAvatar = () => {
        if (!currentConversation) return getUserAvatar(null);

        if (currentConversation.type === 'GROUP') {
            return getUserAvatar(currentConversation);
        }

        const otherMember = currentConversation.members?.find(member => member.id !== user?.id);
        return getUserAvatar(otherMember);
    };

    const getOnlineStatus = () => {
        if (!currentConversation) return '';

        if (currentConversation.type === 'GROUP') {
            const onlineCount = currentConversation.members?.filter(member =>
                member.id !== user?.id && onlineUsers.has(member.id)
            ).length || 0;

            const totalMembers = (currentConversation.members?.length || 1) - 1; // Exclude current user

            if (onlineCount === 0) return `${totalMembers} members`;
            return `${onlineCount} of ${totalMembers} online`;
        } else {
            const otherMember = currentConversation.members?.find(member => member.id !== user?.id);
            if (otherMember && onlineUsers.has(otherMember.id)) {
                return 'Active now';
            }
            return 'Offline';
        }
    };

    const typingUsers = currentConversation ? getTypingUsers(currentConversation.id) : [];

    if (!conversationId) {
        return (
            <div className="chat-window">
                <div className="empty-chat">
                    <svg className="empty-chat-icon" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
                    </svg>
                    <h3>Select a conversation</h3>
                    <p>Choose from your existing conversations or start a new one</p>
                </div>
            </div>
        );
    }

    if (!currentConversation) {
        return (
            <div className="chat-window">
                <div className="empty-chat">
                    <div className="loading-spinner"></div>
                    <h3>Loading conversation...</h3>
                </div>
            </div>
        );
    }

    return (
        <div className="chat-window">
            {/* Chat Header */}
            <div className="chat-header">
                <div className="chat-info">
                    <img
                        src={getConversationAvatar()}
                        alt={getConversationName()}
                        className="chat-avatar"
                    />
                    <div className="chat-details">
                        <h3>{getConversationName()}</h3>
                        <p className="chat-status">{getOnlineStatus()}</p>
                    </div>
                </div>

                <div className="chat-actions">
                    <button className="chat-action-btn" title="Voice call">
                        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                        </svg>
                    </button>
                    <button className="chat-action-btn" title="Video call">
                        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
                        </svg>
                    </button>
                    <button className="chat-action-btn" title="Information">
                        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Messages Container */}
            <div
                className="chat-messages"
                ref={messagesContainerRef}
            >
                {loading ? (
                    <div className="messages-loading">
                        <div className="loading-spinner"></div>
                        <p>Loading messages...</p>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="no-messages">
                        <img
                            src={getConversationAvatar()}
                            alt={getConversationName()}
                            className="conversation-avatar-large"
                        />
                        <h3>Start your conversation with {getConversationName()}</h3>
                        <p>Send a message to get the conversation started</p>
                    </div>
                ) : (
                    <div className="messages-list">
                        {messages.map((message, index) => (
                            <MessageItem
                                key={message.id}
                                message={message}
                                isOwn={message.senderId === user?.id}
                                showAvatar={
                                    index === 0 ||
                                    messages[index - 1].senderId !== message.senderId ||
                                    new Date(message.createdAt) - new Date(messages[index - 1].createdAt) > 5 * 60 * 1000 // 5 minutes
                                }
                                showTime={
                                    index === messages.length - 1 ||
                                    messages[index + 1].senderId !== message.senderId ||
                                    new Date(messages[index + 1].createdAt) - new Date(message.createdAt) > 5 * 60 * 1000
                                }
                            />
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                )}

                {/* Typing Indicator */}
                {typingUsers.length > 0 && (
                    <TypingIndicator users={typingUsers} />
                )}
            </div>

            {/* Scroll to Bottom Button */}
            {showScrollToBottom && (
                <button
                    className="scroll-to-bottom"
                    onClick={scrollToBottom}
                    title="Scroll to bottom"
                >
                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
                    </svg>
                </button>
            )}

            {/* Message Input */}
            <MessageInput onSendMessage={handleSendMessage} />
        </div>
    );
};

export default ChatWindow;
