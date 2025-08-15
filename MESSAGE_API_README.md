# Message API Integration

## Tổng quan

Frontend đã được tích hợp với Message API backend để hỗ trợ các tính năng tin nhắn. Không có thay đổi nào được thực hiện trên backend.

## Các API Endpoints được sử dụng

### 1. Conversation APIs
- `GET /api/conversations/user/{userId}` - Lấy danh sách conversations của user
- `POST /api/conversations/one-to-one` - Tạo hoặc lấy conversation 1-1
- `POST /api/conversations/create-group` - Tạo group conversation
- `PUT /api/conversations/{id}/update` - Cập nhật conversation
- `PUT /api/conversations/{id}/archive` - Archive conversation
- `POST /api/conversations/groups/{id}/avatar` - Upload group avatar

### 2. Message APIs
- `POST /api/messages/send` - Gửi tin nhắn (hỗ trợ file upload)
- `GET /api/messages/get-by-conversation` - Lấy messages theo conversation
- `POST /api/messages/get-by-id` - Lấy message theo ID
- `POST /api/messages/edit` - Chỉnh sửa message
- `PUT /api/messages/{id}/seen` - Đánh dấu đã xem
- `PUT /api/messages/{id}/recall` - Thu hồi message
- `GET /api/messages/search` - Tìm kiếm messages

### 3. Conversation Member APIs
- `POST /api/conversation-members/add` - Thêm member vào conversation
- `POST /api/conversation-members/members-by-conversation` - Lấy members của conversation
- `POST /api/conversation-members/remove` - Xóa member khỏi conversation

### 4. Message Status APIs
- `POST /api/message-statuses/mark-all-seen` - Đánh dấu tất cả messages đã xem

### 5. Attachment APIs
- `GET /api/attachments/message/{messageId}` - Lấy attachments theo message
- `GET /api/attachments/conversation/{conversationId}` - Lấy attachments theo conversation

## Cấu trúc dữ liệu

### Conversation Response
```json
{
  "id": "string",
  "name": "string", // null cho 1-1 conversation
  "group": boolean,
  "createdAt": "datetime",
  "lastMessage": {
    "lastMessageContent": "string",
    "lastMessageSenderName": "string",
    "lastMessageTimeAgo": "string",
    "lastMessageStatus": "string",
    "createdAt": "datetime",
    "seen": boolean
  },
  "avatarUrl": "string", // null cho 1-1 conversation
  "isBlocked": boolean,
  "blockedByMe": boolean,
  "blockedMe": boolean,
  "createdBy": "string",
  "members": [
    {
      "id": "string",
      "displayName": "string",
      "avatarUrl": "string"
    }
  ]
}
```

### Message Response
```json
{
  "id": "string",
  "conversationId": "string",
  "sender": {
    "id": "string",
    "displayName": "string",
    "avatarUrl": "string"
  },
  "content": "string",
  "messageType": "TEXT|IMAGE|FILE|VIDEO",
  "createdAt": "datetime",
  "replyToId": "string",
  "edited": boolean,
  "seen": boolean,
  "recalled": boolean,
  "attachments": [
    {
      "id": "string",
      "fileUrl": "string",
      "fileType": "string",
      "fileSize": "number",
      "originalFileName": "string"
    }
  ],
  "timeAgo": "string",
  "seenBy": [
    {
      "userId": "string",
      "displayName": "string",
      "avatarUrl": "string",
      "seenAt": "datetime"
    }
  ]
}
```

## Các tính năng đã implement

### 1. Hiển thị danh sách conversations
- Hiển thị cả 1-1 và group conversations
- Hiển thị tin nhắn cuối cùng và thời gian
- Hiển thị số tin nhắn chưa đọc
- Tìm kiếm conversations

### 2. Chat interface
- Hiển thị tin nhắn theo thời gian
- Phân biệt tin nhắn của mình và người khác
- Hỗ trợ gửi tin nhắn text
- Hiển thị trạng thái đã xem
- Hiển thị tin nhắn đã chỉnh sửa
- Hỗ trợ attachments (hình ảnh và file)

### 3. Message actions
- Gửi tin nhắn mới
- Chỉnh sửa tin nhắn
- Thu hồi tin nhắn
- Đánh dấu đã xem

## Cách sử dụng

### 1. Truy cập Messages
- Click vào icon Messages trong Navbar
- Hoặc truy cập `/messages` route

### 2. Gửi tin nhắn
- Chọn conversation từ danh sách bên trái
- Nhập tin nhắn vào ô input
- Nhấn Enter hoặc click nút gửi

### 3. Tìm kiếm conversations
- Sử dụng ô tìm kiếm ở đầu danh sách conversations

## Constants

### Message Types
```javascript
MESSAGE_TYPES = {
  TEXT: 'TEXT',
  IMAGE: 'IMAGE', 
  FILE: 'FILE',
  VIDEO: 'VIDEO'
}
```

### API Response Codes
```javascript
API_CODES = {
  SUCCESS: '00',
  ERROR: '01',
  NOT_FOUND: '02',
  UNAUTHORIZED: '03',
  VALIDATION_ERROR: '04',
  MISSING_PARAMETER: '05',
  FILE_TOO_LARGE: '06',
  SYSTEM_ERROR: '99'
}
```

## Lưu ý

1. **Authentication**: Tất cả API calls đều yêu cầu JWT token trong Authorization header
2. **File Upload**: Hỗ trợ upload file với FormData
3. **Pagination**: Messages được phân trang với page và size parameters
4. **Real-time**: Backend hỗ trợ WebSocket cho real-time messaging (chưa implement trong frontend)
5. **Error Handling**: Tất cả API calls đều có error handling và logging

## TODO

1. Implement WebSocket cho real-time messaging
2. Thêm tính năng typing indicator
3. Thêm tính năng reply to message
4. Thêm tính năng forward message
5. Thêm tính năng search messages
6. Thêm tính năng delete message
7. Thêm tính năng pin message
8. Thêm tính năng mute conversation
9. Thêm tính năng block user
10. Thêm tính năng group management


