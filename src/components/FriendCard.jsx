import { useNavigate } from 'react-router-dom';
import { getFullUrl, DEFAULT_AVATAR } from '../utils/placeholderImages';

const FriendCard = ({ friend }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/profile/${friend.id}`);
    };

    return (
        <div
            className="friend-card d-flex flex-column align-items-center p-3 rounded cursor-pointer"
            onClick={handleClick}
            style={{
                backgroundColor: 'var(--fb-card-bg)',
                border: '1px solid var(--fb-border)',
                transition: 'all 0.2s ease',
                cursor: 'pointer',
                minHeight: '120px'
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
            }}
        >
            <img
                src={getFullUrl(friend.avatarUrl) || DEFAULT_AVATAR}
                alt={friend.displayName || 'Bạn bè'}
                className="rounded-circle mb-2"
                style={{
                    width: '60px',
                    height: '60px',
                    objectFit: 'cover'
                }}
            />
            <div
                className="text-center fw-medium small"
                style={{
                    color: 'var(--fb-text)',
                    wordBreak: 'break-word',
                    lineHeight: '1.2'
                }}
            >
                {friend.displayName || 'Người dùng'}
            </div>
        </div>
    );
};

export default FriendCard;
