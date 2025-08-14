import { useEffect } from 'react';
import { usePostManager } from './PostManager';
import PostItemNew from './PostItemNew';

const PostListNew = ({ userId = null, isUserPosts = false }) => {
    const {
        posts,
        loading,
        error,
        hasMore,
        loadPosts,
        loadMorePosts,
        refreshPosts,
        toggleLike,
        toggleReaction,
        openEditModal,
        openDeleteModal,
        openCommentsModal,
        openReactionsModal
    } = usePostManager();

    // Load posts when component mounts or props change
    useEffect(() => {
        if (isUserPosts && userId) {
            loadPosts(0, true, userId);
        } else {
            loadPosts(0, true);
        }
    }, [userId, isUserPosts, loadPosts]);

    const handleLike = (postId) => {
        toggleLike(postId);
    };

    const handleReaction = (postId, reactionType) => {
        toggleReaction(postId, reactionType);
    };

    const handleEdit = (post) => {
        openEditModal(post);
    };

    const handleDelete = (post) => {
        openDeleteModal(post);
    };

    const handleViewComments = (post) => {
        openCommentsModal(post);
    };

    const handleViewReactions = (post) => {
        openReactionsModal(post);
    };

    const renderError = () => (
        <div className="card-fb p-4 text-center">
            <svg className="text-danger mb-3" width="48" height="48" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-1 6a1 1 0 1 1 2 0v4a1 1 0 1 1-2 0V8zm1 8a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" />
            </svg>
            <h5 className="mb-2">Có lỗi xảy ra</h5>
            <p className="text-muted mb-3">{error}</p>
            <button onClick={refreshPosts} className="btn btn-fb-primary">Thử lại</button>
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
            <button onClick={loadMorePosts} className="btn btn-fb-secondary px-4" disabled={loading}>
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
                <button onClick={refreshPosts} className="btn btn-fb-primary">Làm mới</button>
            )}
        </div>
    );

    if (error) return renderError();

    return (
        <div>
            {!loading && posts.length === 0 && renderNoPosts()}
            
            {posts.length > 0 && (
                <div className="d-flex flex-column">
                    {posts.map((post) => (
                        <PostItemNew
                            key={post.id}
                            post={post}
                            onLike={handleLike}
                            onReaction={handleReaction}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onViewComments={handleViewComments}
                            onViewReactions={handleViewReactions}
                        />
                    ))}
                </div>
            )}

            {loading && renderSkeleton()}

            {!loading && hasMore && posts.length > 0 && renderLoadMoreButton()}

            {!loading && !hasMore && posts.length > 0 && renderNoMorePosts()}
        </div>
    );
};

export default PostListNew;
