# Friendship Feature - Tính năng Kết bạn

Hệ thống kết bạn hoàn chỉnh cho ứng dụng Tribe, bao gồm gửi/nhận lời mời kết bạn, quản lý danh sách bạn bè và hiển thị trạng thái kết bạn.

## 🚀 Các tính năng chính

### 1. Gửi và nhận lời mời kết bạn
- **Gửi lời mời**: Từ trang tìm kiếm hoặc profile người dùng
- **Nhận lời mời**: Hiển thị thông báo và danh sách lời mời
- **Chấp nhận/Từ chối**: Xử lý lời mời kết bạn nhanh chóng
- **Theo dõi trạng thái**: Hiển thị trạng thái của lời mời đã gửi

### 2. Quản lý danh sách bạn bè
- **Hiển thị danh sách**: Xem tất cả bạn bè với thông tin chi tiết
- **Tương tác**: Nhắn tin, xem profile, hủy kết bạn
- **Tìm kiếm**: Tìm kiếm trong danh sách bạn bè
- **Sắp xếp**: Theo thời gian kết bạn, tên, hoạt động

### 3. Trạng thái kết bạn thông minh
- **Tự động cập nhật**: Hiển thị đúng trạng thái hiện tại
- **Responsive UI**: Thay đổi giao diện theo trạng thái
- **Feedback**: Thông báo thành công/lỗi rõ ràng

## 📁 Cấu trúc file

```
src/
├── services/
│   └── friendshipService.js            # Service gọi API friendship
├── components/
│   ├── FriendsList.jsx                 # Hiển thị danh sách bạn bè
│   ├── FriendRequests.jsx              # Quản lý lời mời kết bạn
│   └── FriendshipButton.jsx            # Button kết bạn thông minh
└── pages/
    └── FriendsPage.jsx                 # Trang quản lý bạn bè
```

## 🔧 API Endpoints được sử dụng

### Friendship Management
```javascript
// Gửi lời mời kết bạn
POST /api/friendships/send?senderId={senderId}&receiverId={receiverId}

// Chấp nhận lời mời kết bạn
POST /api/friendships/accept?senderId={senderId}&receiverId={receiverId}

// Từ chối lời mời kết bạn
POST /api/friendships/reject?senderId={senderId}&receiverId={receiverId}

// Lấy danh sách bạn bè
GET /api/friendships/friends?userId={userId}

// Lấy lời mời kết bạn nhận được
GET /api/friendships/friend-requests?userId={userId}

// Lấy lời mời kết bạn đã gửi
GET /api/friendships/sent-requests?senderId={senderId}

// Hủy kết bạn
DELETE /api/friendships/unfriend?senderId={senderId}&receiverId={receiverId}

// Lấy danh sách user bị chặn
GET /api/friendships/blocked-users?userId={userId}

// Bỏ chặn user
DELETE /api/friendships/unblock?senderId={senderId}&receiverId={receiverId}
```

## 🛠️ Cách sử dụng

### 1. Tích hợp FriendshipButton

```jsx
import FriendshipButton from '../components/FriendshipButton';

// Trong component
<FriendshipButton 
    targetUserId="user123"
    targetUserName="John Doe"
    onStatusChange={(userId, newStatus) => {
        console.log(`Trạng thái với ${userId}: ${newStatus}`);
    }}
/>
```

### 2. Hiển thị danh sách bạn bè

```jsx
import FriendsList from '../components/FriendsList';

// Hiển thị tất cả bạn bè
<FriendsList 
    userId={currentUser.id}
    showHeader={true}
/>

// Hiển thị giới hạn số lượng
<FriendsList 
    userId={currentUser.id}
    maxItems={9}
    showHeader={false}
/>
```

### 3. Quản lý lời mời kết bạn

```jsx
import FriendRequests from '../components/FriendRequests';

// Hiển thị lời mời kết bạn
<FriendRequests userId={currentUser.id} />
```

### 4. Sử dụng FriendshipService

```javascript
import friendshipService from '../services/friendshipService';

// Gửi lời mời kết bạn
const sendRequest = async () => {
    try {
        const response = await friendshipService.sendFriendRequest(senderId, receiverId);
        if (response.status.success) {
            console.log('Đã gửi lời mời kết bạn');
        }
    } catch (error) {
        console.error('Lỗi khi gửi lời mời:', error);
    }
};

// Lấy danh sách bạn bè
const loadFriends = async () => {
    try {
        const response = await friendshipService.getFriends(userId);
        const friends = response.data.map(friend => 
            friendshipService.formatFriendInfo(friend)
        );
        console.log('Danh sách bạn bè:', friends);
    } catch (error) {
        console.error('Lỗi khi tải bạn bè:', error);
    }
};

// Kiểm tra trạng thái kết bạn
const checkStatus = async () => {
    try {
        const status = await friendshipService.getFriendshipStatus(userId, targetUserId);
        console.log('Trạng thái kết bạn:', status.status);
        // Các trạng thái: 'FRIENDS', 'PENDING_SENT', 'PENDING_RECEIVED', 'NOT_FRIENDS'
    } catch (error) {
        console.error('Lỗi khi kiểm tra trạng thái:', error);
    }
};
```

## 📖 API Response Format

### Friend Object
```json
{
    "friendId": "user123",
    "friendName": "John Doe",
    "avatarUrl": "https://example.com/avatar.jpg",
    "acceptedAt": "2025-01-06T10:15:28"
}
```

### Friend Request Object
```json
{
    "id": "request123",
    "senderId": "user456",
    "receiverId": "user789",
    "senderName": "Jane Doe",
    "senderAvatar": "https://example.com/avatar2.jpg",
    "createdAt": "2025-01-06T10:15:28",
    "status": "PENDING"
}
```

