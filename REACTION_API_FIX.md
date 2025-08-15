# Sửa lỗi API Reaction Bài Viết

## Vấn đề gốc
- API reaction bài viết chưa hoạt động đúng
- Frontend gọi API nhưng không có phản hồi
- Logic toggle reaction chưa được xử lý đúng cách

## Các sửa lỗi đã thực hiện

### 1. Backend - Sửa PostReactionService.java

#### Sửa logic createReaction
- **Trước**: Kiểm tra user đã reaction thì trả về lỗi
- **Sau**: Nếu user đã reaction thì gọi updateReaction thay vì trả lỗi

```java
// Trước
if (postReactionRepository.existsByPostIdAndUserId(postId, userId)) {
    return ApiResponse.error("01", "User đã reaction post này rồi");
}

// Sau  
if (postReactionRepository.existsByPostIdAndUserId(postId, userId)) {
    // Nếu đã có reaction, cập nhật reaction type
    return updateReaction(postId, userId, request);
}
```

#### Thêm endpoint toggle mới trong PostReactionController.java
- **Endpoint**: `POST /api/post-reactions/toggle`
- **Chức năng**: Tạo reaction nếu chưa có, xóa reaction nếu đã có
- **Logic**: 
  - Kiểm tra user đã reaction chưa
  - Nếu đã có: xóa reaction
  - Nếu chưa có: tạo reaction mới + thông báo

```java
@PostMapping("/toggle")
public ApiResponse<Object> toggleReaction(
        @RequestParam Long postId,
        @RequestParam String userId,
        @RequestBody CreatePostReactionRequest request) {
    // Logic toggle reaction
}
```

### 2. Frontend - Sửa postService.js

#### Sửa hàm toggleReaction
- **Trước**: Gọi 2 API riêng biệt (check + create/delete)
- **Sau**: Gọi 1 API toggle duy nhất

```javascript
// Trước
const checkResponse = await api.get('/post-reactions/check', { params: { postId, userId } });
const hasReacted = checkResponse.data.data;
if (hasReacted) {
    await api.delete('/post-reactions/delete', { params: { postId, userId } });
} else {
    await api.post('/post-reactions/create', requestData, { params: { postId, userId } });
}

// Sau
const response = await api.post('/post-reactions/toggle', requestData, {
    params: { postId, userId }
});
```

#### Sửa PostItem.jsx
- Thêm loading state cho nút like
- Gọi API trực tiếp thay vì chỉ gọi callback
- Thêm error handling

```javascript
const handleLike = async () => {
    if (isLiking) return; // Prevent multiple clicks
    
    try {
        setIsLiking(true);
        const result = await postService.toggleReaction(post.id, 'LIKE');
        
        if (onLike) {
            onLike(post.id);
        }
    } catch (error) {
        console.error('Error toggling reaction:', error);
    } finally {
        setIsLiking(false);
    }
};
```

### 3. Cải thiện UX

#### Loading state
- Thêm spinner khi đang xử lý reaction
- Disable nút khi đang loading
- Thay đổi text thành "Đang xử lý..."

#### Error handling
- Thêm try-catch cho tất cả API calls
- Log lỗi để debug
- Có thể thêm toast notification sau này

## API Endpoints

### Reactions
- `POST /api/post-reactions/toggle` - Toggle reaction (tạo/xóa)
- `POST /api/post-reactions/create` - Tạo reaction mới
- `PUT /api/post-reactions/update` - Cập nhật reaction
- `DELETE /api/post-reactions/delete` - Xóa reaction
- `GET /api/post-reactions/check` - Kiểm tra user đã reaction chưa
- `GET /api/post-reactions/post/{postId}` - Lấy reactions của post
- `GET /api/post-reactions/user` - Lấy reaction của user trên post
- `GET /api/post-reactions/count/{postId}` - Đếm số reactions

## Cách test

### 1. Sử dụng file test
Mở file `test_reaction_api.html` trong browser để test API trực tiếp

### 2. Test trong ứng dụng
1. Đăng nhập vào ứng dụng
2. Vào trang News Feed
3. Click nút "Yêu thích" trên bài viết
4. Kiểm tra:
   - Nút chuyển thành "Đã thích"
   - Số like tăng lên
   - Click lại để unlike

## Lưu ý
- Cần restart backend sau khi sửa code
- Đảm bảo database có dữ liệu posts và users để test
- Kiểm tra console browser để xem log lỗi nếu có
