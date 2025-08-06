import { useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import postService from '../features/posts/postService';

const CreatePost = ({ onPostCreate }) => {
    const [postText, setPostText] = useState('');
    const [selectedImages, setSelectedImages] = useState([]);
    const [showPostBox, setShowPostBox] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef(null);
    const { user } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!postText.trim() && selectedImages.length === 0) return;

        setIsSubmitting(true);
        try {
            const postData = {
                content: postText,
                images: selectedImages,
                visibility: 'PUBLIC' // Mặc định là public
            };

            const newPost = await postService.createPost(postData);

            // Gọi callback để update UI
            onPostCreate?.(newPost);

            // Reset form
            setPostText('');
            setSelectedImages([]);
            setShowPostBox(false);
        } catch (error) {
            console.error('Error creating post:', error);
            alert('Có lỗi xảy ra khi đăng bài viết. Vui lòng thử lại.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleImageSelect = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            setSelectedImages(prev => [...prev, ...files]);
        }
    };

    const removeImage = (index) => {
        setSelectedImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleCancel = () => {
        setShowPostBox(false);
        setPostText('');
        setSelectedImages([]);
    };

    return (
        <div className="card-fb spacing-fb">
            <div className="card-body">
                {/* Create Post Header */}
                <div className="d-flex align-items-center mb-3">
                    <img
                        src={user?.avatar || 'https://via.placeholder.com/40'}
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
                            {user?.fullName || user?.username}, bạn đang nghĩ gì?
                        </span>
                    </button>
                </div>

                {/* Expanded Post Creation */}
                {showPostBox && (
                    <form onSubmit={handleSubmit} className="border-top pt-3">
                        <div className="d-flex align-items-start mb-3">
                            <img
                                src={user?.avatar || 'https://via.placeholder.com/40'}
                                alt="Your Avatar"
                                className="profile-pic-fb me-3"
                            />
                            <div className="flex-grow-1">
                                <textarea
                                    className="form-control-fb w-100 mb-3"
                                    rows="3"
                                    placeholder={`${user?.fullName || user?.username}, bạn đang nghĩ gì?`}
                                    value={postText}
                                    onChange={(e) => setPostText(e.target.value)}
                                    autoFocus
                                    style={{
                                        resize: 'none',
                                        border: 'none',
                                        fontSize: '1.1rem'
                                    }}
                                />
                            </div>
                        </div>

                        {/* Selected Images Preview */}
                        {selectedImages.length > 0 && (
                            <div className="mb-3">
                                <div className="d-flex flex-wrap gap-2">
                                    {selectedImages.map((image, index) => (
                                        <div key={index} className="position-relative">
                                            <img
                                                src={URL.createObjectURL(image)}
                                                alt={`Preview ${index + 1}`}
                                                style={{
                                                    width: '100px',
                                                    height: '100px',
                                                    objectFit: 'cover',
                                                    borderRadius: '8px'
                                                }}
                                            />
                                            <button
                                                type="button"
                                                className="btn btn-sm position-absolute top-0 end-0"
                                                style={{
                                                    backgroundColor: 'rgba(0,0,0,0.7)',
                                                    color: 'white',
                                                    borderRadius: '50%',
                                                    width: '24px',
                                                    height: '24px',
                                                    border: 'none',
                                                    margin: '4px'
                                                }}
                                                onClick={() => removeImage(index)}
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Hidden File Input */}
                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageSelect}
                            style={{ display: 'none' }}
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
                                <button
                                    type="button"
                                    className="btn btn-sm"
                                    onClick={() => fileInputRef.current?.click()}
                                    style={{ backgroundColor: 'transparent', border: 'none' }}
                                >
                                    <svg width="24" height="24" fill="#45bd62" viewBox="0 0 24 24">
                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                        <polyline points="8.5,8.5 12,12 18.5,8.5" />
                                        <circle cx="8.5" cy="8.5" r="1.5" />
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
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="d-flex gap-2">
                            <button
                                type="button"
                                className="btn btn-fb-secondary flex-grow-1"
                                onClick={handleCancel}
                                disabled={isSubmitting}
                            >
                                Hủy
                            </button>
                            <button
                                type="submit"
                                className="btn btn-fb-primary flex-grow-1"
                                disabled={(!postText.trim() && selectedImages.length === 0) || isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></div>
                                        Đang đăng...
                                    </>
                                ) : (
                                    'Đăng'
                                )}
                            </button>
                        </div>
                    </form>
                )}

                {/* Quick Actions (when not expanded) */}
                {!showPostBox && (
                    <div className="d-flex justify-content-around border-top pt-3">
                        <button className="btn d-flex align-items-center flex-grow-1 justify-content-center py-2"
                            style={{ backgroundColor: 'transparent', border: 'none' }}
                            onClick={() => {
                                setShowPostBox(true);
                                setTimeout(() => fileInputRef.current?.click(), 100);
                            }}>
                            <svg className="me-2" width="20" height="20" fill="#45bd62" viewBox="0 0 24 24">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                <polyline points="8.5,8.5 12,12 18.5,8.5" />
                                <circle cx="8.5" cy="8.5" r="1.5" />
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
