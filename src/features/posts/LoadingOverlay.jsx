import React from 'react';
import { usePostManager } from './PostManager';

const LoadingOverlay = ({ message = 'Đang tải...' }) => {
    const { loading } = usePostManager();
    if (!loading) return null;

    return (
        <div 
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 9999,
                backdropFilter: 'blur(2px)'
            }}
        >
            <div 
                style={{
                    backgroundColor: 'white',
                    padding: '20px 30px',
                    borderRadius: '8px',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '15px'
                }}
            >
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mb-0 text-muted">{message}</p>
            </div>
        </div>
    );
};

export default LoadingOverlay;
