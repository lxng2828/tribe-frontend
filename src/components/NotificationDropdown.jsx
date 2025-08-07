import { useState, useRef, useEffect } from 'react';
import NotificationList from './NotificationList';
import NotificationBadge from './NotificationBadge';

const NotificationDropdown = ({ className = '' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className={`dropdown me-2 ${className}`} ref={dropdownRef}>
            {/* Notification Bell Button */}
            <button
                onClick={toggleDropdown}
                className="btn position-relative"
                style={{
                    backgroundColor: 'var(--fb-gray)',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    border: 'none'
                }}
                aria-label="Thông báo"
            >
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2a7 7 0 0 1 7 7v4.29l1.68 2.52a1 1 0 0 1-.84 1.61H4.16a1 1 0 0 1-.84-1.61L5 13.29V9a7 7 0 0 1 7-7zm0 18a3 3 0 0 1-3-3h6a3 3 0 0 1-3 3z" />
                </svg>

                {/* Unread notification badge */}
                <div className="position-absolute top-0 start-100 translate-middle">
                    <NotificationBadge />
                </div>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div
                    className="dropdown-menu dropdown-menu-end show position-absolute"
                    style={{
                        border: '1px solid var(--fb-border)',
                        borderRadius: '8px',
                        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
                        minWidth: '380px',
                        maxHeight: '400px',
                        overflow: 'hidden',
                        zIndex: 1050,
                        right: '0',
                        top: '100%',
                        marginTop: '8px'
                    }}
                >
                    <NotificationList
                        maxItems={10}
                        showHeader={true}
                        className="border-0 shadow-none"
                    />
                </div>
            )}
        </div>
    );
};

export default NotificationDropdown;
