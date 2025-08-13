# Hệ thống Avatar Đồng bộ - Tribe Frontend

## Tổng quan

Hệ thống avatar đồng bộ đã được cập nhật để đảm bảo tất cả avatar trong ứng dụng được hiển thị nhất quán và đồng bộ với avatar người dùng, **bao gồm cả avatar trong bài đăng**. Ngoài ra, **trang cá nhân chỉ hiển thị bài đăng của người dùng đó**.

## Các tính năng chính

### 1. Utility Functions

#### `getAvatarUrl(user, fallbackAvatar)`
- Xử lý avatar cho user object
- Ưu tiên: `avatarUrl` > `avatar` > `profilePicture`
- Tạo placeholder dựa trên tên nếu không có avatar
- Fallback về DEFAULT_AVATAR

#### `getPostAuthorAvatar(post, fallbackAvatar)`
- Xử lý avatar cho tác giả bài đăng
- Ưu tiên: `author.avatarUrl` > `author.avatar` > `author.profilePicture` > `avatarSender`
- Tạo placeholder dựa trên tên tác giả

#### `getCommentAuthorAvatar(comment, fallbackAvatar)`
- Xử lý avatar cho tác giả bình luận
- Tương tự như `getPostAuthorAvatar`

### 2. Component Avatar

```jsx
import Avatar from '../components/Avatar';

// Sử dụng cơ bản
<Avatar user={user} />

// Với kích thước tùy chỉnh
<Avatar user={user} size="lg" />

// Với className và style
<Avatar 
    user={user} 
    size="md" 
    className="me-3"
    onClick={() => handleAvatarClick(user)}
/>
```

### 3. Hook useAvatarSync

```jsx
import { useAvatarSync } from '../hooks/useAvatarSync';

const { user, refreshAvatar, forceRefreshAvatar } = useAvatarSync();

// Force refresh avatar khi cần
await forceRefreshAvatar();
```

### 4. Hook usePostAvatarSync

```jsx
import { usePostAvatarSync } from '../hooks/usePostAvatarSync';

const { posts: syncedPosts, refreshAllAvatars } = usePostAvatarSync(posts);

// Tự động đồng bộ avatar bài đăng với avatar user thực tế
```

### 5. Lọc Bài đăng Trang Cá nhân

```jsx
// Trong ProfilePage.jsx
<PostList ref={postListRef} userId={targetUserId} isUserPosts={true} />

// Trong PostList.jsx - Tự động lọc bài đăng theo userId
if (userId) {
    response = await postService.getPostsByUser(userId, pageNumber);
}
```

## Cách sử dụng

### Thay thế avatar cũ

**Trước:**
```jsx
<img src={user?.avatar || DEFAULT_AVATAR} alt="User" />
```

**Sau:**
```jsx
import { getAvatarUrl } from '../utils/placeholderImages';

<img src={getAvatarUrl(user)} alt="User" />
```

### Sử dụng component Avatar

**Trước:**
```jsx
<img 
    src={user?.avatar || DEFAULT_AVATAR} 
    alt="User" 
    className="profile-pic-fb me-3"
    style={{ width: '48px', height: '48px' }}
/>
```

**Sau:**
```jsx
import Avatar from '../components/Avatar';

<Avatar 
    user={user} 
    size="md" 
    className="me-3"
/>
```

## Các component đã được cập nhật

1. **PostItem.jsx** - Avatar tác giả bài đăng và bình luận
2. **CreatePost.jsx** - Avatar người dùng hiện tại
3. **Navbar.jsx** - Avatar trong dropdown menu
4. **ProfilePage.jsx** - Avatar profile với đồng bộ bài đăng + lọc bài đăng theo user
5. **UserSearchDropdown.jsx** - Avatar trong kết quả tìm kiếm
6. **SearchResultsPage.jsx** - Avatar trong trang kết quả
7. **ChatWindow.jsx** - Avatar conversation
8. **ConversationList.jsx** - Avatar conversation list
9. **NewConversationModal.jsx** - Avatar trong modal
10. **MessageItem.jsx** - Avatar người gửi tin nhắn
11. **FriendCard.jsx** - Avatar bạn bè
12. **FriendRequests.jsx** - Avatar yêu cầu kết bạn
13. **postService.js** - Logic xử lý avatar cải thiện + lọc bài đăng theo user
14. **PostList.jsx** - Sử dụng usePostAvatarSync hook + logic lọc bài đăng
15. **NewsFeed.jsx** - Đồng bộ avatar trong newsfeed
16. **usePostAvatarSync.js** - Hook đồng bộ avatar bài đăng


## Lợi ích

1. **Nhất quán**: Tất cả avatar được xử lý theo cùng một cách
2. **Dễ bảo trì**: Chỉ cần cập nhật utility functions
3. **Fallback tốt**: Luôn có avatar hiển thị, không bị lỗi
4. **Performance**: Tạo placeholder dựa trên tên thay vì tải ảnh mặc định
5. **Đồng bộ**: Avatar được cập nhật ngay lập tức khi user thay đổi
6. **Đồng bộ bài đăng**: Avatar trong bài đăng tự động đồng bộ với avatar user thực tế
7. **Lọc bài đăng**: Trang cá nhân chỉ hiển thị bài đăng của người dùng đó

## Cách thêm avatar mới

1. Import utility function:
```jsx
import { getAvatarUrl } from '../utils/placeholderImages';
```

2. Sử dụng trong component:
```jsx
<img src={getAvatarUrl(user)} alt="User" />
```

3. Hoặc sử dụng component Avatar:
```jsx
import Avatar from '../components/Avatar';
<Avatar user={user} />
```

## Lưu ý

- Tất cả avatar URL sẽ được tự động thêm base URL nếu cần
- Placeholder avatar sẽ được tạo dựa trên tên người dùng
- Avatar sẽ được đồng bộ ngay lập tức khi user cập nhật
- Component Avatar hỗ trợ nhiều kích thước khác nhau
- Avatar trong bài đăng sẽ tự động đồng bộ với avatar user thực tế
- Hook usePostAvatarSync tự động xử lý việc đồng bộ avatar bài đăng
- Trang cá nhân tự động lọc và chỉ hiển thị bài đăng của người dùng đó 