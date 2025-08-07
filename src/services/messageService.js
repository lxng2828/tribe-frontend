import api from './api';

class MessageService {
    // ==== CONVERSATION APIs ====

    // Lấy danh sách conversations của user
    async getUserConversations(userId) {
        try {
            const response = await api.get(`/conversations/user/${userId}`);
            return response.data;
        } catch (error) {
            console.error('Error getting user conversations:', error);
            throw error;
        }
    }

    // Tạo hoặc lấy conversation 1-1
    async getOrCreateOneToOneConversation(senderId, receiverId) {
        try {
            const response = await api.post(`/conversations/one-to-one?senderId=${senderId}&receiverId=${receiverId}`);
            return response.data;
        } catch (error) {
            console.error('Error creating/getting conversation:', error);
            throw error;
        }
    }

    // Tạo group conversation
    async createGroupConversation(groupName, createdBy) {
        try {
            const response = await api.post(`/conversations/create-group?name=${encodeURIComponent(groupName)}&createdBy=${createdBy}`);
            return response.data;
        } catch (error) {
            console.error('Error creating group conversation:', error);
            throw error;
        }
    }

    // Cập nhật conversation
    async updateConversation(conversationId, data) {
        try {
            const response = await api.put(`/conversations/${conversationId}/update`, data);
            return response.data;
        } catch (error) {
            console.error('Error updating conversation:', error);
            throw error;
        }
    }

    // Archive conversation
    async archiveConversation(conversationId) {
        try {
            const response = await api.put(`/conversations/${conversationId}/archive`);
            return response.data;
        } catch (error) {
            console.error('Error archiving conversation:', error);
            throw error;
        }
    }

    // Upload group avatar
    async uploadGroupAvatar(conversationId, file) {
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await api.post(`/conversations/groups/${conversationId}/avatar`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error uploading group avatar:', error);
            throw error;
        }
    }

    // ==== MESSAGE APIs ====

    // Gửi tin nhắn
    async sendMessage(messageData, files = null) {
        try {
            const formData = new FormData();

            // Thêm các field required
            formData.append('senderId', messageData.senderId);
            formData.append('messageType', messageData.messageType);

            // Thêm các field optional
            if (messageData.conversationId) {
                formData.append('conversationId', messageData.conversationId);
            }
            if (messageData.receiverId) {
                formData.append('receiverId', messageData.receiverId);
            }
            if (messageData.content) {
                formData.append('content', messageData.content);
            }
            if (messageData.replyToId) {
                formData.append('replyToId', messageData.replyToId);
            }

            // Thêm files nếu có
            if (files && files.length > 0) {
                files.forEach(file => {
                    formData.append('files', file);
                });
            }

            const response = await api.post('/messages/send', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error sending message:', error);
            throw error;
        }
    }

    // Lấy messages theo conversation
    async getMessagesByConversation(conversationId, page = 0, size = 20) {
        try {
            const response = await api.get(`/messages/get-by-conversation?conversationId=${conversationId}&page=${page}&size=${size}`);
            return response.data;
        } catch (error) {
            console.error('Error getting messages:', error);
            throw error;
        }
    }

    // Lấy message theo ID
    async getMessageById(messageId, conversationId) {
        try {
            const response = await api.post(`/messages/get-by-id?messageId=${messageId}&conversationId=${conversationId}`);
            return response.data;
        } catch (error) {
            console.error('Error getting message by ID:', error);
            throw error;
        }
    }

    // Edit message
    async editMessage(messageId, newContent, conversationId) {
        try {
            const response = await api.post('/messages/edit', {
                messageId,
                newContent,
                conversationId
            });
            return response.data;
        } catch (error) {
            console.error('Error editing message:', error);
            throw error;
        }
    }

    // Mark message as seen
    async markMessageAsSeen(messageId) {
        try {
            const response = await api.put(`/messages/${messageId}/seen`);
            return response.data;
        } catch (error) {
            console.error('Error marking message as seen:', error);
            throw error;
        }
    }

    // Recall message
    async recallMessage(messageId, userId) {
        try {
            const response = await api.put(`/messages/${messageId}/recall?userId=${userId}`);
            return response.data;
        } catch (error) {
            console.error('Error recalling message:', error);
            throw error;
        }
    }

    // Search messages
    async searchMessages(conversationId, keyword, page = 0, size = 20) {
        try {
            const response = await api.get(`/messages/search?conversationId=${conversationId}&keyword=${encodeURIComponent(keyword)}&page=${page}&size=${size}`);
            return response.data;
        } catch (error) {
            console.error('Error searching messages:', error);
            throw error;
        }
    }

    // ==== CONVERSATION MEMBER APIs ====

    // Thêm member vào conversation
    async addMemberToConversation(conversationId, userId) {
        try {
            const response = await api.post('/conversation-members/add', {
                conversationId,
                userId
            });
            return response.data;
        } catch (error) {
            console.error('Error adding member:', error);
            throw error;
        }
    }

    // Lấy members của conversation
    async getConversationMembers(conversationId) {
        try {
            const response = await api.post('/conversation-members/members-by-conversation', {
                conversationId
            });
            return response.data;
        } catch (error) {
            console.error('Error getting conversation members:', error);
            throw error;
        }
    }

    // Xóa member khỏi conversation
    async removeMemberFromConversation(conversationId, userId) {
        try {
            const response = await api.post('/conversation-members/remove', {
                conversationId,
                userId
            });
            return response.data;
        } catch (error) {
            console.error('Error removing member:', error);
            throw error;
        }
    }

    // ==== MESSAGE STATUS APIs ====

    // Mark all messages as seen
    async markAllMessagesAsSeen(conversationId, userId) {
        try {
            const response = await api.post(`/message-statuses/mark-all-seen?conversationId=${conversationId}&userId=${userId}`);
            return response.data;
        } catch (error) {
            console.error('Error marking all messages as seen:', error);
            throw error;
        }
    }

    // ==== ATTACHMENT APIs ====

    // Lấy attachments theo message
    async getMessageAttachments(messageId) {
        try {
            const response = await api.get(`/attachments/message/${messageId}`);
            return response.data;
        } catch (error) {
            console.error('Error getting message attachments:', error);
            throw error;
        }
    }

    // Lấy attachments theo conversation
    async getConversationAttachments(conversationId) {
        try {
            const response = await api.get(`/attachments/conversation/${conversationId}`);
            return response.data;
        } catch (error) {
            console.error('Error getting conversation attachments:', error);
            throw error;
        }
    }
}

const messageService = new MessageService();
export default messageService;
