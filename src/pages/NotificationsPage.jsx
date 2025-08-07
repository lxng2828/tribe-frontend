import { useState } from 'react';
import NotificationList from '../components/NotificationList';
import NotificationTestPanel from '../components/NotificationTestPanel';

const NotificationsPage = () => {
    const [activeTab, setActiveTab] = useState('all'); // 'all' hoặc 'unread'
    const [showTestPanel, setShowTestPanel] = useState(false);

    const tabs = [
        { id: 'all', label: 'Tất cả', showUnreadOnly: false },
        { id: 'unread', label: 'Chưa đọc', showUnreadOnly: true }
    ];

    return (
        <div className="bg-light min-vh-100 py-4">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        {/* Page Header */}
                        <div className="mb-4">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h1 className="h3 fw-bold text-dark">Thông báo</h1>
                                    <p className="text-muted mb-0">
                                        Quản lý tất cả thông báo của bạn
                                    </p>
                                </div>

                                <button
                                    onClick={() => setShowTestPanel(!showTestPanel)}
                                    className="btn btn-outline-primary"
                                >
                                    {showTestPanel ? 'Ẩn' : 'Hiện'} Test Panel
                                </button>
                            </div>
                        </div>

                        {/* Test Panel */}
                        {showTestPanel && (
                            <div className="mb-4">
                                <NotificationTestPanel />
                            </div>
                        )}

                        {/* Tabs */}
                        <div className="mb-3">
                            <ul className="nav nav-tabs">
                                {tabs.map((tab) => (
                                    <li className="nav-item" key={tab.id}>
                                        <button
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`nav-link ${activeTab === tab.id ? 'active' : ''}`}
                                        >
                                            {tab.label}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Notification List */}
                        <div className="card shadow-sm">
                            {tabs.map((tab) => (
                                activeTab === tab.id && (
                                    <NotificationList
                                        key={tab.id}
                                        showUnreadOnly={tab.showUnreadOnly}
                                        showHeader={false}
                                        className="border-0 shadow-none"
                                    />
                                )
                            ))}
                        </div>

                        {/* Instructions */}
                        <div className="alert alert-info mt-4">
                            <h6 className="alert-heading">
                                💡 Mẹo sử dụng thông báo
                            </h6>
                            <ul className="mb-0 ps-3">
                                <li>Nhấn vào thông báo để đánh dấu là đã đọc</li>
                                <li>Sử dụng nút "Đánh dấu tất cả đã đọc" để xóa tất cả thông báo chưa đọc</li>
                                <li>Thông báo sẽ tự động làm mới mỗi 30 giây</li>
                                <li>Bạn có thể xóa từng thông báo bằng nút "Xóa"</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotificationsPage;
