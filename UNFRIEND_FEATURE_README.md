# 🚫 Chức Năng Hủy Bạn Bè - Tribe

## 📋 Tổng Quan

Chức năng hủy bạn bè cho phép người dùng chấm dứt mối quan hệ bạn bè với người khác. Khi hủy kết bạn, cả hai người sẽ không còn thấy nhau trong danh sách bạn bè và không thể tương tác trực tiếp.

## 🏗️ Kiến Trúc Hệ Thống

### Backend (Spring Boot)

#### 1. Model
- **Friendship.java**: Model đại diện cho mối quan hệ bạn bè
- **NotificationType.java**: Enum chứa các loại thông báo, bao gồm `FRIEND_UNFRIENDED`

#### 2. Service
- **FriendshipService.java**: Chứa logic xử lý hủy kết bạn
  ```java
  public ApiResponse<String> unfriend(String senderId, String receiverId)
  ```

#### 3. Controller
- **FriendshipController.java**: Endpoint API cho chức năng hủy kết bạn
  ```java
  @DeleteMapping("/unfriend")
  public ResponseEntity<ApiResponse<String>> unfriend(
      @RequestParam String senderId,
      @RequestParam String receiverId)
  ```

#### 4. Repository
- **FriendshipRepository.java**: Truy vấn database cho mối quan hệ bạn bè

### Frontend (React)

#### 1. Service
- **friendshipService.js**: Service gọi API hủy kết bạn
  ```javascript
  async unfriend(senderId, receiverId)
  ```

#### 2. Component
- **FriendshipButton.jsx**: Component hiển thị nút hủy kết bạn
- **ProfilePage.jsx**: Trang profile sử dụng FriendshipButton

## 🔧 Cài Đặt và Chạy

### Backend
```bash
cd message_tribe_service
mvn spring-boot:run
```

### Frontend
```bash
npm install
npm run dev
```

## 📡 API Endpoints

### Hủy Kết Bạn
```
DELETE /api/friendships/unfriend
```

**Parameters:**
- `senderId` (string): ID người gửi yêu cầu hủy kết bạn
- `receiverId` (string): ID người bị hủy kết bạn

**Response:**
```json
{
  "status": {
    "success": true,
    "code": "00",
    "displayMessage": "Đã hủy kết bạn thành công"
  },
  "data": null
}
```

**Error Response:**
```json
{
  "status": {
    "success": false,
    "code": "01",
    "displayMessage": "Một hoặc cả hai người dùng không tồn tại"
  }
}
```

## 🎨 Giao Diện Người Dùng

### Vị Trí Nút Hủy Kết Bạn
- **Trang Profile**: Nút "Hủy kết bạn" xuất hiện trong dropdown menu khi đã là bạn bè
- **Danh Sách Bạn Bè**: Có thể thêm nút hủy kết bạn cho từng bạn bè

### Luồng Tương Tác
1. Người dùng vào trang profile của bạn bè
2. Nhấn vào nút dropdown (3 chấm) bên cạnh nút "Bạn bè"
3. Chọn "❌ Hủy kết bạn"
4. Xác nhận hành động trong popup
5. Hệ thống thực hiện hủy kết bạn
6. Hiển thị thông báo thành công/thất bại

## 🔔 Thông Báo

Khi hủy kết bạn thành công, hệ thống sẽ:
1. Xóa mối quan hệ bạn bè khỏi database
2. Gửi thông báo cho người bị hủy kết bạn
3. Cập nhật UI để phản ánh thay đổi

**Loại thông báo:** `FRIEND_UNFRIENDED`
**Nội dung:** "[Tên người dùng] đã hủy kết bạn với bạn"

## 🧪 Testing

### File Test
Sử dụng file `test_unfriend_feature.html` để test chức năng:

1. **Test API Endpoint**: Kiểm tra endpoint có hoạt động không
2. **Test Hủy Kết Bạn**: Test chức năng với ID thực
3. **Test UI Component**: Kiểm tra giao diện
4. **Test Notification**: Kiểm tra thông báo
5. **Test Error Cases**: Kiểm tra xử lý lỗi

### Cách Test
```bash
# Mở file test trong browser
open test_unfriend_feature.html
```

## 🛡️ Bảo Mật và Validation

### Backend Validation
- Kiểm tra cả hai user ID có tồn tại không
- Kiểm tra mối quan hệ bạn bè có tồn tại và đã được chấp nhận không
- Xử lý cả hai chiều của mối quan hệ (sender → receiver và receiver → sender)

### Frontend Validation
- Xác nhận hành động trước khi thực hiện
- Hiển thị loading state trong quá trình xử lý
- Xử lý lỗi và hiển thị thông báo phù hợp

## 🔄 Luồng Xử Lý

### Backend Flow
1. Nhận request DELETE với senderId và receiverId
2. Validate user IDs
3. Tìm mối quan hệ bạn bè (cả hai chiều)
4. Kiểm tra trạng thái "accepted"
5. Xóa mối quan hệ khỏi database
6. Tạo thông báo cho người bị hủy kết bạn
7. Trả về response thành công

### Frontend Flow
1. User click nút "Hủy kết bạn"
2. Hiển thị confirm dialog
3. Nếu user xác nhận, gọi API unfriend
4. Hiển thị loading state
5. Nhận response từ API
6. Cập nhật UI (ẩn nút kết bạn, hiển thị nút "Kết bạn")
7. Hiển thị thông báo thành công/thất bại

## 🐛 Xử Lý Lỗi

### Các Trường Hợp Lỗi
1. **User không tồn tại**: "Một hoặc cả hai người dùng không tồn tại"
2. **Không phải bạn bè**: "Hai người không phải bạn bè"
3. **Lỗi server**: "Lỗi server, vui lòng thử lại sau"
4. **Lỗi network**: "Lỗi kết nối, vui lòng kiểm tra mạng"

### Error Codes
- `01`: User không tồn tại
- `02`: Không phải bạn bè
- `00`: Thành công

## 📝 Ghi Chú Kỹ Thuật

### Database
- Bảng `friendships` lưu trữ mối quan hệ bạn bè
- Khi hủy kết bạn, record sẽ bị xóa hoàn toàn
- Không lưu lịch sử hủy kết bạn

### Performance
- API response time: < 500ms
- Sử dụng index trên các trường `sender_id`, `receiver_id`, `status`
- Không có cache, luôn query trực tiếp từ database

### Scalability
- Có thể thêm cache Redis cho danh sách bạn bè
- Có thể thêm queue cho việc gửi notification
- Có thể thêm soft delete thay vì hard delete

## 🔮 Tính Năng Tương Lai

1. **Soft Delete**: Lưu lịch sử hủy kết bạn
2. **Block User**: Chặn người dùng sau khi hủy kết bạn
3. **Re-friend**: Cho phép kết bạn lại
4. **Bulk Unfriend**: Hủy kết bạn hàng loạt
5. **Unfriend Analytics**: Thống kê hủy kết bạn

## 📞 Hỗ Trợ

Nếu gặp vấn đề với chức năng hủy bạn bè, vui lòng:
1. Kiểm tra console log của browser
2. Kiểm tra log của backend
3. Sử dụng file test để debug
4. Liên hệ team development

---

**Phiên bản:** 1.0.0  
**Cập nhật lần cuối:** 2024  
**Tác giả:** Tribe Development Team 