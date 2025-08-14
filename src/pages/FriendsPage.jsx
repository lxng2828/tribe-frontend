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
        <div className="bg-light min-vh-100 py-5">
            <div className="container-fluid px-4">
                <div className="row justify-content-center">
                    <div className="col-xl-10 col-lg-11">
                        {/* Header */}
                        <div className="d-flex align-items-center justify-content-between mb-5">
                            <h1 className="mb-0 fw-bold" style={{ fontSize: '2.5rem', color: '#1877f2' }}>Bạn bè</h1>
                        </div>

                        {/* Navigation Tabs */}
                        <div className="card border-0 shadow-lg" style={{ borderRadius: '16px' }}>
                            <div className="card-header bg-white border-bottom-0" style={{ borderRadius: '16px 16px 0 0', padding: '1.5rem 2rem' }}>
                                <ul className="nav nav-tabs card-header-tabs">
                                    <li className="nav-item">
                                        <button
                                            className={`nav-link ${activeTab === 'friends' ? 'active' : ''}`}
                                            onClick={() => setActiveTab('friends')}
                                            style={{ 
                                                fontSize: '1.1rem', 
                                                padding: '0.75rem 1.5rem',
                                                border: 'none',
                                                borderRadius: '12px',
                                                marginRight: '0.5rem'
                                            }}
                                        >
                                            <svg width="20" height="20" fill="currentColor" className="me-3" viewBox="0 0 16 16">
                                                <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1h8zm-7.978-1A.261.261 0 0 1 7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002a.274.274 0 0 1-.014.002H7.022zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM6.936 9.28a5.88 5.88 0 0 0-1.23-.247A7.35 7.35 0 0 0 5 9c-4 0-5 3-5 4 0 .667.333 1 1 1h4.216A2.238 2.238 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816zM4.92 10A5.493 5.493 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275zM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0zm3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
                                            </svg>
                                            Tất cả bạn bè
                                        </button>
                                    </li>
                                    <li className="nav-item">
                                        <button
                                            className={`nav-link ${activeTab === 'requests' ? 'active' : ''}`}
                                            onClick={() => setActiveTab('requests')}
                                            style={{ 
                                                fontSize: '1.1rem', 
                                                padding: '0.75rem 1.5rem',
                                                border: 'none',
                                                borderRadius: '12px'
                                            }}
                                        >
                                            <svg width="20" height="20" fill="currentColor" className="me-3" viewBox="0 0 16 16">
                                                <path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-5 6s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zM11 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5zm.5 2.5a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1h-4zm2 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1h-2z" />
                                            </svg>
                                            Lời mời kết bạn
                                        </button>
                                    </li>
                                </ul>
                            </div>

                            <div className="card-body" style={{ padding: '2rem' }}>
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
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FriendsPage;
