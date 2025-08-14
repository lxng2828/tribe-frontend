import { useState } from 'react';
import { usePostManager } from './PostManager';

const PostDemo = () => {
    const { 
        posts, 
        loading, 
        error, 
        createPost, 
        toggleLike, 
        addComment,
        openCreateModal,
        openCommentsModal,
        openReactionsModal
    } = usePostManager();

    const [testContent, setTestContent] = useState('');

    const handleCreateTestPost = async () => {
        try {
            await createPost({
                content: testContent || 'Bài viết test từ demo',
                visibility: 'PUBLIC'
            });
            setTestContent('');
        } catch (error) {
            console.error('Error creating test post:', error);
        }
    };

    const handleTestLike = (postId) => {
        toggleLike(postId);
    };

    const handleTestComment = async (postId) => {
        try {
            await addComment(postId, 'Bình luận test từ demo');
        } catch (error) {
            console.error('Error adding test comment:', error);
        }
    };

    return (
        <div className="card-fb spacing-fb">
            <div className="card-body">
                <h5>Post System Demo</h5>
                
                {/* Test Controls */}
                <div className="mb-4 p-3 border rounded">
                    <h6>Test Controls:</h6>
                    <div className="d-flex gap-2 mb-2">
                        <button 
                            className="btn btn-primary btn-sm"
                            onClick={openCreateModal}
                        >
                            Open Create Modal
                        </button>
                        <button 
                            className="btn btn-success btn-sm"
                            onClick={handleCreateTestPost}
                            disabled={loading}
                        >
                            Create Test Post
                        </button>
                    </div>
                    
                    <div className="mb-2">
                        <input
                            type="text"
                            className="form-control form-control-sm"
                            placeholder="Test post content"
                            value={testContent}
                            onChange={(e) => setTestContent(e.target.value)}
                        />
                    </div>
                </div>

                {/* Status */}
                <div className="mb-3">
                    <div className="d-flex gap-3">
                        <span className="badge bg-primary">Posts: {posts.length}</span>
                        <span className={`badge ${loading ? 'bg-warning' : 'bg-success'}`}>
                            {loading ? 'Loading...' : 'Ready'}
                        </span>
                        {error && <span className="badge bg-danger">Error: {error}</span>}
                    </div>
                </div>

                {/* Posts List */}
                <div>
                    <h6>Posts ({posts.length}):</h6>
                    {posts.length === 0 ? (
                        <p className="text-muted">No posts yet</p>
                    ) : (
                        posts.map((post) => (
                            <div key={post.id} className="border rounded p-3 mb-2">
                                <div className="d-flex justify-content-between align-items-start">
                                    <div className="flex-grow-1">
                                        <strong>{post.author?.name || 'Unknown'}</strong>
                                        <p className="mb-1">{post.content}</p>
                                        <small className="text-muted">
                                            {post.createdAt} • {post.likesCount} likes • {post.commentsCount} comments
                                        </small>
                                    </div>
                                    <div className="d-flex gap-1">
                                        <button 
                                            className="btn btn-sm btn-outline-primary"
                                            onClick={() => handleTestLike(post.id)}
                                        >
                                            {post.liked ? '❤️' : '🤍'} Like
                                        </button>
                                        <button 
                                            className="btn btn-sm btn-outline-secondary"
                                            onClick={() => handleTestComment(post.id)}
                                        >
                                            💬 Comment
                                        </button>
                                        <button 
                                            className="btn btn-sm btn-outline-info"
                                            onClick={() => openCommentsModal(post)}
                                        >
                                            📝 View Comments
                                        </button>
                                        {post.likesCount > 0 && (
                                            <button 
                                                className="btn btn-sm btn-outline-warning"
                                                onClick={() => openReactionsModal(post)}
                                            >
                                                👥 Reactions
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default PostDemo;

