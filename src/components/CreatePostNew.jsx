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
            </div>
        </div>
    );
};

export default CreatePostNew;

