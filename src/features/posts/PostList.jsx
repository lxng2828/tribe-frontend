import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import PostItem from './PostItem';
import postService from './postService';
import { useAuth } from '../../contexts/AuthContext';
import { usePostAvatarSync } from '../../hooks/usePostAvatarSync';
import { toast } from 'react-toastify';
import ConfirmationModal from '../ConfirmationModal';

const PostList = forwardRef((props, ref) => {
    const { userId, isUserPosts = false } = props; // Thêm props để xác định loại bài viết
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [isInitialized, setIsInitialized] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [postToDelete, setPostToDelete] = useState(null);
    const { user } = useAuth();

    // Sử dụng hook để đồng bộ avatar bài đăng
    const { posts: syncedPosts, refreshAllAvatars } = usePostAvatarSync(posts);



    useEffect(() => {
        if (!isInitialized) {
            loadPosts(0, true);
            setIsInitialized(true);
        }
    }, [isInitialized]);

    // Reload posts when userId or isUserPosts changes
    useEffect(() => {
        if (isInitialized) {
            loadPosts(0, true);
        }
    }, [userId, isUserPosts, isInitialized]);

    // Expose refresh method to parent
    useImperativeHandle(ref, () => ({
        refreshPosts: () => loadPosts(0, true)
    }));

    const loadPosts = async (pageNumber = 0, reset = false) => {
        try {
            setLoading(true);
            let response;

            // Kiểm tra nếu có userId thì gọi API theo user (trang cá nhân)
            if (userId) {
                response = await postService.getPostsByUser(userId, pageNumber);
            } else {
                // Nếu không thì lấy tất cả bài viết (newsfeed)
                response = await postService.getPosts(pageNumber);
            }

            if (reset) {
                // Reset posts khi refresh
                setPosts(response.posts);
                setPage(0);
            } else {
                // Thêm posts mới, tránh duplicate
                setPosts(prev => {
                    const existingIds = new Set(prev.map(post => post.id));
                    const newPosts = response.posts.filter(post => !existingIds.has(post.id));
                    return [...prev, ...newPosts];
                });
                setPage(pageNumber);
            }

            setHasMore(response.hasMore);
        } catch (err) {
            setError(err.message || 'Đã xảy ra lỗi');
        } finally {
            setLoading(false);
        }
    };

    const handleLoadMore = () => {
        if (!loading && hasMore) {
            loadPosts(page + 1, false);
        }
    };

    const handleLike = async (postId) => {
        try {
            await postService.toggleLike(postId);
            setPosts(prev =>
                prev.map(post =>
                    post.id === postId
                        ? {
                            ...post,
                            liked: !post.liked,
                            likesCount: post.liked ? post.likesCount - 1 : post.likesCount + 1
                        }
                        : post
                )
            );
        } catch (err) {
            console.error('Lỗi khi like bài viết:', err);
        }
    };

    const handleAddComment = async (postId, content, parentCommentId = null, refresh = false) => {
        try {
            if (refresh) {
                // Refresh comments by reloading the post
                const response = await postService.getPosts(page);
                const updatedPost = response.posts.find(p => p.id === postId);
                if (updatedPost) {
                    setPosts(prev =>
                        prev.map(post =>
                            post.id === postId
                                ? { ...post, comments: updatedPost.comments, commentsCount: updatedPost.commentsCount }
                                : post
                        )
                    );
                }
                return;
            }

            console.log('Adding comment:', { postId, content, parentCommentId });
            const newComment = await postService.addComment(postId, content, parentCommentId);
            console.log('New comment received:', newComment);

            setPosts(prev => {
                console.log('Previous posts:', prev);
                const updatedPosts = prev.map(post =>
                    post.id === postId
                        ? {
                            ...post,
                            commentsCount: (post.commentsCount || 0) + 1,
                            comments: [...(post.comments || []), newComment]
                        }
                        : post
                );
                console.log('Updated posts:', updatedPosts);
                return updatedPosts;
            });

            return newComment;
        } catch (error) {
            console.error('Error adding comment:', error);
            throw error;
        }
    };

    const handleDelete = async (postId) => {
        const post = posts.find(p => p.id === postId);
        if (!post) return;

        // Check if user can delete this post
        const post = posts.find(p => p.id === postId);
        const canDelete = post?.author?.id === user?.id || post?.isOwner;
        if (!canDelete) {
            toast.error('Bạn không có quyền xóa bài viết này!');
            return;
        }

        setPostToDelete(postId);
        setShowDeleteConfirm(true);
    };

    const confirmDeletePost = async () => {
        if (!postToDelete) return;

        try {
            await postService.deletePost(postToDelete);
            setPosts(prev => prev.filter(post => post.id !== postToDelete));
            toast.success('Đã xóa bài viết thành công');
        } catch (err) {
            console.error('Lỗi khi xóa bài viết:', err);
            toast.error('Có lỗi xảy ra khi xóa bài viết. Vui lòng thử lại.');
        } finally {
            setPostToDelete(null);
            setShowDeleteConfirm(false);
        }
    };

    const handleRefresh = () => loadPosts(0, true);

    const renderError = () => (
        <div className="card-fb p-4 text-center">
            <svg className="text-danger mb-3" width="48" height="48" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-1 6a1 1 0 1 1 2 0v4a1 1 0 1 1-2 0V8zm1 8a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" />
            </svg>
            <h5 className="mb-2">Có lỗi xảy ra</h5>
            <p className="text-muted mb-3">{error}</p>
            <button onClick={handleRefresh} className="btn btn-fb-primary">Thử lại</button>
        </div>
    );

    const renderSkeleton = () => (
        [1, 2, 3].map((index) => (
            <div key={index} className="card-fb spacing-fb">
                <div className="p-4">
                    <div className="d-flex align-items-center mb-3">
                        <div className="skeleton-fb rounded-circle me-3" style={{ width: '40px', height: '40px' }}></div>
                        <div className="flex-grow-1">
                            <div className="skeleton-fb mb-2" style={{ width: '30%', height: '16px' }}></div>
                            <div className="skeleton-fb" style={{ width: '20%', height: '12px' }}></div>
                        </div>
                    </div>
                    <div className="skeleton-fb mb-3" style={{ width: '100%', height: '16px' }}></div>
                    <div className="skeleton-fb mb-3" style={{ width: '80%', height: '16px' }}></div>
                    <div className="skeleton-fb mb-3" style={{ width: '100%', height: '200px' }}></div>
                    <div className="d-flex gap-4">
                        <div className="skeleton-fb" style={{ width: '60px', height: '20px' }}></div>
                        <div className="skeleton-fb" style={{ width: '60px', height: '20px' }}></div>
                        <div className="skeleton-fb" style={{ width: '60px', height: '20px' }}></div>
                    </div>
                </div>
            </div>
        ))
    );

    const renderLoadMoreButton = () => (
        <div className="text-center py-4">
            <button onClick={handleLoadMore} className="btn btn-fb-secondary px-4" disabled={loading}>
                {loading ? (
                    <>
                        <div className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></div>
                        Đang tải...
                    </>
                ) : (
                    'Xem thêm bài viết'
                )}
            </button>
        </div>
    );

    const renderNoMorePosts = () => (
        <div className="text-center py-4">
            <div className="d-inline-flex align-items-center px-4 py-2" style={{ backgroundColor: 'var(--fb-gray)', borderRadius: '20px' }}>
                <svg className="me-2" width="16" height="16" fill="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--fb-text-secondary)' }}>
                    <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-1 6a1 1 0 1 1 2 0v4a1 1 0 1 1-2 0V8zm1 8a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" />
                </svg>
                Hết bài viết
            </div>
        </div>
    );

    const renderNoPosts = () => (
        <div className="card-fb p-4 text-center">
            <svg className="text-muted mb-3" width="48" height="48" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
            </svg>
            <h5 className="mb-2">Chưa có bài viết nào</h5>
            <p className="text-muted mb-3">
                {userId ? 'Người dùng này chưa đăng bài viết nào.' : 'Chưa có bài viết nào trong bảng tin.'}
            </p>
            {!userId && (
                <button onClick={handleRefresh} className="btn btn-fb-primary">Làm mới</button>
            )}
        </div>
    );

    if (error) return renderError();

    return (
        <div>
            {!loading && syncedPosts.length === 0 && renderNoPosts()}

            {syncedPosts.length > 0 && (
                <div className="d-flex flex-column">
                    {syncedPosts.map((post) => (
                        <PostItem
                            key={post.id}
                            post={post}
                            onLike={handleLike}
                            onDelete={handleDeletePost}
                            onAddComment={handleAddComment}
                        />
                    ))}
                </div>
            )}

            {loading && renderSkeleton()}

            {!loading && hasMore && syncedPosts.length > 0 && renderLoadMoreButton()}

            {!loading && !hasMore && syncedPosts.length > 0 && renderNoMorePosts()}

            <ConfirmationModal
                isOpen={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                onConfirm={confirmDeletePost}
                title="Xóa bài viết"
                message="Bạn có chắc chắn muốn xóa bài viết này?"
                confirmText="Xóa"
                cancelText="Hủy"
                type="danger"
            />
        </div>
    );
});

PostList.displayName = 'PostList';

export default PostList;
