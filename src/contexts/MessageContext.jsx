import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import messageService from '../services/messageService';
import webSocketService from '../services/webSocketService';

const MessageContext = createContext(null);

export const useMessage = () => {
    const context = useContext(MessageContext);
    if (!context) {
        throw new Error('useMessage must be used within a MessageProvider');
    }
    return context;
};

export const MessageProvider = ({ children }) => {
    const { user, isAuthenticated } = useAuth();
    const [conversations, setConversations] = useState([]);
    const [currentConversation, setCurrentConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [typing, setTyping] = useState(new Map()); // Map<conversationId, Set<userId>>
    const [onlineUsers, setOnlineUsers] = useState(new Set());
    const [connected, setConnected] = useState(false);

    // Kết nối WebSocket khi user đăng nhập
    useEffect(() => {
        if (isAuthenticated && user?.id) {
            connectWebSocket();
            loadConversations();
        } else {
            disconnectWebSocket();
        }

        return () => {
            disconnectWebSocket();
        };
    }, [isAuthenticated, user?.id]);

    // WebSocket event listeners
    useEffect(() => {
        const handleConversationsUpdate = (updatedConversations) => {
            setConversations(updatedConversations);
        };

        const handleMessagesUpdate = ({ conversationId, messages: newMessages }) => {
            if (currentConversation?.id === conversationId) {
                setMessages(newMessages);
            }

            // Cập nhật lastMessage trong conversations
            setConversations(prev => prev.map(conv => {
                if (conv.id === conversationId && newMessages.length > 0) {
                    const lastMessage = newMessages[newMessages.length - 1];
                    return {
                        ...conv,
                        lastMessage: lastMessage.content,
                        lastMessageTime: lastMessage.createdAt,
                        unreadCount: conv.unreadCount + (lastMessage.senderId !== user?.id ? 1 : 0)
                    };
                }
                return conv;
            }));
        };

        const handleTypingUpdate = ({ conversationId, userId, isTyping, userName }) => {
            setTyping(prev => {
                const newTyping = new Map(prev);
                if (!newTyping.has(conversationId)) {
                    newTyping.set(conversationId, new Map());
                }

                const conversationTyping = newTyping.get(conversationId);
                if (isTyping) {
                    conversationTyping.set(userId, userName);
                } else {
                    conversationTyping.delete(userId);
                }

                return newTyping;
            });
        };

        const handleOnlineStatusUpdate = ({ userId, isOnline }) => {
            setOnlineUsers(prev => {
                const newOnlineUsers = new Set(prev);
                if (isOnline) {
                    newOnlineUsers.add(userId);
                } else {
                    newOnlineUsers.delete(userId);
                }
                return newOnlineUsers;
            });
        };

        // Add event listeners
        webSocketService.addEventListener('conversations', handleConversationsUpdate);
        webSocketService.addEventListener('messages', handleMessagesUpdate);
        webSocketService.addEventListener('typing', handleTypingUpdate);
        webSocketService.addEventListener('onlineStatus', handleOnlineStatusUpdate);

        return () => {
            // Remove event listeners
            webSocketService.removeEventListener('conversations', handleConversationsUpdate);
            webSocketService.removeEventListener('messages', handleMessagesUpdate);
            webSocketService.removeEventListener('typing', handleTypingUpdate);
            webSocketService.removeEventListener('onlineStatus', handleOnlineStatusUpdate);
        };
    }, [currentConversation?.id, user?.id]);

    // Connect WebSocket
    const connectWebSocket = async () => {
        try {
            await webSocketService.connect(user.id);
            setConnected(true);

            // Subscribe to online status updates
            webSocketService.subscribeToOnlineStatus();

            // Send online status
            webSocketService.sendOnlineStatus(user.id, true);
        } catch (error) {
            console.error('Failed to connect WebSocket:', error);
            setConnected(false);
        }
    };

    // Disconnect WebSocket
    const disconnectWebSocket = () => {
        if (user?.id) {
            webSocketService.sendOnlineStatus(user.id, false);
        }
        webSocketService.disconnect();
        setConnected(false);
    };

    // Load conversations
    const loadConversations = async () => {
        if (!user?.id) return;

        setLoading(true);
        try {
            const response = await messageService.getUserConversations(user.id);
            if (response.status.success) {
                setConversations(response.data || []);
            }
        } catch (error) {
            console.error('Error loading conversations:', error);
        } finally {
            setLoading(false);
        }
    };

    // Select conversation
    const selectConversation = async (conversation) => {
        setCurrentConversation(conversation);
        setMessages([]);
        setLoading(true);

        try {
            // Load messages
            const response = await messageService.getMessagesByConversation(conversation.id);
            if (response.status.success) {
                setMessages(response.data || []);
            }

            // Subscribe to messages for this conversation
            webSocketService.subscribeToMessages(conversation.id, user.id);

            // Subscribe to typing indicators
            webSocketService.subscribeToTyping(conversation.id);

            // Mark all messages as seen
            await messageService.markAllMessagesAsSeen(conversation.id, user.id);

            // Update unread count
            setConversations(prev => prev.map(conv =>
                conv.id === conversation.id ? { ...conv, unreadCount: 0 } : conv
            ));

        } catch (error) {
            console.error('Error selecting conversation:', error);
        } finally {
            setLoading(false);
        }
    };

    // Send message
    const sendMessage = async (messageData, files = null) => {
        try {
            const response = await messageService.sendMessage({
                ...messageData,
                senderId: user.id
            }, files);

            if (response.status.success) {
                // Message will be updated via WebSocket
                return response.data;
            }
            throw new Error(response.message || 'Failed to send message');
        } catch (error) {
            console.error('Error sending message:', error);
            throw error;
        }
    };

    // Create conversation
    const createConversation = async (type, participants, groupName = null) => {
        try {
            let response;

            if (type === 'PRIVATE' && participants.length === 1) {
                // 1-1 conversation
                response = await messageService.getOrCreateOneToOneConversation(
                    user.id,
                    participants[0].id
                );
            } else if (type === 'GROUP') {
                // Group conversation
                response = await messageService.createGroupConversation(
                    groupName || 'New Group',
                    user.id
                );

                // Add members to group
                if (response.status.success && participants.length > 0) {
                    for (const participant of participants) {
                        await messageService.addMemberToConversation(
                            response.data.id,
                            participant.id
                        );
                    }
                }
            }

            if (response.status.success) {
                await loadConversations();
                return response.data;
            }
            throw new Error(response.message || 'Failed to create conversation');
        } catch (error) {
            console.error('Error creating conversation:', error);
            throw error;
        }
    };

    // Send typing indicator
    const sendTypingIndicator = (isTyping) => {
        if (currentConversation && user) {
            webSocketService.sendTypingIndicator(currentConversation.id, user.id, isTyping);
        }
    };

    // Edit message
    const editMessage = async (messageId, newContent) => {
        try {
            const response = await messageService.editMessage(
                messageId,
                newContent,
                currentConversation.id
            );

            if (response.status.success) {
                // Message will be updated via WebSocket
                return response.data;
            }
            throw new Error(response.message || 'Failed to edit message');
        } catch (error) {
            console.error('Error editing message:', error);
            throw error;
        }
    };

    // Recall message
    const recallMessage = async (messageId) => {
        try {
            const response = await messageService.recallMessage(messageId, user.id);

            if (response.status.success) {
                // Message will be updated via WebSocket
                return response.data;
            }
            throw new Error(response.message || 'Failed to recall message');
        } catch (error) {
            console.error('Error recalling message:', error);
            throw error;
        }
    };

    // Search messages
    const searchMessages = async (keyword) => {
        if (!currentConversation) return [];

        try {
            const response = await messageService.searchMessages(
                currentConversation.id,
                keyword
            );

            if (response.status.success) {
                return response.data || [];
            }
            return [];
        } catch (error) {
            console.error('Error searching messages:', error);
            return [];
        }
    };

    // Get typing users for a conversation
    const getTypingUsers = (conversationId) => {
        const conversationTyping = typing.get(conversationId);
        if (!conversationTyping) return [];

        return Array.from(conversationTyping.entries())
            .filter(([userId]) => userId !== user?.id)
            .map(([userId, userName]) => ({ userId, userName }));
    };

    const value = {
        // State
        conversations,
        currentConversation,
        messages,
        loading,
        connected,
        onlineUsers,

        // Actions
        selectConversation,
        sendMessage,
        createConversation,
        editMessage,
        recallMessage,
        searchMessages,
        sendTypingIndicator,
        getTypingUsers,
        loadConversations
    };

    return (
        <MessageContext.Provider value={value}>
            {children}
        </MessageContext.Provider>
    );
};
