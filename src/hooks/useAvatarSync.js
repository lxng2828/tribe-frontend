import { useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';

// Custom hook để đồng bộ avatar
export const useAvatarSync = () => {
    const { user, refreshUserInfo } = useAuth();

    // Function để refresh avatar khi cần thiết
    const refreshAvatar = useCallback(async () => {
        try {
            await refreshUserInfo();
        } catch (error) {
            console.error('Error refreshing avatar:', error);
        }
    }, [refreshUserInfo]);

    // Function để force refresh avatar (có thể gọi từ bên ngoài)
    const forceRefreshAvatar = useCallback(async () => {
        await refreshAvatar();
    }, [refreshAvatar]);

    // Effect để tự động refresh avatar khi user thay đổi
    useEffect(() => {
        if (user?.id) {
            // Có thể thêm logic để kiểm tra xem avatar có cần refresh không
            // Ví dụ: kiểm tra timestamp của avatar
        }
    }, [user?.id, user?.avatarUrl]);

    return {
        user,
        refreshAvatar,
        forceRefreshAvatar
    };
}; 