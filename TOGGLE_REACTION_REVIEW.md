# Kiểm tra và sửa hàm toggleReaction

## 🔍 **Các vấn đề phát hiện:**

### 1. **Vấn đề về return type**
- **Vấn đề**: Hàm khai báo return `ApiResponse<PostReactionResponse>` nhưng khi xóa reaction return `null`
- **Giải pháp**: Thay đổi return type thành `ApiResponse<Object>` để linh hoạt hơn

### 2. **Logic xử lý notification**
- **Vấn đề**: Chỉ gửi notification khi tạo reaction, không gửi khi xóa
- **Giải pháp**: Thêm logic kiểm tra để không gửi notification khi user reaction bài viết của chính mình

### 3. **Error handling**
- **Vấn đề**: Không kiểm tra null cho `reactor` và `postOwner`
- **Giải pháp**: Thêm null check và return error message phù hợp

### 4. **Type mismatch trong error handling**
- **Vấn đề**: Return trực tiếp `deleteResult` và `createResult` gây type mismatch
- **Giải pháp**: Extract error code và message từ status để tạo ApiResponse mới

## 🔧 **Các sửa đổi đã thực hiện:**

### 1. **Sửa return type**
```java
// Trước
public ApiResponse<PostReactionResponse> toggleReaction(...)

// Sau  
public ApiResponse<Object> toggleReaction(...)
```

### 2. **Thêm null check**
```java
// Kiểm tra user
User reactor = userService.getUserById(userId);
if (reactor == null) {
    return ApiResponse.error("01", "Không tìm thấy người dùng");
}

// Kiểm tra post
User postOwner = postService.getPostOwner(postId);
if (postOwner == null) {
    return ApiResponse.error("01", "Không tìm thấy bài viết");
}
```

### 3. **Cải thiện logic notification**
```java
// Chỉ gửi notification khi không phải chính chủ nhân bài viết
if (!reactor.getId().equals(postOwner.getId())) {
    notificationService.createNotification(NotificationType.REACTION_POST, postOwner,
            reactor.getDisplayName() + " đã phản ứng với bài viết");
}
```

### 4. **Sửa error handling**
```java
// Trước
return deleteResult;

// Sau
return ApiResponse.error(deleteResult.getStatus().getCode(), 
                       deleteResult.getStatus().getDisplayMessage());
```

## 📋 **Logic hoạt động của hàm:**

### **Khi user chưa reaction:**
1. Kiểm tra user và post tồn tại
2. Gửi notification (nếu không phải chính chủ nhân bài viết)
3. Tạo reaction mới
4. Return success với data reaction

### **Khi user đã reaction:**
1. Xóa reaction hiện tại
2. Return success với data null

### **Khi có lỗi:**
1. Return error với message phù hợp

## 🧪 **Cách test:**

### 1. **Sử dụng file test**
Mở file `test_toggle_reaction.html` trong browser để test:
- Test toggle reaction đơn lẻ
- Test check reaction status
- Test get all reactions
- Test full flow (create → check → toggle → check)

### 2. **Test trong ứng dụng**
1. Đăng nhập vào ứng dụng
2. Vào trang News Feed
3. Click nút "Yêu thích" trên bài viết
4. Kiểm tra:
   - Nút chuyển thành "Đã thích"
   - Số like tăng lên
   - Click lại để unlike

## 📊 **API Response Format:**

### **Khi tạo reaction thành công:**
```json
{
  "status": {
    "code": "00",
    "success": true,
    "message": "Success",
    "displayMessage": "Đã tạo reaction"
  },
  "data": {
    "id": 1,
    "reactionType": "LIKE",
    "user": {
      "senderId": "1",
      "nameSender": "User Name",
      "avatarSender": "avatar_url"
    },
    "createdAt": "2024-01-01T12:00:00Z"
  }
}
```

### **Khi xóa reaction thành công:**
```json
{
  "status": {
    "code": "00",
    "success": true,
    "message": "Success",
    "displayMessage": "Đã bỏ reaction"
  },
  "data": null
}
```

### **Khi có lỗi:**
```json
{
  "status": {
    "code": "01",
    "success": false,
    "message": "Error",
    "displayMessage": "Lỗi cụ thể"
  },
  "data": null
}
```

## ✅ **Kết quả sau khi sửa:**

1. **Type safety**: Không còn lỗi type mismatch
2. **Error handling**: Xử lý lỗi tốt hơn với null check
3. **User experience**: Không gửi notification khi user reaction bài viết của chính mình
4. **Consistency**: Response format nhất quán
5. **Testability**: Có file test để kiểm tra đầy đủ

## 🚀 **Bước tiếp theo:**

1. Restart backend để áp dụng thay đổi
2. Test bằng file `test_toggle_reaction.html`
3. Test trong ứng dụng thực tế
4. Monitor logs để đảm bảo không có lỗi
