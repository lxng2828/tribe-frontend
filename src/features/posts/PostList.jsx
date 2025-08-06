import { useState, useEffect } from 'react';
import PostItem from './PostItem';
import postService from './postService';

const PostList = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    // Tải danh sách bài viết
    const loadPosts = async (pageNumber = 1, reset = false) => {
        try {
            setLoading(true);
            const response = await postService.getPosts(pageNumber);

            if (reset) {
                setPosts(response.posts);
            } else {
                setPosts(prev => [...prev, ...response.posts]);
            }

            setHasMore(response.hasMore);
            setPage(pageNumber);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Tải thêm bài viết
    const loadMore = () => {
        if (!loading && hasMore) {
            loadPosts(page + 1, false);
        }
    };

    // Xử lý like/unlike bài viết
    const handleLike = async (postId) => {
        try {
            await postService.toggleLike(postId);
            setPosts(prev => prev.map(post =>
                post.id === postId
                    ? {
                        ...post,
                        liked: !post.liked,
                        likesCount: post.liked ? post.likesCount - 1 : post.likesCount + 1
                    }
                    : post
            ));
        } catch (err) {
            console.error('Lỗi khi like bài viết:', err);
        }
    };

    // Xử lý xóa bài viết
    const handleDelete = async (postId) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
            try {
                await postService.deletePost(postId);
                setPosts(prev => prev.filter(post => post.id !== postId));
            } catch (err) {
                console.error('Lỗi khi xóa bài viết:', err);
            }
        }
    };

    // Làm mới danh sách
    const handleRefresh = () => {
        loadPosts(1, true);
    };

    useEffect(() => {
        loadPosts();
    }, []);

    if (error) {
        return (
            <div className="card-fb p-4 text-center">
                <svg className="text-danger mb-3" width="48" height="48" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-1 6a1 1 0 1 1 2 0v4a1 1 0 1 1-2 0V8zm1 8a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" />
                </svg>
                <h5 className="mb-2">Có lỗi xảy ra</h5>
                <p className="text-muted mb-3">{error}</p>
                <button
                    onClick={handleRefresh}
                    className="btn btn-fb-primary"
                >
                    Thử lại
                </button>
            </div>
        );
    }

    return (
        <div>
            {/* Posts List */}
            <div className="d-flex flex-column">
                {posts.map((post) => (
                    <PostItem
                        key={post.id}
                        post={post}
                        onLike={handleLike}
                        onDelete={handleDelete}
                    />
                ))}
            </div>

            {/* Loading Skeleton */}
            {loading && (
                <div>
                    {[1, 2, 3].map((index) => (
                        <div key={index} className="card-fb spacing-fb">
                            <div className="p-4">
                                {/* Header skeleton */}
                                <div className="d-flex align-items-center mb-3">
                                    <div className="skeleton-fb rounded-circle me-3"
                                        style={{ width: '40px', height: '40px' }}></div>
                                    <div className="flex-grow-1">
                                        <div className="skeleton-fb mb-2"
                                            style={{ width: '30%', height: '16px' }}></div>
                                        <div className="skeleton-fb"
                                            style={{ width: '20%', height: '12px' }}></div>
                                    </div>
                                </div>

                                {/* Content skeleton */}
                                <div className="skeleton-fb mb-3"
                                    style={{ width: '100%', height: '16px' }}></div>
                                <div className="skeleton-fb mb-3"
                                    style={{ width: '80%', height: '16px' }}></div>

                                {/* Image skeleton */}
                                <div className="skeleton-fb mb-3"
                                    style={{ width: '100%', height: '200px' }}></div>

                                {/* Actions skeleton */}
                                <div className="d-flex gap-4">
                                    <div className="skeleton-fb"
                                        style={{ width: '60px', height: '20px' }}></div>
                                    <div className="skeleton-fb"
                                        style={{ width: '60px', height: '20px' }}></div>
                                    <div className="skeleton-fb"
                                        style={{ width: '60px', height: '20px' }}></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Load More Button */}
            {!loading && hasMore && (
                <div className="text-center py-4">
                    <button
                        onClick={loadMore}
                        className="btn btn-fb-secondary px-4"
                        disabled={loading}
                    >
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
            )}

            {/* End of Posts */}
            {!loading && !hasMore && posts.length > 0 && (
                <div className="text-center py-4">
                    <div className="d-inline-flex align-items-center px-4 py-2"
                        style={{
                            backgroundColor: 'var(--fb-gray)',
                            borderRadius: '20px'
                        }}>
                        <svg className="me-2" width="16" height="16" fill="currentColor" viewBox="0 0 24 24"
                            style={{ color: 'var(--fb-text-secondary)' }}>
                            <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-1 6a1 1 0 1 1 2 0v4a1 1 0 1 1-2 0V8zm1 8a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" />
                        </svg>
                        <span style={{ color: 'var(--fb-text-secondary)', fontSize: '14px' }}>
                            Bạn đã xem hết tất cả bài viết
                        </span>
                    </div>
                </div>
            )}

            {/* Empty State */}
            {!loading && posts.length === 0 && (
                <div className="card-fb">
                    <div className="text-center py-5 px-4">
                        <div className="d-inline-flex align-items-center justify-content-center mb-4"
                            style={{
                                width: '80px',
                                height: '80px',
                                backgroundColor: 'var(--fb-gray)',
                                borderRadius: '50%'
                            }}>
                            <svg width="40" height="40" fill="currentColor" viewBox="0 0 24 24"
                                style={{ color: 'var(--fb-text-secondary)' }}>
                                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
                            </svg>
                        </div>
                        <h5 className="mb-2" style={{ color: 'var(--fb-text)' }}>
                            Chưa có bài viết nào
                        </h5>
                        <p className="mb-4" style={{ color: 'var(--fb-text-secondary)' }}>
                            Khi bạn và bạn bè bắt đầu chia sẻ, các bài viết sẽ hiển thị ở đây.
                        </p>
                        <button className="btn btn-fb-primary">
                            Tìm bạn bè
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PostList;
