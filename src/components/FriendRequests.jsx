import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import friendshipService from '../services/friendshipService';
import { getFullUrl, DEFAULT_AVATAR, getAvatarUrl } from '../utils/placeholderImages';
import Loading from './Loading';

const FriendRequests = ({ userId }) => {
    const [friendRequests, setFriendRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('received'); // 'received' | 'sent'
    const [processingIds, setProcessingIds] = useState(new Set());
    const navigate = useNavigate();

    useEffect(() => {
        loadFriendRequests();
    }, [userId]);

    const loadFriendRequests = async () => {
        try {
            setLoading(true);
            setError(null);

            // Chỉ load received requests theo API docs
            const response = await friendshipService.getFriendRequests(userId);

            if (response.status.success) {
                // Sử dụng dữ liệu theo API docs: senderId, senderDisplayName, avatarUrl, sentAt
                setFriendRequests(response.data || []);
            } else {
                setError(response.status.displayMessage || 'Không thể tải lời mời kết bạn');
            }
        } catch (error) {
            console.error('Error loading friend requests:', error);
            setError('Lỗi khi tải lời mời kết bạn');
        } finally {
            setLoading(false);
        }
    };

    const handleAcceptRequest = async (senderId) => {
        if (processingIds.has(senderId)) return;

        try {
            setProcessingIds(prev => new Set(prev).add(senderId));

            const response = await friendshipService.acceptFriendRequest(senderId, userId);
            if (response.status.success) {
                // Remove from friend requests list
                setFriendRequests(prev => prev.filter(req => req.senderId !== senderId));
            } else {
                alert(response.status.displayMessage || 'Không thể chấp nhận lời mời');
            }
        } catch (error) {
            console.error('Error accepting friend request:', error);
            alert('Lỗi khi chấp nhận lời mời kết bạn');
        } finally {
            setProcessingIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(senderId);
                return newSet;
            });
        }
    };

    const handleRejectRequest = async (senderId) => {
        if (processingIds.has(senderId)) return;

        try {
            setProcessingIds(prev => new Set(prev).add(senderId));

            const response = await friendshipService.rejectFriendRequest(senderId, userId);
            if (response.status.success) {
                // Remove from friend requests list
                setFriendRequests(prev => prev.filter(req => req.senderId !== senderId));
            } else {
                alert(response.status.displayMessage || 'Không thể từ chối lời mời');
            }
        } catch (error) {
            console.error('Error rejecting friend request:', error);
            alert('Lỗi khi từ chối lời mời kết bạn');
        } finally {
            setProcessingIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(senderId);
                return newSet;
            });
        }
    };

    const handleViewProfile = (userId) => {
        navigate(`/profile/${userId}`);
    };

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return (
            <div className="alert alert-danger">
                <div className="d-flex align-items-center">
                    <div className="me-2">⚠️</div>
                    <div>
                        <div>{error}</div>
                        <button
                            onClick={loadFriendRequests}
                            className="btn btn-outline-danger btn-sm mt-2"
                        >
                            Thử lại
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="friend-requests">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Lời mời kết bạn ({friendRequests.length})</h5>
            </div>

            {/* Content */}
            {friendRequests.length === 0 ? (
                <div className="text-center py-5">
                    <div className="text-muted mb-2" style={{ fontSize: '2rem' }}>📬</div>
                    <h6>Không có lời mời kết bạn mới</h6>
                    <p className="text-muted small">
                        Khi có người gửi lời mời kết bạn, chúng sẽ hiển thị ở đây
                    </p>
                </div>
            ) : (
                <div className="list-group list-group-flush">
                    {friendRequests.map((request) => (
                        <div key={request.senderId} className="list-group-item border-0 px-0 py-3">
                            <div className="d-flex align-items-center">
                                <img
                                    src={getAvatarUrl(request)}
                                    alt={request.senderDisplayName || 'Người dùng'}
                                    className="rounded-circle me-3"
                                    style={{
                                        width: '60px',
                                        height: '60px',
                                        objectFit: 'cover',
                                        cursor: 'pointer'
                                    }}
                                    onClick={() => handleViewProfile(request.senderId)}
                                />

                                <div className="flex-grow-1">
                                    <h6
                                        className="mb-1 fw-semibold"
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => handleViewProfile(request.senderId)}
                                    >
                                        {request.senderDisplayName || 'Người dùng'}
                                    </h6>
                                    <small className="text-muted">Muốn kết bạn với bạn</small>
                                    {request.sentAt && (
                                        <div>
                                            <small className="text-muted">
                                                {new Date(request.sentAt).toLocaleDateString('vi-VN', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </small>
                                        </div>
                                    )}
                                </div>

                                {/* Action buttons */}
                                <div className="d-flex gap-2 align-items-center">
                                    <button
                                        onClick={() => handleAcceptRequest(request.senderId)}
                                        disabled={processingIds.has(request.senderId)}
                                        className="btn btn-primary btn-sm"
                                    >
                                        {processingIds.has(request.senderId) ? (
                                            <span className="spinner-border spinner-border-sm me-1" />
                                        ) : (
                                            '✓'
                                        )}
                                        Chấp nhận
                                    </button>
                                    <button
                                        onClick={() => handleRejectRequest(request.senderId)}
                                        disabled={processingIds.has(request.senderId)}
                                        className="btn btn-outline-secondary btn-sm"
                                    >
                                        {processingIds.has(request.senderId) ? (
                                            <span className="spinner-border spinner-border-sm me-1" />
                                        ) : (
                                            '✗'
                                        )}
                                        Từ chối
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FriendRequests;
