import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import friendshipService from '../services/friendshipService';
import { getUserAvatar } from '../utils/placeholderImages';
import Loading from './Loading';

const FriendRequests = ({ userId }) => {
    const [friendRequests, setFriendRequests] = useState([]);
    const [sentRequests, setSentRequests] = useState([]);
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

            // Load both received and sent requests
            const [receivedResponse, sentResponse] = await Promise.all([
                friendshipService.getFriendRequests(userId),
                friendshipService.getSentRequests(userId)
            ]);

            if (receivedResponse.status.success) {
                const formattedReceived = (receivedResponse.data || []).map(request =>
                    friendshipService.formatFriendRequestInfo(request)
                );
                setFriendRequests(formattedReceived);
            }

            if (sentResponse.status.success) {
                const formattedSent = (sentResponse.data || []).map(request =>
                    friendshipService.formatFriendRequestInfo(request)
                );
                setSentRequests(formattedSent);
            }
        } catch (error) {
            console.error('Error loading friend requests:', error);
            setError('Lỗi khi tải lời mời kết bạn');
        } finally {
            setLoading(false);
        }
    };

    const handleAcceptRequest = async (requestId, senderId) => {
        if (processingIds.has(requestId)) return;

        try {
            setProcessingIds(prev => new Set(prev).add(requestId));

            const response = await friendshipService.acceptFriendRequest(senderId, userId);
            if (response.status.success) {
                // Remove from friend requests list
                setFriendRequests(prev => prev.filter(req => req.id !== requestId));
            } else {
                alert(response.status.displayMessage || 'Không thể chấp nhận lời mời');
            }
        } catch (error) {
            console.error('Error accepting friend request:', error);
            alert('Lỗi khi chấp nhận lời mời kết bạn');
        } finally {
            setProcessingIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(requestId);
                return newSet;
            });
        }
    };

    const handleRejectRequest = async (requestId, senderId) => {
        if (processingIds.has(requestId)) return;

        try {
            setProcessingIds(prev => new Set(prev).add(requestId));

            const response = await friendshipService.rejectFriendRequest(senderId, userId);
            if (response.status.success) {
                // Remove from friend requests list
                setFriendRequests(prev => prev.filter(req => req.id !== requestId));
            } else {
                alert(response.status.displayMessage || 'Không thể từ chối lời mời');
            }
        } catch (error) {
            console.error('Error rejecting friend request:', error);
            alert('Lỗi khi từ chối lời mời kết bạn');
        } finally {
            setProcessingIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(requestId);
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

    const currentRequests = activeTab === 'received' ? friendRequests : sentRequests;

    return (
        <div className="friend-requests">
            {/* Header với tabs */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Lời mời kết bạn</h5>
            </div>

            {/* Tabs */}
            <ul className="nav nav-tabs mb-3">
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === 'received' ? 'active' : ''}`}
                        onClick={() => setActiveTab('received')}
                    >
                        Nhận được ({friendRequests.length})
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === 'sent' ? 'active' : ''}`}
                        onClick={() => setActiveTab('sent')}
                    >
                        Đã gửi ({sentRequests.length})
                    </button>
                </li>
            </ul>

            {/* Content */}
            {currentRequests.length === 0 ? (
                <div className="text-center py-5">
                    <div className="text-muted mb-2" style={{ fontSize: '2rem' }}>
                        {activeTab === 'received' ? '📬' : '📤'}
                    </div>
                    <h6>
                        {activeTab === 'received'
                            ? 'Không có lời mời kết bạn mới'
                            : 'Chưa gửi lời mời kết bạn nào'
                        }
                    </h6>
                    <p className="text-muted small">
                        {activeTab === 'received'
                            ? 'Khi có người gửi lời mời kết bạn, chúng sẽ hiển thị ở đây'
                            : 'Hãy tìm kiếm và gửi lời mời kết bạn với những người bạn quen biết'
                        }
                    </p>
                </div>
            ) : (
                <div className="list-group list-group-flush">
                    {currentRequests.map((request) => (
                        <div key={request.id} className="list-group-item border-0 px-0 py-3">
                            <div className="d-flex align-items-center">
                                <img
                                    src={getUserAvatar({ avatar: request.senderAvatar })}
                                    alt={request.senderName}
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
                                        {request.senderName}
                                    </h6>
                                    <small className="text-muted">
                                        {activeTab === 'received'
                                            ? 'Muốn kết bạn với bạn'
                                            : 'Đã gửi lời mời kết bạn'
                                        }
                                    </small>
                                    {request.createdAt && (
                                        <div>
                                            <small className="text-muted">
                                                {new Date(request.createdAt).toLocaleDateString('vi-VN', {
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
                                    {activeTab === 'received' ? (
                                        <>
                                            <button
                                                onClick={() => handleAcceptRequest(request.id, request.senderId)}
                                                disabled={processingIds.has(request.id)}
                                                className="btn btn-primary btn-sm"
                                            >
                                                {processingIds.has(request.id) ? (
                                                    <span className="spinner-border spinner-border-sm me-1" />
                                                ) : (
                                                    '✓'
                                                )}
                                                Chấp nhận
                                            </button>
                                            <button
                                                onClick={() => handleRejectRequest(request.id, request.senderId)}
                                                disabled={processingIds.has(request.id)}
                                                className="btn btn-outline-secondary btn-sm"
                                            >
                                                {processingIds.has(request.id) ? (
                                                    <span className="spinner-border spinner-border-sm me-1" />
                                                ) : (
                                                    '✗'
                                                )}
                                                Từ chối
                                            </button>
                                        </>
                                    ) : (
                                        <small className="text-muted">
                                            Đang chờ phản hồi
                                        </small>
                                    )}
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
