import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFriends } from '../contexts/FriendsContext';
import { getFullUrl, DEFAULT_AVATAR, getAvatarUrl } from '../utils/placeholderImages';
import Loading from './Loading';

const FriendRequests = ({ userId }) => {
    const { friendRequests, loading, error, acceptFriendRequest, rejectFriendRequest } = useFriends();
    const [processingIds, setProcessingIds] = useState(new Set());
    const navigate = useNavigate();

    const handleAcceptRequest = async (senderId) => {
        if (processingIds.has(senderId)) return;

        try {
            setProcessingIds(prev => new Set(prev).add(senderId));

            const success = await acceptFriendRequest(senderId);
            if (!success) {
                alert('Không thể chấp nhận lời mời');
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

            const success = await rejectFriendRequest(senderId);
            if (!success) {
                alert('Không thể từ chối lời mời');
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
                            onClick={() => window.location.reload()}
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
        <div className="friend-requests p-4">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-5">
                <div>
                    <h4 className="mb-0 fw-bold text-primary" style={{ fontSize: '1.5rem' }}>Lời mời kết bạn ({friendRequests.length})</h4>
                    <p className="text-muted mb-0 mt-2" style={{ fontSize: '1.1rem' }}>Quản lý lời mời kết bạn của bạn</p>
                </div>
            </div>

            {/* Content */}
            {friendRequests.length === 0 ? (
                <div className="text-center py-5">
                    <div className="text-muted mb-4" style={{ fontSize: '4rem' }}>📬</div>
                    <h5 className="fw-semibold mb-3" style={{ fontSize: '1.3rem' }}>Không có lời mời kết bạn mới</h5>
                    <p className="text-muted mb-0" style={{ fontSize: '1.1rem' }}>
                        Khi có người gửi lời mời kết bạn, chúng sẽ hiển thị ở đây
                    </p>
                </div>
            ) : (
                <div className="list-group list-group-flush">
                    {friendRequests.map((request) => (
                        <div key={request.senderId} className="list-group-item border-0 px-0 py-4">
                            <div className="d-flex align-items-center p-4 rounded" style={{
                                backgroundColor: 'var(--fb-off-white)',
                                border: '1px solid var(--fb-border)',
                                transition: 'all 0.3s ease',
                                borderRadius: '16px'
                            }}>
                                <div className="position-relative me-4">
                                    <img
                                        src={getAvatarUrl(request)}
                                        alt={request.senderDisplayName || 'Người dùng'}
                                        className="rounded-circle"
                                        style={{
                                            width: '80px',
                                            height: '80px',
                                            objectFit: 'cover',
                                            border: '3px solid var(--fb-white)',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                            cursor: 'pointer'
                                        }}
                                        onClick={() => handleViewProfile(request.senderId)}
                                    />
                                </div>

                                <div className="flex-grow-1 me-4">
                                    <h5
                                        className="mb-2 fw-semibold text-primary"
                                        style={{
                                            cursor: 'pointer',
                                            fontSize: '1.2rem'
                                        }}
                                        onClick={() => handleViewProfile(request.senderId)}
                                    >
                                        {request.senderDisplayName || 'Người dùng'}
                                    </h5>
                                    <p className="text-muted mb-0" style={{ fontSize: '1rem' }}>
                                        Đã gửi lời mời kết bạn {new Date(request.sentAt).toLocaleDateString('vi-VN')}
                                    </p>
                                </div>

                                <div className="d-flex gap-3">
                                    <button
                                        className="btn btn-success px-4 py-2"
                                        onClick={() => handleAcceptRequest(request.senderId)}
                                        disabled={processingIds.has(request.senderId)}
                                        style={{
                                            borderRadius: '12px',
                                            fontWeight: '600',
                                            minWidth: '120px',
                                            fontSize: '1rem'
                                        }}
                                    >
                                        {processingIds.has(request.senderId) ? (
                                            <div className="spinner-border spinner-border-sm me-2" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </div>
                                        ) : (
                                            <svg width="16" height="16" fill="currentColor" className="me-2" viewBox="0 0 16 16">
                                                <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z" />
                                            </svg>
                                        )}
                                        Chấp nhận
                                    </button>
                                    <button
                                        className="btn btn-outline-danger px-4 py-2"
                                        onClick={() => handleRejectRequest(request.senderId)}
                                        disabled={processingIds.has(request.senderId)}
                                        style={{
                                            borderRadius: '12px',
                                            fontWeight: '600',
                                            minWidth: '120px',
                                            fontSize: '1rem'
                                        }}
                                    >
                                        {processingIds.has(request.senderId) ? (
                                            <div className="spinner-border spinner-border-sm me-2" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </div>
                                        ) : (
                                            <svg width="16" height="16" fill="currentColor" className="me-2" viewBox="0 0 16 16">
                                                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                                            </svg>
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
