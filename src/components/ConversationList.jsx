import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMessage } from '../contexts/MessageContext';
import { useAuth } from '../contexts/AuthContext';
import { getUserAvatar } from '../utils/placeholderImages';
import ConversationItem from './ConversationItem';
import NewConversationModal from './NewConversationModal';
import './ConversationList.css';

const ConversationList = ({ selectedConversationId }) => {
    const {
        conversations,
        loading,
        selectConversation,
        currentConversation,
        loadConversations
    } = useMessage();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [showNewConversation, setShowNewConversation] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Filter conversations based on search query
    const filteredConversations = conversations.filter(conv =>
        conv.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.members?.some(member =>
            member.displayName?.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    // Select conversation when URL changes
    useEffect(() => {
        if (selectedConversationId && conversations.length > 0) {
            const conversation = conversations.find(conv => conv.id === selectedConversationId);
            if (conversation && (!currentConversation || currentConversation.id !== conversation.id)) {
                selectConversation(conversation);
            }
        }
    }, [selectedConversationId, conversations, currentConversation, selectConversation]);

    const handleConversationSelect = (conversation) => {
        selectConversation(conversation);
        navigate(`/messages/${conversation.id}`);
    };

    const handleNewConversation = () => {
        setShowNewConversation(true);
    };

    const getConversationName = (conversation) => {
        if (conversation.type === 'GROUP') {
            return conversation.name || 'Group Chat';
        }

        // For private conversations, show the other user's name
        const otherMember = conversation.members?.find(member => member.id !== user?.id);
        return otherMember?.displayName || 'Unknown User';
    };

    const getConversationAvatar = (conversation) => {
        if (conversation.type === 'GROUP') {
            return getUserAvatar(conversation);
        }

        // For private conversations, show the other user's avatar
        const otherMember = conversation.members?.find(member => member.id !== user?.id);
        return getUserAvatar(otherMember);
    };

    return (
        <div className="conversation-list">
            {/* Header */}
            <div className="conversation-header">
                <div className="conversation-header-content">
                    <h2>Chats</h2>
                    <button
                        className="new-conversation-btn"
                        onClick={handleNewConversation}
                        title="New conversation"
                    >
                        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M6 12c0 1.1.9 2 2 2h8l4 4V4c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h2v0z" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Search */}
            <div className="conversation-search">
                <div className="search-input-container">
                    <svg className="search-icon" width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search conversations..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                </div>
            </div>

            {/* Conversations List */}
            <div className="conversations-container">
                {loading ? (
                    <div className="conversations-loading">
                        <div className="loading-spinner"></div>
                        <p>Loading conversations...</p>
                    </div>
                ) : filteredConversations.length === 0 ? (
                    <div className="conversations-empty">
                        {searchQuery ? (
                            <>
                                <p>No conversations found for "{searchQuery}"</p>
                                <button
                                    className="clear-search-btn"
                                    onClick={() => setSearchQuery('')}
                                >
                                    Clear search
                                </button>
                            </>
                        ) : (
                            <>
                                <svg className="empty-icon" width="48" height="48" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
                                </svg>
                                <p>No conversations yet</p>
                                <button
                                    className="start-chat-btn"
                                    onClick={handleNewConversation}
                                >
                                    Start a new chat
                                </button>
                            </>
                        )}
                    </div>
                ) : (
                    <div className="conversations-list">
                        {filteredConversations.map(conversation => (
                            <ConversationItem
                                key={conversation.id}
                                conversation={conversation}
                                isSelected={conversation.id === selectedConversationId}
                                onClick={() => handleConversationSelect(conversation)}
                                avatar={getConversationAvatar(conversation)}
                                name={getConversationName(conversation)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* New Conversation Modal */}
            {showNewConversation && (
                <NewConversationModal
                    onClose={() => setShowNewConversation(false)}
                    onConversationCreated={(conversation) => {
                        setShowNewConversation(false);
                        handleConversationSelect(conversation);
                    }}
                />
            )}
        </div>
    );
};

export default ConversationList;
