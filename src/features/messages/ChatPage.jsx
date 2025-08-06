import { useState, useEffect, useRef } from 'react';
import ChatBox from './ChatBox';
import messageService from './messageService';

const ChatPage = () => {
    const [conversations, setConversations] = useState([]);
    const [activeConversation, setActiveConversation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const messagesEndRef = useRef(null);

    // Tải danh sách cuộc trò chuyện
    const loadConversations = async () => {
        try {
            setLoading(true);
            const data = await messageService.getConversations();
            setConversations(data);

            // Tự động chọn cuộc trò chuyện đầu tiên
            if (data.length > 0 && !activeConversation) {
                setActiveConversation(data[0]);
            }
        } catch (error) {
            console.error('Lỗi khi tải cuộc trò chuyện:', error);
        } finally {
            setLoading(false);
        }
    };

    // Lọc cuộc trò chuyện theo tìm kiếm
    const filteredConversations = conversations.filter(conv =>
        conv.participant.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Format thời gian tin nhắn cuối
    const formatLastMessageTime = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

        if (diffInHours < 1) {
            return 'Vừa xong';
        } else if (diffInHours < 24) {
            return `${diffInHours}h`;
        } else {
            const diffInDays = Math.floor(diffInHours / 24);
            if (diffInDays < 7) {
                return `${diffInDays}d`;
            } else {
                return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
            }
        }
    };

    useEffect(() => {
        loadConversations();
    }, []);

    useEffect(() => {
        // Cuộn xuống cuối khi có tin nhắn mới
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [activeConversation]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar - Danh sách cuộc trò chuyện */}
            <div className="w-1/3 bg-white border-r border-gray-300 flex flex-col">
                {/* Header */}
                <div className="p-4 border-b border-gray-200">
                    <h1 className="text-xl font-semibold text-gray-900">Tin nhắn</h1>

                    {/* Search */}
                    <div className="mt-3">
                        <input
                            type="text"
                            placeholder="Tìm kiếm cuộc trò chuyện..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {/* Conversations List */}
                <div className="flex-1 overflow-y-auto">
                    {filteredConversations.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500">
                            <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            <p>Không có cuộc trò chuyện nào</p>
                        </div>
                    ) : (
                        filteredConversations.map((conversation) => (
                            <div
                                key={conversation.id}
                                onClick={() => setActiveConversation(conversation)}
                                className={`flex items-center p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 ${activeConversation?.id === conversation.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                                    }`}
                            >
                                {/* Avatar */}
                                <div className="relative">
                                    <img
                                        src={conversation.participant.avatar || '/src/assets/images/default-avatar.png'}
                                        alt={conversation.participant.name}
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                    {conversation.participant.isOnline && (
                                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                                    )}
                                </div>

                                {/* Conversation Info */}
                                <div className="ml-3 flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-sm font-medium text-gray-900 truncate">
                                            {conversation.participant.name}
                                        </h3>
                                        <span className="text-xs text-gray-500">
                                            {formatLastMessageTime(conversation.lastMessage.createdAt)}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between mt-1">
                                        <p className="text-sm text-gray-600 truncate">
                                            {conversation.lastMessage.isOwn && 'Bạn: '}
                                            {conversation.lastMessage.content}
                                        </p>
                                        {conversation.unreadCount > 0 && (
                                            <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-blue-600 rounded-full">
                                                {conversation.unreadCount}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col">
                {activeConversation ? (
                    <ChatBox
                        conversation={activeConversation}
                        onConversationUpdate={(updatedConversation) => {
                            setActiveConversation(updatedConversation);
                            setConversations(prev =>
                                prev.map(conv =>
                                    conv.id === updatedConversation.id ? updatedConversation : conv
                                )
                            );
                        }}
                    />
                ) : (
                    <div className="flex-1 flex items-center justify-center bg-gray-50">
                        <div className="text-center text-gray-500">
                            <svg className="w-24 h-24 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            <h3 className="text-lg font-medium mb-2">Chọn một cuộc trò chuyện</h3>
                            <p>Chọn một cuộc trò chuyện từ danh sách bên trái để bắt đầu nhắn tin</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatPage;
