import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useFriends } from '../contexts/FriendsContext';
import { getFullUrl, DEFAULT_AVATAR, getAvatarUrl } from '../utils/placeholderImages';

const FriendCard = ({ friend, onUnfriend }) => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { unfriend } = useFriends();
    const [showUnfriendButton, setShowUnfriendButton] = useState(false);
    const [processing, setProcessing] = useState(false);

    const handleClick = () => {
        navigate(`/profile/${friend.id}`);
    };

    const handleUnfriend = async (e) => {
        e.stopPropagation(); // Ngăn không cho trigger handleClick

        const confirmed = window.confirm(`Bạn có chắc muốn hủy kết bạn với ${friend.displayName}?`);
        if (!confirmed) return;

        try {
            setProcessing(true);
            const success = await unfriend(friend.id);

            if (success) {
                // Gọi callback để cập nhật danh sách bạn bè (nếu cần)
                onUnfriend?.(friend.id);
                alert('Đã hủy kết bạn thành công');
            } else {
                alert('Không thể hủy kết bạn');
            }
        } catch (error) {
            console.error('Error unfriending:', error);
            alert('Lỗi khi hủy kết bạn');
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div
            className="friend-card d-flex flex-column align-items-center p-3 rounded cursor-pointer h-100 position-relative"
            onClick={handleClick}
            onMouseEnter={() => setShowUnfriendButton(true)}
            onMouseLeave={() => setShowUnfriendButton(false)}
            style={{
                backgroundColor: 'white',
                border: '1px solid #e4e6ea',
                transition: 'all 0.2s ease',
                cursor: 'pointer',
                borderRadius: '12px',
                minHeight: '140px'
            }}
        >
            {/* Nút hủy kết bạn - hiển thị khi hover */}
            {showUnfriendButton && user?.id !== friend.id && (
                <button
                    className="btn btn-sm btn-outline-danger position-absolute"
                    onClick={handleUnfriend}
                    disabled={processing}
                    style={{
                        top: '8px',
                        right: '8px',
                        zIndex: 10,
                        fontSize: '0.75rem',
                        padding: '2px 6px'
                    }}
                >
                    {processing ? (
                        <span className="spinner-border spinner-border-sm" style={{ width: '12px', height: '12px' }} />
                    ) : (
                        '❌'
                    )}
                </button>
            )}

            <img
                src={getAvatarUrl(friend)}
                alt={friend.displayName || 'Bạn bè'}
                className="rounded-circle mb-3"
                style={{
                    width: '80px',
                    height: '80px',
                    objectFit: 'cover',
                    border: '2px solid #f0f2f5'
                }}
            />
            <div
                className="text-center fw-medium"
                style={{
                    color: '#1c1e21',
                    wordBreak: 'break-word',
                    lineHeight: '1.2',
                    fontSize: '0.95rem'
                }}
            >
                {friend.displayName || 'Người dùng'}
            </div>
        </div>
    );
};

export default FriendCard;
