import api from '../../services/api';

class MessageService {
    // Lấy danh sách cuộc trò chuyện
    async getConversations() {
        try {
            const response = await api.get('/conversations');
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Lỗi khi tải cuộc trò chuyện');
        }
    }

    // Lấy tin nhắn của một cuộc trò chuyện
    async getMessages(conversationId, page = 1, limit = 50) {
        try {
            const response = await api.get(`/conversations/${conversationId}/messages?page=${page}&limit=${limit}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Lỗi khi tải tin nhắn');
        }
    }

    // Gửi tin nhắn
    async sendMessage(conversationId, content, type = 'text') {
        try {
            const response = await api.post(`/conversations/${conversationId}/messages`, {
                content,
                type
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Lỗi khi gửi tin nhắn');
        }
    }

    // Gửi file/hình ảnh
    async sendFile(conversationId, file) {
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('type', file.type.startsWith('image/') ? 'image' : 'file');

            const response = await api.post(`/conversations/${conversationId}/messages`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Lỗi khi gửi file');
        }
    }

    // Tạo cuộc trò chuyện mới
    async createConversation(participantId) {
        try {
            const response = await api.post('/conversations', {
                participantId
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Lỗi khi tạo cuộc trò chuyện');
        }
    }

    // Xóa tin nhắn
    async deleteMessage(conversationId, messageId) {
        try {
            await api.delete(`/conversations/${conversationId}/messages/${messageId}`);
            return true;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Lỗi khi xóa tin nhắn');
        }
    }

    // Đánh dấu tin nhắn đã đọc
    async markAsRead(conversationId) {
        try {
            await api.post(`/conversations/${conversationId}/read`);
            return true;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Lỗi khi đánh dấu đã đọc');
        }
    }

    // Tìm kiếm tin nhắn
    async searchMessages(query, conversationId = null) {
        try {
            const params = new URLSearchParams({ q: query });
            if (conversationId) {
                params.append('conversationId', conversationId);
            }

            const response = await api.get(`/messages/search?${params.toString()}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Lỗi khi tìm kiếm tin nhắn');
        }
    }

    // Lấy thông tin cuộc trò chuyện
    async getConversation(conversationId) {
        try {
            const response = await api.get(`/conversations/${conversationId}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Lỗi khi tải thông tin cuộc trò chuyện');
        }
    }

    // Rời khỏi cuộc trò chuyện (cho group chat)
    async leaveConversation(conversationId) {
        try {
            await api.post(`/conversations/${conversationId}/leave`);
            return true;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Lỗi khi rời khỏi cuộc trò chuyện');
        }
    }

    // Thêm người vào cuộc trò chuyện (cho group chat)
    async addParticipant(conversationId, userId) {
        try {
            const response = await api.post(`/conversations/${conversationId}/participants`, {
                userId
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Lỗi khi thêm người vào cuộc trò chuyện');
        }
    }

    // Xóa người khỏi cuộc trò chuyện (cho group chat)
    async removeParticipant(conversationId, userId) {
        try {
            await api.delete(`/conversations/${conversationId}/participants/${userId}`);
            return true;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Lỗi khi xóa người khỏi cuộc trò chuyện');
        }
    }

    // Cập nhật cài đặt cuộc trò chuyện
    async updateConversationSettings(conversationId, settings) {
        try {
            const response = await api.put(`/conversations/${conversationId}/settings`, settings);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Lỗi khi cập nhật cài đặt');
        }
    }

    // Báo cáo tin nhắn
    async reportMessage(conversationId, messageId, reason) {
        try {
            const response = await api.post(`/conversations/${conversationId}/messages/${messageId}/report`, {
                reason
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Lỗi khi báo cáo tin nhắn');
        }
    }

    // WebSocket connection cho real-time messaging
    connectWebSocket(userId, onMessage, onError) {
        try {
            const wsUrl = `${process.env.REACT_APP_WS_URL || 'ws://localhost:3001'}/ws?userId=${userId}`;
            const ws = new WebSocket(wsUrl);

            ws.onopen = () => {
                console.log('WebSocket connected');
            };

            ws.onmessage = (event) => {
                const data = JSON.parse(event.data);
                onMessage(data);
            };

            ws.onerror = (error) => {
                console.error('WebSocket error:', error);
                onError(error);
            };

            ws.onclose = () => {
                console.log('WebSocket disconnected');
                // Tự động kết nối lại sau 3 giây
                setTimeout(() => {
                    this.connectWebSocket(userId, onMessage, onError);
                }, 3000);
            };

            return ws;
        } catch (error) {
            console.error('Lỗi khi kết nối WebSocket:', error);
            onError(error);
        }
    }
}

const messageService = new MessageService();
export default messageService;
