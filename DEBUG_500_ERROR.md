# Debug Lỗi 500 - Update Post với ảnh

## 🐛 **Lỗi hiện tại**
```
Failed to load resource: the server responded with a status of 500 ()
postService.js:284 Update post error: AxiosError
Error updating post: Error: Đã xảy ra lỗi không xác định
```

## 🔍 **Nguyên nhân có thể**

### **1. File Upload Issues**
- **File permissions:** Không có quyền tạo thư mục `uploads`
- **File size:** File quá lớn
- **File type:** File không được hỗ trợ
- **Empty files:** File rỗng

### **2. Database Issues**
- **Transaction rollback:** Lỗi trong quá trình lưu PostMedia
- **Foreign key constraint:** Lỗi khi liên kết PostMedia với Post
- **Database connection:** Mất kết nối database

### **3. JSON Parsing Issues**
- **Invalid JSON:** Metadata không đúng format
- **Missing fields:** Thiếu các field bắt buộc

## 🔧 **Giải pháp đã thực hiện**

### **1. Enhanced Logging**
- ✅ **Controller:** Log metadata, files count, validation
- ✅ **Service:** Log postId, userId, content, file processing
- ✅ **FileStorageService:** Log file details, upload process, errors
- ✅ **Constructor test:** Test tạo thư mục và quyền ghi

### **2. Better Error Handling**
- ✅ **Input validation:** Kiểm tra metadata không rỗng
- ✅ **File validation:** Kiểm tra file null, empty
- ✅ **Exception catching:** Catch từng loại exception riêng biệt
- ✅ **Detailed error messages:** Log chi tiết lỗi với stack trace

### **3. File Processing Improvements**
- ✅ **Empty file check:** Bỏ qua file rỗng
- ✅ **File size logging:** Log kích thước file
- ✅ **Content type logging:** Log loại file
- ✅ **Upload path logging:** Log đường dẫn upload

## 🧪 **Cách test và debug**

### **1. Kiểm tra Backend Logs**
```bash
# Tìm các log sau trong console backend:
FileStorageService constructor - Testing upload directory: ...
Write permission test passed
Update post - postId: X, userId: Y
Metadata: {"content":"...","visibility":"PUBLIC"}
Files count: 1
File 0: image.jpg, size: 12345, content type: image/jpeg
PostService.updatePost - postId: X, userId: Y
Processing 1 files...
FileStorageService.uploadFile - Starting upload for: image.jpg
File uploaded to: /uploads/...
PostMedia saved with ID: ...
```

### **2. Kiểm tra Frontend Network**
- Mở DevTools → Network
- Tìm PUT request đến `/api/posts/{postId}`
- Kiểm tra:
  - **Request payload:** FormData có đúng không
  - **Response status:** 500 hay 200
  - **Response body:** Error message chi tiết

### **3. Kiểm tra File System**
```bash
# Kiểm tra thư mục uploads
ls -la uploads/
# Kiểm tra quyền ghi
touch uploads/test.txt
rm uploads/test.txt
```

### **4. Kiểm tra Database**
```sql
-- Kiểm tra bảng post_media
SELECT * FROM post_media ORDER BY id DESC LIMIT 5;

-- Kiểm tra foreign key constraint
SELECT p.id, pm.id as media_id 
FROM posts p 
LEFT JOIN post_media pm ON p.id = pm.post_id 
WHERE p.id = [post_id];
```

## 🎯 **Các bước debug tiếp theo**

### **1. Restart Backend**
```bash
# Dừng backend
Ctrl+C

# Khởi động lại
./mvnw spring-boot:run
```

### **2. Kiểm tra Logs**
- Xem logs khi khởi động backend
- Tìm lỗi FileStorageService constructor
- Test upload một file đơn giản

### **3. Test với file nhỏ**
- Thử với file < 1MB
- Thử với file .jpg, .png
- Kiểm tra content type

### **4. Kiểm tra Database**
- Xem có lỗi transaction không
- Kiểm tra foreign key constraints
- Xem có lỗi connection pool không

## 🔍 **Nếu vẫn có lỗi**

### **1. Check Application Properties**
```properties
# Kiểm tra cấu hình file upload
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB
```

### **2. Check Database Configuration**
```properties
# Kiểm tra kết nối database
spring.datasource.url=jdbc:mysql://localhost:3306/...
spring.jpa.hibernate.ddl-auto=update
```

### **3. Check File Permissions**
```bash
# Kiểm tra quyền thư mục project
ls -la
# Đảm bảo có quyền ghi vào thư mục hiện tại
```

## 📋 **Expected Results**
- ✅ Backend logs hiển thị chi tiết quá trình xử lý
- ✅ File được upload thành công vào thư mục uploads
- ✅ PostMedia được lưu vào database
- ✅ Response trả về success với PostResponse
- ✅ Frontend nhận được response thành công

