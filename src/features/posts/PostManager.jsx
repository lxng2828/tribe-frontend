import { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import postService from './postService';
import { getAvatarUrl } from '../../utils/placeholderImages';

// Create context
const PostManagerContext = createContext();

export const usePostManager = () => {
    const context = useContext(PostManagerContext);
    if (!context) {
        throw new Error('usePostManager must be used within a PostManager');
    }
    return context;
};

const PostManager = ({ children }) => {
    const { user } = useAuth();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [isInitialized, setIsInitialized] = useState(false);

    console.log('PostManager mounted/updated:', {
        userId: user?.id,
        postsCount: posts.length,
        isInitialized
    });
    const [selectedPost, setSelectedPost] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showCommentsModal, setShowCommentsModal] = useState(false);
    const [showReactionsModal, setShowReactionsModal] = useState(false);

    // Load posts
    const loadPosts = useCallback(async (pageNumber = 0, reset = false, userId = null) => {
        try {
            console.log('PostManager loadPosts called:', {
                pageNumber,
                reset,
                userId,
                willLoadUserPosts: !!userId
            });

            setLoading(true);
            setError(null);

            let response;
            if (userId) {
                console.log('Calling getPostsByUser for userId:', userId);
                response = await postService.getPostsByUser(userId, pageNumber);
                console.log('getPostsByUser response:', {
                    postsCount: response.posts?.length || 0,
                    hasMore: response.hasMore
                });
            } else {
                console.log('Calling getPosts (all posts)');
                response = await postService.getPosts(pageNumber);
                console.log('getPosts response:', {
                    postsCount: response.posts?.length || 0,
                    hasMore: response.hasMore
                });
            }

            // Cập nhật trạng thái reaction cho từng post
            const postsWithReactionStatus = await Promise.all(
                response.posts.map(async (post) => {
                    try {
                        const currentReaction = await postService.getUserReaction(post.id);
                        return {
                            ...post,
                            liked: currentReaction ? true : false,
                            currentReaction: currentReaction
                        };
                    } catch (error) {
                        console.error(`Error checking reaction status for post ${post.id}:`, error);
                        return post; // Giữ nguyên post nếu có lỗi
                    }
                })
            );

            if (reset) {
                setPosts(postsWithReactionStatus);
                setPage(0);
            } else {
                setPosts(prev => {
                    const existingIds = new Set(prev.map(post => post.id));
                    const newPosts = postsWithReactionStatus.filter(post => !existingIds.has(post.id));
                    return [...prev, ...newPosts];
                });
                setPage(pageNumber);
            }

            setHasMore(response.hasMore);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    // Initialize - không tự động load posts, để PostListNew quyết định
    useEffect(() => {
        if (!isInitialized) {
            setIsInitialized(true);
        }
    }, [isInitialized]);

    // Sync selectedPost with posts array when posts change
    useEffect(() => {
        if (selectedPost && posts.length > 0) {
            const updatedPost = posts.find(post => post.id === selectedPost.id);
            if (updatedPost && updatedPost !== selectedPost) {
                setSelectedPost(updatedPost);
            }
        }
    }, [posts, selectedPost?.id]);

    // Create post
    const createPost = async (postData) => {
        try {
            setLoading(true);
            const newPost = await postService.createPost({
                ...postData,
                userId: user?.id || user?.userId
            });

            // Đảm bảo post mới có đầy đủ thông tin user
            const formattedPost = {
                ...newPost,
                author: {
                    ...newPost.author,
                    id: user?.id || user?.userId,
                    name: user?.fullName || user?.displayName || user?.username || 'Người dùng',
                    avatar: getAvatarUrl(user),
                    displayName: user?.displayName,
                    fullName: user?.fullName,
                    username: user?.username
                },
                isOwner: true, // Post mới tạo luôn là của user hiện tại
                createdAt: newPost.createdAt || new Date().toISOString(),
                likesCount: 0,
                commentsCount: 0,
                liked: false
            };

            setPosts(prev => [formattedPost, ...prev]);
            setShowCreateModal(false);
            return formattedPost;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Update post
    const updatePost = async (postId, postData) => {
        try {
            setLoading(true);
            const updatedPost = await postService.updatePost(postId, postData);

            // Format dữ liệu updated post để đảm bảo nhất quán
            const formattedUpdatedPost = {
                ...updatedPost,
                author: {
                    ...updatedPost.author,
                    id: user?.id || user?.userId,
                    name: user?.fullName || user?.displayName || user?.username || 'Người dùng',
                    avatar: getAvatarUrl(user),
                    displayName: user?.displayName,
                    fullName: user?.fullName,
                    username: user?.username
                },
                isOwner: true
            };

            setPosts(prev => prev.map(post =>
                post.id === postId ? { ...post, ...formattedUpdatedPost } : post
            ));
            setShowEditModal(false);
            setSelectedPost(null);
            return formattedUpdatedPost;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Delete post
    const deletePost = async (postId) => {
        try {
            setLoading(true);
            await postService.deletePost(postId);

            setPosts(prev => prev.filter(post => post.id !== postId));
            setShowDeleteModal(false);
            setSelectedPost(null);
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Toggle reaction
    const toggleReaction = async (postId, reactionType = 'LIKE') => {
        try {
            const result = await postService.toggleReaction(postId, reactionType);

            setPosts(prev => prev.map(post =>
                post.id === postId
                    ? {
                        ...post,
                        liked: result.reacted,
                        currentReaction: result.reactionType,
                        likesCount: result.reacted ? post.likesCount + 1 : post.likesCount - 1
                    }
                    : post
            ));

        } catch (error) {
            console.error('Error toggling reaction:', error);
        }
    };

    // Toggle like (backward compatibility)
    const toggleLike = async (postId) => {
        await toggleReaction(postId, 'LIKE');
    };

    // Helper function để thêm reply vào parent comment
    const addReplyToComment = (comments, parentCommentId, newReply) => {
        return comments.map(comment => {
            if (comment.id === parentCommentId) {
                return {
                    ...comment,
                    replies: [...(comment.replies || []), newReply]
                };
            }
            // Nếu comment có replies, đệ quy tìm parent comment trong replies
            if (comment.replies && comment.replies.length > 0) {
                return {
                    ...comment,
                    replies: addReplyToComment(comment.replies, parentCommentId, newReply)
                };
            }
            return comment;
        });
    };

    // Add comment
    const addComment = async (postId, content, parentCommentId = null) => {
        try {
            const newComment = await postService.addComment(postId, content, parentCommentId);

            // Format comment mới để đảm bảo có đầy đủ thông tin user
            const formattedComment = {
                ...newComment,
                user: {
                    ...newComment.user,
                    id: user?.id || user?.userId,
                    name: user?.fullName || user?.displayName || user?.username || 'Người dùng',
                    avatar: getAvatarUrl(user),
                    displayName: user?.displayName,
                    fullName: user?.fullName,
                    username: user?.username
                },
                author: {
                    ...newComment.author,
                    id: user?.id || user?.userId,
                    name: user?.fullName || user?.displayName || user?.username || 'Người dùng',
                    avatar: getAvatarUrl(user),
                    displayName: user?.displayName,
                    fullName: user?.fullName,
                    username: user?.username
                },
                isOwner: true, // Comment mới tạo luôn là của user hiện tại
                createdAt: newComment.createdAt || new Date().toISOString(),
                parentCommentId: parentCommentId // Đảm bảo parentCommentId được set
            };

            setPosts(prev => {
                const updatedPosts = prev.map(post =>
                    post.id === postId
                        ? {
                            ...post,
                            commentsCount: post.commentsCount + 1,
                            comments: parentCommentId
                                ? addReplyToComment(post.comments || [], parentCommentId, formattedComment)
                                : [...(post.comments || []), formattedComment]
                        }
                        : post
                );

                // Cập nhật selectedPost ngay lập tức nếu đang mở comments modal
                if (showCommentsModal && selectedPost?.id === postId) {
                    const updatedPost = updatedPosts.find(post => post.id === postId);
                    if (updatedPost) {
                        setSelectedPost(updatedPost);
                    }
                }

                return updatedPosts;
            });

            return formattedComment;
        } catch (error) {
            throw error;
        }
    };

    // Helper function để xóa comment/reply khỏi nested structure
    const removeCommentFromNested = (comments, commentIdToRemove) => {
        return comments
            .filter(comment => comment.id !== commentIdToRemove)
            .map(comment => {
                if (comment.replies && comment.replies.length > 0) {
                    return {
                        ...comment,
                        replies: removeCommentFromNested(comment.replies, commentIdToRemove)
                    };
                }
                return comment;
            });
    };

    // Delete comment
    const deleteComment = async (postId, commentId) => {
        try {
            await postService.deleteComment(postId, commentId);

            setPosts(prev => {
                const updatedPosts = prev.map(post =>
                    post.id === postId
                        ? {
                            ...post,
                            commentsCount: post.commentsCount - 1,
                            comments: removeCommentFromNested(post.comments || [], commentId)
                        }
                        : post
                );

                // Cập nhật selectedPost ngay lập tức nếu đang mở comments modal
                if (showCommentsModal && selectedPost?.id === postId) {
                    const updatedPost = updatedPosts.find(post => post.id === postId);
                    if (updatedPost) {
                        setSelectedPost(updatedPost);
                    }
                }

                return updatedPosts;
            });

        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    // Get post by ID
    const getPostById = async (postId) => {
        try {
            const post = await postService.getPost(postId);
            return post;
        } catch (error) {
            throw error;
        }
    };

    // Search posts
    const searchPosts = async (query, page = 0) => {
        try {
            setLoading(true);
            const response = await postService.searchPosts(query, page);
            return response;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Load more posts
    const loadMorePosts = () => {
        if (!loading && hasMore) {
            loadPosts(page + 1, false);
        }
    };

    // Refresh posts
    const refreshPosts = () => {
        loadPosts(0, true);
    };

    // Modal handlers
    const openCreateModal = () => setShowCreateModal(true);
    const closeCreateModal = () => setShowCreateModal(false);

    const openEditModal = (post) => {
        setSelectedPost(post);
        setShowEditModal(true);
    };
    const closeEditModal = () => {
        setSelectedPost(null);
        setShowEditModal(false);
    };

    const openDeleteModal = (post) => {
        setSelectedPost(post);
        setShowDeleteModal(true);
    };
    const closeDeleteModal = () => {
        setSelectedPost(null);
        setShowDeleteModal(false);
    };

    const openCommentsModal = (post) => {
        setSelectedPost(post);
        setShowCommentsModal(true);
    };
    const closeCommentsModal = () => {
        setSelectedPost(null);
        setShowCommentsModal(false);
    };

    const openReactionsModal = (post) => {
        setSelectedPost(post);
        setShowReactionsModal(true);
    };
    const closeReactionsModal = () => {
        setSelectedPost(null);
        setShowReactionsModal(false);
    };

    // Context value
    const contextValue = {
        // State
        posts,
        loading,
        error,
        hasMore,
        selectedPost,
        showCreateModal,
        showEditModal,
        showDeleteModal,
        showCommentsModal,
        showReactionsModal,

        // Actions
        createPost,
        updatePost,
        deletePost,
        toggleLike,
        toggleReaction,
        addComment,
        deleteComment,
        getPostById,
        searchPosts,
        loadMorePosts,
        refreshPosts,
        loadPosts,

        // Modal handlers
        openCreateModal,
        closeCreateModal,
        openEditModal,
        closeEditModal,
        openDeleteModal,
        closeDeleteModal,
        openCommentsModal,
        closeCommentsModal,
        openReactionsModal,
        closeReactionsModal,
    };

    return (
        <PostManagerContext.Provider value={contextValue}>
            {children}
        </PostManagerContext.Provider>
    );
};

export default PostManager;
