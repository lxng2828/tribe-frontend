import api from './api';

class FriendshipService {

    /**
     * Gửi lời mời kết bạn
     * @param {string} senderId - ID người gửi
     * @param {string} receiverId - ID người nhận
     * @returns {Promise} Response từ API
     */
    async sendFriendRequest(senderId, receiverId) {
        try {
            const response = await api.post('/friendships/send', null, {
                params: { senderId, receiverId }
            });
            return response.data;
        } catch (error) {
            console.error('Error sending friend request:', error);
            throw error;
        }
    }

    /**
     * Chấp nhận lời mời kết bạn
     * @param {string} senderId - ID người gửi lời mời
     * @param {string} receiverId - ID người nhận lời mời
     * @returns {Promise} Response từ API
     */
    async acceptFriendRequest(senderId, receiverId) {
        try {
            const response = await api.post('/friendships/accept', null, {
                params: { senderId, receiverId }
            });
            return response.data;
        } catch (error) {
            console.error('Error accepting friend request:', error);
            throw error;
        }
    }

    /**
     * Từ chối lời mời kết bạn
     * @param {string} senderId - ID người gửi lời mời
     * @param {string} receiverId - ID người nhận lời mời
     * @returns {Promise} Response từ API
     */
    async rejectFriendRequest(senderId, receiverId) {
        try {
            const response = await api.post('/friendships/reject', null, {
                params: { senderId, receiverId }
            });
            return response.data;
        } catch (error) {
            console.error('Error rejecting friend request:', error);
            throw error;
        }
    }

    /**
     * Lấy danh sách bạn bè
     * @param {string} userId - ID của user
     * @returns {Promise} Danh sách bạn bè
     */
    async getFriends(userId) {
        try {
            const response = await api.get('/friendships/friends', {
                params: { userId }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching friends:', error);
            throw error;
        }
    }

    /**
     * Lấy lời mời kết bạn đang chờ (received)
     * @param {string} userId - ID của user
     * @returns {Promise} Danh sách lời mời kết bạn
     */
    async getFriendRequests(userId) {
        try {
            const response = await api.get('/friendships/friend-requests', {
                params: { userId }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching friend requests:', error);
            throw error;
        }
    }

    /**
     * Lấy lời mời đã gửi (sent)
     * @param {string} senderId - ID của user
     * @returns {Promise} Danh sách lời mời đã gửi
     */
    async getSentRequests(senderId) {
        try {
            const response = await api.get('/friendships/sent-requests', {
                params: { senderId }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching sent requests:', error);
            throw error;
        }
    }

    /**
     * Lấy danh sách user bị chặn
     * @param {string} userId - ID của user
     * @returns {Promise} Danh sách user bị chặn
     */
    async getBlockedUsers(userId) {
        try {
            const response = await api.get('/friendships/blocked-users', {
                params: { userId }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching blocked users:', error);
            throw error;
        }
    }

    /**
     * Bỏ chặn user
     * @param {string} senderId - ID người thực hiện
     * @param {string} receiverId - ID người bị chặn
     * @returns {Promise} Response từ API
     */
    async unblockUser(senderId, receiverId) {
        try {
            const response = await api.delete('/friendships/unblock', {
                params: { senderId, receiverId }
            });
            return response.data;
        } catch (error) {
            console.error('Error unblocking user:', error);
            throw error;
        }
    }

    /**
     * Hủy kết bạn
     * @param {string} senderId - ID người thực hiện
     * @param {string} receiverId - ID người muốn hủy kết bạn
     * @returns {Promise} Response từ API
     */
    async unfriend(senderId, receiverId) {
        try {
            const response = await api.delete('/friendships/unfriend', {
                params: { senderId, receiverId }
            });
            return response.data;
        } catch (error) {
            console.error('Error unfriending user:', error);
            throw error;
        }
    }

    /**
     * Kiểm tra trạng thái quan hệ giữa 2 user
     * @param {string} userId - ID user hiện tại
     * @param {string} targetUserId - ID user cần kiểm tra
     * @returns {Promise} Trạng thái quan hệ
     */
    async getFriendshipStatus(userId, targetUserId) {
        try {
            // Kiểm tra xem có phải bạn bè không
            const friends = await this.getFriends(userId);
            const isFriend = friends.data?.some(friend => friend.friendId === targetUserId);

            if (isFriend) {
                return { status: 'FRIENDS', isFriend: true };
            }

            // Kiểm tra xem có lời mời đã gửi không
            const sentRequests = await this.getSentRequests(userId);
            const hasSentRequest = sentRequests.data?.some(request => request.receiverId === targetUserId);

            if (hasSentRequest) {
                return { status: 'PENDING_SENT', hasSentRequest: true };
            }

            // Kiểm tra xem có lời mời nhận được không
            const receivedRequests = await this.getFriendRequests(userId);
            const hasReceivedRequest = receivedRequests.data?.some(request => request.senderId === targetUserId);

            if (hasReceivedRequest) {
                return { status: 'PENDING_RECEIVED', hasReceivedRequest: true };
            }

            return { status: 'NOT_FRIENDS' };
        } catch (error) {
            console.error('Error checking friendship status:', error);
            throw error;
        }
    }

    /**
     * Format dữ liệu bạn bè để hiển thị
     * @param {Object} friend - Dữ liệu bạn bè từ API
     * @returns {Object} Dữ liệu đã format
     */
    formatFriendInfo(friend) {
        return {
            id: friend.friendId || friend.id,
            displayName: friend.friendName || friend.displayName || friend.name || 'Người dùng',
            avatar: friend.avatarUrl || friend.avatar || '/default-avatar.png',
            acceptedAt: friend.acceptedAt,
            email: friend.email,
            phoneNumber: friend.phoneNumber
        };
    }

    /**
     * Format dữ liệu lời mời kết bạn để hiển thị
     * @param {Object} request - Dữ liệu lời mời từ API
     * @returns {Object} Dữ liệu đã format
     */
    formatFriendRequestInfo(request) {
        return {
            id: request.id,
            senderId: request.senderId,
            receiverId: request.receiverId,
            senderName: request.senderName || request.displayName || 'Người dùng',
            senderAvatar: request.senderAvatar || request.avatar || '/default-avatar.png',
            createdAt: request.createdAt,
            status: request.status
        };
    }
}

// Export singleton instance
const friendshipService = new FriendshipService();
export default friendshipService;
