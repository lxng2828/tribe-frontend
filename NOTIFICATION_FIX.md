# Sửa lỗi Notification API

## 🔍 **Vấn đề gốc:**
```
Error: Lỗi khi toggle reaction: could not execute statement [Field 'user_id' doesn't have a default value] [insert into notifications (content,created_at,is_read,receiver_id,type) values (?,?,?,?,?)]
```

## 🔧 **Nguyên nhân:**
1. **Thiếu set giá trị cho `createdAt`**: Model `Notification` có cột `createdAt` với `nullable = false` nhưng không được set giá trị
2. **Mismatch tên cột**: Model sử dụng `receiver_id` nhưng database có cột `user_id`

## ✅ **Các sửa đổi đã thực hiện:**

### 1. **Sửa NotificationService.java**
```java
// Trước
public Notification createNotification(NotificationType type, User receiver, String content) {
    Notification notification = new Notification();
    notification.setType(type);
    notification.setReceiver(receiver);
    notification.setContent(content);
    return notificationRepository.save(notification);
}

// Sau
public Notification createNotification(NotificationType type, User receiver, String content) {
    Notification notification = new Notification();
    notification.setType(type);
    notification.setReceiver(receiver);
    notification.setContent(content);
    notification.setCreatedAt(LocalDateTime.now());  // ✅ Thêm
    notification.setRead(false);                     // ✅ Thêm
    return notificationRepository.save(notification);
}
```

### 2. **Sửa Notification.java model**
```java
// Trước
@JoinColumn(name = "receiver_id", nullable = false)
private User receiver;

// Sau  
@JoinColumn(name = "user_id", nullable = false)  // ✅ Sửa tên cột
private User receiver;
```

### 3. **Thêm import**
```java
import java.time.LocalDateTime;  // ✅ Thêm import
```

## 🧪 **Testing:**
- Tạo file `test_notification_api.html` để test API notification
- Test toggle reaction sẽ tạo notification
- Test get user notifications

## 📋 **Các bước tiếp theo:**
1. Build lại backend: `mvn clean compile`
2. Restart server
3. Test API bằng file `test_notification_api.html`
4. Kiểm tra trong ứng dụng thực tế

## 🔍 **Lưu ý:**
- Database schema sử dụng `user_id` thay vì `receiver_id`
- Cần đảm bảo tất cả notification đều có `createdAt` và `isRead`
- Logic notification chỉ gửi khi không phải chính chủ nhân bài viết
