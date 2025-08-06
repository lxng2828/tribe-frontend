import api from '../../services/api';

class PostService {
    // Lấy danh sách bài viết
    async getPosts(page = 0, size = 20) {
        try {
            const response = await api.get(`/posts/all`, {
                params: { page, size }
            });

            const { status, data } = response.data;
            console.log('API Response:', response.data);

            if (status.success) {
                const posts = data.map(post => ({
                    id: post.id,
                    content: post.content,
                    author: {
                        id: post.user?.id,
                        name: post.user?.displayName || post.user?.username || 'Người dùng',
                        avatar: post.user?.avatar || 'https://via.placeholder.com/40'
                    },
                    visibility: post.visibility,
                    createdAt: post.createdAt,
                    updatedAt: post.updatedAt,
                    likesCount: post.reactionCount || 0,
                    commentsCount: post.commentCount || 0,
                    liked: post.reactions ? post.reactions.some(r => r.liked === true) : false,
                    mediaUrls: post.mediaUrls || [],
                    images: post.mediaUrls || [],
                    isOwner: post.isOwner || false,
                    comments: []
                }));

                return {
                    posts,
                    hasMore: data.length === size,
                    total: null // Nếu API có total thì lấy ra
                };
            } else {
                throw new Error(status.displayMessage || 'Lỗi khi tải bài viết');
            }
        } catch (error) {
            console.error('API Error:', error);
            throw new Error(error.response?.data?.status?.displayMessage || 'Lỗi khi tải bài viết');
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

            if (postData.visibility) {
                formData.append('visibility', postData.visibility);
            }

            if (postData.images?.length) {
                postData.images.forEach(image => {
                    formData.append('images', image);
                });
            }

            const response = await api.post('/posts', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            const { status, data } = response.data;
            if (status.success) {
                return data;
            } else {
                throw new Error(status.displayMessage || 'Lỗi khi tạo bài viết');
            }
        } catch (error) {
            console.error('Create post error:', error);
            throw new Error(error.response?.data?.status?.displayMessage || 'Lỗi khi tạo bài viết');
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
            const response = await api.delete(`/posts/${postId}`);
            const { status } = response.data;
            if (status.success) {
                return true;
            } else {
                throw new Error(status.displayMessage || 'Lỗi khi xóa bài viết');
            }
        } catch (error) {
            console.error('Delete post error:', error);
            throw new Error(error.response?.data?.status?.displayMessage || 'Lỗi khi xóa bài viết');
        }
    }

    // Like/Unlike bài viết
    async toggleLike(postId) {
        try {
            const response = await api.post(`/posts/${postId}/like`);
            const { status, data } = response.data;
            if (status.success) {
                return data;
            } else {
                throw new Error(status.displayMessage || 'Lỗi khi thích bài viết');
            }
        } catch (error) {
            console.error('Toggle like error:', error);
            throw new Error(error.response?.data?.status?.displayMessage || 'Lỗi khi thích bài viết');
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
            const response = await api.get(`/posts/${postId}/comments`, {
                params: { page, limit }
            });
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

    // Lấy bài viết theo người dùng
    async getPostsByUser(userId, page = 1, limit = 10) {
        try {
            const response = await api.get(`/users/${userId}/posts`, {
                params: { page, limit }
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Lỗi khi tải bài viết của người dùng');
        }
    }

    // Tìm kiếm bài viết
    async searchPosts(query, page = 1, limit = 10) {
        try {
            const response = await api.get(`/posts/search`, {
                params: { q: query, page, limit }
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Lỗi khi tìm kiếm bài viết');
        }
    }
}

export default new PostService();
