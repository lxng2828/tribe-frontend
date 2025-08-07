import { useState, useRef } from 'react';
import PostList from '../features/posts/PostList';
import CreatePost from '../components/CreatePost';
import { DEFAULT_STORY_IMAGE, generatePlaceholderAvatar } from '../utils/placeholderImages';

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
           
            {/* Create Post */}
            <CreatePost onPostCreate={handlePostCreate} />

            {/* News Feed */}
            <PostList ref={postListRef} />
        </div>
    );
};

export default NewsFeed;
