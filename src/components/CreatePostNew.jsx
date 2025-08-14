import { useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { usePostManager } from '../features/posts/PostManager';
import { getAvatarUrl } from '../utils/placeholderImages';

const CreatePostNew = () => {
    const { openCreateModal } = usePostManager();
    const { user } = useAuth();

    return (
        <div className="card-fb spacing-fb">
            <div className="card-body p-4">
                {/* Create Post Header */}
                <div className="d-flex align-items-center">
                    <img
                        src={getAvatarUrl(user)}
                        alt="Your Avatar"
                        className="profile-pic-fb me-3"
                        style={{ width: '48px', height: '48px', borderRadius: '50%' }}
                    />
                    <button
                        className="form-control-fb text-start flex-grow-1"
                        onClick={openCreateModal}
                        style={{
                            border: '1px solid var(--fb-border)',
                            borderRadius: '20px',
                            padding: '12px 16px',
                            backgroundColor: 'var(--fb-bg)',
                            color: 'var(--fb-text-secondary)',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = 'var(--fb-gray)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = 'var(--fb-bg)';
                        }}
                    >
                        Bạn đang nghĩ gì?
                    </button>
                </div>

                {/* Action Buttons */}
                <div className="d-flex justify-content-between mt-3 pt-3" style={{ borderTop: '1px solid var(--fb-border)' }}>
                    <button
                        className="btn btn-link d-flex align-items-center"
                        onClick={openCreateModal}
                        style={{ color: 'var(--fb-text-secondary)', textDecoration: 'none' }}
                    >
                        <svg className="me-2" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                        </svg>
                        Ảnh/Video
                    </button>
                    
                    <button
                        className="btn btn-link d-flex align-items-center"
                        onClick={openCreateModal}
                        style={{ color: 'var(--fb-text-secondary)', textDecoration: 'none' }}
                    >
                        <svg className="me-2" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                        Cảm xúc
                    </button>
                    
                    <button
                        className="btn btn-link d-flex align-items-center"
                        onClick={openCreateModal}
                        style={{ color: 'var(--fb-text-secondary)', textDecoration: 'none' }}
                    >
                        <svg className="me-2" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                        Check in
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreatePostNew;

