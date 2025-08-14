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

    // Hiển thị 9 bạn bè đầu tiên như trong hình
    const displayedFriends = maxItems ? friends.slice(0, maxItems) : friends.slice(0, 9);

    return (
        <div className="friends-list">
            {showHeader && (
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h4 className="mb-1 fw-bold" style={{ color: '#1c1e21' }}>Bạn bè</h4>
                        <p className="mb-0 text-muted" style={{ fontSize: '0.9rem' }}>
                            {friends.length} người bạn
                        </p>
                    </div>
                    {friends.length > 9 && (
                        <Link
                            to="/friends"
                            className="text-primary text-decoration-none fw-medium"
                            style={{ fontSize: '0.9rem' }}
                        >
                            Xem tất cả bạn bè
                        </Link>
                    )}
                </div>
            )}

            {friends.length === 0 ? (
                <div className="text-center py-5">
                    <div className="text-muted mb-3" style={{ fontSize: '3rem' }}>👥</div>
                    <h4>Chưa có bạn bè</h4>
                    <p className="text-muted" style={{ fontSize: '1.1rem' }}>
                        Hãy tìm kiếm và kết bạn với những người bạn quen biết
                    </p>
                </div>
            ) : (
                <div className="row g-3">
                    {displayedFriends.map((friend) => (
                        <div key={friend.id} className="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-6">
                            <FriendCard friend={friend} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FriendsList;
