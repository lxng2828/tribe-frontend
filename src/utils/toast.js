import { toast } from 'react-toastify';

// Toast functions cơ bản
export const showSuccess = (message, autoClose = 5000) => {
    toast.success(message, {
        position: "top-right",
        autoClose: autoClose,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
    });
};

export const showError = (message) => {
    toast.error(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
    });
};

export const showWarning = (message) => {
    toast.warning(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
    });
};

export const showInfo = (message) => {
    toast.info(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
    });
};

export const showLoading = (message) => {
    return toast.loading(message, {
        position: "top-right",
        closeOnClick: false,
        pauseOnHover: false,
    });
};

export const updateLoading = (toastId, message, type = 'success') => {
    toast.update(toastId, {
        render: message,
        type: type,
        isLoading: false,
        autoClose: 5000,
        closeOnClick: true,
        pauseOnHover: true,
    });
};

// Auth specific toast functions
export const authToasts = {
    // Success messages
    registerSuccess: () => showSuccess('Đăng ký thành công! Vui lòng đăng nhập để tiếp tục.'),
    loginSuccess: () => showSuccess('Đăng nhập thành công!'),
    forgotPasswordSuccess: (message) => showSuccess(message || 'Mã OTP đã được gửi đến email của bạn'),
    verifyOTPSuccess: (message) => showSuccess(message || 'Mã OTP hợp lệ'),
    resetPasswordSuccess: (message) => showSuccess(message || 'Mật khẩu đã được đặt lại thành công'),
    logoutSuccess: () => showSuccess('Đã đăng xuất thành công', 3000), // Hiển thị 3 giây cho logout

    // Error messages
    registerError: (message) => showError(message || 'Đăng ký thất bại. Vui lòng thử lại.'),
    loginError: (message) => showError(message || 'Email hoặc mật khẩu không chính xác'),
    forgotPasswordError: (message) => showError(message || 'Gửi OTP thất bại'),
    verifyOTPError: (message) => showError(message || 'Mã OTP không hợp lệ'),
    resetPasswordError: (message) => showError(message || 'Đặt lại mật khẩu thất bại'),
    
    // Common error messages
    networkError: () => showError('Lỗi kết nối mạng. Vui lòng kiểm tra lại kết nối.'),
    serverError: () => showError('Lỗi hệ thống. Vui lòng thử lại sau.'),
    validationError: (message) => showError(message || 'Dữ liệu không hợp lệ'),
}; 