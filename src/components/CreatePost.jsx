import { useState } from 'react';

const CreatePost = ({ onPostCreate }) => {
    const [postText, setPostText] = useState('');
    const [showPostBox, setShowPostBox] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (postText.trim()) {
            onPostCreate?.({
                content: postText,
                timestamp: new Date().toISOString(),
                author: {
                    name: 'Bạn',
                    avatar: 'https://via.placeholder.com/40'
                }
            });
            setPostText('');
            setShowPostBox(false);
        }
    };

    return (
        <div className="card-fb spacing-fb">
            <div className="card-body">
                {/* Create Post Header */}
                <div className="d-flex align-items-center mb-3">
                    <img
                        src="https://via.placeholder.com/40"
                        alt="Your Avatar"
                        className="profile-pic-fb me-3"
                    />
                    <button
                        className="form-control-fb text-start flex-grow-1"
                        onClick={() => setShowPostBox(true)}
                        style={{
                            backgroundColor: 'var(--fb-gray)',
                            border: 'none',
                            cursor: 'pointer'
                        }}
                    >
                        <span style={{ color: 'var(--fb-text-secondary)' }}>
                            Bạn đang nghĩ gì?
                        </span>
                    </button>
                </div>

                {/* Expanded Post Creation */}
                {showPostBox && (
                    <form onSubmit={handleSubmit} className="border-top pt-3">
                        <textarea
                            className="form-control-fb w-100 mb-3"
                            rows="3"
                            placeholder="Bạn đang nghĩ gì?"
                            value={postText}
                            onChange={(e) => setPostText(e.target.value)}
                            autoFocus
                            style={{
                                resize: 'none',
                                border: 'none',
                                fontSize: '1.1rem'
                            }}
                        />

                        {/* Post Options */}
                        <div className="d-flex align-items-center justify-content-between p-3 mb-3"
                            style={{
                                backgroundColor: 'var(--fb-background)',
                                borderRadius: '8px',
                                border: '1px solid var(--fb-border)'
                            }}>
                            <span className="fw-medium small">Thêm vào bài viết của bạn</span>
                            <div className="d-flex gap-2">
                                <button type="button" className="btn btn-sm"
                                    style={{ backgroundColor: 'transparent', border: 'none' }}>
                                    <svg width="24" height="24" fill="#45bd62" viewBox="0 0 24 24">
                                        <path d="M13.5 3a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zM15 5.25a3 3 0 0 0-6 0v13.5a3 3 0 0 0 6 0V5.25z" />
                                    </svg>
                                </button>
                                <button type="button" className="btn btn-sm"
                                    style={{ backgroundColor: 'transparent', border: 'none' }}>
                                    <svg width="24" height="24" fill="#f3425f" viewBox="0 0 24 24">
                                        <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-1 6a1 1 0 1 1 2 0v4a1 1 0 1 1-2 0V8zm1 8a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" />
                                    </svg>
                                </button>
                                <button type="button" className="btn btn-sm"
                                    style={{ backgroundColor: 'transparent', border: 'none' }}>
                                    <svg width="24" height="24" fill="#f7b928" viewBox="0 0 24 24">
                                        <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-1 6a1 1 0 1 1 2 0v4a1 1 0 1 1-2 0V8zm1 8a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" />
                                    </svg>
                                </button>
                                <button type="button" className="btn btn-sm"
                                    style={{ backgroundColor: 'transparent', border: 'none' }}>
                                    <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="d-flex gap-2">
                            <button
                                type="button"
                                className="btn btn-fb-secondary flex-grow-1"
                                onClick={() => {
                                    setShowPostBox(false);
                                    setPostText('');
                                }}
                            >
                                Hủy
                            </button>
                            <button
                                type="submit"
                                className="btn btn-fb-primary flex-grow-1"
                                disabled={!postText.trim()}
                            >
                                Đăng
                            </button>
                        </div>
                    </form>
                )}

                {/* Quick Actions (when not expanded) */}
                {!showPostBox && (
                    <div className="d-flex justify-content-around border-top pt-3">
                        <button className="btn d-flex align-items-center flex-grow-1 justify-content-center py-2"
                            style={{ backgroundColor: 'transparent', border: 'none' }}
                            onClick={() => setShowPostBox(true)}>
                            <svg className="me-2" width="20" height="20" fill="#45bd62" viewBox="0 0 24 24">
                                <path d="M13.5 3a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zM15 5.25a3 3 0 0 0-6 0v13.5a3 3 0 0 0 6 0V5.25z" />
                            </svg>
                            <span className="fw-medium" style={{ color: 'var(--fb-text-secondary)' }}>
                                Ảnh/Video
                            </span>
                        </button>

                        <button className="btn d-flex align-items-center flex-grow-1 justify-content-center py-2"
                            style={{ backgroundColor: 'transparent', border: 'none' }}
                            onClick={() => setShowPostBox(true)}>
                            <svg className="me-2" width="20" height="20" fill="#f3425f" viewBox="0 0 24 24">
                                <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-1 6a1 1 0 1 1 2 0v4a1 1 0 1 1-2 0V8zm1 8a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" />
                            </svg>
                            <span className="fw-medium" style={{ color: 'var(--fb-text-secondary)' }}>
                                Cảm xúc
                            </span>
                        </button>

                        <button className="btn d-flex align-items-center flex-grow-1 justify-content-center py-2"
                            style={{ backgroundColor: 'transparent', border: 'none' }}
                            onClick={() => setShowPostBox(true)}>
                            <svg className="me-2" width="20" height="20" fill="#f7b928" viewBox="0 0 24 24">
                                <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-1 6a1 1 0 1 1 2 0v4a1 1 0 1 1-2 0V8zm1 8a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" />
                            </svg>
                            <span className="fw-medium" style={{ color: 'var(--fb-text-secondary)' }}>
                                Sự kiện
                            </span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CreatePost;
