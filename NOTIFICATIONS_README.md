# Notification System - Hệ thống Thông báo

Hệ thống thông báo hoàn chỉnh cho ứng dụng Tribe, được xây dựng dựa trên tài liệu API backend.

## 🚀 Các tính năng chính

### 1. Hiển thị thông báo
- **NotificationBadge**: Hiển thị số lượng thông báo chưa đọc
- **NotificationDropdown**: Menu dropdown hiển thị thông báo nhanh
- **NotificationList**: Danh sách thông báo với phân trang
- **NotificationItem**: Hiển thị từng thông báo chi tiết

### 2. Quản lý thông báo
- Đánh dấu đã đọc/chưa đọc
- Xóa thông báo
- Đánh dấu tất cả là đã đọc
- Tự động làm mới mỗi 30 giây
- Phân loại theo loại thông báo

### 3. Thông báo trình duyệt
- Hỗ trợ browser notifications
- Tự động yêu cầu permission
- Hiển thị thông báo real-time

## 📁 Cấu trúc file

```
src/
├── services/
│   └── notificationService.js          # Service gọi API
├── contexts/
│   └── NotificationContext.jsx         # Context quản lý state
├── components/
│   ├── NotificationBadge.jsx          # Badge số lượng chưa đọc
│   ├── NotificationDropdown.jsx       # Dropdown thông báo
│   ├── NotificationList.jsx           # Danh sách thông báo
│   ├── NotificationItem.jsx           # Item thông báo
│   └── NotificationTestPanel.jsx      # Panel test (development)
└── pages/
    └── NotificationsPage.jsx           # Trang quản lý thông báo
```

## 🔧 Cài đặt và sử dụng

### 1. Import Context Provider
Đã được thêm vào `App.jsx`:
```jsx
import { NotificationProvider } from './contexts/NotificationContext';

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <AppRoutes />
      </NotificationProvider>
    </AuthProvider>
  );
}
```

### 2. Sử dụng trong components
```jsx
import { useNotifications } from '../contexts/NotificationContext';

const MyComponent = () => {
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    createNotification 
  } = useNotifications();
  
  // Sử dụng các functions...
};
```

### 3. Thêm NotificationDropdown vào Navbar
Đã được thêm vào `Navbar.jsx`:
```jsx
import NotificationDropdown from './NotificationDropdown';

// Trong component
<NotificationDropdown />
```

## 📖 API Reference

### NotificationService Methods

#### `getUserNotifications(userId)`
Lấy tất cả thông báo của user
```javascript
const response = await notificationService.getUserNotifications(userId);
```

#### `getUnreadNotifications(userId)`
Lấy thông báo chưa đọc
```javascript
const response = await notificationService.getUnreadNotifications(userId);
```

#### `markAsRead(notificationId)`
Đánh dấu thông báo là đã đọc
```javascript
await notificationService.markAsRead(notificationId);
```

#### `createNotification(data)`
Tạo thông báo mới
```javascript
const notificationData = {
  userId: 'user_id',
  title: 'Tiêu đề',
  content: 'Nội dung',
  type: 'MESSAGE' // MESSAGE, FRIEND_REQUEST, POST, LIKE, COMMENT
};
await notificationService.createNotification(notificationData);
```

### NotificationContext Methods

#### `useNotifications()`
Hook để sử dụng notification context
```javascript
const {
  notifications,        // Danh sách thông báo
  unreadCount,          // Số lượng chưa đọc
  loading,              // Trạng thái loading
  fetchNotifications,   // Fetch lại thông báo
  markAsRead,           // Đánh dấu đã đọc
  markAllAsRead,        // Đánh dấu tất cả đã đọc
  createNotification,   // Tạo thông báo mới
  showBrowserNotification, // Hiển thị browser notification
} = useNotifications();
```

## 🎨 Customization

### CSS Framework
Hệ thống notifications sử dụng **Bootstrap CSS** để tương thích với giao diện hiện tại của ứng dụng Tribe.

### Thay đổi icon thông báo
Chỉnh sửa trong `notificationService.js`:
```javascript
getNotificationIcon(type) {
  switch (type) {
    case 'MESSAGE': return '💬';
    case 'FRIEND_REQUEST': return '👥';
    // Thêm cases khác...
  }
}
```

### Thay đổi styling
Sử dụng các Bootstrap classes hoặc CSS variables:
```css
/* Custom CSS cho notification badge */
.badge.bg-danger {
  --bs-badge-font-size: 0.65em;
}

/* Custom hover effects */
.dropdown-item:hover {
  background-color: var(--bs-gray-100);
}
```

### Tùy chỉnh thời gian auto-refresh
Thay đổi interval trong `NotificationContext.jsx`:
```javascript
// Refresh every 30 seconds -> 60 seconds
const interval = setInterval(fetchNotifications, 60000);
```

## 🧪 Testing

### Sử dụng Test Panel
1. Vào trang `/notifications`
2. Nhấn nút "Hiện Test Panel"
3. Tạo thông báo mẫu hoặc thông báo tùy chỉnh
4. Test các chức năng đánh dấu đã đọc, xóa, v.v.

### Test Browser Notifications
1. Nhấn "Cấp quyền thông báo trình duyệt"
2. Tạo thông báo test
3. Kiểm tra thông báo xuất hiện trên desktop

## 🌐 Routes

- `/notifications` - Trang quản lý thông báo chính
- Dropdown notification có sẵn trong navbar

## 🔄 Real-time Updates

Hệ thống hỗ trợ:
- Auto-refresh mỗi 30 giây
- Browser notifications real-time
- Context state management cho sync across components

## 📱 Responsive Design

Tất cả components đã được thiết kế responsive sử dụng Bootstrap:
- Bootstrap grid system cho layout
- Responsive utilities cho mobile/desktop
- Bootstrap components cho consistent UI
- Touch-friendly buttons và interactions

## 🛠️ Troubleshooting

### Thông báo không hiển thị
1. Kiểm tra user đã đăng nhập
2. Kiểm tra API backend đang chạy
3. Kiểm tra console errors

### Browser notifications không hoạt động
1. Kiểm tra permission đã được cấp
2. Kiểm tra browser hỗ trợ Notification API
3. Thử refresh trang và cấp quyền lại

### Badge không cập nhật
1. Kiểm tra NotificationContext đã được wrap
2. Kiểm tra component sử dụng useNotifications hook
3. Kiểm tra network tab trong DevTools

## 🔮 Future Enhancements

- WebSocket integration cho real-time notifications
- Push notifications cho mobile
- Notification scheduling
- Advanced filtering và searching
- Email notifications integration
- Sound notifications
- Dark mode support
