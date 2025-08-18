import { useState, useEffect } from 'react';
import { useMessage } from '../contexts/MessageContext';
import { useAuth } from '../contexts/AuthContext';
import userService from '../services/userService';
import { DEFAULT_AVATAR, getAvatarUrl } from '../utils/placeholderImages';
import { toast } from 'react-toastify';
import './NewConversationModal.css';

const NewConversationModal = ({ onClose, onConversationCreated }) => {
    const { createConversation } = useMessage();
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('users'); // 'users' or 'group'
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [groupName, setGroupName] = useState('');
    const [loading, setLoading] = useState(false);
    const [creating, setCreating] = useState(false);

    // Search users
    useEffect(() => {
        const searchUsers = async () => {
            if (searchQuery.trim().length < 2) {
                setSearchResults([]);
                return;
            }

            setLoading(true);
            try {
                const response = await userService.searchUsersByEmail(searchQuery);
                if (response.status?.success) {
                    // Filter out current user
                    const filteredResults = (response.data || []).filter(u => u.id !== user?.id);
                    setSearchResults(filteredResults);
                } else {
                    setSearchResults([]);
                }
            } catch (error) {
                console.error('Error searching users:', error);
                setSearchResults([]);
            } finally {
                setLoading(false);
            }
        };

        const timeoutId = setTimeout(searchUsers, 300);
        return () => clearTimeout(timeoutId);
    }, [searchQuery, user?.id]);

    const handleUserSelect = (selectedUser) => {
        if (activeTab === 'users') {
            // For direct chat, create conversation immediately
            handleCreateConversation('PRIVATE', [selectedUser]);
        } else {
            // For group, add to selected users
            if (!selectedUsers.find(u => u.id === selectedUser.id)) {
                setSelectedUsers(prev => [...prev, selectedUser]);
            }
        }
    };

    const removeSelectedUser = (userId) => {
        setSelectedUsers(prev => prev.filter(u => u.id !== userId));
    };

    const handleCreateConversation = async (type, participants, name = null) => {
        setCreating(true);
        try {
            const conversation = await createConversation(type, participants, name);
            onConversationCreated(conversation);
        } catch (error) {
            console.error('Error creating conversation:', error);
            toast.error('Failed to create conversation. Please try again.');
        } finally {
            setCreating(false);
        }
    };

    const handleCreateGroup = () => {
        if (selectedUsers.length === 0) {
            toast.error('Please select at least one user for the group');
            return;
        }
        if (!groupName.trim()) {
            toast.error('Please enter a group name');
            return;
        }
        handleCreateConversation('GROUP', selectedUsers, groupName);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="new-conversation-modal" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="modal-header">
                    <h2>New Conversation</h2>
                    <button className="close-btn" onClick={onClose}>
                        <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                        </svg>
                    </button>
                </div>

                {/* Tabs */}
                <div className="modal-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
                        onClick={() => setActiveTab('users')}
                    >
                        Direct Message
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'group' ? 'active' : ''}`}
                        onClick={() => setActiveTab('group')}
                    >
                        Create Group
                    </button>
                </div>

                {/* Content */}
                <div className="modal-content">
                    {/* Search Input */}
                    <div className="search-section">
                        <div className="search-input-container">
                            <svg className="search-icon" width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search by email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="search-input"
                            />
                        </div>
                    </div>

                    {/* Group Name Input (only for group tab) */}
                    {activeTab === 'group' && (
                        <div className="group-name-section">
                            <input
                                type="text"
                                placeholder="Enter group name..."
                                value={groupName}
                                onChange={(e) => setGroupName(e.target.value)}
                                className="group-name-input"
                                maxLength={50}
                            />
                        </div>
                    )}

                    {/* Selected Users (only for group tab) */}
                    {activeTab === 'group' && selectedUsers.length > 0 && (
                        <div className="selected-users-section">
                            <h4>Selected Users ({selectedUsers.length})</h4>
                            <div className="selected-users-list">
                                {selectedUsers.map(user => (
                                    <div key={user.id} className="selected-user-item">
                                                                            <img
                                        src={getAvatarUrl(user)}
                                        alt={user.displayName}
                                        className="user-avatar-small"
                                    />
                                        <span className="user-name">{user.displayName}</span>
                                        <button
                                            className="remove-user-btn"
                                            onClick={() => removeSelectedUser(user.id)}
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Search Results */}
                    <div className="search-results-section">
                        {loading ? (
                            <div className="loading-state">
                                <div className="loading-spinner"></div>
                                <p>Searching...</p>
                            </div>
                        ) : searchQuery.length < 2 ? (
                            <div className="empty-state">
                                <p>Enter at least 2 characters to search for users</p>
                            </div>
                        ) : searchResults.length === 0 ? (
                            <div className="empty-state">
                                <p>No users found for "{searchQuery}"</p>
                            </div>
                        ) : (
                            <div className="search-results-list">
                                {searchResults.map(result => (
                                    <div
                                        key={result.id}
                                        className={`search-result-item ${selectedUsers.find(u => u.id === result.id) ? 'selected' : ''
                                            }`}
                                        onClick={() => handleUserSelect(result)}
                                    >
                                                                        <img
                                    src={getAvatarUrl(result)}
                                    alt={result.displayName}
                                    className="user-avatar"
                                />
                                        <div className="user-info">
                                            <h4>{result.displayName}</h4>
                                            <p>{result.email}</p>
                                        </div>
                                        {activeTab === 'group' && selectedUsers.find(u => u.id === result.id) && (
                                            <div className="selected-indicator">✓</div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                {activeTab === 'group' && (
                    <div className="modal-footer">
                        <button
                            className="create-group-btn"
                            onClick={handleCreateGroup}
                            disabled={creating || selectedUsers.length === 0 || !groupName.trim()}
                        >
                            {creating ? 'Creating...' : `Create Group (${selectedUsers.length} members)`}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NewConversationModal;
