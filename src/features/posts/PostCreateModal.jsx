import { useState, useRef } from 'react';
import { usePostManager } from './PostManager';
import { getAvatarUrl } from '../../utils/placeholderImages';

const PostCreateModal = () => {
    const {
        showCreateModal,
        closeCreateModal,
        createPost,
        loading,
    } = usePostManager();

    const [postText, setPostText] = useState('');
    const [selectedImages, setSelectedImages] = useState([]);
    const [visibility, setVisibility] = useState('PUBLIC');
    const [error, setError] = useState(null); // Added for error handling
    const fileInputRef = useRef(null);
    const maxLength = 500; // Max characters for post text
    const maxImages = 4; // Max number of images

    // Handle image selection with validation
    const handleImageSelect = (e) => {
        const files = Array.from(e.target.files);
        const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
        const maxSize = 5 * 1024 * 1024; // 5MB limit

        if (selectedImages.length + files.length > maxImages) {
            setError(`Chỉ được chọn tối đa ${maxImages} ảnh.`);
            return;
        }

        const validFiles = files.filter((file) => {
            if (!validImageTypes.includes(file.type)) {
                setError('Chỉ hỗ trợ định dạng JPEG, PNG hoặc GIF.');
                return false;
            }
            if (file.size > maxSize) {
                setError('Kích thước ảnh không được vượt quá 5MB.');
                return false;
            }
            return true;
        });

        if (validFiles.length > 0) {
            setSelectedImages((prev) => [...prev, ...validFiles]);
            setError(null);
        }
    };

    // Remove an image from the selection
    const removeImage = (index) => {
        setSelectedImages((prev) => prev.filter((_, i) => i !== index));
        setError(null);
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!postText.trim() && selectedImages.length === 0) {
            setError('Vui lòng nhập nội dung hoặc chọn ít nhất một ảnh.');
            return;
        }
        if (postText.length > maxLength) {
            setError(`Nội dung không được vượt quá ${maxLength} ký tự.`);
            return;
        }

        try {
            await createPost({
                content: postText,
                images: selectedImages,
                visibility,
            });
            setPostText('');
            setSelectedImages([]);
            setVisibility('PUBLIC');
            setError(null);
            closeCreateModal();
        } catch (error) {
            console.error('Error creating post:', error);
            setError('Không thể đăng bài viết. Vui lòng thử lại.');
        }
    };

    // Handle cancel action
    const handleCancel = () => {
        setPostText('');
        setSelectedImages([]);
        setVisibility('PUBLIC');
        setError(null);
        closeCreateModal();
    };

    // Visibility options with icons
    const getVisibilityInfo = (vis) => {
        switch (vis) {
            case 'PUBLIC':
                return {
                    icon: (
                        <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                        </svg>
                    ),
                    text: 'Công khai',
                };
            case 'FRIENDS':
                return {
                    icon: (
                        <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 8H17c-.8 0-1.54.37-2.01 1l-1.7 2.26A3.997 3.997 0 0 0 10 15c-2.21 0-4 1.79-4 4v2h14zm-8-2c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2z" />
                        </svg>
                    ),
                    text: 'Bạn bè',
                };
            case 'PRIVATE':
                return {
                    icon: (
                        <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                        </svg>
                    ),
                    text: 'Chỉ mình tôi',
                };
            default:
                return {
                    icon: (
                        <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                        </svg>
                    ),
                    text: 'Công khai',
                };
        }
    };

    // Skeleton loader for image preview
    const ImageSkeleton = () => (
        <div className="col-md-4 mb-2">
            <div className="position-relative bg-light rounded" style={{ height: '150px', width: '100%' }}></div>
        </div>
    );

    if (!showCreateModal) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="modal-backdrop fade show"
                onClick={handleCancel}
                style={{ zIndex: 1040 }}
                aria-hidden="true"
            ></div>

            {/* Modal */}
            <div
                className="modal fade show post-fb"
                style={{ display: 'block', zIndex: 1050 }}
                tabIndex="-1"
                role="dialog"
                aria-labelledby="createPostModalTitle"
                aria-modal="true"
            >
                <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="createPostModalTitle">
                                Tạo bài viết mới
                            </h5>
                            <button
                                type="button"
                                className="btn-close"
                                onClick={handleCancel}
                                disabled={loading}
                                aria-label="Đóng"
                            ></button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                {/* Error message */}
                                {error && (
                                    <div className="alert alert-danger alert-dismissible fade show" role="alert">
                                        {error}
                                        <button
                                            type="button"
                                            className="btn-close"
                                            onClick={() => setError(null)}
                                            aria-label="Đóng cảnh báo"
                                        ></button>
                                    </div>
                                )}

                                {/* Post content */}
                                <div className="mb-3">
                                    <textarea
                                        className="form-control comment-input-field"
                                        rows="4"
                                        placeholder="Bạn đang nghĩ gì?"
                                        value={postText}
                                        onChange={(e) => setPostText(e.target.value)}
                                        disabled={loading}
                                        maxLength={maxLength}
                                        aria-label="Nội dung bài viết"
                                    />
                                    <div className="text-muted text-end mt-1">
                                        {postText.length}/{maxLength}
                                    </div>
                                </div>

                                {/* Image preview */}
                                {selectedImages.length > 0 && (
                                    <div className="mb-3">
                                        <h6>Ảnh đã chọn ({selectedImages.length}/{maxImages}):</h6>
                                        <div className="row">
                                            {loading ? (
                                                <>
                                                    <ImageSkeleton />
                                                    <ImageSkeleton />
                                                </>
                                            ) : (
                                                selectedImages.map((image, index) => (
                                                    <div key={index} className="col-md-4 mb-2">
                                                        <div className="position-relative">
                                                            <img
                                                                src={URL.createObjectURL(image)}
                                                                alt={`Preview ${index + 1}`}
                                                                className="img-fluid rounded post-image-single"
                                                                style={{ height: '150px', width: '100%', objectFit: 'cover' }}
                                                                loading="lazy"
                                                            />
                                                            <button
                                                                type="button"
                                                                className="btn btn-danger btn-sm position-absolute top-0 end-0"
                                                                onClick={() => removeImage(index)}
                                                                disabled={loading}
                                                                aria-label={`Xóa ảnh ${index + 1}`}
                                                            >
                                                                ×
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Visibility selector */}
                                <div className="mb-3">
                                    <label className="form-label" htmlFor="visibilitySelect">
                                        Quyền riêng tư:
                                    </label>
                                    <div className="input-group">
                                        <span className="input-group-text">{getVisibilityInfo(visibility).icon}</span>
                                        <select
                                            id="visibilitySelect"
                                            className="form-select"
                                            value={visibility}
                                            onChange={(e) => setVisibility(e.target.value)}
                                            disabled={loading}
                                            aria-label="Chọn quyền riêng tư"
                                        >
                                            <option value="PUBLIC">{getVisibilityInfo('PUBLIC').text}</option>
                                            <option value="FRIENDS">{getVisibilityInfo('FRIENDS').text}</option>
                                            <option value="PRIVATE">{getVisibilityInfo('PRIVATE').text}</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary input-action-btn"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={loading}
                                    aria-label="Thêm ảnh"
                                >
                                    <svg className="me-2" width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                                    </svg>
                                    Thêm ảnh
                                </button>

                                <button
                                    type="button"
                                    className="btn btn-secondary input-action-btn"
                                    onClick={handleCancel}
                                    disabled={loading}
                                    aria-label="Hủy"
                                >
                                    Hủy
                                </button>

                                <button
                                    type="submit"
                                    className="btn btn-primary comment-send-button"
                                    disabled={loading || (!postText.trim() && selectedImages.length === 0)}
                                    aria-label="Đăng bài viết"
                                >
                                    {loading ? (
                                        <>
                                            <div className="spinner-border spinner-border-sm me-2" role="status">
                                                <span className="visually-hidden">Đang đăng...</span>
                                            </div>
                                            Đang đăng...
                                        </>
                                    ) : (
                                        'Đăng bài viết'
                                    )}
                                </button>
                            </div>
                        </form>

                        {/* Hidden file input */}
                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageSelect}
                            style={{ display: 'none' }}
                            aria-hidden="true"
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default PostCreateModal;