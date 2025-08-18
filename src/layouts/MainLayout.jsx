import Navbar from '../components/Navbar';
import { generatePlaceholderAvatar, getAvatarUrl } from '../utils/placeholderImages';
import { Link, useLocation } from 'react-router-dom';
import { useFriends } from '../contexts/FriendsContext';

const MainLayout = ({ children }) => {
    const location = useLocation();
    const { friends, loading, error, loadFriends } = useFriends();

    const getInitials = (name) => {
        if (!name) return 'U';
        return name.split(' ').map(word => word.charAt(0)).join('').toUpperCase().slice(0, 2);
    };

    return (
        <div className="min-vh-100" style={{ backgroundColor: 'var(--fb-background)' }}>
            {/* Navigation */}
            <Navbar />

            {/* Main Content với layout giống Facebook */}
            <div className="container-fluid">
                <div className="row">
                    {/* Left Sidebar */}
                    <div className="col-xl-3 col-lg-3 d-none d-lg-block">
                        <div className="sidebar-fb position-sticky" style={{ top: '70px' }}>
                            <div className="p-3">
                                <Link
                                    to="/"
                                    className={`sidebar-item-fb ${location.pathname === '/' ? 'active' : ''}`}
                                >
                                    <svg className="me-3" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M9.464 1.286C10.294.803 11.092.5 12 .5c.908 0 1.706.303 2.536.786.795.462 1.697 1.14 2.815 1.977l2.232 1.675c1.391 1.042 2.359 1.766 2.888 2.826.53 1.059.529 2.268.529 4.178V17.25c0 .966-.784 1.75-1.75 1.75H4.75A1.75 1.75 0 0 1 3 17.25v-5.312c0-1.91-.001-3.119.529-4.178.53-1.06 1.497-1.784 2.888-2.826L8.649 3.249c1.118-.837 2.02-1.515 2.815-1.977z" />
                                    </svg>
                                    Bảng tin
                                </Link>
                                <Link
                                    to="/friends"
                                    className={`sidebar-item-fb ${location.pathname === '/friends' ? 'active' : ''}`}
                                >
                                    <svg className="me-3" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 3a3 3 0 1 1 0 6 3 3 0 0 1 0-6zm0 14.2a7.2 7.2 0 0 1-6-3.22c.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08a7.2 7.2 0 0 1-6 3.22z" />
                                    </svg>
                                    Bạn bè
                                </Link>
                                <Link
                                    to="/messages"
                                    className={`sidebar-item-fb ${location.pathname === '/messages' ? 'active' : ''}`}
                                >
                                    <svg className="me-3" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.17L2.546 20.4a1 1 0 0 0 1.053 1.054l3.23-.892A9.958 9.958 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" />
                                    </svg>
                                    Tin nhắn
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Center Content */}
                    <div className="col-xl-6 col-lg-9 col-12">
                        <div className="py-3">
                            {children}
                        </div>
                    </div>

                    {/* Right Sidebar */}
                    <div className="col-xl-3 d-none d-xl-block">
                        <div className="position-sticky" style={{ top: '70px', height: 'calc(100vh - 70px)' }}>
                            <div className="p-3 h-100 d-flex flex-column">

                                {/* Contacts */}
                                <div className="flex-grow-1 d-flex flex-column">
                                    <div className="mb-3">
                                        <h6 className="mb-0" style={{ color: 'var(--fb-text-secondary)' }}>
                                            Người liên hệ
                                            {!loading && friends.length > 0 && (
                                                <span className="ms-1 text-muted small">({friends.length})</span>
                                            )}
                                        </h6>
                                    </div>

                                    {loading ? (
                                        <div className="text-center py-3">
                                            <div className="spinner-border spinner-border-sm" role="status">
                                                <span className="visually-hidden">Đang tải...</span>
                                            </div>
                                        </div>
                                    ) : error ? (
                                        <div className="text-center py-3">
                                            <div className="text-danger small">{error}</div>
                                            <button
                                                className="btn btn-sm btn-outline-primary mt-2"
                                                onClick={() => loadFriends()}
                                            >
                                                Thử lại
                                            </button>
                                        </div>
                                    ) : friends.length > 0 ? (
                                        <div className="flex-grow-1 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
                                            {friends.map((friend, index) => (
                                                <Link
                                                    key={friend.id}
                                                    to={`/profile/${friend.id}`}
                                                    className="d-flex align-items-center hover-fb p-2 rounded text-decoration-none"
                                                    style={{ color: 'inherit' }}
                                                >
                                                    <div className="position-relative">
                                                        <img
                                                            src={getAvatarUrl(friend)}
                                                            alt={friend.displayName}
                                                            className="profile-pic-sm-fb me-3"
                                                            onError={(e) => {
                                                                e.target.src = generatePlaceholderAvatar(32, getInitials(friend.displayName));
                                                            }}
                                                        />
                                                        {/* Hiển thị trạng thái online nếu có */}
                                                        {friend.isOnline && (
                                                            <div className="position-absolute bottom-0 end-0" style={{
                                                                width: '8px',
                                                                height: '8px',
                                                                backgroundColor: 'var(--fb-green)',
                                                                borderRadius: '50%',
                                                                border: '2px solid white'
                                                            }}></div>
                                                        )}
                                                    </div>
                                                    <div className="flex-grow-1">
                                                        <div className="small fw-medium">{friend.displayName}</div>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-3">
                                            <div className="text-muted small mb-2">Chưa có bạn bè nào</div>
                                            <Link
                                                to="/friends"
                                                className="btn btn-sm btn-outline-primary"
                                            >
                                                Tìm bạn bè
                                            </Link>
                                        </div>
                                    )}
                                </div>

                                {/* Link "Xem tất cả" ở cuối */}
                                {!loading && !error && friends.length > 0 && (
                                    <div className="mt-3 pt-2 border-top">
                                        <Link
                                            to="/friends"
                                            className="d-block text-primary text-decoration-none small"
                                        >
                                            Xem tất cả bạn bè
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer (minimal cho Facebook style) */}
            <footer className="text-center py-3 border-top" style={{ backgroundColor: 'var(--fb-card-bg)' }}>
                <div className="container">
                    <div className="text-muted small">
                        © 2025 Tribe · <a href="#" className="text-decoration-none">Điều khoản</a> ·
                        <a href="#" className="text-decoration-none ms-1">Bảo mật</a> ·
                        <a href="#" className="text-decoration-none ms-1">Hỗ trợ</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default MainLayout;
