# API Đăng Ký Tài Khoản - Hướng Dẫn Test

## Tổng Quan
API đăng ký tài khoản đã được ghép thành công giữa frontend React và backend Spring Boot.

### Flow Đăng Ký → Đăng Nhập
1. **Đăng ký thành công** → Redirect sang trang Login
2. **Hiển thị thông báo thành công** trên trang Login
3. **Đăng nhập** với email/password vừa tạo
4. **Redirect về trang chính** sau khi đăng nhập thành công

## Cấu Trúc API

### Endpoint
```
POST http://localhost:8080/api/auth/register
```

### Request Body (RegisterRequest)
```json
{
  "email": "user@example.com",
  "password": "123456",
  "displayName": "User Name",
  "phoneNumber": "+84123456789",
  "birthday": "1990-01-01",
  "avatarUrl": "https://example.com/avatar.jpg"
}
```

### Response Format
```json
{
  "status": {
    "code": "00",
    "success": true,
    "message": "Success",
    "displayMessage": "Đăng ký thành công",
    "responseTime": "2024-01-01T12:00:00Z"
  },
  "data": {
    "token": "jwt_token_here",
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "displayName": "User Name"
    }
  }
}
```

## Validation Rules

### Backend Validation (Java)
- **email**: @Email annotation
- **password**: @NotBlank, @Size(min=6, max=100)
- **displayName**: @NotBlank
- **phoneNumber**: @Pattern(regexp="^\\+?[0-9]{7,15}$")
- **birthday**: @Pattern(regexp="^\\d{4}-\\d{2}-\\d{2}$")
- **avatarUrl**: Optional

### Frontend Validation (Yup)
- **displayName**: min 2, max 100 ký tự
- **email**: email format
- **password**: min 6, max 100 ký tự
- **phoneNumber**: regex `/^\+?[0-9]{7,15}$/`
- **birthday**: format `yyyy-MM-dd`

## Cách Test

### 1. Test Flow Đăng Ký → Đăng Nhập
```bash
# Mở file test_register_flow.html trong browser
# Test toàn bộ flow: Register → Login → Home
```

### 2. Test API Đăng Ký Riêng Lẻ
```bash
# Mở file test_register_api.html trong browser
# Điền thông tin và click "Test Register"
```

### 2. Sử dụng cURL
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "123456",
    "displayName": "Test User",
    "phoneNumber": "+84123456789",
    "birthday": "1990-01-01"
  }'
```

### 3. Sử dụng Postman
- Method: POST
- URL: `http://localhost:8080/api/auth/register`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "email": "test@example.com",
  "password": "123456",
  "displayName": "Test User",
  "phoneNumber": "+84123456789",
  "birthday": "1990-01-01"
}
```

## Files Đã Sửa

### Frontend
1. **src/features/auth/authService.js**
   - Sửa format request/response theo API backend
   - Thêm logging để debug
   - Xử lý error message đúng format

2. **src/features/auth/RegisterPage.jsx**
   - Cập nhật validation schema
   - Sửa format dữ liệu gửi đi
   - Thêm logging

3. **src/services/api.js**
   - Base URL: `http://localhost:8080/api`
   - Đã có sẵn interceptors cho token

### Backend
1. **AuthController.java**
   - Endpoint: `POST /api/auth/register`
   - Validation với @Valid
   - Response format chuẩn

2. **RegisterRequest.java**
   - Validation annotations
   - Các trường bắt buộc và optional

## Lưu Ý

1. **CORS**: Đảm bảo backend có cấu hình CORS cho frontend
2. **Database**: Backend cần có database để lưu user
3. **Email Service**: Nếu có email verification, cần cấu hình email service
4. **Password Hashing**: Backend sẽ hash password trước khi lưu

## Error Codes

- **00**: Success
- **01**: Validation error
- **02**: User already exists
- **99**: System error

## Debug

### Frontend Console
- Log request data: `Sending register data: {...}`
- Log response: `Register response: {...}`
- Log errors: `Register error: {...}`

### Backend Logs
- Check Spring Boot console logs
- Validation errors sẽ hiển thị chi tiết
- Database errors nếu có

## Next Steps

1. Test đăng ký thành công
2. Test validation errors
3. Test duplicate email
4. Test đăng nhập sau khi đăng ký
5. Test token authentication
