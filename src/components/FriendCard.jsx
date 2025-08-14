import { useNavigate } from 'react-router-dom';
import { getFullUrl, DEFAULT_AVATAR, getAvatarUrl } from '../utils/placeholderImages';

const FriendCard = ({ friend }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/profile/${friend.id}`);
    };

    return (
        <div
            className="friend-card d-flex flex-column align-items-center p-4 rounded cursor-pointer"
            onClick={handleClick}
            style={{
                backgroundColor: 'var(--fb-card-bg)',
                border: '1px solid var(--fb-border)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                minHeight: '180px',
                borderRadius: '16px'
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
            }}
        >
            <img
                src={getAvatarUrl(friend)}
                alt={friend.displayName || 'Bạn bè'}
                className="rounded-circle mb-3"
                style={{
                    width: '100px',
                    height: '100px',
                    objectFit: 'cover',
                    border: '3px solid #e7f3ff'
                }}
            />
            <div
                className="text-center fw-semibold"
                style={{
                    color: 'var(--fb-text)',
                    wordBreak: 'break-word',
                    lineHeight: '1.3',
                    fontSize: '1.1rem'
                }}
            >
                {friend.displayName || 'Người dùng'}
            </div>
        </div>
    );
};

export default FriendCard;
