import { useState, useEffect, useRef } from 'react';
import messageService from './messageService';
import Button from '../../components/Button';

const ChatBox = ({ conversation, onConversationUpdate }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    // Tải tin nhắn của cuộc trò chuyện
    const loadMessages = async () => {
        try {
            setLoading(true);
            const data = await messageService.getMessages(conversation.id);
            setMessages(data);
        } catch (error) {
            console.error('Lỗi khi tải tin nhắn:', error);
        } finally {
            setLoading(false);
        }
    };

    // Gửi tin nhắn
    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || sending) return;

        const messageContent = newMessage.trim();
        setNewMessage('');
        setSending(true);

        try {
            const sentMessage = await messageService.sendMessage(conversation.id, messageContent);
            setMessages(prev => [...prev, sentMessage]);

            // Cập nhật cuộc trò chuyện với tin nhắn mới nhất
            const updatedConversation = {
                ...conversation,
                lastMessage: {
                    content: messageContent,
                    createdAt: new Date().toISOString(),
                    isOwn: true
                }
            };
            onConversationUpdate(updatedConversation);
        } catch (error) {
            console.error('Lỗi khi gửi tin nhắn:', error);
            setNewMessage(messageContent); // Khôi phục tin nhắn nếu gửi thất bại
        } finally {
            setSending(false);
        }
    };

    // Format thời gian tin nhắn
    const formatMessageTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Nhóm tin nhắn theo ngày
    const groupMessagesByDate = (messages) => {
        const groups = [];
        let currentGroup = null;

        messages.forEach(message => {
            const messageDate = new Date(message.createdAt).toDateString();

            if (!currentGroup || currentGroup.date !== messageDate) {
                currentGroup = {
                    date: messageDate,
                    messages: [message]
                };
                groups.push(currentGroup);
            } else {
                currentGroup.messages.push(message);
            }
        });

        return groups;
    };

    // Format ngày
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return 'Hôm nay';
        } else if (date.toDateString() === yesterday.toDateString()) {
            return 'Hôm qua';
        } else {
            return date.toLocaleDateString('vi-VN', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }
    };

    // Cuộn xuống cuối khi có tin nhắn mới
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Xử lý phím Enter
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage(e);
        }
    };

    useEffect(() => {
        if (conversation) {
            loadMessages();
        }
    }, [conversation.id]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        // Focus vào input khi mở chat
        inputRef.current?.focus();
    }, [conversation.id]);

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    const messageGroups = groupMessagesByDate(messages);

    return (
        <div className="flex-1 flex flex-col h-full">
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 p-4 flex items-center">
                <img
                    src={conversation.participant.avatar || '/src/assets/images/default-avatar.png'}
                    alt={conversation.participant.name}
                    className="w-10 h-10 rounded-full object-cover"
                />
                <div className="ml-3">
                    <h2 className="text-lg font-semibold text-gray-900">
                        {conversation.participant.name}
                    </h2>
                    <p className="text-sm text-gray-500">
                        {conversation.participant.isOnline ? 'Đang hoạt động' : 'Offline'}
                    </p>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                {messageGroups.map((group, groupIndex) => (
                    <div key={groupIndex}>
                        {/* Date Separator */}
                        <div className="flex justify-center my-4">
                            <span className="bg-white px-3 py-1 rounded-full text-sm text-gray-500 border">
                                {formatDate(group.date)}
                            </span>
                        </div>

                        {/* Messages */}
                        {group.messages.map((message, index) => (
                            <div
                                key={message.id}
                                className={`flex mb-4 ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`max-w-xs lg:max-w-md ${message.isOwn ? 'order-2' : 'order-1'}`}>
                                    <div
                                        className={`px-4 py-2 rounded-lg ${message.isOwn
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-white text-gray-800 border border-gray-200'
                                            }`}
                                    >
                                        <p className="whitespace-pre-wrap break-words">{message.content}</p>
                                    </div>
                                    <div
                                        className={`text-xs text-gray-500 mt-1 ${message.isOwn ? 'text-right' : 'text-left'
                                            }`}
                                    >
                                        {formatMessageTime(message.createdAt)}
                                        {message.isOwn && message.status && (
                                            <span className="ml-1">
                                                {message.status === 'sent' && '✓'}
                                                {message.status === 'delivered' && '✓✓'}
                                                {message.status === 'read' && <span className="text-blue-500">✓✓</span>}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ))}

                {/* Scroll anchor */}
                <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="bg-white border-t border-gray-200 p-4">
                <form onSubmit={handleSendMessage} className="flex items-end space-x-2">
                    <div className="flex-1">
                        <textarea
                            ref={inputRef}
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Nhập tin nhắn..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            rows={1}
                            style={{ minHeight: '40px', maxHeight: '120px' }}
                            disabled={sending}
                        />
                    </div>
                    <Button
                        type="submit"
                        disabled={!newMessage.trim() || sending}
                        className="px-4 py-2"
                    >
                        {sending ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        )}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default ChatBox;
