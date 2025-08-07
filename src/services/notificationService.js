import api from './api';

class NotificationService {
    /**
     * Lấy tất cả notifications của user
     * @param {string} userId - ID của user
     * @returns {Promise} Response từ API
     */
    async getUserNotifications(userId) {
        try {
            const response = await api.get(`/notifications/user/${userId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching user notifications:', error);
            throw error;
        }
    }

    /**
     * Lấy notifications chưa đọc của user
     * @param {string} userId - ID của user
     * @returns {Promise} Response từ API
     */
    async getUnreadNotifications(userId) {
        try {
            const response = await api.get(`/notifications/user/${userId}/unread`);
            return response.data;
        } catch (error) {
            console.error('Error fetching unread notifications:', error);
            throw error;
        }
    }

    /**
     * Đánh dấu notification là đã đọc
     * @param {string} notificationId - ID của notification
     * @returns {Promise} Response từ API
     */
    async markAsRead(notificationId) {
        try {
            const response = await api.put(`/notifications/${notificationId}/read`);
            return response.data;
        } catch (error) {
            console.error('Error marking notification as read:', error);
            throw error;
        }
    }

    /**
     * Tạo notification mới
     * @param {Object} notificationData - Dữ liệu notification
     * @param {string} notificationData.userId - ID user nhận notification
     * @param {string} notificationData.title - Tiêu đề notification
     * @param {string} notificationData.content - Nội dung notification
     * @param {string} notificationData.type - Loại notification (MESSAGE/FRIEND_REQUEST/POST)
     * @returns {Promise} Response từ API
     */
    async createNotification(notificationData) {
        try {
            const response = await api.post('/notifications', notificationData);
            return response.data;
        } catch (error) {
            console.error('Error creating notification:', error);
            throw error;
        }
    }

    /**
     * Đánh dấu tất cả notifications là đã đọc
     * @param {string} userId - ID của user
     * @returns {Promise} Response từ API
     */
    async markAllAsRead(userId) {
        try {
            // Lấy tất cả notifications chưa đọc
            const unreadResponse = await this.getUnreadNotifications(userId);
            const unreadNotifications = unreadResponse.data || [];

            // Đánh dấu từng notification là đã đọc
            const markPromises = unreadNotifications.map(notification =>
                this.markAsRead(notification.id)
            );

            await Promise.all(markPromises);
            return { success: true, message: 'All notifications marked as read' };
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
            throw error;
        }
    }

    /**
     * Lấy số lượng notifications chưa đọc
     * @param {string} userId - ID của user
     * @returns {Promise<number>} Số lượng notifications chưa đọc
     */
    async getUnreadCount(userId) {
        try {
            const response = await this.getUnreadNotifications(userId);
            return response.data ? response.data.length : 0;
        } catch (error) {
            console.error('Error fetching unread count:', error);
            return 0;
        }
    }

    /**
     * Xóa notification (nếu API hỗ trợ)
     * @param {string} notificationId - ID của notification
     * @returns {Promise} Response từ API
     */
    async deleteNotification(notificationId) {
        try {
            const response = await api.delete(`/notifications/${notificationId}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting notification:', error);
            throw error;
        }
    }

    /**
     * Format thời gian notification
     * @param {string} createdAt - Thời gian tạo notification
     * @returns {string} Thời gian đã format
     */
    formatNotificationTime(createdAt) {
        const now = new Date();
        const notificationTime = new Date(createdAt);
        const diffInMs = now - notificationTime;
        const diffInMinutes = Math.floor(diffInMs / 60000);
        const diffInHours = Math.floor(diffInMinutes / 60);
        const diffInDays = Math.floor(diffInHours / 24);

        if (diffInMinutes < 1) {
            return 'Vừa xong';
        } else if (diffInMinutes < 60) {
            return `${diffInMinutes} phút trước`;
        } else if (diffInHours < 24) {
            return `${diffInHours} giờ trước`;
        } else if (diffInDays < 7) {
            return `${diffInDays} ngày trước`;
        } else {
            return notificationTime.toLocaleDateString('vi-VN');
        }
    }

    /**
     * Lấy icon cho loại notification
     * @param {string} type - Loại notification
     * @returns {string} Icon class hoặc emoji
     */
    getNotificationIcon(type) {
        switch (type) {
            case 'MESSAGE':
                return '💬';
            case 'FRIEND_REQUEST':
                return '👥';
            case 'POST':
                return '📝';
            case 'LIKE':
                return '👍';
            case 'COMMENT':
                return '💬';
            default:
                return '🔔';
        }
    }

    /**
     * Lấy màu cho loại notification
     * @param {string} type - Loại notification
     * @returns {string} CSS class cho màu
     */
    getNotificationColor(type) {
        switch (type) {
            case 'MESSAGE':
                return 'text-blue-500';
            case 'FRIEND_REQUEST':
                return 'text-green-500';
            case 'POST':
                return 'text-purple-500';
            case 'LIKE':
                return 'text-red-500';
            case 'COMMENT':
                return 'text-yellow-500';
            default:
                return 'text-gray-500';
        }
    }
}

// Export singleton instance
const notificationService = new NotificationService();
export default notificationService;
