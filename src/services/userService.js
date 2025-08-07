import api from './api';

class UserService {
    /**
     * Tìm kiếm người dùng theo email
     * @param {string} email - Email để tìm kiếm
     * @returns {Promise} Response từ API
     */
    async searchUsersByEmail(email) {
        try {
            const response = await api.get(`/users/search?email=${encodeURIComponent(email)}`);
            return response.data;
        } catch (error) {
            console.error('Error searching users by email:', error);
            throw error;
        }
    }

    /**
     * Tìm người dùng theo email chính xác
     * @param {string} email - Email chính xác
     * @returns {Promise} Response từ API
     */
    async findUserByEmail(email) {
        try {
            const response = await api.get(`/users/find?email=${encodeURIComponent(email)}`);
            return response.data;
        } catch (error) {
            console.error('Error finding user by email:', error);
            throw error;
        }
    }

    /**
     * Lấy thông tin người dùng theo ID
     * @param {string} userId - ID của người dùng
     * @returns {Promise} Response từ API
     */
    async getUserById(userId) {
        try {
            const response = await api.get(`/users/${userId}`);
            return response.data;
        } catch (error) {
            console.error('Error getting user by ID:', error);
            throw error;
        }
    }

    /**
     * Tìm kiếm người dùng theo từ khóa (email hoặc tên)
     * @param {string} keyword - Từ khóa tìm kiếm
     * @returns {Promise} Danh sách người dùng tìm được
     */
    async searchUsers(keyword) {
        try {
            if (!keyword || keyword.trim().length < 2) {
                return [];
            }

            // Tìm kiếm theo email trước
            const emailResults = await this.searchUsersByEmail(keyword.trim());

            // Nếu có kết quả email, trả về luôn
            if (emailResults.data && emailResults.data.length > 0) {
                return emailResults.data;
            }

            // Nếu không có kết quả, có thể mở rộng tìm kiếm theo tên sau này
            return [];
        } catch (error) {
            console.error('Error searching users:', error);
            return [];
        }
    }

    /**
     * Format thông tin người dùng để hiển thị
     * @param {Object} user - Thông tin người dùng
     * @returns {Object} Thông tin đã format
     */
    formatUserInfo(user) {
        return {
            id: user.id,
            displayName: user.displayName || user.username || 'Người dùng',
            email: user.email,
            avatar: user.avatar || '/default-avatar.png',
            phoneNumber: user.phoneNumber,
            createdAt: user.createdAt,
            lastSeen: user.lastSeen
        };
    }

    /**
     * Debounce function để giảm số lần gọi API
     * @param {Function} func - Function cần debounce
     * @param {number} delay - Thời gian delay (ms)
     * @returns {Function} Function đã được debounce
     */
    debounce(func, delay) {
        let timeoutId;
        return function (...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    }
}

// Export singleton instance
const userService = new UserService();
export default userService;