### Friendship Status Response
```json
{
    "status": "FRIENDS", // hoặc "PENDING_SENT", "PENDING_RECEIVED", "NOT_FRIENDS"
    "isFriend": true,
    "hasSentRequest": false,
    "hasReceivedRequest": false
}
```

## 🎨 Customization

### Thay đổi giao diện FriendshipButton

```jsx
// Custom styling cho các trạng thái khác nhau
<FriendshipButton 
    targetUserId="user123"
    targetUserName="John Doe"
    className="custom-friendship-btn"
    size="sm" // sm, md, lg
    variant="outline" // solid, outline
/>
```

### Custom FriendsList layout

```jsx
// Grid layout
<FriendsList 
    userId={userId}
    layout="grid" // grid, list
    columns={4} // số cột trên desktop
    showActions={true} // hiển thị nút hành động
/>
```

## 🔄 Workflow

### Gửi lời mời kết bạn
1. **Người dùng tìm kiếm** → SearchResultsPage
2. **Nhấn nút "Kết bạn"** → FriendshipButton
3. **Gọi API gửi lời mời** → friendshipService.sendFriendRequest()
4. **Cập nhật UI** → Hiển thị "Đã gửi lời mời"
5. **Thông báo cho người nhận** → NotificationService

### Xử lý lời mời kết bạn
1. **Nhận thông báo** → NotificationDropdown
2. **Vào trang lời mời** → FriendsPage (tab requests)
3. **Chấp nhận/Từ chối** → FriendRequests component
4. **Gọi API xử lý** → friendshipService.acceptFriendRequest()
5. **Cập nhật danh sách** → Tự động refresh

### Quản lý bạn bè
1. **Vào trang bạn bè** → /friends
2. **Xem danh sách** → FriendsList component
3. **Tương tác** → Nhắn tin, xem profile, hủy kết bạn
4. **Tìm kiếm/Lọc** → Real-time search

## 🧪 Testing

### Test Cases cho FriendshipButton

1. **Người lạ**: Hiển thị nút "Kết bạn"
2. **Đã gửi lời mời**: Hiển thị "Đã gửi lời mời"
3. **Nhận được lời mời**: Hiển thị "Chấp nhận" và "Từ chối"
4. **Đã là bạn bè**: Hiển thị "Bạn bè" với dropdown
5. **Chính mình**: Không hiển thị nút

### Test Cases cho FriendsList

1. **Danh sách trống**: Hiển thị thông báo chưa có bạn bè
2. **Có bạn bè**: Hiển thị grid/list với thông tin đầy đủ
3. **Loading**: Hiển thị skeleton loading
4. **Error**: Hiển thị thông báo lỗi với nút retry
5. **Pagination**: Load thêm khi scroll (nếu có)

### Test Cases cho FriendRequests

1. **Không có lời mời**: Hiển thị thông báo trống
2. **Có lời mời nhận**: Hiển thị list với nút chấp nhận/từ chối
3. **Có lời mời gửi**: Hiển thị list với trạng thái "Đang chờ"
4. **Xử lý lời mời**: Test accept/reject thành công
5. **Loading states**: Test UI khi đang xử lý

## 🌐 User Experience

### Desktop
- Grid layout cho danh sách bạn bè
- Hover effects cho các nút tương tác
- Dropdown menu cho hành động nâng cao
- Modal confirmation cho hủy kết bạn

### Mobile
- List layout tối ưu cho touch
- Swipe actions cho quick actions
- Bottom sheet cho menu options
- Touch-friendly button sizes

## 🛠️ Troubleshooting

### FriendshipButton không cập nhật trạng thái
1. Kiểm tra userId trong AuthContext
2. Kiểm tra API response format
3. Xem console errors
4. Verify API endpoints

### FriendsList không load dữ liệu
1. Kiểm tra API `/friendships/friends`
2. Kiểm tra authentication token
3. Xem Network tab trong DevTools
4. Kiểm tra data mapping trong service

### API errors
1. Kiểm tra CORS settings
2. Verify API endpoints trong backend
3. Kiểm tra request parameters
4. Xem server logs

### Performance issues
1. Implement pagination cho large lists
2. Add debouncing cho search
3. Use memoization cho expensive computations
4. Optimize re-renders với React.memo

## 🔮 Future Enhancements

### Tính năng nâng cao
- **Friend suggestions**: Gợi ý kết bạn dựa trên mutual friends
- **Friend categories**: Phân loại bạn bè (gia đình, công việc, etc.)
- **Privacy settings**: Cho phép/từ chối lời mời từ stranger
- **Blocking system**: Chặn và bỏ chặn người dùng
- **Friend import**: Import từ contact/social networks

### UI/UX improvements
- **Infinite scroll**: Pagination không giới hạn
- **Advanced search**: Tìm kiếm với filters
- **Bulk actions**: Chọn nhiều để thực hiện hành động
- **Real-time updates**: WebSocket cho updates real-time
- **Animations**: Smooth transitions và micro-interactions

### Analytics
- **Friendship analytics**: Thống kê kết bạn
- **Activity tracking**: Theo dõi hoạt động bạn bè
- **Recommendation system**: ML-based friend suggestions
- **Social graph**: Visualization mối quan hệ

---

## 📝 Notes

- Tất cả API calls đều handle errors và hiển thị user-friendly messages
- Components đều responsive và accessible
- State management được optimize để tránh unnecessary re-renders
- Caching được implement cho frequently used data
- Loading states được handle consistently across components

## 🤝 Contributing

Khi thêm features mới cho friendship system:

1. Follow existing patterns trong codebase
2. Add proper error handling và loading states
3. Include unit tests cho logic components
4. Update documentation và API references
5. Test thoroughly trên mobile và desktop
