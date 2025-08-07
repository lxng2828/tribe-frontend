import { createContext, useContext, useEffect, useState } from 'react';
import notificationService from '../services/notificationService';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    // Fetch notifications
    const fetchNotifications = async () => {
        if (!user?.id) return;

        try {
            setLoading(true);
            const response = await notificationService.getUserNotifications(user.id);
            setNotifications(response.data || []);

            // Calculate unread count
            const unread = (response.data || []).filter(n => !n.isRead).length;
            setUnreadCount(unread);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    // Mark notification as read
    const markAsRead = async (notificationId) => {
        try {
            await notificationService.markAsRead(notificationId);

            setNotifications(prev =>
                prev.map(notification =>
                    notification.id === notificationId
                        ? { ...notification, isRead: true }
                        : notification
                )
            );

            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    // Mark all as read
    const markAllAsRead = async () => {
        try {
            await notificationService.markAllAsRead(user.id);

            setNotifications(prev =>
                prev.map(notification => ({ ...notification, isRead: true }))
            );

            setUnreadCount(0);
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    // Add new notification
    const addNotification = (notification) => {
        setNotifications(prev => [notification, ...prev]);
        if (!notification.isRead) {
            setUnreadCount(prev => prev + 1);
        }
    };

    // Remove notification
    const removeNotification = (notificationId) => {
        const notification = notifications.find(n => n.id === notificationId);
        if (notification && !notification.isRead) {
            setUnreadCount(prev => Math.max(0, prev - 1));
        }

        setNotifications(prev =>
            prev.filter(notification => notification.id !== notificationId)
        );
    };

    // Create notification
    const createNotification = async (notificationData) => {
        try {
            const response = await notificationService.createNotification(notificationData);
            if (response.status.success) {
                addNotification(response.data);
            }
            return response;
        } catch (error) {
            console.error('Error creating notification:', error);
            throw error;
        }
    };

    // Show browser notification (if permission granted)
    const showBrowserNotification = (title, content, options = {}) => {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(title, {
                body: content,
                icon: '/favicon.ico',
                badge: '/favicon.ico',
                ...options
            });
        }
    };

    // Request notification permission
    const requestNotificationPermission = async () => {
        if ('Notification' in window) {
            const permission = await Notification.requestPermission();
            return permission === 'granted';
        }
        return false;
    };

    // Auto refresh notifications
    useEffect(() => {
        if (user?.id) {
            fetchNotifications();

            // Refresh every 30 seconds
            const interval = setInterval(fetchNotifications, 30000);
            return () => clearInterval(interval);
        }
    }, [user?.id]);

    // Request notification permission on mount
    useEffect(() => {
        requestNotificationPermission();
    }, []);

    const value = {
        notifications,
        unreadCount,
        loading,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        addNotification,
        removeNotification,
        createNotification,
        showBrowserNotification,
        requestNotificationPermission
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};
