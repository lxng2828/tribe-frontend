import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import friendshipService from '../services/friendshipService';
import FriendCard from './FriendCard';
import Loading from './Loading';

const FriendsList = ({ userId, showHeader = true, maxItems = null }) => {
    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
                // Sử dụng dữ liệu theo đúng API docs: id, displayName, avatarUrl
                setFriends(data || []);
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
                </div>
            ) : (
                <div className="row g-3">
                    {displayedFriends.map((friend) => (
                        <div key={friend.id} className="col-6 col-sm-4 col-md-3 col-lg-2">
                            <FriendCard friend={friend} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FriendsList;
