import React from 'react';
import { getAvatarUrl } from '../utils/placeholderImages';

const Avatar = ({ 
    user, 
    size = 'medium', 
    className = '', 
    alt = '', 
    onClick,
    style = {}
}) => {
    // Định nghĩa các kích thước
    const sizeMap = {
        'xs': { width: '24px', height: '24px' },
        'sm': { width: '32px', height: '32px' },
        'medium': { width: '40px', height: '40px' },
        'md': { width: '48px', height: '48px' },
        'lg': { width: '64px', height: '64px' },
        'xl': { width: '96px', height: '96px' },
        'xxl': { width: '128px', height: '128px' }
    };

    const avatarSize = sizeMap[size] || sizeMap.medium;
    const avatarUrl = getAvatarUrl(user);
    const displayName = user?.displayName || user?.fullName || user?.username || user?.name || alt || 'User';

    return (
        <img
            src={avatarUrl}
            alt={displayName}
            className={`rounded-circle ${className}`}
            style={{
                ...avatarSize,
                objectFit: 'cover',
                cursor: onClick ? 'pointer' : 'default',
                ...style
            }}
            onClick={onClick}
        />
    );
};

export default Avatar; 