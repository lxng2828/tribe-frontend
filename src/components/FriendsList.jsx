import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import friendshipService from '../services/friendshipService';
import { DEFAULT_AVATAR } from '../utils/placeholderImages';
import Loading from './Loading';

const FriendsList = ({ userId, showHeader = true, maxItems = null }) => {
    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        loadFriends();
    }, [userId]);

    const loadFriends = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await friendshipService.getFriends(userId);
            const { status, data } = response;

            if (status.success) {
                const formattedFriends = (data || []).map(friend =>
                    friendshipService.formatFriendInfo(friend)
                );
                setFriends(formattedFriends);
            } else {
                setError(status.displayMessage || 'Không thể tải danh sách bạn bè');
            }
        } catch (error) {
            console.error('Error loading friends:', error);
            setError('Lỗi khi tải danh sách bạn bè');
        } finally {
            setLoading(false);
        }
    };

    const handleUnfriend = async (friendId, friendName) => {
        const confirmed = window.confirm(`Bạn có chắc muốn hủy kết bạn với ${friendName}?`);
        if (!confirmed) return;

        try {
            const response = await friendshipService.unfriend(userId, friendId);
            if (response.status.success) {
                // Cập nhật danh sách sau khi hủy kết bạn
                setFriends(friends.filter(friend => friend.id !== friendId));
            } else {
                alert(response.status.displayMessage || 'Không thể hủy kết bạn');
            }
        } catch (error) {
            console.error('Error unfriending:', error);
            alert('Lỗi khi hủy kết bạn');
        }
    };

    const handleViewProfile = (friendId) => {
        navigate(`/profile/${friendId}`);
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
                            onClick={loadFriends}
                            className="btn btn-outline-danger btn-sm mt-2"
                        >
                            Thử lại
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const displayedFriends = maxItems ? friends.slice(0, maxItems) : friends;

    return (
        <div className="friends-list">
            {showHeader && (
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="mb-0">Bạn bè ({friends.length})</h5>
                    {maxItems && friends.length > maxItems && (
                        <Link
                            to="/friends"
                            className="text-primary text-decoration-none"
                        >
                            Xem tất cả
                        </Link>
                    )}
                </div>
            )}

            {friends.length === 0 ? (
                <div className="text-center py-4">
                    <div className="text-muted mb-2" style={{ fontSize: '2rem' }}>👥</div>
                    <h6>Chưa có bạn bè</h6>
                    <p className="text-muted small">
                        Hãy tìm kiếm và kết bạn với những người bạn quen biết
                    </p>
                    <Link to="/search" className="btn btn-primary btn-sm">
                        Tìm bạn bè
                    </Link>
                </div>
            ) : (
                <div className="row g-3">
                    {displayedFriends.map((friend) => (
                        <div key={friend.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                            <div className="card border-0 shadow-sm h-100">
                                <div className="position-relative">
                                    <img
                                        src={friend.avatar || DEFAULT_AVATAR}
                                        alt={friend.displayName}
                                        className="card-img-top"
                                        style={{
                                            height: '200px',
                                            objectFit: 'cover',
                                            cursor: 'pointer'
                                        }}
                                        onClick={() => handleViewProfile(friend.id)}
                                    />

                                    {/* Dropdown menu */}
                                    <div className="dropdown position-absolute top-0 end-0 m-2">
                                        <button
                                            className="btn btn-light btn-sm rounded-circle p-1"
                                            type="button"
                                            data-bs-toggle="dropdown"
                                            style={{ width: '32px', height: '32px' }}
                                        >
                                            <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                                <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
                                            </svg>
                                        </button>
                                        <ul className="dropdown-menu dropdown-menu-end">
                                            <li>
                                                <button
                                                    className="dropdown-item"
                                                    onClick={() => handleViewProfile(friend.id)}
                                                >
                                                    👤 Xem trang cá nhân
                                                </button>
                                            </li>
                                            <li>
                                                <button
                                                    className="dropdown-item"
                                                    onClick={() => navigate(`/messages?userId=${friend.id}`)}
                                                >
                                                    💬 Nhắn tin
                                                </button>
                                            </li>
                                            <li><hr className="dropdown-divider" /></li>
                                            <li>
                                                <button
                                                    className="dropdown-item text-danger"
                                                    onClick={() => handleUnfriend(friend.id, friend.displayName)}
                                                >
                                                    ❌ Hủy kết bạn
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="card-body p-3">
                                    <h6
                                        className="card-title mb-1 text-truncate"
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => handleViewProfile(friend.id)}
                                    >
                                        {friend.displayName}
                                    </h6>
                                    {friend.acceptedAt && (
                                        <small className="text-muted">
                                            Bạn bè từ {new Date(friend.acceptedAt).toLocaleDateString('vi-VN')}
                                        </small>
                                    )}

                                    <div className="d-flex gap-2 mt-2">
                                        <button
                                            onClick={() => handleViewProfile(friend.id)}
                                            className="btn btn-outline-primary btn-sm flex-grow-1"
                                        >
                                            Xem trang
                                        </button>
                                        <button
                                            onClick={() => navigate(`/messages?userId=${friend.id}`)}
                                            className="btn btn-primary btn-sm flex-grow-1"
                                        >
                                            Nhắn tin
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FriendsList;
