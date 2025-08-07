# User Search System - Hệ thống Tìm kiếm Người dùng

Hệ thống tìm kiếm người dùng hoàn chỉnh cho ứng dụng Tribe, được tích hợp vào navbar và hỗ trợ tìm kiếm real-time.

## 🚀 Các tính năng chính

### 1. Search Bar tích hợp navbar
- **SearchBar Component**: Thanh tìm kiếm với dropdown kết quả
- **Real-time search**: Tìm kiếm ngay khi người dùng gõ
- **Debounced search**: Giảm số lần gọi API
- **Auto-complete dropdown**: Hiển thị kết quả ngay dưới ô tìm kiếm

### 2. Search Results
- **UserSearchDropdown**: Dropdown hiển thị 5 kết quả đầu tiên
- **SearchResultsPage**: Trang hiển thị tất cả kết quả tìm kiếm
- **User profiles**: Click để xem profile người dùng
- **Mobile responsive**: Hỗ trợ đầy đủ trên mobile

### 3. API Integration
- **Search by email**: Tìm kiếm theo email (chính hoặc gần đúng)
- **Find exact email**: Tìm email chính xác
- **User details**: Lấy thông tin chi tiết người dùng

## 📁 Cấu trúc file

```
src/
├── services/
│   └── userService.js                  # Service gọi API user search
├── components/
│   ├── SearchBar.jsx                   # Thanh tìm kiếm chính
│   ├── UserSearchDropdown.jsx          # Dropdown kết quả tìm kiếm
│   └── UserSearchTestPanel.jsx         # Panel test (development)
└── pages/
    └── SearchResultsPage.jsx           # Trang kết quả tìm kiếm đầy đủ
```

## 🔧 Cài đặt và sử dụng

### 1. Đã tích hợp vào Navbar
```jsx
import SearchBar from './SearchBar';

// Trong Navbar component
<SearchBar style={{ width: '240px' }} />
```

### 2. API Endpoints được sử dụng
```javascript
// Tìm kiếm theo email
GET /api/users/search?email={email}

// Tìm email chính xác  
GET /api/users/find?email={email}

// Lấy thông tin user theo ID
GET /api/users/{userId}
```

### 3. Routes đã thêm
```javascript
// Route cho trang tìm kiếm
/search?q={query}

// Route cho profile user
/profile/{userId}
```

## 📖 API Reference

### UserService Methods

#### `searchUsers(keyword)`
Tìm kiếm người dùng theo từ khóa
```javascript
const results = await userService.searchUsers('john@example.com');
```

#### `searchUsersByEmail(email)`
Tìm kiếm người dùng theo email (gần đúng)
```javascript
const results = await userService.searchUsersByEmail('john');
```

#### `findUserByEmail(email)`
Tìm người dùng theo email chính xác
```javascript
const user = await userService.findUserByEmail('john@example.com');
```

#### `getUserById(userId)`
Lấy thông tin người dùng theo ID
```javascript
const user = await userService.getUserById('user123');
```

## 🎨 Customization

### Thay đổi debounce delay
Chỉnh sửa trong `UserSearchDropdown.jsx`:
```javascript
// 300ms -> 500ms
const debouncedSearch = userService.debounce(async (query) => {
    // ...
}, 500);
```

### Thay đổi số lượng kết quả hiển thị
Chỉnh sửa trong `UserSearchDropdown.jsx`:
```javascript
// Hiển thị tối đa 10 kết quả thay vì 5
{searchResults.length >= 10 && (
    // "Xem tất cả kết quả" button
)}
```

### Custom styling
Sử dụng Bootstrap classes hoặc CSS:
```css
/* Custom search bar styling */
.search-bar-custom {
    border-radius: 25px;
    background: var(--fb-gray);
}

/* Custom dropdown styling */
.search-dropdown-custom {
    max-height: 400px;
    border-radius: 12px;
}
```

## 🧪 Testing

### Sử dụng Test Panel
1. Vào trang `/search`
2. Nhấn nút "Hiện Test Panel"
3. Thử các từ khóa mẫu hoặc nhập tùy chỉnh
4. Xem kết quả API và format data

### Test từ khóa mẫu
- `admin@example.com`
- `user@test.com` 
- `john.doe@gmail.com`
- `test`
- `admin`

### Test Cases
1. **Email chính xác**: Nhập email đầy đủ
2. **Email một phần**: Nhập một phần email
3. **Không có kết quả**: Nhập email không tồn tại
4. **Từ khóa ngắn**: Nhập < 2 ký tự (không tìm kiếm)
5. **Đặc biệt ký tự**: Test với ký tự đặc biệt

## 🌐 User Experience

### Desktop
- Thanh tìm kiếm ở navbar
- Dropdown hiển thị kết quả real-time
- Click outside để đóng dropdown
- Keyboard navigation (ESC để đóng)

### Mobile  
- Thanh tìm kiếm trong mobile menu
- Full-screen dropdown experience
- Touch-friendly interface

## 🔄 Workflow

1. **User gõ từ khóa** → SearchBar component
2. **Debounced API call** → userService.searchUsers()
3. **Hiển thị dropdown** → UserSearchDropdown component
4. **Click "Xem tất cả"** → Navigate to /search page
5. **Click user** → Navigate to /profile/{userId}

## 🛠️ Troubleshooting

### Không có kết quả tìm kiếm
1. Kiểm tra API backend đang chạy
2. Kiểm tra endpoint `/api/users/search`
3. Xem Network tab trong DevTools
4. Kiểm tra user data trong database

### Dropdown không hiển thị
1. Kiểm tra searchQuery >= 2 ký tự
2. Kiểm tra state showDropdown
3. Kiểm tra CSS z-index
4. Kiểm tra position styling

### API errors
1. Kiểm tra CORS settings
2. Kiểm tra authentication token
3. Kiểm tra API response format
4. Xem console errors

## 🔮 Future Enhancements

- **Advanced search**: Tìm kiếm theo tên, số điện thoại
- **Search history**: Lưu lịch sử tìm kiếm
- **Recent searches**: Hiển thị tìm kiếm gần đây
- **Search suggestions**: Gợi ý từ khóa phổ biến
- **Fuzzy search**: Tìm kiếm mờ, chịu lỗi chính tả
- **Search filters**: Lọc theo thời gian, vị trí
- **Search analytics**: Thống kê từ khóa tìm kiếm
- **Voice search**: Tìm kiếm bằng giọng nói
