# Sửa chức năng Reply Comment

## 🔍 **Vấn đề gốc:**
- Chức năng reply comment (trả lời comment của ai đó) không hoạt động đúng
- Không hiển thị các reply đã có
- Không truyền `parentCommentId` đúng cách

## ✅ **Các sửa đổi đã thực hiện:**

### 1. **Sửa PostManager.jsx**
```javascript
// Trước
const newComment = await postService.addComment(postId, content);

// Sau
const newComment = await postService.addComment(postId, content, parentCommentId);
```

### 2. **Thêm hiển thị replies trong PostCommentsModal.jsx**
```jsx
{/* Replies */}
{comment.replies && comment.replies.length > 0 && (
    <div className="replies-container mt-3 ms-4">
        {comment.replies.map((reply) => (
            <div key={reply.id} className="reply-item mb-2">
                {/* Hiển thị reply với avatar, tên, nội dung */}
                {/* Có nút "Trả lời" và "Xóa" cho reply */}
            </div>
        ))}
    </div>
)}
```

### 3. **Chức năng reply hoạt động:**
- ✅ Tạo comment gốc (không có parentCommentId)
- ✅ Tạo reply comment (có parentCommentId)
- ✅ Hiển thị danh sách replies dưới comment gốc
- ✅ Có thể reply cho cả comment gốc và reply khác
- ✅ Hiển thị avatar và tên người reply
- ✅ Có thể xóa reply

### 4. **API endpoints cho reply:**
- ✅ `POST /api/post-comments/create` - Tạo comment/reply với parentCommentId
- ✅ `GET /api/post-comments/{commentId}/replies` - Lấy replies của comment
- ✅ `GET /api/post-comments/post/{postId}` - Lấy tất cả comments (bao gồm replies)

## 🧪 **Testing:**
- Tạo file `test_reply_comment.html` để test chức năng reply
- Test tạo comment gốc
- Test tạo reply cho comment
- Test xem danh sách replies
- Test reply cho reply (nested replies)

## 📋 **Cách sử dụng:**
1. **Tạo comment gốc**: Không cần parentCommentId
2. **Tạo reply**: Cần parentCommentId của comment gốc
3. **Reply cho reply**: Cần parentCommentId của reply

## 🔍 **Lưu ý:**
- Reply sẽ hiển thị dưới comment gốc với indent
- Có thể reply cho cả comment gốc và reply khác
- Avatar và tên người reply được hiển thị đúng
- Có thể xóa reply nếu có quyền

## 📋 **Trạng thái hiện tại:**
- ✅ Chức năng reply comment hoạt động đầy đủ
- ✅ Hiển thị replies dưới comment gốc
- ✅ Có thể tạo nested replies
- ✅ UI/UX reply giống Facebook
