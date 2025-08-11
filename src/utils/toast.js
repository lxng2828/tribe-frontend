import { toast } from 'react-toastify';

// Toast configuration
const toastConfig = {
  position: "top-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

// Success toast
export const showSuccess = (message) => {
  toast.success(message, toastConfig);
};

// Error toast
export const showError = (message) => {
  toast.error(message, toastConfig);
};

// Warning toast
export const showWarning = (message) => {
  toast.warning(message, toastConfig);
};

// Info toast
export const showInfo = (message) => {
  toast.info(message, toastConfig);
};

// Loading toast
export const showLoading = (message = "Đang xử lý...") => {
  return toast.loading(message, {
    ...toastConfig,
    autoClose: false,
  });
};

// Update loading toast
export const updateLoading = (toastId, message, type = "success") => {
  toast.update(toastId, {
    render: message,
    type: type,
    isLoading: false,
    autoClose: 3000,
  });
};

// Dismiss toast
export const dismissToast = (toastId) => {
  toast.dismiss(toastId);
};

// Auth specific toasts
export const authToasts = {
  // Register
  registerSuccess: () => showSuccess("Đăng ký thành công! Vui lòng đăng nhập để tiếp tục."),
  registerError: (message) => showError(message || "Đăng ký thất bại. Vui lòng thử lại."),
  
  // Login
  loginSuccess: () => showSuccess("Đăng nhập thành công!"),
  loginError: (message) => showError(message || "Email hoặc mật khẩu không chính xác"),
  
  // Logout
  logoutSuccess: () => showInfo("Đã đăng xuất thành công"),
  logoutError: (message) => showError(message || "Đăng xuất thất bại"),
  
  // Forgot Password
  forgotPasswordSuccess: (message) => showSuccess(message || "Mã OTP đã được gửi đến email của bạn"),
  forgotPasswordError: (message) => showError(message || "Gửi OTP thất bại"),
  
  // Verify OTP
  verifyOTPSuccess: (message) => showSuccess(message || "Mã OTP hợp lệ"),
  verifyOTPError: (message) => showError(message || "Mã OTP không hợp lệ"),
  
  // Reset Password
  resetPasswordSuccess: (message) => showSuccess(message || "Mật khẩu đã được đặt lại thành công"),
  resetPasswordError: (message) => showError(message || "Đặt lại mật khẩu thất bại"),
  
  // General
  networkError: () => showError("Lỗi kết nối mạng. Vui lòng kiểm tra lại kết nối."),
  validationError: (message) => showError(message || "Dữ liệu không hợp lệ"),
  serverError: () => showError("Lỗi hệ thống. Vui lòng thử lại sau."),
};

