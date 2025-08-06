import api from '../../services/api';

class PostService {
    // Lấy danh sách bài viết
    async getPosts(page = 1, limit = 10) {
        try {
            const response = await api.get(`/posts?page=${page}&limit=${limit}`);
            return {
                posts: response.data.posts,
                hasMore: response.data.hasMore,
                total: response.data.total
            };
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Lỗi khi tải bài viết');
        }
    }

    // Lấy chi tiết một bài viết
    async getPost(postId) {
        try {
            const response = await api.get(`/posts/${postId}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Lỗi khi tải bài viết');
        }
    }

    // Tạo bài viết mới
    async createPost(postData) {
        try {
            const formData = new FormData();
            formData.append('content', postData.content);

            // Thêm hình ảnh nếu có
            if (postData.images && postData.images.length > 0) {
                postData.images.forEach((image, index) => {
                    formData.append(`images`, image);
                });
            }

            const response = await api.post('/posts', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Lỗi khi tạo bài viết');
        }
    }

    // Cập nhật bài viết
    async updatePost(postId, postData) {
        try {
            const response = await api.put(`/posts/${postId}`, postData);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Lỗi khi cập nhật bài viết');
        }
    }

    // Xóa bài viết
    async deletePost(postId) {
        try {
            await api.delete(`/posts/${postId}`);
            return true;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Lỗi khi xóa bài viết');
        }
    }

    // Like/Unlike bài viết
    async toggleLike(postId) {
        try {
            const response = await api.post(`/posts/${postId}/like`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Lỗi khi thích bài viết');
        }
    }

    // Lấy danh sách người đã like
    async getLikes(postId) {
        try {
            const response = await api.get(`/posts/${postId}/likes`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Lỗi khi tải danh sách like');
        }
    }

    // Lấy bình luận của bài viết
    async getComments(postId, page = 1, limit = 10) {
        try {
            const response = await api.get(`/posts/${postId}/comments?page=${page}&limit=${limit}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Lỗi khi tải bình luận');
        }
    }

    // Thêm bình luận
    async addComment(postId, content) {
        try {
            const response = await api.post(`/posts/${postId}/comments`, { content });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Lỗi khi thêm bình luận');
        }
    }

    // Xóa bình luận
    async deleteComment(postId, commentId) {
        try {
            await api.delete(`/posts/${postId}/comments/${commentId}`);
            return true;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Lỗi khi xóa bình luận');
        }
    }

    // Báo cáo bài viết
    async reportPost(postId, reason) {
        try {
            const response = await api.post(`/posts/${postId}/report`, { reason });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Lỗi khi báo cáo bài viết');
        }
    }

    // Lấy bài viết theo user
    async getPostsByUser(userId, page = 1, limit = 10) {
        try {
            const response = await api.get(`/users/${userId}/posts?page=${page}&limit=${limit}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Lỗi khi tải bài viết của người dùng');
        }
    }

    // Tìm kiếm bài viết
    async searchPosts(query, page = 1, limit = 10) {
        try {
            const response = await api.get(`/posts/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Lỗi khi tìm kiếm bài viết');
        }
    }
}

const postService = new PostService();
export default postService;
