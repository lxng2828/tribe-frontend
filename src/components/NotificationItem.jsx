import { useState } from 'react';
import notificationService from '../services/notificationService';
import { useNotifications } from '../contexts/NotificationContext';

const NotificationItem = ({
    notification,
    showActions = true
}) => {
    const [isMarking, setIsMarking] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const { markAsRead, removeNotification } = useNotifications();

    const handleMarkAsRead = async () => {
        if (notification.isRead || isMarking) return;

        try {
            setIsMarking(true);
            await markAsRead(notification.id);
        } catch (error) {
            console.error('Error marking notification as read:', error);
        } finally {
            setIsMarking(false);
        }
    };

    const handleDelete = async () => {
        if (isDeleting) return;

        try {
            setIsDeleting(true);
            await notificationService.deleteNotification(notification.id);
            removeNotification(notification.id);
        } catch (error) {
            console.error('Error deleting notification:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    const formatTime = notificationService.formatNotificationTime(notification.createdAt);
    const icon = notificationService.getNotificationIcon(notification.type);
    const colorClass = notificationService.getNotificationColor(notification.type);

    return (
        <div
            className={`p-3 border-bottom ${!notification.isRead ? 'bg-light border-start border-primary border-3' : ''}`}
            style={{
                cursor: 'pointer',
                transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--bs-gray-100)'}
            onMouseLeave={(e) => e.target.style.backgroundColor = !notification.isRead ? 'var(--bs-light)' : 'transparent'}
        >
            <div className="d-flex align-items-start">
                {/* Icon */}
                <div
                    className="flex-shrink-0 rounded-circle bg-light d-flex align-items-center justify-content-center me-3"
                    style={{ width: '40px', height: '40px' }}
                >
                    <span style={{ fontSize: '1.2rem' }}>{icon}</span>
                </div>

                {/* Content */}
                <div className="flex-grow-1">
                    <div className="d-flex align-items-center justify-content-between">
                        <h6 className={`mb-1 small ${!notification.isRead ? 'fw-semibold' : 'fw-normal text-muted'}`}>
                            {notification.title}
                        </h6>

                        {!notification.isRead && (
                            <div
                                className="bg-primary rounded-circle flex-shrink-0 ms-2"
                                style={{ width: '8px', height: '8px' }}
                            ></div>
                        )}
                    </div>

                    <p className={`small mb-2 ${!notification.isRead ? 'text-dark' : 'text-muted'}`}>
                        {notification.content}
                    </p>

                    <div className="d-flex align-items-center justify-content-between">
                        <small className="text-muted">
                            {formatTime}
                        </small>

                        {showActions && (
                            <div className="d-flex gap-2">
                                {!notification.isRead && (
                                    <button
                                        onClick={handleMarkAsRead}
                                        disabled={isMarking}
                                        className="btn btn-link btn-sm text-primary p-0"
                                        style={{
                                            textDecoration: 'none',
                                            fontSize: '0.75rem'
                                        }}
                                    >
                                        {isMarking ? 'Đang đánh dấu...' : 'Đánh dấu đã đọc'}
                                    </button>
                                )}

                                <button
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                    className="btn btn-link btn-sm text-danger p-0"
                                    style={{
                                        textDecoration: 'none',
                                        fontSize: '0.75rem'
                                    }}
                                >
                                    {isDeleting ? 'Đang xóa...' : 'Xóa'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotificationItem;
