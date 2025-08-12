import api from '../../services/api';

class EditProfileService {
    // Lấy thông tin profile hiện tại
    async getCurrentProfile() {
        try {
            const response = await api.get('/users/profile');
            console.log('Profile API response:', response.data); // Log response thực tế
            const { status, data } = response.data;
            if (status?.code === '00' && data) {
                return data;
            }
            throw new Error(status?.message || 'Không thể lấy thông tin profile');
        } catch (error) {
            const message = error.response?.data?.status?.message || error.message || 'Lỗi khi lấy thông tin profile';
            throw new Error(message);
        }
    }

    // Cập nhật thông tin profile
    async updateProfile(profileData) {
        try {
            // Chỉ gửi các trường đúng với API docs
            const payload = {
                displayName: profileData.displayName,
                phoneNumber: profileData.phoneNumber || '',
                birthday: profileData.birthday || null
            };
            const response = await api.put('/users/profile', payload);
            // Chuẩn hóa lấy code, message đúng với API docs
            const code = response.data.code || response.data.status?.code;
            const message = response.data.message || response.data.status?.message;
            const data = response.data.data;
            if (code === '00') {
                return data;
            } else {
                throw new Error(message || 'Cập nhật profile thất bại');
            }
        } catch (error) {
            const message = error.response?.data?.message || error.message || 'Lỗi khi cập nhật profile';
            throw new Error(message);
        }
    }

    // Upload avatar
    async uploadAvatar(file) {
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await api.post('/users/avatar', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const { code, message, data } = response.data;

            if (code === '00') {
                return data.avatarUrl;
            } else {
                throw new Error(message || 'Upload avatar thất bại');
            }
        } catch (error) {
            const message = error.response?.data?.message || error.message || 'Lỗi khi upload avatar';
            throw new Error(message);
        }
    }

    // Đổi mật khẩu
    async changePassword(oldPassword, newPassword) {
        try {
            const response = await api.put('/users/change-password', {
                oldPassword,
                newPassword
            });

            const { code, message } = response.data;

            if (code === '00') {
                return message || 'Đổi mật khẩu thành công';
            } else {
                throw new Error(message || 'Đổi mật khẩu thất bại');
            }
        } catch (error) {
            const message = error.response?.data?.message || error.message || 'Lỗi khi đổi mật khẩu';
            throw new Error(message);
        }
    }
}

const editProfileService = new EditProfileService();
export default editProfileService;

