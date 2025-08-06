import { useState, useRef } from 'react';
import PostList from '../features/posts/PostList';
import CreatePost from '../components/CreatePost';

const NewsFeed = () => {
    const postListRef = useRef(null);

    const handlePostCreate = (newPost) => {
        // Refresh the PostList after creating a new post
        if (postListRef.current) {
            postListRef.current.refreshPosts();
        }
    };

    return (
        <div>
            {/* Stories Section */}
            <div className="card-fb spacing-fb">
                <div className="p-3">
                    <div className="d-flex gap-3 overflow-auto scrollbar-hide">
                        {/* Create Story */}
                        <div className="position-relative flex-shrink-0"
                            style={{ width: '112px', height: '200px' }}>
                            <div className="w-100 h-100 d-flex flex-column"
                                style={{
                                    background: 'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.5) 100%), url("https://via.placeholder.com/112x200") center/cover',
                                    borderRadius: '12px',
                                    cursor: 'pointer',
                                    border: '2px solid var(--fb-border)'
                                }}>
                                <div className="mt-auto p-3 text-center">
                                    <div className="mb-2 d-flex justify-content-center">
                                        <div className="d-flex align-items-center justify-content-center"
                                            style={{
                                                width: '24px',
                                                height: '24px',
                                                backgroundColor: 'var(--fb-blue)',
                                                borderRadius: '50%',
                                                border: '2px solid white'
                                            }}>
                                            <svg width="12" height="12" fill="white" viewBox="0 0 24 24">
                                                <path d="M12 4v16m8-8H4" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="text-white small fw-medium">Tạo tin</div>
                                </div>
                            </div>
                        </div>

                        {/* Sample Stories */}
                        {[1, 2, 3, 4, 5].map((story) => (
                            <div key={story} className="position-relative flex-shrink-0"
                                style={{ width: '112px', height: '200px' }}>
                                <div className="w-100 h-100 position-relative"
                                    style={{
                                        background: `linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.3) 100%), url("https://via.placeholder.com/112x200?text=Story${story}") center/cover`,
                                        borderRadius: '12px',
                                        cursor: 'pointer'
                                    }}>
                                    <img
                                        src="https://via.placeholder.com/32"
                                        alt="User"
                                        className="position-absolute top-0 start-0 m-2"
                                        style={{
                                            width: '32px',
                                            height: '32px',
                                            borderRadius: '50%',
                                            border: '3px solid var(--fb-blue)'
                                        }}
                                    />
                                    <div className="position-absolute bottom-0 start-0 end-0 p-2">
                                        <div className="text-white small fw-medium">
                                            Người dùng {story}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Create Post */}
            <CreatePost onPostCreate={handlePostCreate} />

            {/* News Feed */}
            <PostList ref={postListRef} />
        </div>
    );
};

export default NewsFeed;
