import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import userService from '../services/userService';
import UserSearchTestPanel from '../components/UserSearchTestPanel';
import { DEFAULT_AVATAR } from '../utils/placeholderImages';

const SearchResultsPage = () => {
    const [searchParams] = useSearchParams();
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showTestPanel, setShowTestPanel] = useState(false);
    const navigate = useNavigate();

    const query = searchParams.get('q') || '';

    useEffect(() => {
        if (query) {
            performSearch(query);
        }
    }, [query]);

    const performSearch = async (searchQuery) => {
        try {
            setLoading(true);
            setError(null);

            const results = await userService.searchUsers(searchQuery);
            const formattedResults = results.map(user => userService.formatUserInfo(user));
            setSearchResults(formattedResults);
        } catch (error) {
            console.error('Search error:', error);
            setError('Lỗi khi tìm kiếm người dùng');
            setSearchResults([]);
        } finally {
            setLoading(false);
        }
    };

    const handleUserClick = (user) => {
        navigate(`/profile/${user.id}`);
    };

    const handleBackToHome = () => {
        navigate('/');
    };

    return (
        <div className="bg-light min-vh-100 py-4">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        {/* Header */}
                        <div className="d-flex align-items-center justify-content-between mb-4">
                            <div className="d-flex align-items-center">
                                <button
                                    onClick={handleBackToHome}
                                    className="btn btn-outline-secondary me-3"
                                    aria-label="Quay về trang chủ"
                                >
                                    <svg width="16" height="16" fill="currentColor">
                                        <path d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z" />
                                    </svg>
                                </button>
                                <div>
                                    <h1 className="h4 mb-1">Kết quả tìm kiếm</h1>
                                    <p className="text-muted mb-0">
                                        {query ? `Tìm kiếm cho "${query}"` : 'Nhập từ khóa để tìm kiếm'}
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={() => setShowTestPanel(!showTestPanel)}
                                className="btn btn-outline-primary"
                            >
                                {showTestPanel ? 'Ẩn' : 'Hiện'} Test Panel
                            </button>
                        </div>

                        {/* Test Panel */}
                        {showTestPanel && (
                            <div className="mb-4">
                                <UserSearchTestPanel />
                            </div>
                        )}

                        {/* Search Results */}
                        <div className="card shadow-sm">
                            <div className="card-body">
                                {loading && (
                                    <div className="text-center py-4">
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Đang tìm kiếm...</span>
                                        </div>
                                        <div className="mt-2 text-muted">Đang tìm kiếm...</div>
                                    </div>
                                )}

                                {error && (
                                    <div className="alert alert-danger text-center">
                                        <div className="mb-2">⚠️</div>
                                        <div>{error}</div>
                                        <button
                                            onClick={() => performSearch(query)}
                                            className="btn btn-outline-danger btn-sm mt-2"
                                        >
                                            Thử lại
                                        </button>
                                    </div>
                                )}

                                {!loading && !error && (
                                    <>
                                        {!query ? (
                                            <div className="text-center py-4">
                                                <div className="text-muted mb-2" style={{ fontSize: '2rem' }}>🔍</div>
                                                <h5>Tìm kiếm người dùng</h5>
                                                <p className="text-muted">
                                                    Sử dụng thanh tìm kiếm để tìm kiếm người dùng theo email
                                                </p>
                                            </div>
                                        ) : searchResults.length === 0 ? (
                                            <div className="text-center py-4">
                                                <div className="text-muted mb-2" style={{ fontSize: '2rem' }}>😔</div>
                                                <h5>Không tìm thấy kết quả</h5>
                                                <p className="text-muted">
                                                    Không tìm thấy người dùng nào phù hợp với "{query}"
                                                </p>
                                                <button
                                                    onClick={handleBackToHome}
                                                    className="btn btn-primary"
                                                >
                                                    Quay về trang chủ
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="d-flex align-items-center justify-content-between mb-3">
                                                    <h6 className="mb-0">
                                                        Tìm thấy {searchResults.length} kết quả
                                                    </h6>
                                                    <small className="text-muted">
                                                        Tìm kiếm cho "{query}"
                                                    </small>
                                                </div>

                                                <div className="list-group list-group-flush">
                                                    {searchResults.map((user) => (
                                                        <button
                                                            key={user.id}
                                                            onClick={() => handleUserClick(user)}
                                                            className="list-group-item list-group-item-action d-flex align-items-center p-3 border-0"
                                                            style={{
                                                                cursor: 'pointer',
                                                                transition: 'background-color 0.2s'
                                                            }}
                                                        >
                                                            <img
                                                                src={user.avatar || DEFAULT_AVATAR}
                                                                alt={user.displayName}
                                                                className="rounded-circle me-3"
                                                                style={{
                                                                    width: '50px',
                                                                    height: '50px',
                                                                    objectFit: 'cover'
                                                                }}
                                                            />
                                                            <div className="flex-grow-1 text-start">
                                                                <div className="fw-medium text-dark mb-1">
                                                                    {user.displayName}
                                                                </div>
                                                                <div className="small text-muted">
                                                                    {user.email}
                                                                </div>
                                                                {user.phoneNumber && (
                                                                    <div className="small text-muted">
                                                                        📞 {user.phoneNumber}
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <svg width="16" height="16" fill="currentColor" className="text-muted">
                                                                <path d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z" />
                                                            </svg>
                                                        </button>
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Tips */}
                        <div className="alert alert-info mt-4">
                            <h6 className="alert-heading">💡 Mẹo tìm kiếm</h6>
                            <ul className="mb-0 ps-3">
                                <li>Sử dụng email để tìm kiếm chính xác</li>
                                <li>Nhập ít nhất 2 ký tự để bắt đầu tìm kiếm</li>
                                <li>Kết quả sẽ hiển thị ngay khi bạn gõ</li>
                                <li>Click vào người dùng để xem hồ sơ</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchResultsPage;
