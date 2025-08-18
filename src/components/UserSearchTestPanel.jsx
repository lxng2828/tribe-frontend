import { useState } from 'react';
import userService from '../services/userService';
import { toast } from 'react-toastify';
import { DEFAULT_AVATAR, getAvatarUrl, generatePlaceholderAvatar } from '../utils/placeholderImages';

const UserSearchTestPanel = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            toast.error('Vui lòng nhập từ khóa tìm kiếm');
            return;
        }

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

    const testQueries = [
        'admin@example.com',
        'user@test.com',
        'john.doe@gmail.com',
        'test',
        'admin'
    ];

    const handleTestQuery = (query) => {
        setSearchQuery(query);
    };

    return (
        <div className="card shadow">
            <div className="card-body">
                <h5 className="card-title mb-3">
                    🔍 Test User Search Panel
                </h5>

                {/* Search Input */}
                <div className="mb-3">
                    <label className="form-label small fw-medium">
                        Từ khóa tìm kiếm
                    </label>
                    <div className="input-group">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="form-control"
                            placeholder="Nhập email hoặc tên người dùng..."
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        />
                        <button
                            onClick={handleSearch}
                            disabled={loading}
                            className="btn btn-primary"
                        >
                            {loading ? 'Đang tìm...' : 'Tìm kiếm'}
                        </button>
                    </div>
                </div>

                {/* Test Queries */}
                <div className="mb-3">
                    <small className="form-text text-muted mb-2 d-block">
                        Hoặc thử các từ khóa mẫu:
                    </small>
                    <div className="d-flex flex-wrap gap-1">
                        {testQueries.map((query) => (
                            <button
                                key={query}
                                onClick={() => handleTestQuery(query)}
                                className="btn btn-outline-secondary btn-sm"
                            >
                                {query}
                            </button>
                        ))}
                    </div>
                </div>

                <hr />

                {/* Results */}
                <div>
                    <h6 className="mb-3">Kết quả tìm kiếm</h6>

                    {loading && (
                        <div className="text-center py-3">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Đang tìm kiếm...</span>
                            </div>
                            <div className="small text-muted mt-1">Đang tìm kiếm...</div>
                        </div>
                    )}

                    {error && (
                        <div className="alert alert-danger">
                            {error}
                        </div>
                    )}

                    {!loading && !error && searchResults.length === 0 && searchQuery && (
                        <div className="text-center py-3 text-muted">
                            Không tìm thấy kết quả nào cho "{searchQuery}"
                        </div>
                    )}

                    {!loading && searchResults.length > 0 && (
                        <div className="list-group">
                            {searchResults.map((user) => (
                                <div key={user.id} className="list-group-item">
                                    <div className="d-flex align-items-center">
                                        <img
                                            src={getAvatarUrl(user)}
                                            alt={user.displayName}
                                            className="rounded-circle me-3"
                                            style={{
                                                width: '40px',
                                                height: '40px',
                                                objectFit: 'cover'
                                            }}
                                            onError={(e) => {
                                                // Fallback khi image load lỗi
                                                console.log('Image load error for user:', user.displayName);
                                                e.target.src = generatePlaceholderAvatar(40, user.displayName);
                                            }}
                                        />
                                        <div className="flex-grow-1">
                                            <div className="fw-medium">
                                                {user.displayName}
                                            </div>
                                            <small className="text-muted">
                                                {user.email}
                                            </small>
                                        </div>
                                        <small className="text-muted">
                                            ID: {user.id}
                                        </small>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Instructions */}
                <div className="alert alert-info mt-3 mb-0">
                    <h6 className="alert-heading small">Hướng dẫn test:</h6>
                    <ul className="mb-0 small">
                        <li>Nhập email để tìm kiếm chính xác</li>
                        <li>Thử các từ khóa mẫu ở trên</li>
                        <li>Kết quả sẽ hiển thị thông tin user tìm được</li>
                        <li>API endpoint: GET /api/users/search?email=...</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default UserSearchTestPanel;
