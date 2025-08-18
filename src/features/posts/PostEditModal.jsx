import { useState, useEffect, useRef } from 'react';
import { usePostManager } from './PostManager';
import { toast } from 'react-toastify';

const PostEditModal = () => {
    const { 
        showEditModal, 
        closeEditModal, 
        updatePost, 
        selectedPost, 
        loading 
    } = usePostManager();
    
    const [postText, setPostText] = useState('');
    const [selectedImages, setSelectedImages] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
    const [visibility, setVisibility] = useState('PUBLIC');
    const fileInputRef = useRef(null);

    // Load post data when modal opens
    useEffect(() => {
        if (showEditModal && selectedPost) {
            setPostText(selectedPost.content || '');
            setExistingImages(selectedPost.images || []);
            setSelectedImages([]);
            setVisibility(selectedPost.visibility || 'PUBLIC');
        }
    }, [showEditModal, selectedPost]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!postText.trim() && selectedImages.length === 0 && existingImages.length === 0) {
            toast.error('Vui lòng nhập nội dung hoặc chọn ảnh!');
            return;
        }

        try {
            await updatePost(selectedPost.id, {
                content: postText,
                images: selectedImages,
                existingImages: existingImages,
                visibility: visibility
            });
            
            // Reset form
            setPostText('');
            setSelectedImages([]);
            setExistingImages([]);
            setVisibility('PUBLIC');
        } catch (error) {
            console.error('Error updating post:', error);
        }
    };

    const handleImageSelect = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            setSelectedImages(prev => [...prev, ...files]);
        }
    };

    const removeNewImage = (index) => {
        setSelectedImages(prev => prev.filter((_, i) => i !== index));
    };

    const removeExistingImage = (index) => {
        setExistingImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleCancel = () => {
        setPostText('');
        setSelectedImages([]);
        setExistingImages([]);
        setVisibility('PUBLIC');
        closeEditModal();
    };

    if (!showEditModal || !selectedPost) return null;

    return (
        <>
            {/* Backdrop */}
            <div 
                className="modal-backdrop fade show" 
                onClick={handleCancel}
                style={{ zIndex: 1040 }}
            ></div>
            
            {/* Modal */}
            <div 
                className="modal fade show" 
                style={{ display: 'block', zIndex: 1050 }} 
                tabIndex="-1"
            >
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Chỉnh sửa bài viết</h5>
                            <button 
                                type="button" 
                                className="btn-close" 
                                onClick={handleCancel}
                                disabled={loading}
                            ></button>
                        </div>
                        
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                {/* Post content */}
                                <div className="mb-3">
                                    <textarea
                                        className="form-control"
                                        rows="4"
                                        placeholder="Bạn đang nghĩ gì?"
                                        value={postText}
                                        onChange={(e) => setPostText(e.target.value)}
                                        disabled={loading}
                                    />
                                </div>

                                {/* Existing images */}
                                {existingImages.length > 0 && (
                                    <div className="mb-3">
                                        <h6>Ảnh hiện tại:</h6>
                                        <div className="row">
                                            {existingImages.map((image, index) => (
                                                <div key={`existing-${index}`} className="col-md-4 mb-2">
                                                    <div className="position-relative">
                                                        <img
                                                            src={image}
                                                            alt={`Existing ${index + 1}`}
                                                            className="img-fluid rounded"
                                                            style={{ height: '150px', width: '100%', objectFit: 'cover' }}
                                                        />
                                                        <button
                                                            type="button"
                                                            className="btn btn-danger btn-sm position-absolute top-0 end-0"
                                                            onClick={() => removeExistingImage(index)}
                                                            disabled={loading}
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* New images */}
                                {selectedImages.length > 0 && (
                                    <div className="mb-3">
                                        <h6>Ảnh mới:</h6>
                                        <div className="row">
                                            {selectedImages.map((image, index) => (
                                                <div key={`new-${index}`} className="col-md-4 mb-2">
                                                    <div className="position-relative">
                                                        <img
                                                            src={URL.createObjectURL(image)}
                                                            alt={`New ${index + 1}`}
                                                            className="img-fluid rounded"
                                                            style={{ height: '150px', width: '100%', objectFit: 'cover' }}
                                                        />
                                                        <button
                                                            type="button"
                                                            className="btn btn-danger btn-sm position-absolute top-0 end-0"
                                                            onClick={() => removeNewImage(index)}
                                                            disabled={loading}
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Visibility selector */}
                                <div className="mb-3">
                                    <label className="form-label">Quyền riêng tư:</label>
                                    <select
                                        className="form-select"
                                        value={visibility}
                                        onChange={(e) => setVisibility(e.target.value)}
                                        disabled={loading}
                                    >
                                        <option value="PUBLIC">Công khai</option>
                                        <option value="FRIENDS">Bạn bè</option>
                                        <option value="PRIVATE">Chỉ mình tôi</option>
                                    </select>
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={loading}
                                >
                                    <svg className="me-2" width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                                    </svg>
                                    Thêm ảnh
                                </button>
                                
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={handleCancel}
                                    disabled={loading}
                                >
                                    Hủy
                                </button>
                                
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={loading || (!postText.trim() && selectedImages.length === 0 && existingImages.length === 0)}
                                >
                                    {loading ? (
                                        <>
                                            <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                                            Đang cập nhật...
                                        </>
                                    ) : (
                                        'Cập nhật bài viết'
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
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default PostEditModal;
