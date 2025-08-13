import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getAvatarUrl } from '../utils/placeholderImages';


// Hook để đồng bộ avatar bài đăng với avatar người dùng thực tế
export const usePostAvatarSync = (posts) => {
    const { user } = useAuth();
    const [syncedPosts, setSyncedPosts] = useState(posts);

    // Function để đồng bộ avatar cho một bài đăng
    const syncPostAvatar = useCallback((post) => {
        if (!post || !post.author) return post;

        // Nếu bài đăng thuộc về user hiện tại, sử dụng avatar thực tế của user
        if (post.author.id === user?.id) {
            const syncedPost = {
                ...post,
                author: {
                    ...post.author,
                    avatar: getAvatarUrl(user),
                    displayName: user?.displayName || user?.fullName || user?.username,
                    fullName: user?.fullName,
                    username: user?.username,
                    avatarUrl: user?.avatarUrl
                }
            };
            
            return syncedPost;
        }

        return post;
    }, [user]);

    // Function để đồng bộ tất cả bài đăng
    const syncAllPosts = useCallback(() => {
        if (!posts) return;
        
        const updatedPosts = posts.map(syncPostAvatar);
        setSyncedPosts(updatedPosts);
    }, [posts, syncPostAvatar]);

    // Effect để đồng bộ khi posts hoặc user thay đổi
    useEffect(() => {
        syncAllPosts();
    }, [posts, user?.avatarUrl, user?.displayName, syncAllPosts]);

    // Function để force refresh avatar cho một bài đăng cụ thể
    const refreshPostAvatar = useCallback((postId) => {
        setSyncedPosts(prevPosts => 
            prevPosts.map(post => 
                post.id === postId ? syncPostAvatar(post) : post
            )
        );
    }, [syncPostAvatar]);

    // Function để force refresh tất cả avatar
    const refreshAllAvatars = useCallback(() => {
        syncAllPosts();
    }, [syncAllPosts]);

    return {
        posts: syncedPosts,
        refreshPostAvatar,
        refreshAllAvatars,
        syncPostAvatar
    };
}; 