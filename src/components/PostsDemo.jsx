import React, { useState, useEffect } from 'react';
import postService from '../features/posts/postService';

const PostsDemo = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState({});

    useEffect(() => {
        loadPosts();
    }, []);

    const loadPosts = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await postService.getPosts(0, 10);
            setPosts(response.posts || []);
            
            // Tính toán thống kê
            const totalPosts = response.posts.length;
            const publicPosts = response.posts.filter(p => p.visibility === 'PUBLIC').length;
            const privatePosts = response.posts.filter(p => p.visibility === 'PRIVATE').length;
            const friendsPosts = response.posts.filter(p => p.visibility === 'FRIENDS').length;
            const totalReactions = response.posts.reduce((sum, p) => sum + p.likesCount, 0);
            const totalComments = response.posts.reduce((sum, p) => sum + p.commentsCount, 0);
            const postsWithMedia = response.posts.filter(p => p.mediaUrls && p.mediaUrls.length > 0).length;

            setStats({
                totalPosts,
                publicPosts,
                privatePosts,
                friendsPosts,
                totalReactions,
                totalComments,
                postsWithMedia
            });

        } catch (err) {
            setError(err.message);
            console.error('Error loading posts:', err);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

        if (diffInHours < 1) {
            return 'Vừa xong';
        } else if (diffInHours < 24) {
            return `${diffInHours} giờ trước`;
        } else {
            const diffInDays = Math.floor(diffInHours / 24);
            return `${diffInDays} ngày trước`;
        }
    };

    const getVisibilityInfo = (visibility) => {
        switch (visibility) {
            case 'PUBLIC':
                return { text: 'Công khai', color: '#1877f2', bg: '#e7f3ff' };
            case 'FRIENDS':
                return { text: 'Bạn bè', color: '#f57c00', bg: '#fff3e0' };
            case 'PRIVATE':
                return { text: 'Chỉ mình tôi', color: '#d32f2f', bg: '#ffebee' };
            default:
                return { text: 'Công khai', color: '#1877f2', bg: '#e7f3ff' };
        }
    };

    const renderPost = (post) => {
        const visibility = getVisibilityInfo(post.visibility);
        const userName = post.author?.name || 'Người dùng';
        const userInitial = userName.charAt(0).toUpperCase();

        return (
            <div key={post.id} style={{
                background: 'white',
                border: '1px solid #e4e6ea',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '16px',
                boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
            }}>
                {/* Post Header */}
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: '#1877f2',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        marginRight: '12px'
                    }}>
                        {userInitial}
                    </div>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: '600', fontSize: '14px', color: '#1c1e21' }}>
                            {userName}
                        </div>
                        <div style={{ fontSize: '12px', color: '#65676b', display: 'flex', alignItems: 'center' }}>
                            {formatDate(post.createdAt)}
                            <span style={{ margin: '0 4px' }}>•</span>
                            <span style={{
                                padding: '2px 8px',
                                borderRadius: '12px',
                                fontSize: '11px',
                                fontWeight: '500',
                                color: visibility.color,
                                backgroundColor: visibility.bg
                            }}>
                                {visibility.text}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Post Content */}
                <div style={{ marginBottom: '12px', lineHeight: '1.5', color: '#1c1e21' }}>
                    {post.content}
                </div>

                {/* Media */}
                {post.mediaUrls && post.mediaUrls.length > 0 && (
                    <div style={{ marginBottom: '12px' }}>
                        <img 
                            src={post.mediaUrls[0]} 
                            alt="Post media" 
                            style={{ 
                                maxWidth: '100%', 
                                borderRadius: '8px',
                                maxHeight: '300px',
                                objectFit: 'cover'
                            }}
                            onError={(e) => e.target.style.display = 'none'}
                        />
                    </div>
                )}

                {/* Stats */}
                <div style={{ 
                    display: 'flex', 
                    gap: '20px', 
                    fontSize: '12px', 
                    color: '#65676b',
                    marginBottom: '8px'
                }}>
                    <span>❤️ {post.likesCount} lượt thích</span>
                    <span>💬 {post.commentsCount} bình luận</span>
                </div>

                {/* Reactions */}
                {post.reactions && post.reactions.length > 0 && (
                    <div style={{ 
                        display: 'flex', 
                        gap: '4px', 
                        marginBottom: '8px',
                        flexWrap: 'wrap'
                    }}>
                        {post.reactions.map((reaction, index) => (
                            <span key={index} style={{
                                background: '#f0f2f5',
                                padding: '2px 6px',
                                borderRadius: '10px',
                                fontSize: '11px',
                                color: '#65676b'
                            }}>
                                {reaction.type} bởi {reaction.user.name}
                            </span>
                        ))}
                    </div>
                )}

                {/* Comments Preview */}
                {post.comments && post.comments.length > 0 && (
                    <div style={{ 
                        marginTop: '8px', 
                        paddingTop: '8px', 
                        borderTop: '1px solid #f0f2f5'
                    }}>
                        {post.comments.slice(0, 2).map((comment, index) => (
                            <div key={index} style={{ 
                                fontSize: '12px', 
                                color: '#65676b',
                                marginBottom: '4px'
                            }}>
                                <strong>{comment.user.name}:</strong> {comment.content}
                            </div>
                        ))}
                        {post.comments.length > 2 && (
                            <div style={{ fontSize: '12px', color: '#65676b' }}>
                                ... và {post.comments.length - 2} bình luận khác
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    };

    const renderStats = () => (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: '12px',
            marginBottom: '24px'
        }}>
            <div style={{ background: '#e3f2fd', padding: '12px', borderRadius: '6px', textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#1976d2' }}>{stats.totalPosts || 0}</div>
                <div style={{ fontSize: '11px', color: '#666' }}>Tổng bài viết</div>
            </div>
            <div style={{ background: '#e8f5e8', padding: '12px', borderRadius: '6px', textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#388e3c' }}>{stats.publicPosts || 0}</div>
                <div style={{ fontSize: '11px', color: '#666' }}>Công khai</div>
            </div>
            <div style={{ background: '#fff3e0', padding: '12px', borderRadius: '6px', textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#f57c00' }}>{stats.friendsPosts || 0}</div>
                <div style={{ fontSize: '11px', color: '#666' }}>Bạn bè</div>
            </div>
            <div style={{ background: '#fce4ec', padding: '12px', borderRadius: '6px', textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#c2185b' }}>{stats.privatePosts || 0}</div>
                <div style={{ fontSize: '11px', color: '#666' }}>Riêng tư</div>
            </div>
            <div style={{ background: '#f3e5f5', padding: '12px', borderRadius: '6px', textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#7b1fa2' }}>{stats.totalReactions || 0}</div>
                <div style={{ fontSize: '11px', color: '#666' }}>Tổng lượt thích</div>
            </div>
            <div style={{ background: '#e0f2f1', padding: '12px', borderRadius: '6px', textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#00695c' }}>{stats.totalComments || 0}</div>
                <div style={{ fontSize: '11px', color: '#666' }}>Tổng bình luận</div>
            </div>
        </div>
    );

    return (
        <div style={{ 
            maxWidth: '800px', 
            margin: '0 auto', 
            padding: '20px',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}>
            <div style={{ 
                background: 'white', 
                padding: '20px', 
                borderRadius: '8px', 
                marginBottom: '20px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
                <h1 style={{ color: '#1877f2', marginBottom: '10px' }}>📝 Posts API Demo</h1>
                <p style={{ color: '#65676b', marginBottom: '20px' }}>
                    Demo hiển thị bài viết với cấu trúc API response mới
                </p>
                
                <button 
                    onClick={loadPosts}
                    disabled={loading}
                    style={{
                        background: '#1877f2',
                        color: 'white',
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: '6px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        fontSize: '14px',
                        opacity: loading ? 0.7 : 1
                    }}
                >
                    {loading ? '🔄 Đang tải...' : '🔄 Làm mới'}
                </button>
            </div>

            {error && (
                <div style={{
                    background: '#f8d7da',
                    color: '#721c24',
                    border: '1px solid #f5c6cb',
                    borderRadius: '6px',
                    padding: '15px',
                    marginBottom: '20px'
                }}>
                    ❌ Lỗi: {error}
                </div>
            )}

            {Object.keys(stats).length > 0 && renderStats()}

            {loading ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                    <div style={{
                        display: 'inline-block',
                        width: '40px',
                        height: '40px',
                        border: '4px solid #f3f3f3',
                        borderTop: '4px solid #1877f2',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                    }}></div>
                    <p style={{ marginTop: '16px', color: '#65676b' }}>Đang tải bài viết...</p>
                </div>
            ) : posts.length > 0 ? (
                <div>
                    <h3 style={{ marginBottom: '16px', color: '#1c1e21' }}>
                        📄 Danh sách bài viết ({posts.length} bài)
                    </h3>
                    {posts.map(renderPost)}
                </div>
            ) : (
                <div style={{ 
                    textAlign: 'center', 
                    padding: '40px',
                    background: 'white',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>📝</div>
                    <h3 style={{ marginBottom: '8px', color: '#1c1e21' }}>Chưa có bài viết nào</h3>
                    <p style={{ color: '#65676b' }}>Hãy thử làm mới để xem bài viết mới nhất</p>
                </div>
            )}

            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default PostsDemo;
