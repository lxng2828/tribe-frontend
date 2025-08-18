import React from 'react';
import { toast } from 'react-toastify';

const ConfirmationModal = {
    // Hiển thị popup xác nhận và trả về Promise
    show: (message, options = {}) => {
        return new Promise((resolve) => {
            const {
                title = 'Xác nhận',
                confirmText = 'Đồng ý',
                cancelText = 'Hủy',
                type = 'warning',
                position = 'top-center',
                autoClose = false,
                closeOnClick = false,
                pauseOnHover = true,
                draggable = true,
                theme = 'light'
            } = options;

            // Tạo toastId trước khi sử dụng
            const toastId = `confirmation-${Date.now()}-${Math.random()}`;

            toast(
                <div className="confirmation-toast">
                    <div className="confirmation-header">
                        <h4>{title}</h4>
                    </div>
                    <div className="confirmation-message">
                        <p>{message}</p>
                    </div>
                    <div className="confirmation-actions">
                        <button
                            className="btn btn-danger btn-sm me-2"
                            onClick={() => {
                                toast.dismiss(toastId);
                                resolve(true);
                            }}
                        >
                            {confirmText}
                        </button>
                        <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => {
                                toast.dismiss(toastId);
                                resolve(false);
                            }}
                        >
                            {cancelText}
                        </button>
                    </div>
                </div>,
                {
                    toastId,
                    type,
                    position,
                    autoClose,
                    closeOnClick,
                    pauseOnHover,
                    draggable,
                    theme,
                    closeButton: false,
                    hideProgressBar: true,
                    style: {
                        minWidth: '300px',
                        maxWidth: '400px'
                    }
                }
            );
        });
    },

    // Phương thức tiện ích cho các trường hợp phổ biến
    confirmDelete: (itemName) => {
        return ConfirmationModal.show(
            `Bạn có chắc chắn muốn xóa ${itemName}?`,
            {
                title: 'Xác nhận xóa',
                confirmText: 'Xóa',
                cancelText: 'Hủy',
                type: 'error'
            }
        );
    },

    confirmUnfriend: (userName) => {
        return ConfirmationModal.show(
            `Bạn có chắc muốn hủy kết bạn với ${userName}?`,
            {
                title: 'Xác nhận hủy kết bạn',
                confirmText: 'Hủy kết bạn',
                cancelText: 'Không',
                type: 'warning'
            }
        );
    }
};

export default ConfirmationModal;
