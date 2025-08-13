import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getUserAvatar } from '../utils/placeholderImages';
import NotificationDropdown from './NotificationDropdown';
import SearchBar from './SearchBar';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const toggleProfileMenu = () => {
        setIsProfileMenuOpen(!isProfileMenuOpen);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-fb sticky-top">
            <div className="container-fluid px-3">
                {/* Logo và Search */}
                <div className="d-flex align-items-center">
                    <Link className="navbar-brand d-flex align-items-center me-3" to="/">
                        <div className="d-flex align-items-center justify-content-center me-2"
                            style={{
                                width: '40px',
                                height: '40px',
                                backgroundColor: 'var(--fb-blue)',
                                borderRadius: '50%'
                            }}>
                            <span className="text-white fw-bold fs-5">T</span>
                        </div>
                        <span className="fw-bold fs-4 d-none d-md-inline" style={{ color: 'var(--fb-blue)' }}>
                            Tribe
                        </span>
                    </Link>

                    {/* Search Bar */}
                    <div className="d-none d-md-block">
                        <SearchBar style={{ width: '240px' }} />
                    </div>
                </div>

                {/* Right Side Actions */}
                <div className="d-flex align-items-center">
                    {/* Mobile Menu Button */}
                    <button
                        className="btn d-lg-none me-2"
                        type="button"
                        onClick={toggleMenu}
                        style={{
                            backgroundColor: 'var(--fb-gray)',
                            borderRadius: '50%',
                            width: '40px',
                            height: '40px',
                            border: 'none'
                        }}
                    >
                        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M3 12h18m-18-6h18m-18 12h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </button>

                    {/* Notifications */}
                    <NotificationDropdown />

                    {/* Messages */}
                    <Link
                        to="/messages"
                        className="btn position-relative me-2"
                        style={{
                            backgroundColor: 'var(--fb-gray)',
                            borderRadius: '50%',
                            width: '40px',
                            height: '40px',
                            border: 'none',
                            textDecoration: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.17L2.546 20.4a1 1 0 0 0 1.053 1.054l3.23-.892A9.958 9.958 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" />
                        </svg>
                        <span className="notification-badge-fb">5</span>
                    </Link>

                    {/* Profile Dropdown */}
                    <div className="dropdown">
                        <button
                            className="btn dropdown-toggle border-0 p-0"
                            onClick={toggleProfileMenu}
                            aria-expanded={isProfileMenuOpen}
                            style={{ backgroundColor: 'transparent' }}
                        >
                            <img
                                src={getUserAvatar(user)}
                                alt={user?.displayName || user?.fullName || user?.username || 'User'}
                                className="profile-pic-fb"
                            />
                        </button>

                        {/* Dropdown Menu */}
                        <ul className={`dropdown-menu dropdown-menu-end ${isProfileMenuOpen ? 'show' : ''}`}
                            style={{
                                border: '1px solid var(--fb-border)',
                                borderRadius: '8px',
                                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
                                minWidth: '320px'
                            }}>
                            <li className="px-3 py-2">
                                <div className="d-flex align-items-center">
                                    <img
                                        src={getUserAvatar(user)}
                                        alt={user?.displayName || user?.fullName || 'User'}
                                        className="profile-pic-fb me-3"
                                    />
                                    <div>
                                        <div className="fw-bold" style={{ color: 'var(--fb-text)' }}>
                                            {user?.displayName || user?.fullName || user?.username || 'Người dùng'}
                                        </div>
                                        <div className="text-muted small">{user?.email}</div>
                                    </div>
                                </div>
                                <hr className="my-2" />
                            </li>
                            <li>
                                <Link
                                    className="dropdown-item d-flex align-items-center py-2"
                                    to="/profile"
                                    onClick={() => setIsProfileMenuOpen(false)}
                                    style={{ borderRadius: '6px', margin: '0 8px' }}
                                >
                                    <div className="me-3 d-flex align-items-center justify-content-center"
                                        style={{
                                            width: '36px',
                                            height: '36px',
                                            backgroundColor: 'var(--fb-gray)',
                                            borderRadius: '50%'
                                        }}>
                                        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 3a3 3 0 1 1 0 6 3 3 0 0 1 0-6zm0 14.2a7.2 7.2 0 0 1-6-3.22c.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08a7.2 7.2 0 0 1-6 3.22z" />
                                        </svg>
                                    </div>
                                    Xem hồ sơ của bạn
                                </Link>
                            </li>
                            <li>
                                <Link
                                    className="dropdown-item d-flex align-items-center py-2"
                                    to="/edit-profile"
                                    onClick={() => setIsProfileMenuOpen(false)}
                                    style={{ borderRadius: '6px', margin: '0 8px' }}
                                >
                                    <div className="me-3 d-flex align-items-center justify-content-center"
                                        style={{
                                            width: '36px',
                                            height: '36px',
                                            backgroundColor: 'var(--fb-gray)',
                                            borderRadius: '50%'
                                        }}>
                                        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8zm0 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm9.5-2a1.5 1.5 0 0 1 0 3l-1.061.659a8.966 8.966 0 0 1-.467 1.125l.417 1.124a1.5 1.5 0 0 1-1.375 2.092l-1.125-.417a8.966 8.966 0 0 1-1.125.467L16.105 21.5a1.5 1.5 0 0 1-3 0l-.659-1.061a8.966 8.966 0 0 1-1.125-.467l-1.124.417a1.5 1.5 0 0 1-2.092-1.375l.417-1.125a8.966 8.966 0 0 1-.467-1.125L2.5 15.105a1.5 1.5 0 0 1 0-3l1.061-.659a8.966 8.966 0 0 1 .467-1.125L3.611 9.197a1.5 1.5 0 0 1 1.375-2.092l1.125.417a8.966 8.966 0 0 1 1.125-.467L7.895 2.5a1.5 1.5 0 0 1 3 0l.659 1.061a8.966 8.966 0 0 1 1.125.467l1.124-.417a1.5 1.5 0 0 1 2.092 1.375l-.417 1.125a8.966 8.966 0 0 1 .467 1.125L21.5 8z" />
                                        </svg>
                                    </div>
                                    Thông tin cá nhân và mật khẩu
                                </Link>
                            </li>
                            <li><hr className="my-2" /></li>
                            <li>
                                <button
                                    className="dropdown-item d-flex align-items-center py-2 w-100 text-start"
                                    onClick={handleLogout}
                                    style={{ borderRadius: '6px', margin: '0 8px', border: 'none', background: 'none' }}
                                >
                                    <div className="me-3 d-flex align-items-center justify-content-center"
                                        style={{
                                            width: '36px',
                                            height: '36px',
                                            backgroundColor: 'var(--fb-gray)',
                                            borderRadius: '50%'
                                        }}>
                                        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M16 17l5-5-5-5M19.8 12H9M10 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h5" />
                                        </svg>
                                    </div>
                                    Đăng xuất
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`}>
                    <div className="d-lg-none mt-3">
                        {/* Mobile Search */}
                        <div className="px-3 mb-3">
                            <SearchBar />
                        </div>

                        <div className="border-top pt-3">
                            <Link
                                className="sidebar-item-fb"
                                to="/"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <svg className="me-3" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M9.464 1.286C10.294.803 11.092.5 12 .5c.908 0 1.706.303 2.536.786.795.462 1.697 1.14 2.815 1.977l2.232 1.675c1.391 1.042 2.359 1.766 2.888 2.826.53 1.059.529 2.268.529 4.178V17.25c0 .966-.784 1.75-1.75 1.75H4.75A1.75 1.75 0 0 1 3 17.25v-5.312c0-1.91-.001-3.119.529-4.178.53-1.06 1.497-1.784 2.888-2.826L8.649 3.249c1.118-.837 2.02-1.515 2.815-1.977zM12 2.5c-.545 0-1.033.205-1.608.55-.575.344-1.278.848-2.29 1.6L6.87 5.324c-1.265.946-2.021 1.52-2.384 2.274-.363.755-.363 1.677-.363 3.464V17.25c0 .138.112.25.25.25h14.754a.25.25 0 0 0 .25-.25v-5.938c0-1.787 0-2.709-.363-3.464-.363-.754-1.119-1.328-2.384-2.274L14.398 4.65c-1.012-.752-1.715-1.256-2.29-1.6C12.033 2.705 11.545 2.5 12 2.5z" />
                                </svg>
                                Trang chủ
                            </Link>
                            <Link
                                className="sidebar-item-fb"
                                to="/friends"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <svg className="me-3" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1h8zm-7.978-1A.261.261 0 0 1 7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002a.274.274 0 0 1-.014.002H7.022zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM6.936 9.28a5.88 5.88 0 0 0-1.23-.247A7.35 7.35 0 0 0 5 9c-4 0-5 3-5 4 0 .667.333 1 1 1h4.216A2.238 2.238 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816zM4.92 10A5.493 5.493 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275zM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0zm3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
                                </svg>
                                Bạn bè
                            </Link>
                            <Link
                                className="sidebar-item-fb"
                                to="/messages"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <svg className="me-3" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12.013 6.75c-2.903 0-5.25 2.347-5.25 5.25s2.347 5.25 5.25 5.25 5.25-2.347 5.25-5.25-2.347-5.25-5.25-5.25zm0 1.5c2.072 0 3.75 1.678 3.75 3.75s-1.678 3.75-3.75 3.75-3.75-1.678-3.75-3.75 1.678-3.75 3.75-3.75z" />
                                </svg>
                                Tin nhắn
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
