import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import friendshipService from '../services/friendshipService';

const FriendsContext = createContext(null);

export const useFriends = () => {
    const context = useContext(FriendsContext);
    if (!context) {
        throw new Error('useFriends must be used within a FriendsProvider');
    }
    return context;
};

export const FriendsProvider = ({ children }) => {
    const { user } = useAuth();
    const [friends, setFriends] = useState([]);
    const [friendRequests, setFriendRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Load friends
    const loadFriends = useCallback(async () => {
        if (!user?.id) return;

        try {
            setLoading(true);
            setError(null);
            const response = await friendshipService.getFriends(user.id);
            if (response.status.success) {
                setFriends(response.data || []);
            } else {
                setError('Không thể tải danh sách bạn bè');
            }
        } catch (error) {
            console.error('Error fetching friends:', error);
            setError('Có lỗi xảy ra khi tải danh sách bạn bè');
        } finally {
            setLoading(false);
        }
    }, [user?.id]);

    // Load friend requests
    const loadFriendRequests = useCallback(async () => {
        if (!user?.id) return;

        try {
            const response = await friendshipService.getFriendRequests(user.id);
            if (response.status.success) {
                setFriendRequests(response.data || []);
            }
        } catch (error) {
            console.error('Error fetching friend requests:', error);
        }
    }, [user?.id]);

    // Accept friend request
    const acceptFriendRequest = useCallback(async (senderId) => {
        if (!user?.id) return false;

        try {
            const response = await friendshipService.acceptFriendRequest(senderId, user.id);
            if (response.status.success) {
                // Remove from friend requests
                setFriendRequests(prev => prev.filter(req => req.senderId !== senderId));

                // Refresh friends list to include the new friend
                await loadFriends();

                return true;
            } else {
                console.error('Failed to accept friend request:', response.status.displayMessage);
                return false;
            }
        } catch (error) {
            console.error('Error accepting friend request:', error);
            return false;
        }
    }, [user?.id, loadFriends]);

    // Reject friend request
    const rejectFriendRequest = useCallback(async (senderId) => {
        if (!user?.id) return false;

        try {
            const response = await friendshipService.rejectFriendRequest(senderId, user.id);
            if (response.status.success) {
                // Remove from friend requests
                setFriendRequests(prev => prev.filter(req => req.senderId !== senderId));
                return true;
            } else {
                console.error('Failed to reject friend request:', response.status.displayMessage);
                return false;
            }
        } catch (error) {
            console.error('Error rejecting friend request:', error);
            return false;
        }
    }, [user?.id]);

    // Send friend request
    const sendFriendRequest = useCallback(async (receiverId) => {
        if (!user?.id) return false;

        try {
            const response = await friendshipService.sendFriendRequest(user.id, receiverId);
            return response.status.success;
        } catch (error) {
            console.error('Error sending friend request:', error);
            return false;
        }
    }, [user?.id]);

    // Get friendship status
    const getFriendshipStatus = useCallback(async (targetUserId) => {
        if (!user?.id || !targetUserId) return { status: 'NOT_FRIENDS' };

        try {
            const response = await friendshipService.getFriendshipStatus(user.id, targetUserId);
            return response;
        } catch (error) {
            console.error('Error getting friendship status:', error);
            return { status: 'NOT_FRIENDS' };
        }
    }, [user?.id]);

    // Unfriend
    const unfriend = useCallback(async (friendId) => {
        if (!user?.id) return false;

        try {
            const response = await friendshipService.unfriend(user.id, friendId);
            if (response.status.success) {
                // Remove from friends list
                setFriends(prev => prev.filter(friend => friend.id !== friendId));
                return true;
            } else {
                console.error('Failed to unfriend:', response.status.displayMessage);
                return false;
            }
        } catch (error) {
            console.error('Error unfriending:', error);
            return false;
        }
    }, [user?.id]);

    // Refresh all data
    const refreshAll = useCallback(async () => {
        await Promise.all([loadFriends(), loadFriendRequests()]);
    }, [loadFriends, loadFriendRequests]);

    // Load data when user changes
    useEffect(() => {
        if (user?.id) {
            refreshAll();
        } else {
            setFriends([]);
            setFriendRequests([]);
        }
    }, [user?.id, refreshAll]);

    const contextValue = {
        // State
        friends,
        friendRequests,
        loading,
        error,

        // Actions
        loadFriends,
        loadFriendRequests,
        acceptFriendRequest,
        rejectFriendRequest,
        sendFriendRequest,
        getFriendshipStatus,
        unfriend,
        refreshAll,
    };

    return (
        <FriendsContext.Provider value={contextValue}>
            {children}
        </FriendsContext.Provider>
    );
};
