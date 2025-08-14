import { useState, useRef } from 'react';
import PostsApp from '../features/posts/PostsApp';
import { DEFAULT_STORY_IMAGE, generatePlaceholderAvatar } from '../utils/placeholderImages';
import { useAvatarSync } from '../hooks/useAvatarSync';

const NewsFeed = () => {
    const { forceRefreshAvatar } = useAvatarSync();

    const handleAvatarUpdate = async () => {
        // Refresh avatar và bài đăng khi user cập nhật avatar
        await forceRefreshAvatar();
    };

    return (
        <div>
            {/* Wrap everything in PostManager */}
            <PostsApp />
        </div>
    );
};

export default NewsFeed;
