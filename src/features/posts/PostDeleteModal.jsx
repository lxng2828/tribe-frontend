import { useState } from 'react';
import { usePostManager } from './PostManager';
import { getAvatarUrl } from '../../utils/placeholderImages';

const PostDeleteModal = () => {
    const {
        showDeleteModal,
        closeDeleteModal,
        deletePost,
        selectedPost,
        loading,
    } = usePostManager();

    const [error, setError] = useState(null); // Added for error handling

    // Handle post deletion
    const handleConfirmDelete = async () => {
        if (!selectedPost) return;

        try {
            await deletePost(selectedPost.id);
            setError(null);
            closeDeleteModal();
        } catch (error) {
            console.error('Error deleting post:', error);
            setError('Không thể xóa bài viết. Vui lòng thử lại.');
        }
    };

    // Handle cancel action
    const handleCancel = () => {
        setError(null);
        closeDeleteModal();
    };

    // Skeleton loader for post preview
    const PostSkeleton = () => (
        <div className="alert alert-warning">
            <div className="bg-light rounded mb-2" style={{ width: '60%', height: '20px' }}></div>
            <div className="bg-light rounded" style={{ width: '80%', height: '16px' }}></div>
        </div>
    );

    if (!showDeleteModal || !selectedPost) return null;

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
                aria-labelledby="deletePostModalTitle"
                aria-modal="true"
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="deletePostModalTitle">
                                Xác nhận xóa bài viết
                            </h5>
                            <button
                                type="button"
                                className="btn-close"
                                onClick={handleCancel}
                                disabled={loading}
                                aria-label="Đóng"
                            ></button>
                        </div>

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

                            <p>Bạn có chắc chắn muốn xóa bài viết này không?</p>
                            <p className="text-muted small">
                                Hành động này không thể hoàn tác. Bài viết sẽ bị xóa vĩnh viễn.
                            </p>

                            {/* Post preview */}
                            {loading ? (
                                <PostSkeleton />
                            ) : (
                                <div className="alert alert-warning">
                                    <strong>Nội dung bài viết:</strong>
                                    <div className="mt-2">
                                        {selectedPost.content && (
                                            <p className="post-content-text mb-2">
                                                {selectedPost.content.length > 100
                                                    ? `${selectedPost.content.substring(0, 100)}...`
                                                    : selectedPost.content}
                                            </p>
                                        )}
                                        {selectedPost.images && selectedPost.images.length > 0 && (
                                            <div className="row">
                                                {selectedPost.images.slice(0, 2).map((image, index) => (
                                                    <div key={index} className="col-6 mb-2">
                                                        <img
                                                            src={image.url || getAvatarUrl()}
                                                            alt={`Hình ảnh ${index + 1}`}
                                                            className="img-fluid rounded post-image-single"
                                                            style={{ height: '100px', width: '100%', objectFit: 'cover' }}
                                                            loading="lazy"
                                                        />
                                                    </div>
                                                ))}
                                                {selectedPost.images.length > 2 && (
                                                    <div className="col-12 text-muted small">
                                                        +{selectedPost.images.length - 2} ảnh khác
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="modal-footer">
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
                                type="button"
                                className="btn btn-danger comment-send-button"
                                onClick={handleConfirmDelete}
                                disabled={loading}
                                aria-label="Xóa bài viết"
                            >
                                {loading ? (
                                    <>
                                        <div className="spinner-border spinner-border-sm me-2" role="status">
                                            <span className="visually-hidden">Đang xóa...</span>
                                        </div>
                                        Đang xóa...
                                    </>
                                ) : (
                                    'Xóa bài viết'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PostDeleteModal;