import { useNotifications } from '../contexts/NotificationContext';

const NotificationBadge = ({ className = '' }) => {
    const { unreadCount, loading } = useNotifications();

    // Không hiển thị badge nếu không có notifications chưa đọc
    if (unreadCount === 0 || loading) {
        return null;
    }

    return (
        <span className={`badge bg-danger ${className}`}>
            {unreadCount > 99 ? '99+' : unreadCount}
        </span>
    );
};

export default NotificationBadge;
