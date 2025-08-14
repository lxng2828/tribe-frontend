# 📝 Posts API - Cấu trúc mới

## 🎯 Tổng quan

API Posts đã được cập nhật với cấu trúc response mới, hỗ trợ đầy đủ thông tin về bài viết, reactions, comments và media.

## 📋 Cấu trúc API Response

### Endpoint chính
```
GET /api/posts/all
```

### Response Format
```json
{
    "status": {
        "code": "00",
        "success": true,
        "message": "Success",
        "responseTime": "2025-08-14T08:56:53+07:00",
        "displayMessage": "Lấy danh sách posts thành công"
    },
    "data": [
        {
            "id": 17,
            "user": {
                "senderId": "2657a6c2-0cc8-4aa9-a27b-2c3ff67a0a7f",
                "nameSender": "Long",
                "avatarSender": null
            },
            "content": "Nội dung bài viết",
            "visibility": "PUBLIC",
            "createdAt": "2025-08-14T08:21:19.70395",
            "updatedAt": "2025-08-14T08:21:19.70395",
            "reactionCount": 0,
            "commentCount": 0,
            "reactions": [],
            "comments": [],
            "mediaUrls": []
        }
    ]
}
```

## 🔧 Cập nhật PostService

### Các thay đổi chính:

1. **Xử lý cấu trúc user mới**:
   - `user.senderId` thay vì `user.id`
   - `user.nameSender` thay vì `user.name`
   - `user.avatarSender` thay vì `user.avatar`

2. **Xử lý reactions**:
   - `reaction.reactionType` (LIKE, LOVE, WOW, etc.)
   - `reaction.user` với cấu trúc mới

3. **Xử lý comments**:
   - Hỗ trợ nested comments với `replies`
   - `comment.user` với cấu trúc mới

4. **Xử lý media**:
   - `mediaUrls` array chứa đường dẫn ảnh

## 📱 Sử dụng trong React Components

### PostList Component
```jsx
import PostList from '../features/posts/PostList';

// Sử dụng trong component
<PostList 
    userId={optionalUserId} 
    isUserPosts={false} 
    ref={postListRef}
/>
```

### PostItem Component
```jsx
import PostItem from '../features/posts/PostItem';

// Sử dụng trong component
<PostItem 
    post={postData} 
    onLike={handleLike} 
    onDelete={handleDelete}
/>
```

## 🧪 Test API

### File test: `test_posts_api.html`

Mở file này trong trình duyệt để test API:

1. **Lấy tất cả bài viết**: Test endpoint `/api/posts/all`
2. **Lấy bài viết theo trang**: Test pagination với `page` và `size`
3. **Thống kê**: Xem thống kê về bài viết, reactions, comments

### Chạy test:
```bash
# Mở file trong trình duyệt
open test_posts_api.html
```

## 📊 Cấu trúc dữ liệu chi tiết

### Post Object
```typescript
interface Post {
    id: number;
    user: {
        senderId: string;
        nameSender: string;
        avatarSender: string | null;
    };
    content: string;
    visibility: 'PUBLIC' | 'FRIENDS' | 'PRIVATE';
    createdAt: string;
    updatedAt: string;
    reactionCount: number;
    commentCount: number;
    reactions: Reaction[];
    comments: Comment[];
    mediaUrls: string[];
}
```

### Reaction Object
```typescript
interface Reaction {
    id: number;
    user: {
        senderId: string;
        nameSender: string;
        avatarSender: string | null;
    };
    reactionType: 'LIKE' | 'LOVE' | 'WOW' | 'HAHA' | 'SAD' | 'ANGRY';
    createdAt: string;
}
```

### Comment Object
```typescript
interface Comment {
    id: number;
    user: {
        senderId: string;
        nameSender: string;
        avatarSender: string | null;
    };
    content: string;
    parentCommentId: number | null;
    createdAt: string;
    replies: Comment[] | null;
}
```

## 🔄 Các API Endpoints khác

### Tạo bài viết
```javascript
// POST /api/posts/create-simple
const newPost = await postService.createPost({
    content: "Nội dung bài viết",
    visibility: "PUBLIC"
});
```

### Like/Unlike bài viết
```javascript
// POST /api/posts/{postId}/like
const result = await postService.toggleLike(postId);
```

### Xóa bài viết
```javascript
// DELETE /api/posts/{postId}
const success = await postService.deletePost(postId);
```

### Lấy bài viết theo user
```javascript
// GET /api/posts/all (filtered by userId)
const userPosts = await postService.getPostsByUser(userId, page, size);
```

## 🎨 Styling

### CSS Classes chính:
- `.post-fb`: Container chính của bài viết
- `.post-header-fb`: Header với avatar và thông tin user
- `.profile-pic-fb`: Avatar user
- `.visibility-badge`: Badge hiển thị quyền riêng tư

### Visibility Badges:
- `visibility-public`: Công khai (xanh)
- `visibility-friends`: Bạn bè (vàng)
- `visibility-private`: Riêng tư (đỏ)

## 🚀 Deployment

### Backend API:
- Base URL: `http://localhost:8080/api`
- CORS đã được cấu hình
- Authentication với Bearer token

### Frontend:
- React app với Vite
- Axios cho HTTP requests
- Interceptors cho token management

## 📝 Notes

1. **Avatar handling**: Nếu `avatarSender` là null, sẽ sử dụng placeholder avatar
2. **Media URLs**: Tự động thêm base URL nếu cần
3. **Date formatting**: Tự động format thời gian (vừa xong, X giờ trước, X ngày trước)
4. **Error handling**: Graceful fallback khi API không khả dụng
5. **Pagination**: Hỗ trợ infinite scroll với `hasMore` flag

## 🔧 Troubleshooting

### Lỗi thường gặp:

1. **CORS Error**: Kiểm tra backend CORS configuration
2. **401 Unauthorized**: Kiểm tra token trong localStorage
3. **404 Not Found**: Kiểm tra API endpoint URL
4. **500 Server Error**: Kiểm tra backend logs

### Debug:
```javascript
// Enable debug logging
console.log('API Response:', response.data);
console.log('Post data:', post);
```

## 📞 Support

Nếu gặp vấn đề, hãy kiểm tra:
1. Console logs trong browser
2. Network tab trong DevTools
3. Backend logs
4. API documentation
