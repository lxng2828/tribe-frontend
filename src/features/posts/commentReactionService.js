import api from '../../services/api';
import { getCurrentUserId } from './postService';

class CommentReactionService {
    // Tạo reaction cho comment
    async createReaction(commentId, reactionType = 'LIKE') {
        try {
            const userId = getCurrentUserId();
            const response = await api.post('/comment-reactions/create', { reactionType }, {
                params: { commentId, userId }
            });
            
            const { status, data } = response.data;
            if (status.success) {
                return data;
            } else {
                throw new Error(status.displayMessage || 'Lỗi khi tạo reaction');
            }
        } catch (error) {
            console.error('Create comment reaction error:', error);
            throw new Error('Lỗi khi tạo reaction: ' + (error.response?.data?.status?.displayMessage || error.message));
        }
    }

    // Toggle reaction cho comment
    async toggleReaction(commentId, reactionType = 'LIKE') {
        try {
            const userId = getCurrentUserId();
            const response = await api.post('/comment-reactions/toggle', { reactionType }, {
                params: { commentId, userId }
            });
            
            const { status, data } = response.data;
            if (status.success) {
                return data;
            } else {
                throw new Error(status.displayMessage || 'Lỗi khi toggle reaction');
            }
        } catch (error) {
            console.error('Toggle comment reaction error:', error);
            throw new Error('Lỗi khi toggle reaction: ' + (error.response?.data?.status?.displayMessage || error.message));
        }
    }

    // Cập nhật reaction cho comment
    async updateReaction(commentId, reactionType) {
        try {
            const userId = getCurrentUserId();
            const response = await api.put('/comment-reactions/update', { reactionType }, {
                params: { commentId, userId }
            });
            
            const { status, data } = response.data;
            if (status.success) {
                return data;
            } else {
                throw new Error(status.displayMessage || 'Lỗi khi cập nhật reaction');
            }
        } catch (error) {
            console.error('Update comment reaction error:', error);
            throw new Error('Lỗi khi cập nhật reaction: ' + (error.response?.data?.status?.displayMessage || error.message));
        }
    }

    // Xóa reaction cho comment
    async deleteReaction(commentId) {
        try {
            const userId = getCurrentUserId();
            const response = await api.delete('/comment-reactions/delete', {
                params: { commentId, userId }
            });
            
            const { status } = response.data;
            if (status.success) {
                return true;
            } else {
                throw new Error(status.displayMessage || 'Lỗi khi xóa reaction');
            }
        } catch (error) {
            console.error('Delete comment reaction error:', error);
            throw new Error('Lỗi khi xóa reaction: ' + (error.response?.data?.status?.displayMessage || error.message));
        }
    }

    // Kiểm tra user đã reaction comment chưa
    async checkUserReaction(commentId) {
        try {
            const userId = getCurrentUserId();
            const response = await api.get('/comment-reactions/check', {
                params: { commentId, userId }
            });
            
            const { status, data } = response.data;
            if (status.success) {
                return data;
            } else {
                throw new Error(status.displayMessage || 'Lỗi khi kiểm tra reaction');
            }
        } catch (error) {
            console.error('Check comment reaction error:', error);
            throw new Error('Lỗi khi kiểm tra reaction: ' + (error.response?.data?.status?.displayMessage || error.message));
        }
    }

    // Lấy reaction của user cho comment
    async getUserReaction(commentId) {
        try {
            const userId = getCurrentUserId();
            const response = await api.get('/comment-reactions/user-reaction', {
                params: { commentId, userId }
            });
            
            const { status, data } = response.data;
            if (status.success) {
                return data;
            } else {
                throw new Error(status.displayMessage || 'Lỗi khi lấy reaction');
            }
        } catch (error) {
            console.error('Get user comment reaction error:', error);
            throw new Error('Lỗi khi lấy reaction: ' + (error.response?.data?.status?.displayMessage || error.message));
        }
    }

    // Đếm số reaction cho comment
    async getReactionCount(commentId) {
        try {
            const response = await api.get(`/comment-reactions/count/${commentId}`);
            
            const { status, data } = response.data;
            if (status.success) {
                return data;
            } else {
                throw new Error(status.displayMessage || 'Lỗi khi đếm reaction');
            }
        } catch (error) {
            console.error('Get comment reaction count error:', error);
            throw new Error('Lỗi khi đếm reaction: ' + (error.response?.data?.status?.displayMessage || error.message));
        }
    }

    // Lấy thống kê reaction cho comment
    async getReactionStats(commentId) {
        try {
            const response = await api.get(`/comment-reactions/stats/${commentId}`);
            
            const { status, data } = response.data;
            if (status.success) {
                return data;
            } else {
                throw new Error(status.displayMessage || 'Lỗi khi lấy thống kê reaction');
            }
        } catch (error) {
            console.error('Get comment reaction stats error:', error);
            throw new Error('Lỗi khi lấy thống kê reaction: ' + (error.response?.data?.status?.displayMessage || error.message));
        }
    }

    // Lấy danh sách reaction của comment
    async getCommentReactions(commentId) {
        try {
            const response = await api.get(`/comment-reactions/comment/${commentId}`);
            
            const { status, data } = response.data;
            if (status.success) {
                return data;
            } else {
                throw new Error(status.displayMessage || 'Lỗi khi lấy danh sách reaction');
            }
        } catch (error) {
            console.error('Get comment reactions error:', error);
            throw new Error('Lỗi khi lấy danh sách reaction: ' + (error.response?.data?.status?.displayMessage || error.message));
        }
    }
}

export default new CommentReactionService();
