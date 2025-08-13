// Utility functions để debug avatar trong bài đăng
export const debugPostAvatar = (post, user) => {
    console.group(`🔍 Debug Avatar cho Post ${post.id}`);
    
    console.log('📝 Post data:', {
        id: post.id,
        content: post.content?.substring(0, 50) + '...',
        author: post.author,
        avatarSender: post.avatarSender
    });
    
    console.log('👤 User data:', {
        id: user?.id,
        displayName: user?.displayName,
        fullName: user?.fullName,
        username: user?.username,
        avatarUrl: user?.avatarUrl,
        avatar: user?.avatar
    });
    
    console.log('🔄 Avatar sync check:', {
        isOwnPost: post.author?.id === user?.id,
        postAuthorId: post.author?.id,
        currentUserId: user?.id,
        shouldSync: post.author?.id === user?.id
    });
    
    console.groupEnd();
};

export const debugAllPostsAvatars = (posts, user) => {
    console.group('🔍 Debug Tất cả Avatar trong Posts');
    
    posts.forEach((post, index) => {
        console.log(`📝 Post ${index + 1}:`, {
            id: post.id,
            authorName: post.author?.displayName || post.author?.name,
            authorId: post.author?.id,
            avatar: post.author?.avatar,
            isOwnPost: post.author?.id === user?.id
        });
    });
    
    console.groupEnd();
};

export const logAvatarSync = (action, data) => {
    console.log(`🔄 Avatar Sync - ${action}:`, data);
}; 