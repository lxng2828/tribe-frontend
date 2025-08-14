# Debug Lỗi 500 - Update Post với ảnh (Chi tiết)

## 🐛 **Lỗi hiện tại**
```
PUT http://localhost:8080/api/posts/5?userId=a033d64c-4286-4826-8827-f5b69af13f96 500 (Internal Server Error)
Update post error: AxiosError
Error updating post: Error: Đã xảy ra lỗi không xác định
```

## 🔍 **Nguyên nhân có thể**

### **1. File Upload Issues**
- **File permissions:** Không có quyền tạo thư mục `uploads`
- **File size:** File quá lớn (đã set 100MB)
- **File type:** File không được hỗ trợ
- **Empty files:** File rỗng

### **2. Database Issues**
- **Transaction rollback:** Lỗi trong quá trình lưu PostMedia
- **Foreign key constraint:** Lỗi khi liên kết PostMedia với Post
- **Database connection:** Mất kết nối database
- **Entity not found:** Post không tồn tại

### **3. Service Issues**
- **PostReactionService:** Lỗi khi lấy reaction count
- **PostCommentService:** Lỗi khi lấy comment count
- **FileStorageService:** Lỗi khi upload file

## 🔧 **Giải pháp đã thực hiện**

### **1. Enhanced Logging**
- ✅ **Controller:** Log metadata, files count, validation
- ✅ **Service:** Log postId, userId, content, file processing
- ✅ **FileStorageService:** Log file details, upload process, errors
- ✅ **ConvertToResponse:** Log từng bước conversion

### **2. Better Error Handling**
- ✅ **Input validation:** Kiểm tra metadata không rỗng
- ✅ **File validation:** Kiểm tra file null, empty
- ✅ **Exception catching:** Catch từng loại exception riêng biệt
- ✅ **Graceful degradation:** Tiếp tục xử lý nếu một file lỗi

### **3. Service Improvements**
- ✅ **File processing:** Kiểm tra file empty, log chi tiết
- ✅ **Database logging:** Log PostMedia creation và save
- ✅ **Response conversion:** Try-catch cho từng service call
- ✅ **Test controller:** Endpoint test upload

## 🧪 **Cách test và debug**

### **1. Test Health Check**
```bash
# Kiểm tra service có chạy không
curl http://localhost:8080/api/test/health
```

### **2. Test File Upload**
```bash
# Test upload file đơn giản
curl -X POST -F "file=@test.jpg" http://localhost:8080/api/test/upload-test
```

### **3. Kiểm tra Backend Logs**
Tìm các log sau trong console backend:
```
FileStorageService constructor - Testing upload directory: ...
Write permission test passed
Update post - postId: 5, userId: a033d64c-4286-4826-8827-f5b69af13f96
Metadata: {"content":"...","visibility":"PUBLIC"}
Files count: 1
File 0: image.jpg, size: 12345, content type: image/jpeg
PostService.updatePost - postId: 5, userId: a033d64c-4286-4826-8827-f5b69af13f96
Found post: 5, user: a033d64c-4286-4826-8827-f5b69af13f96
Saving updated post...
Post saved successfully with ID: 5
Processing 1 files...
Processing file 0: image.jpg, size: 12345, type: image/jpeg
Uploading file 0...
FileStorageService.uploadFile - Starting upload for: image.jpg
File uploaded to: /uploads/...
PostMedia 0 saved with ID: ...
Converting post to response...
Converting post 5 to response...
Setting user info for user: a033d64c-4286-4826-8827-f5b69af13f96
Set reaction count: 0
Set comment count: 0
Set reactions successfully
Set comments successfully
Set media URLs: 1 items
Post response conversion completed successfully
Response converted successfully
```

### **4. Kiểm tra Frontend Network**
- Mở DevTools → Network
- Tìm PUT request đến `/api/posts/5`
- Kiểm tra:
  - **Request payload:** FormData có đúng không
  - **Response status:** 500 hay 200
  - **Response body:** Error message chi tiết

## 🎯 **Các bước debug tiếp theo**

### **1. Restart Backend**
```bash
# Dừng backend
Ctrl+C

# Khởi động lại
cd message_tribe_service
./mvnw spring-boot:run
```

### **2. Kiểm tra Logs khi khởi động**
Tìm logs:
```
FileStorageService constructor - Testing upload directory: ...
Write permission test passed
```

### **3. Test với file nhỏ**
- Thử với file < 1MB
- Thử với file .jpg, .png
- Kiểm tra content type

### **4. Test database connection**
```sql
-- Kiểm tra post có tồn tại không
SELECT * FROM posts WHERE id = 5;

-- Kiểm tra user có tồn tại không
SELECT * FROM users WHERE id = 'a033d64c-4286-4826-8827-f5b69af13f96';
```

## 🔍 **Nếu vẫn có lỗi**

### **1. Check Environment Variables**
```bash
# Kiểm tra các biến môi trường
echo $DB_URL
echo $DB_USERNAME
echo $DB_PASSWORD
```

### **2. Check File Permissions**
```bash
# Kiểm tra quyền thư mục project
ls -la
# Đảm bảo có quyền ghi vào thư mục hiện tại
```

### **3. Check Database Logs**
```bash
# Kiểm tra logs database
tail -f /var/log/mysql/error.log
```

## 📋 **Expected Results**
- ✅ Backend logs hiển thị chi tiết quá trình xử lý
- ✅ File được upload thành công vào thư mục uploads
- ✅ PostMedia được lưu vào database
- ✅ Response trả về success với PostResponse
- ✅ Frontend nhận được response thành công

## 🚨 **Common Issues & Solutions**

### **Issue 1: File Permission Denied**
```
Error: Permission denied
Solution: chmod 755 uploads/
```

### **Issue 2: Database Connection Failed**
```
Error: Could not create connection to database server
Solution: Check DB_URL, DB_USERNAME, DB_PASSWORD
```

### **Issue 3: Entity Not Found**
```
Error: Không tìm thấy post
Solution: Check post ID exists in database
```

### **Issue 4: Transaction Rollback**
```
Error: Transaction rolled back
Solution: Check foreign key constraints
```

