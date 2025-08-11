# Chức năng Quên Mật khẩu - Tribe App

## Tổng quan
Chức năng quên mật khẩu cho phép người dùng đặt lại mật khẩu thông qua email một cách an toàn và bảo mật.

## Luồng hoạt động

### 1. Người dùng nhấn "Quên mật khẩu"
- Từ trang đăng nhập, người dùng nhấn vào link "Quên mật khẩu?"
- Chuyển hướng đến trang `/forgot-password`

### 2. Nhập email
- Người dùng nhập email đã đăng ký
- Hệ thống gửi yêu cầu đến backend API `/api/auth/forgot-password`
- Backend tạo token reset và gửi email chứa link đặt lại mật khẩu

### 3. Nhận email
- Người dùng kiểm tra email
- Email chứa link: `http://localhost:5173/reset-password?token=<token>`
- Token có hiệu lực trong 30 phút

### 4. Đặt lại mật khẩu
- Người dùng nhấn vào link trong email
- Chuyển hướng đến trang `/reset-password` với token
- Nhập mật khẩu mới và xác nhận
- Hệ thống gửi yêu cầu đến backend API `/api/auth/reset-password`

### 5. Hoàn thành
- Mật khẩu được cập nhật thành công
- Chuyển hướng về trang đăng nhập với thông báo thành công
- Người dùng có thể đăng nhập với mật khẩu mới

## API Endpoints

### 1. Gửi email đặt lại mật khẩu
```
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "status": {
    "success": true,
    "code": "00",
    "displayMessage": "Nếu email tồn tại, hướng dẫn đã được gửi."
  }
}
```

### 2. Đặt lại mật khẩu
```
POST /api/auth/reset-password
Content-Type: application/json

{
  "token": "reset-token-from-email",
  "newPassword": "new-password-123"
}
```

**Response:**
```json
{
  "status": {
    "success": true,
    "code": "00",
    "displayMessage": "Mật khẩu đã được đặt lại thành công"
  }
}
```

## Cấu hình Email

### Backend Configuration
Trong file `application.yml`:
```yaml
spring:
  mail:
    host: smtp.gmail.com
    port: 587
    username: ${MAIL_USERNAME}
    password: ${MAIL_PASSWORD}
    properties:
      mail.smtp.auth: true
      mail.smtp.starttls.enable: true
```

### Environment Variables
Cần thiết lập các biến môi trường:
- `MAIL_USERNAME`: Email Gmail
- `MAIL_PASSWORD`: Mật khẩu ứng dụng Gmail

## Bảo mật

### Token Security
- Token được tạo bằng UUID ngẫu nhiên
- Token có thời hạn 30 phút
- Token bị xóa sau khi sử dụng
- Token cũ bị xóa khi tạo token mới

### Email Security
- Không tiết lộ thông tin về việc email có tồn tại hay không
- Link reset chỉ chứa token, không chứa thông tin nhạy cảm
- Email có hướng dẫn rõ ràng về việc bỏ qua nếu không yêu cầu

### Password Requirements
- Mật khẩu mới phải có ít nhất 8 ký tự
- Phải chứa chữ hoa, chữ thường và số
- Phải xác nhận mật khẩu

## Frontend Routes

### 1. Forgot Password Page
- **Route:** `/forgot-password`
- **Component:** `ForgotPasswordPage.jsx`
- **Chức năng:** Nhập email để gửi yêu cầu đặt lại mật khẩu

### 2. Email Sent Confirmation
- **Route:** `/verify-otp`
- **Component:** `VerifyOTPPage.jsx`
- **Chức năng:** Hiển thị thông báo email đã được gửi

### 3. Reset Password Page
- **Route:** `/reset-password?token=<token>`
- **Component:** `ResetPasswordPage.jsx`
- **Chức năng:** Nhập mật khẩu mới với token từ email

## Testing

### Test Case 1: Email không tồn tại
1. Nhập email không có trong hệ thống
2. Hệ thống vẫn trả về thành công (bảo mật)
3. Không có email được gửi

### Test Case 2: Email tồn tại
1. Nhập email có trong hệ thống
2. Hệ thống tạo token và gửi email
3. Kiểm tra email nhận được

### Test Case 3: Token hợp lệ
1. Nhấn vào link trong email
2. Nhập mật khẩu mới
3. Xác nhận đặt lại thành công

### Test Case 4: Token hết hạn
1. Đợi 30 phút sau khi nhận email
2. Thử sử dụng token
3. Nhận thông báo token không hợp lệ

### Test Case 5: Token đã sử dụng
1. Sử dụng token để đặt lại mật khẩu
2. Thử sử dụng lại token
3. Nhận thông báo token không hợp lệ

## Troubleshooting

### Email không được gửi
1. Kiểm tra cấu hình SMTP trong `application.yml`
2. Kiểm tra biến môi trường `MAIL_USERNAME` và `MAIL_PASSWORD`
3. Kiểm tra log backend để xem lỗi

### Token không hoạt động
1. Kiểm tra token có đúng format UUID không
2. Kiểm tra token có trong database không
3. Kiểm tra token có hết hạn chưa

### Frontend không kết nối được backend
1. Kiểm tra CORS configuration
2. Kiểm tra URL API trong frontend
3. Kiểm tra backend có đang chạy không

## Deployment Notes

### Production Environment
- Thay đổi URL trong `EmailService.java` từ `localhost:5173` thành domain thực tế
- Cấu hình email SMTP cho production
- Đảm bảo HTTPS cho các link reset password

### Environment Variables
```bash
# Email Configuration
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password

# Database Configuration
DB_URL=jdbc:mysql://localhost:3306/tribe_db
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_password

# Server Configuration
PORT_SERVER=8080
```

## Security Best Practices

1. **Rate Limiting:** Nên thêm rate limiting cho API forgot-password
2. **Audit Logging:** Log tất cả các yêu cầu đặt lại mật khẩu
3. **Email Validation:** Validate format email trước khi gửi
4. **Password History:** Không cho phép sử dụng lại mật khẩu cũ
5. **Session Management:** Đăng xuất tất cả session hiện tại khi đặt lại mật khẩu 