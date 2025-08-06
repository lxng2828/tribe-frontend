import Navbar from '../components/Navbar';

const MainLayout = ({ children }) => {
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
                                <a href="#" className="sidebar-item-fb active">
                                    <svg className="me-3" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M9.464 1.286C10.294.803 11.092.5 12 .5c.908 0 1.706.303 2.536.786.795.462 1.697 1.14 2.815 1.977l2.232 1.675c1.391 1.042 2.359 1.766 2.888 2.826.53 1.059.529 2.268.529 4.178V17.25c0 .966-.784 1.75-1.75 1.75H4.75A1.75 1.75 0 0 1 3 17.25v-5.312c0-1.91-.001-3.119.529-4.178.53-1.06 1.497-1.784 2.888-2.826L8.649 3.249c1.118-.837 2.02-1.515 2.815-1.977z" />
                                    </svg>
                                    Bảng tin
                                </a>
                                <a href="#" className="sidebar-item-fb">
                                    <svg className="me-3" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 3a3 3 0 1 1 0 6 3 3 0 0 1 0-6zm0 14.2a7.2 7.2 0 0 1-6-3.22c.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08a7.2 7.2 0 0 1-6 3.22z" />
                                    </svg>
                                    Bạn bè
                                </a>
                                <a href="#" className="sidebar-item-fb">
                                    <svg className="me-3" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.17L2.546 20.4a1 1 0 0 0 1.053 1.054l3.23-.892A9.958 9.958 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" />
                                    </svg>
                                    Tin nhắn
                                </a>
                                <a href="#" className="sidebar-item-fb">
                                    <svg className="me-3" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M9 2a1 1 0 0 0 0 2h6a1 1 0 1 0 0-2H9zM6.5 6a.5.5 0 0 0-.5.5v13a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 .5-.5v-13a.5.5 0 0 0-.5-.5h-11z" />
                                    </svg>
                                    Trang
                                </a>
                                <a href="#" className="sidebar-item-fb">
                                    <svg className="me-3" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                    </svg>
                                    Yêu thích
                                </a>
                                <a href="#" className="sidebar-item-fb">
                                    <svg className="me-3" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M9 11H7v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-9h-2m-6 0V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v5m-6 0h6m-9 0h12" />
                                    </svg>
                                    Marketplace
                                </a>
                                <hr style={{ color: 'var(--fb-border)' }} />
                                <div className="text-muted small mb-2 px-3">Lối tắt của bạn</div>
                                <a href="#" className="sidebar-item-fb">
                                    <div className="me-3" style={{
                                        width: '28px',
                                        height: '28px',
                                        backgroundColor: 'var(--fb-blue)',
                                        borderRadius: '6px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <span className="text-white fw-bold small">A</span>
                                    </div>
                                    Anime Lovers
                                </a>
                                <a href="#" className="sidebar-item-fb">
                                    <div className="me-3" style={{
                                        width: '28px',
                                        height: '28px',
                                        backgroundColor: 'var(--fb-green)',
                                        borderRadius: '6px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <span className="text-white fw-bold small">T</span>
                                    </div>
                                    Tech Group
                                </a>
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
                        <div className="position-sticky" style={{ top: '70px' }}>
                            <div className="p-3">
                                {/* Sponsored */}
                                <div className="mb-4">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <h6 className="mb-0" style={{ color: 'var(--fb-text-secondary)' }}>Được tài trợ</h6>
                                    </div>
                                    <div className="card-fb p-3">
                                        <div className="d-flex align-items-center">
                                            <img
                                                src="https://via.placeholder.com/80x80"
                                                alt="Ad"
                                                className="rounded me-3"
                                                style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                                            />
                                            <div>
                                                <div className="fw-bold small">Quảng cáo mẫu</div>
                                                <div className="text-muted small">example.com</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Contacts */}
                                <div>
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <h6 className="mb-0" style={{ color: 'var(--fb-text-secondary)' }}>Người liên hệ</h6>
                                        <button className="btn btn-sm" style={{ backgroundColor: 'transparent', border: 'none' }}>
                                            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 4a1 1 0 0 1 1 1v6h6a1 1 0 1 1 0 2h-6v6a1 1 0 1 1-2 0v-6H5a1 1 0 1 1 0-2h6V5a1 1 0 0 1 1-1z" />
                                            </svg>
                                        </button>
                                    </div>
                                    <div className="d-flex align-items-center hover-fb p-2 rounded">
                                        <div className="position-relative">
                                            <img
                                                src="https://via.placeholder.com/32"
                                                alt="Friend"
                                                className="profile-pic-sm-fb me-3"
                                            />
                                            <div className="position-absolute bottom-0 end-0" style={{
                                                width: '8px',
                                                height: '8px',
                                                backgroundColor: 'var(--fb-green)',
                                                borderRadius: '50%',
                                                border: '2px solid white'
                                            }}></div>
                                        </div>
                                        <div className="flex-grow-1">
                                            <div className="small fw-medium">Nguyễn Văn A</div>
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-center hover-fb p-2 rounded">
                                        <div className="position-relative">
                                            <img
                                                src="https://via.placeholder.com/32"
                                                alt="Friend"
                                                className="profile-pic-sm-fb me-3"
                                            />
                                            <div className="position-absolute bottom-0 end-0" style={{
                                                width: '8px',
                                                height: '8px',
                                                backgroundColor: 'var(--fb-green)',
                                                borderRadius: '50%',
                                                border: '2px solid white'
                                            }}></div>
                                        </div>
                                        <div className="flex-grow-1">
                                            <div className="small fw-medium">Trần Thị B</div>
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-center hover-fb p-2 rounded">
                                        <div className="position-relative">
                                            <img
                                                src="https://via.placeholder.com/32"
                                                alt="Friend"
                                                className="profile-pic-sm-fb me-3"
                                            />
                                        </div>
                                        <div className="flex-grow-1">
                                            <div className="small fw-medium">Lê Văn C</div>
                                        </div>
                                    </div>
                                </div>
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
