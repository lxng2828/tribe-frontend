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
            const formData = new URLSearchParams();
            formData.append('senderId', senderId);
            formData.append('receiverId', receiverId);

            const response = await api.post('/friendships/send', formData, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
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
            const formData = new URLSearchParams();
            formData.append('senderId', senderId);
            formData.append('receiverId', receiverId);

            const response = await api.post('/friendships/accept', formData, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
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
            const formData = new URLSearchParams();
            formData.append('senderId', senderId);
            formData.append('receiverId', receiverId);

            const response = await api.post('/friendships/reject', formData, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
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
     * Kiểm tra trạng thái quan hệ giữa 2 user
     * @param {string} userId - ID user hiện tại
     * @param {string} targetUserId - ID user cần kiểm tra
     * @returns {Promise} Trạng thái quan hệ
     */
    async getFriendshipStatus(userId, targetUserId) {
        try {
            // Kiểm tra xem có phải bạn bè không
            const friends = await this.getFriends(userId);
            if (friends.status.success) {
                const isFriend = friends.data?.some(friend => friend.id === targetUserId);
                if (isFriend) {
                    return { status: 'FRIENDS' };
                }
            }

            // Kiểm tra xem có lời mời nhận được không
            const receivedRequests = await this.getFriendRequests(userId);
            if (receivedRequests.status.success) {
                const hasReceivedRequest = receivedRequests.data?.some(request => request.senderId === targetUserId);
                if (hasReceivedRequest) {
                    return { status: 'PENDING_RECEIVED' };
                }
            }

            // Kiểm tra xem có lời mời đã gửi không (gọi API ngược lại)
            const targetRequests = await this.getFriendRequests(targetUserId);
            if (targetRequests.status.success) {
                const hasSentRequest = targetRequests.data?.some(request => request.senderId === userId);
                if (hasSentRequest) {
                    return { status: 'PENDING_SENT' };
                }
            }

            return { status: 'NOT_FRIENDS' };
        } catch (error) {
            console.error('Error checking friendship status:', error);
            return { status: 'NOT_FRIENDS' };
        }
    }

    /**
     * Lấy cả lời mời gửi đi và nhận về cho FriendsPage
     * @param {string} userId - ID của user
     * @returns {Promise} Object chứa cả received và sent requests
     */
    async getAllFriendRequests(userId) {
        try {
            // Lấy lời mời nhận được
            const receivedResponse = await this.getFriendRequests(userId);
            const receivedRequests = receivedResponse.status.success ? receivedResponse.data : [];

            // Lấy lời mời đã gửi bằng cách kiểm tra tất cả users khác
            // Vì API không có endpoint sent-requests, ta sẽ chỉ hiển thị received
            const sentRequests = []; // Có thể implement sau nếu backend hỗ trợ

            return {
                status: { success: true },
                data: {
                    received: receivedRequests,
                    sent: sentRequests
                }
            };
        } catch (error) {
            console.error('Error fetching all friend requests:', error);
            throw error;
        }
    }

    /**
     * Hủy kết bạn
     * @param {string} senderId - ID người gửi yêu cầu hủy kết bạn
     * @param {string} receiverId - ID người bị hủy kết bạn
     * @returns {Promise} Response từ API
     */
    async unfriend(senderId, receiverId) {
        try {
            const response = await api.delete('/friendships/unfriend', {
                params: { senderId, receiverId }
            });
            return response.data;
        } catch (error) {
            console.error('Error unfriending:', error);
            throw error;
        }
    }
}

// Export singleton instance
const friendshipService = new FriendshipService();
export default friendshipService;
