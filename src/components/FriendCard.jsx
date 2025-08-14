import { useNavigate } from 'react-router-dom';
import { getFullUrl, DEFAULT_AVATAR, getAvatarUrl } from '../utils/placeholderImages';

const FriendCard = ({ friend }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/profile/${friend.id}`);
    };

    return (
        <div
            className="friend-card d-flex flex-column align-items-center p-3 rounded cursor-pointer h-100"
            onClick={handleClick}
            style={{
                backgroundColor: 'white',
                border: '1px solid #e4e6ea',
                transition: 'all 0.2s ease',
                cursor: 'pointer',
                borderRadius: '12px',
                minHeight: '140px'
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
