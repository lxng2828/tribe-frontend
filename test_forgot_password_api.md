# Test API Chức năng Quên Mật khẩu

## 1. Test API Gửi Email Đặt lại Mật khẩu

### Request
```bash
curl -X POST http://localhost:8080/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com"
  }'
```

### Expected Response (Email tồn tại)
```json
{
  "status": {
    "success": true,
    "code": "00",
    "displayMessage": "Nếu email tồn tại, hướng dẫn đã được gửi."
  }
}
```

### Expected Response (Email không tồn tại)
```json
{
  "status": {
    "success": true,
    "code": "00",
    "displayMessage": "Nếu email tồn tại, hướng dẫn đã được gửi."
  }
}
```

## 2. Test API Đặt lại Mật khẩu

### Request (Token hợp lệ)
```bash
curl -X POST http://localhost:8080/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "token": "valid-reset-token-uuid",
    "newPassword": "NewPassword123"
  }'
```

### Expected Response (Thành công)
```json
{
  "status": {
    "success": true,
    "code": "00",
    "displayMessage": "Mật khẩu đã được đặt lại thành công"
  }
}
```

### Request (Token không hợp lệ)
```bash
curl -X POST http://localhost:8080/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "token": "invalid-token",
    "newPassword": "NewPassword123"
  }'
```

### Expected Response (Token không hợp lệ)
```json
{
  "status": {
    "success": false,
    "code": "01",
    "displayMessage": "Token không hợp lệ hoặc đã hết hạn"
  }
}
```

## 3. Test Cases với Postman

### Test Case 1: Email hợp lệ
1. **Method:** POST
2. **URL:** `http://localhost:8080/api/auth/forgot-password`
3. **Headers:** `Content-Type: application/json`
4. **Body:**
```json
{
  "email": "existing-user@example.com"
}
```
5. **Expected:** Status 200, success response

### Test Case 2: Email không tồn tại
1. **Method:** POST
2. **URL:** `http://localhost:8080/api/auth/forgot-password`
3. **Headers:** `Content-Type: application/json`
4. **Body:**
```json
{
  "email": "non-existing@example.com"
}
```
5. **Expected:** Status 200, success response (bảo mật)

### Test Case 3: Email format không hợp lệ
1. **Method:** POST
2. **URL:** `http://localhost:8080/api/auth/forgot-password`
3. **Headers:** `Content-Type: application/json`
4. **Body:**
```json
{
  "email": "invalid-email"
}
```
5. **Expected:** Status 400, validation error

### Test Case 4: Token hợp lệ
1. **Method:** POST
2. **URL:** `http://localhost:8080/api/auth/reset-password`
3. **Headers:** `Content-Type: application/json`
4. **Body:**
```json
{
  "token": "valid-uuid-token",
  "newPassword": "NewPassword123"
}
```
5. **Expected:** Status 200, success response

### Test Case 5: Token không hợp lệ
1. **Method:** POST
2. **URL:** `http://localhost:8080/api/auth/reset-password`
3. **Headers:** `Content-Type: application/json`
4. **Body:**
```json
{
  "token": "invalid-token",
  "newPassword": "NewPassword123"
}
```
5. **Expected:** Status 400, error response

### Test Case 6: Token hết hạn
1. **Method:** POST
2. **URL:** `http://localhost:8080/api/auth/reset-password`
3. **Headers:** `Content-Type: application/json`
4. **Body:**
```json
{
  "token": "expired-token",
  "newPassword": "NewPassword123"
}
```
5. **Expected:** Status 400, error response

### Test Case 7: Mật khẩu không đủ mạnh
1. **Method:** POST
2. **URL:** `http://localhost:8080/api/auth/reset-password`
3. **Headers:** `Content-Type: application/json`
4. **Body:**
```json
{
  "token": "valid-token",
  "newPassword": "123"
}
```
5. **Expected:** Status 400, validation error

## 4. Test Database

### Kiểm tra bảng password_reset_tokens
```sql
-- Xem tất cả tokens
SELECT * FROM password_reset_tokens;

-- Xem tokens chưa hết hạn
SELECT * FROM password_reset_tokens 
WHERE expiry_date > NOW();

-- Xem tokens đã hết hạn
SELECT * FROM password_reset_tokens 
WHERE expiry_date <= NOW();
```

### Kiểm tra user sau khi reset password
```sql
-- Xem thông tin user
SELECT id, email, password FROM users 
WHERE email = 'test@example.com';
```

## 5. Test Email

### Kiểm tra email được gửi
1. Sử dụng email test thực tế
2. Gọi API forgot-password
3. Kiểm tra inbox và spam folder
4. Verify link trong email có format đúng

### Email Content Test
Email phải chứa:
- Subject: "Tribe - Đặt lại mật khẩu"
- Link format: `http://localhost:5173/reset-password?token=<uuid>`
- Thông báo về thời hạn 30 phút
- Hướng dẫn bỏ qua nếu không yêu cầu

## 6. Test Frontend Integration

### Test Flow hoàn chỉnh
1. Mở trang login: `http://localhost:5173/login`
2. Nhấn "Quên mật khẩu?"
3. Nhập email và submit
4. Kiểm tra chuyển hướng đến `/verify-otp`
5. Kiểm tra email nhận được
6. Nhấn link trong email
7. Nhập mật khẩu mới
8. Submit và kiểm tra chuyển hướng về login

### Test Error Handling
1. Nhập email không hợp lệ
2. Nhập mật khẩu không đủ mạnh
3. Sử dụng token không hợp lệ
4. Kiểm tra thông báo lỗi hiển thị đúng

## 7. Performance Test

### Load Test
```bash
# Test với nhiều request đồng thời
ab -n 100 -c 10 -H "Content-Type: application/json" \
  -p forgot_password_data.json \
  http://localhost:8080/api/auth/forgot-password
```

### File forgot_password_data.json
```json
{
  "email": "test@example.com"
}
```

## 8. Security Test

### Test Rate Limiting
1. Gửi nhiều request forgot-password liên tiếp
2. Kiểm tra có bị block không

### Test Token Security
1. Thử sử dụng token đã dùng
2. Thử sử dụng token hết hạn
3. Thử sử dụng token không tồn tại

### Test Email Security
1. Kiểm tra email không tiết lộ thông tin nhạy cảm
2. Kiểm tra link reset có chứa token an toàn

## 9. Environment Variables Test

### Kiểm tra cấu hình email
```bash
# Kiểm tra biến môi trường
echo $MAIL_USERNAME
echo $MAIL_PASSWORD

# Test kết nối SMTP
telnet smtp.gmail.com 587
```

## 10. Log Analysis

### Kiểm tra logs
```bash
# Xem logs của application
tail -f logs/application.log

# Tìm lỗi email
grep "email" logs/application.log

# Tìm lỗi password reset
grep "password.*reset" logs/application.log
``` 