import { useState, useRef } from 'react';
import UserSearchDropdown from './UserSearchDropdown';

const SearchBar = ({ className = '' }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const inputRef = useRef(null);

    const handleInputChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);

        // Hiển thị dropdown nếu có ít nhất 2 ký tự
        if (value.trim().length >= 2) {
            setShowDropdown(true);
        } else {
            setShowDropdown(false);
        }
    };

    const handleInputFocus = () => {
        // Hiển thị dropdown nếu đã có search query
        if (searchQuery.trim().length >= 2) {
            setShowDropdown(true);
        }
    };

    const handleCloseDropdown = () => {
        setShowDropdown(false);
    };

    const handleClearSearch = () => {
        setSearchQuery('');
        setShowDropdown(false);
        inputRef.current?.focus();
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            setShowDropdown(false);
            inputRef.current?.blur();
        }
    };

    return (
        <div className={`position-relative ${className}`}>
            <div className="position-relative">
                {/* Search Icon */}
                <svg
                    className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                >
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                </svg>

                {/* Search Input */}
                <input
                    ref={inputRef}
                    type="text"
                    value={searchQuery}
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}
                    onKeyDown={handleKeyDown}
                    className="form-control ps-5 pe-4"
                    placeholder="Tìm kiếm trên Tribe"
                    style={{
                        backgroundColor: 'var(--fb-gray)',
                        border: 'none',
                        borderRadius: '20px',
                        height: '40px',
                        fontSize: '14px',
                        paddingLeft: '40px',
                        paddingRight: '40px',
                        transition: 'all 0.2s ease',
                        boxShadow: 'none'
                    }}
                />

                {/* Clear Button */}
                {searchQuery && (
                    <button
                        onClick={handleClearSearch}
                        className="btn position-absolute top-50 end-0 translate-middle-y me-2 p-0"
                        style={{
                            width: '20px',
                            height: '20px',
                            backgroundColor: 'transparent',
                            border: 'none'
                        }}
                        aria-label="Xóa tìm kiếm"
                    >
                        <svg width="14" height="14" fill="currentColor" className="text-muted">
                            <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z" />
                        </svg>
                    </button>
                )}
            </div>

            {/* Search Results Dropdown */}
            {showDropdown && (
                <UserSearchDropdown
                    searchQuery={searchQuery}
                    onClose={handleCloseDropdown}
                    className="w-100"
                />
            )}
        </div>
    );
};

export default SearchBar;
