import { useState, useEffect } from 'react';
import PostItem from './PostItem';
import postService from './postService';

const PostList = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        loadPosts();
    }, []);

    const loadPosts = async (pageNumber = 1, reset = false) => {
        try {
            setLoading(true);
            const response = await postService.getPosts(pageNumber);

            setPosts(prev => reset ? response.posts : [...prev, ...response.posts]);
            setHasMore(response.hasMore);
            setPage(pageNumber);
        } catch (err) {
            setError(err.message || 'Đã xảy ra lỗi');
        } finally {
            setLoading(false);
        }
    };

    const handleLoadMore = () => {
        if (!loading && hasMore) {
            loadPosts(page + 1);
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

    const handleDelete = async (postId) => {
        const confirmed = window.confirm('Bạn có chắc chắn muốn xóa bài viết này?');
        if (!confirmed) return;

        try {
            await postService.deletePost(postId);
            setPosts(prev => prev.filter(post => post.id !== postId));
        } catch (err) {
            console.error('Lỗi khi xóa bài viết:', err);
        }
    };

    const handleRefresh = () => loadPosts(1, true);

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

    if (error) return renderError();

    return (
        <div>
            <div className="d-flex flex-column">
                {posts.map(post => (
                    <PostItem
                        key={post.id}
                        post={post}
                        onLike={handleLike}
                        onDelete={handleDelete}
                    />
                ))}
            </div>

            {loading && renderSkeleton()}

            {!loading && hasMore && renderLoadMoreButton()}

            {!loading && !hasMore && posts.length > 0 && renderNoMorePosts()}
        </div>
    );
};

export default PostList;
