import { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import postService from './postService';

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

    // Create post
    const createPost = async (postData) => {
        try {
            setLoading(true);
            const newPost = await postService.createPost({
                ...postData,
                userId: user?.id || user?.userId
            });
            
            setPosts(prev => [newPost, ...prev]);
            setShowCreateModal(false);
            return newPost;
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
            
            setPosts(prev => prev.map(post => 
                post.id === postId ? { ...post, ...updatedPost } : post
            ));
            setShowEditModal(false);
            setSelectedPost(null);
            return updatedPost;
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

    // Add comment
    const addComment = async (postId, content, parentCommentId = null) => {
        try {
            const newComment = await postService.addComment(postId, content, parentCommentId);
            
            setPosts(prev => prev.map(post => 
                post.id === postId 
                    ? { 
                        ...post, 
                        commentsCount: post.commentsCount + 1,
                        comments: [...(post.comments || []), newComment]
                    } 
                    : post
            ));
            
            return newComment;
        } catch (error) {
            throw error;
        }
    };

    // Delete comment
    const deleteComment = async (postId, commentId) => {
        try {
            await postService.deleteComment(postId, commentId);
            
            setPosts(prev => prev.map(post => 
                post.id === postId 
                    ? { 
                        ...post, 
                        commentsCount: post.commentsCount - 1,
                        comments: post.comments.filter(comment => comment.id !== commentId)
                    } 
                    : post
            ));
            
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
