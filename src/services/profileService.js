import api from './api';

class ProfileService {
    // Lấy thông tin profile của user hiện tại
    async getCurrentUserProfile() {
        try {
            const response = await api.get('/users/profile');
            return response.data;
        } catch (error) {
            console.error('Error fetching current user profile:', error);
            throw error;
        }
    }

    // Lấy thông tin profile của user theo ID
    async getUserProfile(userId) {
        try {
            const response = await api.get(`/users/${userId}/profile`);
            return response.data;
        } catch (error) {
            console.error('Error fetching user profile:', error);
            throw error;
        }
    }

    // Cập nhật thông tin profile
    async updateProfile(profileData) {
        try {
            const response = await api.put('/users/profile', profileData);
            return response.data;
        } catch (error) {
            console.error('Error updating profile:', error);
            throw error;
        }
    }

    // Cập nhật avatar
    async updateAvatar(formData) {
        try {
            const response = await api.post('/users/profile/avatar', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error updating avatar:', error);
            throw error;
        }
    }

    // Cập nhật ảnh bìa
    async updateCoverPhoto(formData) {
        try {
            const response = await api.post('/users/profile/cover', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error updating cover photo:', error);
            throw error;
        }
    }

    // Lấy danh sách bạn bè
    async getFriends(userId = null, page = 0, size = 20) {
        try {
            const url = userId ? `/users/${userId}/friends` : '/users/friends';
            const response = await api.get(url, {
                params: { page, size }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching friends:', error);
            throw error;
        }
    }

    // Lấy danh sách ảnh của user
    async getUserPhotos(userId = null, page = 0, size = 20) {
        try {
            const url = userId ? `/users/${userId}/photos` : '/users/photos';
            const response = await api.get(url, {
                params: { page, size }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching user photos:', error);
            throw error;
        }
    }

    // Lấy thống kê của user (số bạn bè, followers, etc.)
    async getUserStats(userId = null) {
        try {
            const url = userId ? `/users/${userId}/stats` : '/users/stats';
            const response = await api.get(url);
            return response.data;
        } catch (error) {
            console.error('Error fetching user stats:', error);
            throw error;
        }
    }

    // Gửi lời mời kết bạn
    async sendFriendRequest(userId) {
        try {
            const response = await api.post(`/users/${userId}/friend-request`);
            return response.data;
        } catch (error) {
            console.error('Error sending friend request:', error);
            throw error;
        }
    }

    // Chấp nhận lời mời kết bạn
    async acceptFriendRequest(requestId) {
        try {
            const response = await api.post(`/friend-requests/${requestId}/accept`);
            return response.data;
        } catch (error) {
            console.error('Error accepting friend request:', error);
            throw error;
        }
    }

    // Từ chối lời mời kết bạn
    async declineFriendRequest(requestId) {
        try {
            const response = await api.post(`/friend-requests/${requestId}/decline`);
            return response.data;
        } catch (error) {
            console.error('Error declining friend request:', error);
            throw error;
        }
    }

    // Hủy kết bạn
    async unfriend(userId) {
        try {
            const response = await api.delete(`/users/${userId}/friend`);
            return response.data;
        } catch (error) {
            console.error('Error unfriending user:', error);
            throw error;
        }
    }
}

export default new ProfileService();
