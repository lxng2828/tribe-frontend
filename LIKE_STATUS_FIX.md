# Sửa lỗi trạng thái Like không hiển thị đúng

## Vấn đề
- Khi load lại trang, các bài viết đã được like nhưng nút like không hiển thị màu xanh
- Logic kiểm tra `liked` không đúng cách

## Nguyên nhân
- Logic cũ: `post.reactions.some(r => r.liked === true)` 
- Logic này sai vì `r.liked` không tồn tại trong response từ backend
- Cần kiểm tra xem user hiện tại có trong danh sách reactions không

## Giải pháp đã thực hiện

### 1. Sửa logic kiểm tra liked trong postService.js
**Trước:**
```javascript
liked: post.reactions ? post.reactions.some(r => r.liked === true) : false,
```

**Sau:**
```javascript
liked: post.reactions ? post.reactions.some(r => r.user?.senderId === getCurrentUserId() || r.user?.id === getCurrentUserId()) : false,
```

### 2. Thêm method checkUserLikeStatus
```javascript
// Kiểm tra user đã like post chưa
async checkUserLikeStatus(postId) {
    try {
        const userId = getCurrentUserId();
        const response = await api.get('/post-reactions/check', {
            params: { postId, userId }
        });
        const { status, data } = response.data;
        if (status.success) {
            return data; // true nếu đã like, false nếu chưa
        } else {
            return false;
        }
    } catch (error) {
        console.error('Error checking like status:', error);
        return false;
    }
}
```

### 3. Cải thiện PostManager để kiểm tra like status khi load posts
```javascript
// Cập nhật trạng thái like cho từng post
const postsWithLikeStatus = await Promise.all(
    response.posts.map(async (post) => {
        try {
            const isLiked = await postService.checkUserLikeStatus(post.id);
            return { ...post, liked: isLiked };
        } catch (error) {
            console.error(`Error checking like status for post ${post.id}:`, error);
            return post; // Giữ nguyên post nếu có lỗi
        }
    })
);
```

## Kết quả
- ✅ Nút like sẽ hiển thị đúng trạng thái khi load lại trang
- ✅ Logic kiểm tra like dựa trên user ID thay vì field không tồn tại
- ✅ Có fallback khi API check like status bị lỗi
- ✅ Tương thích với cả `senderId` và `id` từ backend

## Cách hoạt động
1. Khi load posts, hệ thống sẽ gọi API `/post-reactions/check` cho từng post
2. API trả về `true` nếu user đã like, `false` nếu chưa
3. Frontend cập nhật trạng thái `liked` cho từng post
4. UI hiển thị nút like với màu xanh nếu `liked: true`

## Lưu ý
- Method này có thể làm chậm việc load posts vì phải gọi nhiều API
- Có thể tối ưu bằng cách backend trả về trạng thái like trong response chính
- Hiện tại đã có fallback để không bị crash nếu API check like bị lỗi

