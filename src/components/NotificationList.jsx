import { useState, useEffect } from 'react';
import NotificationItem from './NotificationItem';
import Loading from './Loading';
import { useNotifications } from '../contexts/NotificationContext';

const NotificationList = ({
    showUnreadOnly = false,
    maxItems = 20,
    className = '',
    showHeader = true
}) => {
    const [filteredNotifications, setFilteredNotifications] = useState([]);
    const [error, setError] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    const {
        notifications,
        loading,
        fetchNotifications,
        markAllAsRead
    } = useNotifications();

    // Filter and limit notifications
    useEffect(() => {
        let filtered = notifications;

        if (showUnreadOnly) {
            filtered = notifications.filter(n => !n.isRead);
        }

        if (maxItems) {
            filtered = filtered.slice(0, maxItems);
        }

        setFilteredNotifications(filtered);
    }, [notifications, showUnreadOnly, maxItems]);

    // Handle refresh
    const handleRefresh = async () => {
        try {
            setRefreshing(true);
            setError(null);
            await fetchNotifications();
        } catch (error) {
            console.error('Error refreshing notifications:', error);
            setError('Không thể tải thông báo. Vui lòng thử lại.');
        } finally {
            setRefreshing(false);
        }
    };

    // Handle mark all as read
    const handleMarkAllAsRead = async () => {
        try {
            setRefreshing(true);
            await markAllAsRead();
        } catch (error) {
            console.error('Error marking all as read:', error);
            setError('Không thể đánh dấu tất cả là đã đọc.');
        } finally {
            setRefreshing(false);
        }
    };

    if (loading) {
        return (
            <div className={`text-center p-4 ${className}`}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Đang tải thông báo...</span>
                </div>
                <div className="mt-2 small text-muted">Đang tải thông báo...</div>
            </div>
        );
    }

    return (
        <div className={`bg-white rounded ${className}`}>
            {showHeader && (
                <div className="px-3 py-2 border-bottom">
                    <div className="d-flex justify-content-between align-items-center">
                        <h6 className="mb-0 fw-semibold">
                            {showUnreadOnly ? 'Thông báo chưa đọc' : 'Thông báo'}
                            {filteredNotifications.length > 0 && (
                                <small className="text-muted ms-2">
                                    ({filteredNotifications.length})
                                </small>
                            )}
                        </h6>

                        <div className="d-flex gap-2">
                            <button
                                onClick={handleRefresh}
                                disabled={refreshing}
                                className="btn btn-link btn-sm text-primary p-0"
                                style={{ textDecoration: 'none' }}
                            >
                                {refreshing ? 'Đang tải...' : 'Làm mới'}
                            </button>

                            {!showUnreadOnly && filteredNotifications.some(n => !n.isRead) && (
                                <button
                                    onClick={handleMarkAllAsRead}
                                    disabled={refreshing}
                                    className="btn btn-link btn-sm text-success p-0"
                                    style={{ textDecoration: 'none' }}
                                >
                                    Đánh dấu tất cả đã đọc
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {error && (
                <div className="alert alert-danger border-0 border-start border-danger border-4 rounded-0 m-3">
                    <p className="mb-2 small">{error}</p>
                    <button
                        onClick={handleRefresh}
                        className="btn btn-link btn-sm text-danger p-0"
                        style={{ textDecoration: 'none' }}
                    >
                        Thử lại
                    </button>
                </div>
            )}

            <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
                {filteredNotifications.length === 0 ? (
                    <div className="text-center py-5">
                        <div className="text-muted" style={{ fontSize: '2rem' }}>🔔</div>
                        <h6 className="mt-2 mb-1">
                            {showUnreadOnly ? 'Không có thông báo chưa đọc' : 'Không có thông báo'}
                        </h6>
                        <small className="text-muted">
                            {showUnreadOnly
                                ? 'Tất cả thông báo đã được đọc'
                                : 'Bạn sẽ nhận được thông báo ở đây'
                            }
                        </small>
                    </div>
                ) : (
                    filteredNotifications.map((notification) => (
                        <NotificationItem
                            key={notification.id}
                            notification={notification}
                        />
                    ))
                )}
            </div>

            {maxItems && filteredNotifications.length === maxItems && (
                <div className="border-top text-center p-3">
                    <a
                        href="/notifications"
                        className="text-primary text-decoration-none small fw-medium"
                    >
                        Xem tất cả thông báo
                    </a>
                </div>
            )}
        </div>
    );
};

export default NotificationList;
