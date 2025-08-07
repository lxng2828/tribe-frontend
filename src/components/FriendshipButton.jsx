import { useState, useEffect } from 'react';
import friendshipService from '../services/friendshipService';
import { useAuth } from '../contexts/AuthContext';

const FriendshipButton = ({ targetUserId, targetUserName, onStatusChange }) => {
    const { user } = useAuth();
    const [friendshipStatus, setFriendshipStatus] = useState('NOT_FRIENDS');
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        if (user?.id && targetUserId && user.id !== targetUserId) {
            checkFriendshipStatus();
        } else {
            setLoading(false);
        }
    }, [user?.id, targetUserId]);

    const checkFriendshipStatus = async () => {
        try {
            setLoading(true);
            const status = await friendshipService.getFriendshipStatus(user.id, targetUserId);
            setFriendshipStatus(status.status);
        } catch (error) {
            console.error('Error checking friendship status:', error);
            setFriendshipStatus('NOT_FRIENDS');
        } finally {
            setLoading(false);
        }
    };

    const handleSendFriendRequest = async () => {
        try {
            setProcessing(true);
            const response = await friendshipService.sendFriendRequest(user.id, targetUserId);

            if (response.status.success) {
                setFriendshipStatus('PENDING_SENT');
                onStatusChange?.(targetUserId, 'PENDING_SENT');
            } else {
                alert(response.status.displayMessage || 'Không thể gửi lời mời kết bạn');
            }
        } catch (error) {
            console.error('Error sending friend request:', error);
            alert('Lỗi khi gửi lời mời kết bạn');
        } finally {
            setProcessing(false);
        }
    };

    const handleAcceptFriendRequest = async () => {
        try {
            setProcessing(true);
            const response = await friendshipService.acceptFriendRequest(targetUserId, user.id);

            if (response.status.success) {
                setFriendshipStatus('FRIENDS');
                onStatusChange?.(targetUserId, 'FRIENDS');
            } else {
                alert(response.status.displayMessage || 'Không thể chấp nhận lời mời');
            }
        } catch (error) {
            console.error('Error accepting friend request:', error);
            alert('Lỗi khi chấp nhận lời mời kết bạn');
        } finally {
            setProcessing(false);
        }
    };

    const handleRejectFriendRequest = async () => {
        try {
            setProcessing(true);
            const response = await friendshipService.rejectFriendRequest(targetUserId, user.id);

            if (response.status.success) {
                setFriendshipStatus('NOT_FRIENDS');
                onStatusChange?.(targetUserId, 'NOT_FRIENDS');
            } else {
                alert(response.status.displayMessage || 'Không thể từ chối lời mời');
            }
        } catch (error) {
            console.error('Error rejecting friend request:', error);
            alert('Lỗi khi từ chối lời mời kết bạn');
        } finally {
            setProcessing(false);
        }
    };

    const handleUnfriend = async () => {
        const confirmed = window.confirm(`Bạn có chắc muốn hủy kết bạn với ${targetUserName}?`);
        if (!confirmed) return;

        try {
            setProcessing(true);
            const response = await friendshipService.unfriend(user.id, targetUserId);

            if (response.status.success) {
                setFriendshipStatus('NOT_FRIENDS');
                onStatusChange?.(targetUserId, 'NOT_FRIENDS');
            } else {
                alert(response.status.displayMessage || 'Không thể hủy kết bạn');
            }
        } catch (error) {
            console.error('Error unfriending:', error);
            alert('Lỗi khi hủy kết bạn');
        } finally {
            setProcessing(false);
        }
    };

    // Không hiển thị nút cho chính mình
    if (!user?.id || !targetUserId || user.id === targetUserId) {
        return null;
    }

    if (loading) {
        return (
            <div className="d-flex gap-2">
                <div className="placeholder-glow flex-grow-1">
                    <span className="placeholder w-100" style={{ height: '38px' }}></span>
                </div>
            </div>
        );
    }

    const renderButton = () => {
        switch (friendshipStatus) {
            case 'FRIENDS':
                return (
                    <div className="d-flex gap-2">
                        <button
                            className="btn btn-outline-primary flex-grow-1"
                            disabled={processing}
                        >
                            <svg width="16" height="16" fill="currentColor" className="me-1" viewBox="0 0 16 16">
                                <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1h8zm-7.978-1A.261.261 0 0 1 7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002a.274.274 0 0 1-.014.002H7.022zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM6.936 9.28a5.88 5.88 0 0 0-1.23-.247A7.35 7.35 0 0 0 5 9c-4 0-5 3-5 4 0 .667.333 1 1 1h4.216A2.238 2.238 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816zM4.92 10A5.493 5.493 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275zM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0zm3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
                            </svg>
                            Bạn bè
                        </button>
                        <div className="dropdown">
                            <button
                                className="btn btn-outline-secondary dropdown-toggle"
                                type="button"
                                data-bs-toggle="dropdown"
                                disabled={processing}
                            >
                                <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
                                </svg>
                            </button>
                            <ul className="dropdown-menu">
                                <li>
                                    <button
                                        className="dropdown-item text-danger"
                                        onClick={handleUnfriend}
                                    >
                                        ❌ Hủy kết bạn
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                );

            case 'PENDING_SENT':
                return (
                    <button
                        className="btn btn-outline-secondary w-100"
                        disabled={processing}
                    >
                        {processing ? (
                            <span className="spinner-border spinner-border-sm me-2" />
                        ) : (
                            <svg width="16" height="16" fill="currentColor" className="me-2" viewBox="0 0 16 16">
                                <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />
                                <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z" />
                            </svg>
                        )}
                        Đã gửi lời mời
                    </button>
                );

            case 'PENDING_RECEIVED':
                return (
                    <div className="d-flex gap-2">
                        <button
                            onClick={handleAcceptFriendRequest}
                            disabled={processing}
                            className="btn btn-primary flex-grow-1"
                        >
                            {processing ? (
                                <span className="spinner-border spinner-border-sm me-1" />
                            ) : (
                                '✓ '
                            )}
                            Chấp nhận
                        </button>
                        <button
                            onClick={handleRejectFriendRequest}
                            disabled={processing}
                            className="btn btn-outline-secondary"
                        >
                            {processing ? (
                                <span className="spinner-border spinner-border-sm" />
                            ) : (
                                '✗'
                            )}
                        </button>
                    </div>
                );

            default: // NOT_FRIENDS
                return (
                    <button
                        onClick={handleSendFriendRequest}
                        disabled={processing}
                        className="btn btn-primary w-100"
                    >
                        {processing ? (
                            <span className="spinner-border spinner-border-sm me-2" />
                        ) : (
                            <svg width="16" height="16" fill="currentColor" className="me-2" viewBox="0 0 16 16">
                                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                            </svg>
                        )}
                        Kết bạn
                    </button>
                );
        }
    };

    return renderButton();
};

export default FriendshipButton;
