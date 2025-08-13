import { useState, useEffect, useRef } from 'react';
import userService from '../services/userService';
import { DEFAULT_AVATAR, getAvatarUrl } from '../utils/placeholderImages';
import { useNavigate } from 'react-router-dom';

const UserSearchDropdown = ({ searchQuery, onClose, className = '' }) => {
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    // Debounced search function
    const debouncedSearch = userService.debounce(async (query) => {
        if (!query || query.trim().length < 2) {
            setSearchResults([]);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const results = await userService.searchUsers(query);
            const formattedResults = results.map(user => userService.formatUserInfo(user));
            setSearchResults(formattedResults);
        } catch (error) {
            console.error('Search error:', error);
            setError('Lỗi khi tìm kiếm người dùng');
            setSearchResults([]);
        } finally {
            setLoading(false);
        }
    }, 300);

    // Effect để thực hiện tìm kiếm khi searchQuery thay đổi
    useEffect(() => {
        if (searchQuery !== null) {
            setLoading(true);
            debouncedSearch(searchQuery);
        }
    }, [searchQuery]);

    // Xử lý click vào kết quả
    const handleUserClick = (user) => {
        navigate(`/profile/${user.id}`);
        onClose();
    };

    // Xử lý click outside để đóng dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    // Không hiển thị nếu không có search query
    if (!searchQuery || searchQuery.length < 2) {
        return null;
    }

    return (
        <div
            ref={dropdownRef}
            className={`dropdown-menu show position-absolute ${className}`}
            style={{
                top: '100%',
                left: '0',
                right: '0',
                border: '1px solid var(--fb-border)',
                borderRadius: '8px',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
                maxHeight: '300px',
                overflowY: 'auto',
                zIndex: 1050,
                marginTop: '4px'
            }}
        >
            {/* Header */}
            <div className="px-3 py-2 border-bottom">
                <small className="text-muted fw-medium">
                    Kết quả tìm kiếm cho "{searchQuery}"
                </small>
            </div>

            {/* Loading */}
            {loading && (
                <div className="text-center py-3">
                    <div className="spinner-border spinner-border-sm text-primary" role="status">
                        <span className="visually-hidden">Đang tìm kiếm...</span>
                    </div>
                    <div className="small text-muted mt-1">Đang tìm kiếm...</div>
                </div>
            )}

            {/* Error */}
            {error && (
                <div className="px-3 py-2 text-danger small">
                    {error}
                </div>
            )}

            {/* Results */}
            {!loading && !error && (
                <>
                    {searchResults.length === 0 ? (
                        <div className="px-3 py-3 text-center">
                            <div className="text-muted mb-1">🔍</div>
                            <small className="text-muted">
                                Không tìm thấy người dùng nào
                            </small>
                        </div>
                    ) : (
                        <>
                            {searchResults.map((user) => (
                                <button
                                    key={user.id}
                                    onClick={() => handleUserClick(user)}
                                    className="dropdown-item d-flex align-items-center p-3 border-0"
                                    style={{
                                        cursor: 'pointer',
                                        transition: 'background-color 0.2s'
                                    }}
                                >
                                    <img
                                        src={getAvatarUrl(user)}
                                        alt={user.displayName}
                                        className="rounded-circle me-3"
                                        style={{
                                            width: '40px',
                                            height: '40px',
                                            objectFit: 'cover'
                                        }}
                                    />
                                    <div className="flex-grow-1 text-start">
                                        <div className="fw-medium text-dark">
                                            {user.displayName}
                                        </div>
                                        <small className="text-muted">
                                            {user.email}
                                        </small>
                                    </div>
                                    <svg width="16" height="16" fill="currentColor" className="text-muted">
                                        <path d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z" />
                                    </svg>
                                </button>
                            ))}

                            {/* View all results */}
                            {searchResults.length >= 5 && (
                                <div className="border-top">
                                    <button
                                        onClick={() => {
                                            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
                                            onClose();
                                        }}
                                        className="dropdown-item text-center py-2 small text-primary fw-medium"
                                    >
                                        Xem tất cả kết quả
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default UserSearchDropdown;
