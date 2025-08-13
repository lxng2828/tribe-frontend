// Tạo data URIs cho placeholder images thay vì sử dụng external URLs
export const generatePlaceholderAvatar = (size = 40, text = '') => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = size;
    canvas.height = size;

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, size, size);
    gradient.addColorStop(0, '#667eea');
    gradient.addColorStop(1, '#764ba2');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);

    // Text
    if (text) {
        ctx.fillStyle = 'white';
        ctx.font = `${size / 2.5}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text.charAt(0).toUpperCase(), size / 2, size / 2);
    } else {
        // Default user icon
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(size / 2, size / 3, size / 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(size / 2, size * 0.75, size / 3, 0, Math.PI * 2);
        ctx.fill();
    }

    return canvas.toDataURL();
};

export const generatePlaceholderImage = (width = 200, height = 200, text = '') => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = width;
    canvas.height = height;

    // Background
    ctx.fillStyle = '#f0f2f5';
    ctx.fillRect(0, 0, width, height);

    // Text
    ctx.fillStyle = '#65676b';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text || `${width}x${height}`, width / 2, height / 2);

    return canvas.toDataURL();
};

// Default placeholder images
export const DEFAULT_AVATAR = 'https://i.pravatar.cc/150?img=1';
export const DEFAULT_STORY_IMAGE = generatePlaceholderImage(112, 200, 'Story');
export const DEFAULT_POST_IMAGE = generatePlaceholderImage(400, 300, 'Image');

// Utility function để xử lý URL từ backend
export const getFullUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    return `http://localhost:8080${url}`;
};

// Utility function để xử lý avatar một cách nhất quán
export const getAvatarUrl = (user, fallbackAvatar = DEFAULT_AVATAR) => {
    // Ưu tiên avatarUrl từ user object
    if (user?.avatarUrl) {
        return getFullUrl(user.avatarUrl);
    }
    
    // Fallback cho avatar field cũ
    if (user?.avatar) {
        return getFullUrl(user.avatar);
    }
    
    // Fallback cho profilePicture field
    if (user?.profilePicture) {
        return getFullUrl(user.profilePicture);
    }
    
    // Nếu không có avatar, tạo placeholder dựa trên tên
    if (user?.displayName || user?.fullName || user?.username) {
        const name = user.displayName || user.fullName || user.username;
        return generatePlaceholderAvatar(40, name);
    }
    
    // Fallback cuối cùng
    return fallbackAvatar;
};

// Utility function để xử lý avatar cho posts
export const getPostAuthorAvatar = (post, fallbackAvatar = DEFAULT_AVATAR) => {
    // Ưu tiên avatar từ author object
    if (post?.author?.avatarUrl) {
        return getFullUrl(post.author.avatarUrl);
    }
    
    if (post?.author?.avatar) {
        return getFullUrl(post.author.avatar);
    }
    
    if (post?.author?.profilePicture) {
        return getFullUrl(post.author.profilePicture);
    }
    
    // Fallback cho avatarSender field (từ API cũ)
    if (post?.avatarSender) {
        return getFullUrl(post.avatarSender);
    }
    
    // Tạo placeholder dựa trên tên author
    if (post?.author?.displayName || post?.author?.fullName || post?.author?.username || post?.author?.name) {
        const name = post.author.displayName || post.author.fullName || post.author.username || post.author.name;
        return generatePlaceholderAvatar(40, name);
    }
    
    return fallbackAvatar;
};

// Utility function để xử lý avatar cho comments
export const getCommentAuthorAvatar = (comment, fallbackAvatar = DEFAULT_AVATAR) => {
    if (comment?.author?.avatarUrl) {
        return getFullUrl(comment.author.avatarUrl);
    }
    
    if (comment?.author?.avatar) {
        return getFullUrl(comment.author.avatar);
    }
    
    if (comment?.author?.profilePicture) {
        return getFullUrl(comment.author.profilePicture);
    }
    
    // Tạo placeholder dựa trên tên author
    if (comment?.author?.displayName || comment?.author?.fullName || comment?.author?.username || comment?.author?.name) {
        const name = comment.author.displayName || comment.author.fullName || comment.author.username || comment.author.name;
        return generatePlaceholderAvatar(40, name);
    }
    
    return fallbackAvatar;
};
