import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import FriendsList from '../components/FriendsList';
import FriendRequests from '../components/FriendRequests';
import Loading from '../components/Loading';

const FriendsPage = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('friends');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate loading time
        const timer = setTimeout(() => {
            setLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return <Loading />;
    }

    if (!user) {
        return (
            <div className="container mt-5">
                <div className="alert alert-warning text-center">
                    <h5>Vui lòng đăng nhập để xem danh sách bạn bè</h5>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-light min-vh-100 py-4">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        {/* Header */}
                        <div className="d-flex align-items-center justify-content-between mb-4">
                            <h2 className="mb-0 fw-bold">Bạn bè</h2>
                            <div className="d-flex gap-2">
                                <button
                                    onClick={() => window.history.back()}
                                    className="btn btn-outline-secondary"
                                >
                                    ← Quay lại
                                </button>
                            </div>
                        </div>

                        {/* Navigation Tabs */}
                        <div className="card border-0 shadow-sm">
                            <div className="card-header bg-white border-bottom-0">
                                <ul className="nav nav-tabs card-header-tabs">
                                    <li className="nav-item">
                                        <button
                                            className={`nav-link ${activeTab === 'friends' ? 'active' : ''}`}
                                            onClick={() => setActiveTab('friends')}
                                        >
                                            <svg width="16" height="16" fill="currentColor" className="me-2" viewBox="0 0 16 16">
                                                <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1h8zm-7.978-1A.261.261 0 0 1 7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002a.274.274 0 0 1-.014.002H7.022zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM6.936 9.28a5.88 5.88 0 0 0-1.23-.247A7.35 7.35 0 0 0 5 9c-4 0-5 3-5 4 0 .667.333 1 1 1h4.216A2.238 2.238 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816zM4.92 10A5.493 5.493 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275zM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0zm3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
                                            </svg>
                                            Tất cả bạn bè
                                        </button>
                                    </li>
                                    <li className="nav-item">
                                        <button
                                            className={`nav-link ${activeTab === 'requests' ? 'active' : ''}`}
                                            onClick={() => setActiveTab('requests')}
                                        >
                                            <svg width="16" height="16" fill="currentColor" className="me-2" viewBox="0 0 16 16">
                                                <path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-5 6s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zM11 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5zm.5 2.5a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1h-4zm2 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1h-2z" />
                                            </svg>
                                            Lời mời kết bạn
                                        </button>
                                    </li>
                                    <li className="nav-item">
                                        <button
                                            className={`nav-link ${activeTab === 'suggestions' ? 'active' : ''}`}
                                            onClick={() => setActiveTab('suggestions')}
                                        >
                                            <svg width="16" height="16" fill="currentColor" className="me-2" viewBox="0 0 16 16">
                                                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                                            </svg>
                                            Gợi ý kết bạn
                                        </button>
                                    </li>
                                </ul>
                            </div>

                            <div className="card-body">
                                {/* Tab Content */}
                                {activeTab === 'friends' && (
                                    <FriendsList
                                        userId={user.id}
                                        showHeader={false}
                                    />
                                )}

                                {activeTab === 'requests' && (
                                    <FriendRequests userId={user.id} />
                                )}

                                {activeTab === 'suggestions' && (
                                    <div className="text-center py-5">
                                        <div className="text-muted mb-3" style={{ fontSize: '3rem' }}>🔍</div>
                                        <h5>Gợi ý kết bạn</h5>
                                        <p className="text-muted mb-4">
                                            Tính năng này sẽ được phát triển trong tương lai.<br />
                                            Hiện tại bạn có thể tìm kiếm bạn bè bằng email.
                                        </p>
                                        <button
                                            onClick={() => window.location.href = '/search'}
                                            className="btn btn-primary"
                                        >
                                            Tìm kiếm bạn bè
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="row mt-4">
                            <div className="col-md-6">
                                <div className="card border-0 shadow-sm h-100">
                                    <div className="card-body text-center">
                                        <div className="text-primary mb-3" style={{ fontSize: '2rem' }}>🔍</div>
                                        <h6>Tìm kiếm bạn bè</h6>
                                        <p className="text-muted small mb-3">
                                            Tìm kiếm người dùng theo email để gửi lời mời kết bạn
                                        </p>
                                        <button
                                            onClick={() => window.location.href = '/search'}
                                            className="btn btn-outline-primary btn-sm"
                                        >
                                            Tìm kiếm ngay
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="card border-0 shadow-sm h-100">
                                    <div className="card-body text-center">
                                        <div className="text-success mb-3" style={{ fontSize: '2rem' }}>📱</div>
                                        <h6>Mời bạn bè qua email</h6>
                                        <p className="text-muted small mb-3">
                                            Gửi lời mời tham gia Tribe cho bạn bè qua email
                                        </p>
                                        <button
                                            className="btn btn-outline-success btn-sm"
                                            disabled
                                        >
                                            Sắp ra mắt
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FriendsPage;
