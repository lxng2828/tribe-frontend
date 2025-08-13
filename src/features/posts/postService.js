import api from '../../services/api';
import { DEFAULT_AVATAR, getAvatarUrl } from '../../utils/placeholderImages';

// Base URL cho API
const API_BASE_URL = 'http://localhost:8080';

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
                const posts = data.map(post => {
                    // Cải thiện logic xử lý thông tin user
                    const user = post.user || {};
                    
                    // Ưu tiên lấy thông tin user từ nhiều nguồn khác nhau
                    const userName = user.nameSender || user.displayName || user.fullName || user.username || user.name || 'Người dùng';
                    const userId = user.senderId || user.id || user.userId || post.userId;
                    
                    // Xử lý avatar với logic cải thiện
                    let userAvatar = null;
                    
                    // Ưu tiên 1: avatarUrl từ user object
                    if (user.avatarUrl) {
                        userAvatar = getAvatarUrl(user);
                    }
                    // Ưu tiên 2: avatarSender từ post (API cũ)
                    else if (post.avatarSender) {
                        userAvatar = getAvatarUrl({ avatarUrl: post.avatarSender });
                    }
                    // Ưu tiên 3: avatar từ user object
                    else if (user.avatar) {
                        userAvatar = getAvatarUrl(user);
                    }
                    // Ưu tiên 4: profilePicture từ user object
                    else if (user.profilePicture) {
                        userAvatar = getAvatarUrl(user);
                    }
                    // Fallback: tạo placeholder từ tên
                    else {
                        userAvatar = getAvatarUrl({ displayName: userName });
                    }

                    console.log('Post avatar processing:', {
                        postId: post.id,
                        userName,
                        userId,
                        userAvatar,
                        userData: user,
                        avatarSender: post.avatarSender
                    });

                    // Xử lý đường dẫn ảnh - thêm base URL nếu cần
                    const processImageUrls = (urls) => {
                        if (!urls || !Array.isArray(urls)) return [];
                        return urls.map(url => {
                            if (url.startsWith('http')) {
                                return url; // Đã là URL đầy đủ
                            } else if (url.startsWith('/')) {
                                return `${API_BASE_URL}${url}`; // Thêm base URL
                            } else {
                                return `${API_BASE_URL}/${url}`; // Thêm base URL và dấu /
                            }
                        });
                    };

                    return {
                        id: post.id,
                        content: post.content,
                        author: {
                            id: userId,
                            name: userName,
                            avatar: userAvatar,
                            // Thêm thông tin user đầy đủ để component có thể sử dụng
                            displayName: user.displayName,
                            fullName: user.fullName,
                            username: user.username,
                            avatarUrl: user.avatarUrl
                        },
                        visibility: post.visibility || 'PUBLIC',
                        createdAt: post.createdAt,
                        updatedAt: post.updatedAt,
                        likesCount: post.reactionCount || post.likesCount || 0,
                        commentsCount: post.commentCount || post.commentsCount || 0,
                        liked: post.reactions ? post.reactions.some(r => r.liked === true) : false,
                        mediaUrls: processImageUrls(post.mediaUrls),
                        images: processImageUrls(post.mediaUrls), // Sử dụng mediaUrls từ API
                        isOwner: post.isOwner || false,
                        comments: []
                    };
                });

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
            // Nếu có file, sử dụng multipart/form-data
            if (postData.images?.length > 0) {
                const formData = new FormData();

                // Tạo metadata object
                const metadata = {
                    userId: postData.userId || '1', // Lấy từ user context
                    content: postData.content,
                    visibility: postData.visibility || 'PUBLIC'
                };

                formData.append('metadata', JSON.stringify(metadata));

                // Thêm files
                postData.images.forEach(image => {
                    formData.append('files', image);
                });

                const response = await api.post('/posts/create', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });

                const { status, data } = response.data;
                if (status.success) {
                    return data;
                } else {
                    throw new Error(status.displayMessage || 'Lỗi khi tạo bài viết');
                }
            } else {
                // Không có file, sử dụng create-simple endpoint
                const requestData = {
                    userId: postData.userId || '1', // Lấy từ user context
                    content: postData.content,
                    visibility: postData.visibility || 'PUBLIC'
                };

                const response = await api.post('/posts/create-simple', requestData);

                const { status, data } = response.data;
                if (status.success) {
                    return data;
                } else {
                    throw new Error(status.displayMessage || 'Lỗi khi tạo bài viết');
                }
            }
        } catch (error) {
            console.error('Create post error:', error);
            throw new Error(error.response?.data?.status?.displayMessage || 'Đã xảy ra lỗi không xác định');
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
    async getPostsByUser(userId, page = 0, size = 20) {
        try {
            console.log('Loading posts for user:', userId);

            // Fallback: Lấy tất cả bài viết và filter theo userId
            const response = await api.get(`/posts/all`, {
                params: { page: 0, size: 100 } // Lấy nhiều hơn để filter
            });

            const { status, data } = response.data;
            console.log('API Response for all posts:', response.data);

            if (status.success) {
                // Filter posts by userId
                const allPosts = data || [];
                const userPosts = allPosts.filter(post => {
                    const postUserId = post.user?.senderId || post.user?.id || post.user?.userId || post.userId;
                    console.log('Comparing postUserId:', postUserId, 'with targetUserId:', userId);
                    return postUserId === userId || postUserId === String(userId);
                });

                console.log('Filtered user posts:', userPosts.length, 'out of', allPosts.length);

                // Simulate pagination for filtered results
                const startIndex = page * size;
                const endIndex = startIndex + size;
                const paginatedPosts = userPosts.slice(startIndex, endIndex);

                const posts = paginatedPosts.map(post => {
                    // Cải thiện logic xử lý thông tin user
                    const user = post.user || {};
                    const userName = user.nameSender || user.displayName || user.fullName || user.username || user.name || 'Người dùng';
                    const userPostId = user.senderId || user.id || user.userId || post.userId;
                    
                    // Xử lý avatar với logic cải thiện
                    let userAvatar = null;
                    
                    // Ưu tiên 1: avatarUrl từ user object
                    if (user.avatarUrl) {
                        userAvatar = getAvatarUrl(user);
                    }
                    // Ưu tiên 2: avatarSender từ post (API cũ)
                    else if (post.avatarSender) {
                        userAvatar = getAvatarUrl({ avatarUrl: post.avatarSender });
                    }
                    // Ưu tiên 3: avatar từ user object
                    else if (user.avatar) {
                        userAvatar = getAvatarUrl(user);
                    }
                    // Ưu tiên 4: profilePicture từ user object
                    else if (user.profilePicture) {
                        userAvatar = getAvatarUrl(user);
                    }
                    // Fallback: tạo placeholder từ tên
                    else {
                        userAvatar = getAvatarUrl({ displayName: userName });
                    }

                    // Xử lý đường dẫn ảnh - thêm base URL nếu cần
                    const processImageUrls = (urls) => {
                        if (!urls || !Array.isArray(urls)) return [];
                        return urls.map(url => {
                            if (url.startsWith('http')) {
                                return url; // Đã là URL đầy đủ
                            } else if (url.startsWith('/')) {
                                return `${API_BASE_URL}${url}`; // Thêm base URL
                            } else {
                                return `${API_BASE_URL}/${url}`; // Thêm base URL và dấu /
                            }
                        });
                    };

                    return {
                        id: post.id,
                        content: post.content,
                        author: {
                            id: userPostId,
                            name: userName,
                            avatar: userAvatar,
                            // Thêm thông tin user đầy đủ để component có thể sử dụng
                            displayName: user.displayName,
                            fullName: user.fullName,
                            username: user.username,
                            avatarUrl: user.avatarUrl
                        },
                        visibility: post.visibility || 'PUBLIC',
                        createdAt: post.createdAt,
                        updatedAt: post.updatedAt,
                        likesCount: post.reactionCount || post.likesCount || 0,
                        commentsCount: post.commentCount || post.commentsCount || 0,
                        liked: post.reactions ? post.reactions.some(r => r.liked === true) : false,
                        mediaUrls: processImageUrls(post.mediaUrls),
                        images: processImageUrls(post.mediaUrls), // Sử dụng mediaUrls từ API
                        isOwner: post.isOwner || false,
                        comments: []
                    };
                });

                return {
                    posts,
                    hasMore: endIndex < userPosts.length, // Check if there are more posts
                    total: userPosts.length
                };
            } else {
                throw new Error(status.displayMessage || 'Lỗi khi tải bài viết của người dùng');
            }
        } catch (error) {
            console.error('API Error for user posts:', error);

            // Nếu tất cả đều fail, trả về empty array thay vì throw error
            console.warn('Cannot load user posts, returning empty list');
            return {
                posts: [],
                hasMore: false,
                total: 0
            };
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
