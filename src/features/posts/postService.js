import api from '../../services/api';
import { DEFAULT_AVATAR, getAvatarUrl } from '../../utils/placeholderImages';

// Helper function to get current user ID
const getCurrentUserId = () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
        try {
            const user = JSON.parse(userStr);
            return user.id || user.userId || '1';
        } catch (e) {
            console.error('Error parsing user from localStorage:', e);
        }
    }
    return '1'; // fallback
};

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
                    // Xử lý thông tin user từ cấu trúc mới
                    const user = post.user || {};
                    
                    // Lấy thông tin user từ cấu trúc mới
                    const userName = user.nameSender || user.displayName || user.fullName || user.username || user.name || 'Người dùng';
                    const userId = user.senderId || user.id || user.userId || post.userId;
                    
                    // Xử lý avatar với logic cải thiện
                    let userAvatar = null;
                    
                    // Ưu tiên 1: avatarSender từ user object (cấu trúc mới)
                    if (user.avatarSender) {
                        userAvatar = getAvatarUrl({ avatarUrl: user.avatarSender });
                    }
                    // Ưu tiên 2: avatarUrl từ user object
                    else if (user.avatarUrl) {
                        userAvatar = getAvatarUrl(user);
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
                        userData: user
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

                    // Xử lý reactions từ cấu trúc mới
                    const processReactions = (reactions) => {
                        if (!reactions || !Array.isArray(reactions)) return [];
                        return reactions.map(reaction => ({
                            id: reaction.id,
                            type: reaction.reactionType,
                            user: {
                                id: reaction.user?.senderId || reaction.user?.id,
                                name: reaction.user?.nameSender || reaction.user?.name,
                                avatar: reaction.user?.avatarSender ? 
                                    getAvatarUrl({ avatarUrl: reaction.user.avatarSender }) : 
                                    getAvatarUrl({ displayName: reaction.user?.nameSender || 'User' })
                            },
                            createdAt: reaction.createdAt
                        }));
                    };

                    // Xử lý comments từ cấu trúc mới
                    const processComments = (comments) => {
                        if (!comments || !Array.isArray(comments)) return [];
                        return comments.map(comment => ({
                            id: comment.id,
                            content: comment.content,
                            user: {
                                id: comment.user?.senderId || comment.user?.id,
                                name: comment.user?.nameSender || comment.user?.name,
                                avatar: comment.user?.avatarSender ? 
                                    getAvatarUrl({ avatarUrl: comment.user.avatarSender }) : 
                                    getAvatarUrl({ displayName: comment.user?.nameSender || 'User' })
                            },
                            parentCommentId: comment.parentCommentId,
                            createdAt: comment.createdAt,
                            replies: comment.replies ? processComments(comment.replies) : []
                        }));
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
                            avatarUrl: user.avatarUrl,
                            senderId: user.senderId
                        },
                        visibility: post.visibility || 'PUBLIC',
                        createdAt: post.createdAt,
                        updatedAt: post.updatedAt,
                        likesCount: post.reactionCount || post.likesCount || 0,
                        commentsCount: post.commentCount || post.commentsCount || 0,
                        liked: post.reactions ? post.reactions.some(r => r.user?.senderId === getCurrentUserId() || r.user?.id === getCurrentUserId()) : false,
                        mediaUrls: processImageUrls(post.mediaUrls),
                        images: processImageUrls(post.mediaUrls), // Sử dụng mediaUrls từ API
                        isOwner: post.isOwner || false,
                        reactions: processReactions(post.reactions),
                        comments: processComments(post.comments)
                    };
                });

                return {
                    posts,
                    hasMore: data.length === size,
                    total: null, // Nếu API có total thì lấy ra
                    status: status // Trả về thông tin status để component có thể sử dụng
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
                    userId: postData.userId || getCurrentUserId(),
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
                    userId: postData.userId || getCurrentUserId(),
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
            const userId = getCurrentUserId();
            
            // Nếu có file, sử dụng multipart/form-data
            if (postData.images?.length > 0) {
                const formData = new FormData();
                
                // Tạo metadata object và append như một field riêng
                const metadata = {
                    content: postData.content,
                    visibility: postData.visibility || 'PUBLIC'
                };
                
                // Append metadata như một field riêng biệt
                formData.append('metadata', JSON.stringify(metadata));
                
                // Append files
                postData.images.forEach(image => {
                    formData.append('files', image);
                });

                const response = await api.put(`/posts/${postId}`, formData, {
                    params: { userId }
                    // Không set Content-Type header, để browser tự động set với boundary
                });
                
                const { status, data } = response.data;
                if (status.success) {
                    return data;
                } else {
                    throw new Error(status.displayMessage || 'Lỗi khi cập nhật bài viết');
                }
            } else {
                // Không có file, sử dụng simple endpoint
                const requestData = {
                    content: postData.content,
                    visibility: postData.visibility || 'PUBLIC'
                };
                
                const response = await api.put(`/posts/${postId}/simple`, requestData, {
                    params: { userId }
                });
                
                const { status, data } = response.data;
                if (status.success) {
                    return data;
                } else {
                    throw new Error(status.displayMessage || 'Lỗi khi cập nhật bài viết');
                }
            }
        } catch (error) {
            console.error('Update post error:', error);
            throw new Error(error.response?.data?.status?.displayMessage || 'Lỗi khi cập nhật bài viết');
        }
    }

    // Xóa bài viết
    async deletePost(postId) {
        try {
            const userId = getCurrentUserId();
            const response = await api.delete(`/posts/${postId}`, {
                params: { userId }
            });
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

    // Toggle reaction (Like/Unlike hoặc thay đổi reaction)
    async toggleReaction(postId, reactionType = 'LIKE') {
        try {
            const userId = getCurrentUserId();
            
            // Kiểm tra xem user đã reaction chưa
            const checkResponse = await api.get('/post-reactions/check', {
                params: { postId, userId }
            });
            
            const hasReacted = checkResponse.data.data;
            
            if (hasReacted) {
                // Nếu đã reaction thì xóa
                const response = await api.delete('/post-reactions/delete', {
                    params: { postId, userId }
                });
                const { status } = response.data;
                if (status.success) {
                    return { reacted: false, reactionType: null };
                } else {
                    throw new Error(status.displayMessage || 'Lỗi khi bỏ reaction');
                }
            } else {
                // Nếu chưa reaction thì tạo mới
                const requestData = {
                    reactionType: reactionType
                };
                
                const response = await api.post('/post-reactions/create', requestData, {
                    params: { postId, userId }
                });
                
                const { status, data } = response.data;
                if (status.success) {
                    return { reacted: true, reactionType: reactionType, reaction: data };
                } else {
                    throw new Error(status.displayMessage || 'Lỗi khi tạo reaction');
                }
            }
        } catch (error) {
            console.error('Toggle reaction error:', error);
            throw new Error(error.response?.data?.status?.displayMessage || 'Lỗi khi tạo reaction');
        }
    }

    // Like/Unlike bài viết (backward compatibility)
    async toggleLike(postId) {
        return this.toggleReaction(postId, 'LIKE');
    }

    // Lấy danh sách người đã like
    async getLikes(postId) {
        try {
            const response = await api.get(`/post-reactions/post/${postId}`);
            const { status, data } = response.data;
            if (status.success) {
                return data;
            } else {
                throw new Error(status.displayMessage || 'Lỗi khi tải danh sách like');
            }
        } catch (error) {
            console.error('Get likes error:', error);
            throw new Error(error.response?.data?.status?.displayMessage || 'Lỗi khi tải danh sách like');
        }
    }

    // Lấy bình luận của bài viết
    async getComments(postId, page = 1, limit = 10) {
        try {
            const response = await api.get(`/post-comments/post/${postId}`, {
                params: { page, size: limit }
            });
            const { status, data } = response.data;
            if (status.success) {
                return data;
            } else {
                throw new Error(status.displayMessage || 'Lỗi khi tải bình luận');
            }
        } catch (error) {
            console.error('Get comments error:', error);
            throw new Error(error.response?.data?.status?.displayMessage || 'Lỗi khi tải bình luận');
        }
    }

    // Thêm bình luận
    async addComment(postId, content, parentCommentId = null) {
        try {
            const requestData = {
                content: content,
                parentCommentId: parentCommentId
            };
            
            const response = await api.post(`/post-comments/create`, requestData, {
                params: { 
                    postId: postId,
                    userId: getCurrentUserId()
                }
            });
            
            const { status, data } = response.data;
            if (status.success) {
                return data;
            } else {
                throw new Error(status.displayMessage || 'Lỗi khi thêm bình luận');
            }
        } catch (error) {
            console.error('Add comment error:', error);
            throw new Error(error.response?.data?.status?.displayMessage || 'Lỗi khi thêm bình luận');
        }
    }

    // Xóa bình luận
    async deleteComment(postId, commentId) {
        try {
            const response = await api.delete(`/post-comments/${commentId}`, {
                params: { 
                    userId: getCurrentUserId()
                }
            });
            
            const { status } = response.data;
            if (status.success) {
                return true;
            } else {
                throw new Error(status.displayMessage || 'Lỗi khi xóa bình luận');
            }
        } catch (error) {
            console.error('Delete comment error:', error);
            throw new Error(error.response?.data?.status?.displayMessage || 'Lỗi khi xóa bình luận');
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


            // Fallback: Lấy tất cả bài viết và filter theo userId
            const response = await api.get(`/posts/all`, {
                params: { page: 0, size: 100 } // Lấy nhiều hơn để filter
            });

            const { status, data } = response.data;


            if (status.success) {
                // Filter posts by userId - chỉ lấy bài đăng của user cụ thể
                const allPosts = data || [];
                const userPosts = allPosts.filter(post => {
                    const postUserId = post.user?.senderId || post.user?.id || post.user?.userId || post.userId;
                    const targetUserIdStr = String(userId);
                    const postUserIdStr = String(postUserId);
                    
                    return postUserIdStr === targetUserIdStr;
                });



                // Simulate pagination for filtered results
                const startIndex = page * size;
                const endIndex = startIndex + size;
                const paginatedPosts = userPosts.slice(startIndex, endIndex);

                const posts = paginatedPosts.map(post => {
                    // Xử lý thông tin user từ cấu trúc mới
                    const user = post.user || {};
                    const userName = user.nameSender || user.displayName || user.fullName || user.username || user.name || 'Người dùng';
                    const userPostId = user.senderId || user.id || user.userId || post.userId;
                    
                    // Xử lý avatar với logic cải thiện
                    let userAvatar = null;
                    
                    // Ưu tiên 1: avatarSender từ user object (cấu trúc mới)
                    if (user.avatarSender) {
                        userAvatar = getAvatarUrl({ avatarUrl: user.avatarSender });
                    }
                    // Ưu tiên 2: avatarUrl từ user object
                    else if (user.avatarUrl) {
                        userAvatar = getAvatarUrl(user);
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

                    // Xử lý reactions từ cấu trúc mới
                    const processReactions = (reactions) => {
                        if (!reactions || !Array.isArray(reactions)) return [];
                        return reactions.map(reaction => ({
                            id: reaction.id,
                            type: reaction.reactionType,
                            user: {
                                id: reaction.user?.senderId || reaction.user?.id,
                                name: reaction.user?.nameSender || reaction.user?.name,
                                avatar: reaction.user?.avatarSender ? 
                                    getAvatarUrl({ avatarUrl: reaction.user.avatarSender }) : 
                                    getAvatarUrl({ displayName: reaction.user?.nameSender || 'User' })
                            },
                            createdAt: reaction.createdAt
                        }));
                    };

                    // Xử lý comments từ cấu trúc mới
                    const processComments = (comments) => {
                        if (!comments || !Array.isArray(comments)) return [];
                        return comments.map(comment => ({
                            id: comment.id,
                            content: comment.content,
                            user: {
                                id: comment.user?.senderId || comment.user?.id,
                                name: comment.user?.nameSender || comment.user?.name,
                                avatar: comment.user?.avatarSender ? 
                                    getAvatarUrl({ avatarUrl: comment.user.avatarSender }) : 
                                    getAvatarUrl({ displayName: comment.user?.nameSender || 'User' })
                            },
                            parentCommentId: comment.parentCommentId,
                            createdAt: comment.createdAt,
                            replies: comment.replies ? processComments(comment.replies) : []
                        }));
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
                            avatarUrl: user.avatarUrl,
                            senderId: user.senderId
                        },
                        visibility: post.visibility || 'PUBLIC',
                        createdAt: post.createdAt,
                        updatedAt: post.updatedAt,
                        likesCount: post.reactionCount || post.likesCount || 0,
                        commentsCount: post.commentCount || post.commentsCount || 0,
                        liked: post.reactions ? post.reactions.some(r => r.user?.senderId === getCurrentUserId() || r.user?.id === getCurrentUserId()) : false,
                        mediaUrls: processImageUrls(post.mediaUrls),
                        images: processImageUrls(post.mediaUrls), // Sử dụng mediaUrls từ API
                        isOwner: post.isOwner || false,
                        reactions: processReactions(post.reactions),
                        comments: processComments(post.comments)
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

    // Kiểm tra user đã like post chưa (backward compatibility)
    async checkUserLikeStatus(postId) {
        const reaction = await this.getUserReaction(postId);
        return reaction ? true : false;
    }

    // Lấy reaction hiện tại của user trên post
    async getUserReaction(postId) {
        try {
            const userId = getCurrentUserId();
            const response = await api.get('/post-reactions/user', {
                params: { postId, userId }
            });
            const { status, data } = response.data;
            if (status.success && data) {
                return data.reactionType; // Trả về loại reaction (LIKE, LOVE, etc.)
            } else {
                return null; // Chưa có reaction
            }
        } catch (error) {
            console.error('Error getting user reaction:', error);
            return null;
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
