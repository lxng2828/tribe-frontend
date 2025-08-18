import { useState } from 'react';
import { useNotifications } from '../contexts/NotificationContext';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

const NotificationTestPanel = () => {
    const [testNotification, setTestNotification] = useState({
        title: '',
        content: '',
        type: 'MESSAGE'
    });
    const [isCreating, setIsCreating] = useState(false);

    const { createNotification, showBrowserNotification, requestNotificationPermission } = useNotifications();
    const { user } = useAuth();

    const notificationTypes = [
        { value: 'MESSAGE', label: 'Tin nhắn' },
        { value: 'FRIEND_REQUEST', label: 'Lời mời kết bạn' },
        { value: 'POST', label: 'Bài viết' },
        { value: 'LIKE', label: 'Thích' },
        { value: 'COMMENT', label: 'Bình luận' }
    ];

    const handleInputChange = (field, value) => {
        setTestNotification(prev => ({ ...prev, [field]: value }));
    };

    const handleCreateTestNotification = async () => {
        if (!testNotification.title || !testNotification.content) {
            toast.error('Vui lòng nhập đầy đủ tiêu đề và nội dung');
            return;
        }

        try {
            setIsCreating(true);

            const notificationData = {
                userId: user.id,
                title: testNotification.title,
                content: testNotification.content,
                type: testNotification.type
            };

            await createNotification(notificationData);

            // Also show browser notification
            showBrowserNotification(testNotification.title, testNotification.content);

            // Reset form
            setTestNotification({
                title: '',
                content: '',
                type: 'MESSAGE'
            });

            toast.success('Tạo thông báo test thành công!');
        } catch (error) {
            console.error('Error creating test notification:', error);
            toast.error('Lỗi khi tạo thông báo test');
        } finally {
            setIsCreating(false);
        }
    };

    const handleRequestPermission = async () => {
        const granted = await requestNotificationPermission();
        if (granted) {
            toast.success('Đã cấp quyền thông báo!');
        } else {
            toast.error('Không thể cấp quyền thông báo');
        }
    };

    const createSampleNotifications = async () => {
        const samples = [
            {
                title: 'Tin nhắn mới',
                content: 'Bạn có tin nhắn mới từ John Doe',
                type: 'MESSAGE'
            },
            {
                title: 'Lời mời kết bạn',
                content: 'Jane Smith đã gửi lời mời kết bạn',
                type: 'FRIEND_REQUEST'
            },
            {
                title: 'Bài viết mới',
                content: 'Mike Johnson đã đăng bài viết mới',
                type: 'POST'
            },
            {
                title: 'Thích bài viết',
                content: 'Anna đã thích bài viết của bạn',
                type: 'LIKE'
            },
            {
                title: 'Bình luận mới',
                content: 'Tom đã bình luận vào bài viết của bạn',
                type: 'COMMENT'
            }
        ];

        try {
            setIsCreating(true);

            for (const sample of samples) {
                const notificationData = {
                    userId: user.id,
                    ...sample
                };

                await createNotification(notificationData);
                // Delay between notifications
                await new Promise(resolve => setTimeout(resolve, 500));
            }

            toast.success('Đã tạo 5 thông báo mẫu!');
        } catch (error) {
            console.error('Error creating sample notifications:', error);
            toast.error('Lỗi khi tạo thông báo mẫu');
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div className="card shadow">
            <div className="card-body">
                <h5 className="card-title mb-3">
                    🧪 Test Notification Panel
                </h5>

                {/* Request Permission */}
                <div className="mb-3">
                    <button
                        onClick={handleRequestPermission}
                        className="btn btn-primary w-100"
                    >
                        Cấp quyền thông báo trình duyệt
                    </button>
                </div>

                {/* Create Sample Notifications */}
                <div className="mb-3">
                    <button
                        onClick={createSampleNotifications}
                        disabled={isCreating}
                        className="btn btn-success w-100"
                    >
                        {isCreating ? 'Đang tạo...' : 'Tạo 5 thông báo mẫu'}
                    </button>
                </div>

                <hr />

                {/* Custom Notification Form */}
                <div>
                    <div className="mb-3">
                        <label className="form-label small fw-medium">
                            Tiêu đề
                        </label>
                        <input
                            type="text"
                            value={testNotification.title}
                            onChange={(e) => handleInputChange('title', e.target.value)}
                            className="form-control"
                            placeholder="Nhập tiêu đề thông báo"
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label small fw-medium">
                            Nội dung
                        </label>
                        <textarea
                            value={testNotification.content}
                            onChange={(e) => handleInputChange('content', e.target.value)}
                            className="form-control"
                            placeholder="Nhập nội dung thông báo"
                            rows="3"
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label small fw-medium">
                            Loại thông báo
                        </label>
                        <select
                            value={testNotification.type}
                            onChange={(e) => handleInputChange('type', e.target.value)}
                            className="form-select"
                        >
                            {notificationTypes.map(type => (
                                <option key={type.value} value={type.value}>
                                    {type.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button
                        onClick={handleCreateTestNotification}
                        disabled={isCreating || !testNotification.title || !testNotification.content}
                        className="btn btn-outline-primary w-100"
                    >
                        {isCreating ? 'Đang tạo...' : 'Tạo thông báo test'}
                    </button>
                </div>

                <div className="alert alert-info mt-3 mb-0">
                    <h6 className="alert-heading small">Hướng dẫn:</h6>
                    <ul className="mb-0 small">
                        <li>Cấp quyền để nhận thông báo trình duyệt</li>
                        <li>Dùng "Tạo thông báo mẫu" để test nhanh</li>
                        <li>Hoặc tạo thông báo tùy chỉnh bên dưới</li>
                        <li>Thông báo sẽ xuất hiện trong dropdown và trang notifications</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default NotificationTestPanel;
