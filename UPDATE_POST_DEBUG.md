# Debug lỗi Update Post với ảnh - Lỗi 500

## 🐛 **Vấn đề**
- Khi chỉnh sửa bài viết và thêm ảnh, hệ thống báo lỗi 500
- API call đúng nhưng backend xử lý sai

## 🔍 **Nguyên nhân đã tìm thấy**

### **1. Mismatch giữa Frontend và Backend**
- **Frontend:** Gửi metadata như JSON string trong FormData
- **Backend:** Đang sử dụng `@RequestPart("metadata")` với `UpdatePostRequest` object
- **Kết quả:** Spring không thể deserialize JSON string thành object

### **2. Inconsistency với CreatePost**
- **CreatePost:** Sử dụng `@RequestParam("metadata")` + JSON parsing
- **UpdatePost:** Sử dụng `@RequestPart("metadata")` + direct object mapping
- **Kết quả:** Không nhất quán, gây lỗi

## 🔧 **Giải pháp đã thực hiện**

### **1. Sửa Backend Controller**
**Trước:**
```java
@PutMapping(value = "/{postId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
public ApiResponse<PostResponse> updatePost(
    @PathVariable Long postId,
    @RequestParam String userId,
    @RequestPart("metadata") @Valid @NotNull UpdatePostRequest request,
    @RequestPart(value = "files", required = false) MultipartFile[] files
) {
    return postService.updatePost(postId, userId, request, files);
}
```

**Sau:**
```java
@PutMapping(value = "/{postId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
public ApiResponse<PostResponse> updatePost(
    @PathVariable Long postId,
    @RequestParam String userId,
    @RequestParam("metadata") String metadata,
    @RequestPart(value = "files", required = false) MultipartFile[] files
) throws JsonProcessingException {
    try {
        // Log để debug
        System.out.println("Update post - postId: " + postId + ", userId: " + userId);
        System.out.println("Metadata: " + metadata);
        System.out.println("Files count: " + (files != null ? files.length : 0));
        
        // Convert String JSON -> UpdatePostRequest object
        UpdatePostRequest request = objectMapper.readValue(metadata, UpdatePostRequest.class);
        
        // Log request object
        System.out.println("Parsed request - content: " + request.getContent() + 
                         ", visibility: " + request.getVisibility());
        
        return postService.updatePost(postId, userId, request, files);
    } catch (Exception e) {
        System.err.println("Error in updatePost: " + e.getMessage());
        e.printStackTrace();
        return ApiResponse.error("01", "Lỗi khi cập nhật post: " + e.getMessage());
    }
}
```

### **2. Cải thiện Frontend**
**Trước:**
```javascript
const response = await api.put(`/posts/${postId}`, formData, {
    params: { userId },
    headers: { 'Content-Type': 'multipart/form-data' }
});
```

**Sau:**
```javascript
const response = await api.put(`/posts/${postId}`, formData, {
    params: { userId }
    // Không set Content-Type header, để browser tự động set với boundary
});
```

### **3. Thêm Logging cho Debug**
- **Controller:** Log metadata, files count, parsed request
- **Service:** Log postId, userId, content, visibility, file upload process
- **Error handling:** Log chi tiết lỗi với stack trace

## 📋 **Các thay đổi chi tiết**

### **Backend Changes:**
1. **PostController.java:**
   - Thay `@RequestPart("metadata")` bằng `@RequestParam("metadata")`
   - Thêm JSON parsing với ObjectMapper
   - Thêm try-catch và logging
   - Thêm `throws JsonProcessingException`

2. **PostService.java:**
   - Thêm logging cho updatePost method
   - Log file upload process
   - Log error details

### **Frontend Changes:**
1. **postService.js:**
   - Cải thiện FormData handling
   - Loại bỏ manual Content-Type header
   - Thêm comments giải thích

## 🧪 **Cách test**

### **1. Test Update Post với ảnh:**
1. Tạo bài viết mới
2. Click "Chỉnh sửa"
3. Thêm ảnh mới
4. Click "Lưu"
5. Kiểm tra console logs

### **2. Kiểm tra Backend Logs:**
```bash
# Trong terminal backend, tìm các log:
Update post - postId: X, userId: Y
Metadata: {"content":"...","visibility":"PUBLIC"}
Files count: 1
Parsed request - content: ..., visibility: PUBLIC
PostService.updatePost - postId: X, userId: Y
Processing 1 files...
Uploading file: image.jpg, size: 12345, type: image/jpeg
File uploaded to: /uploads/...
```

### **3. Kiểm tra Frontend Network:**
- Mở DevTools → Network
- Tìm PUT request đến `/api/posts/{postId}`
- Kiểm tra Request payload có FormData đúng không
- Kiểm tra Response status và body

## 🎯 **Kết quả mong đợi**
- ✅ Update post với ảnh thành công
- ✅ Không còn lỗi 500
- ✅ Ảnh được upload và lưu đúng
- ✅ Logs hiển thị chi tiết quá trình xử lý
- ✅ Consistent với createPost API

## 🔍 **Nếu vẫn có lỗi**
1. Kiểm tra backend logs để xem lỗi cụ thể
2. Kiểm tra FileStorageService có hoạt động không
3. Kiểm tra database connection
4. Kiểm tra file permissions cho upload directory

