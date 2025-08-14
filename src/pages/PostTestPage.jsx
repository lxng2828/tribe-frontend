import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import PostsApp from '../features/posts/PostsApp';

const PostTestPage = () => {
    const { user } = useAuth();
    const [showDemo, setShowDemo] = useState(false);
    const [showCreatePost, setShowCreatePost] = useState(true);

    return (
        <div className="container mt-4">
            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card-header">
                            <h4>Posts System Test Page</h4>
                            <p className="text-muted mb-0">
                                Current User: {user?.displayName || user?.username || 'Not logged in'} 
                                (ID: {user?.id || 'N/A'})
                            </p>
                        </div>
                        <div className="card-body">
                            {/* Test Controls */}
                            <div className="mb-4">
                                <h6>Test Controls:</h6>
                                <div className="d-flex gap-2 mb-2">
                                    <button 
                                        className={`btn btn-sm ${showDemo ? 'btn-success' : 'btn-outline-success'}`}
                                        onClick={() => setShowDemo(!showDemo)}
                                    >
                                        {showDemo ? 'Hide' : 'Show'} Demo
                                    </button>
                                    <button 
                                        className={`btn btn-sm ${showCreatePost ? 'btn-primary' : 'btn-outline-primary'}`}
                                        onClick={() => setShowCreatePost(!showCreatePost)}
                                    >
                                        {showCreatePost ? 'Hide' : 'Show'} Create Post
                                    </button>
                                </div>
                                
                                <div className="alert alert-info">
                                    <strong>Instructions:</strong>
                                    <ul className="mb-0 mt-2">
                                        <li>Enable "Show Demo" to see test controls and debug info</li>
                                        <li>Use "Show Create Post" to toggle the create post component</li>
                                        <li>Check browser console for any errors</li>
                                        <li>Use Network tab to monitor API calls</li>
                                    </ul>
                                </div>
                            </div>

                            {/* Posts System */}
                            <PostsApp 
                                showDemo={showDemo}
                                showCreatePost={showCreatePost}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostTestPage;

