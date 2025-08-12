// editProfileService.js

import api from '../../services/api';

class EditProfileService {
    // Lấy thông tin profile hiện tại
    async getCurrentProfile() {
        try {
            const response = await api.get('/users/profile');
            const { status, data } = response.data;
            if (status?.code === '00' && data) {
                return data;
            }
            throw new Error(status?.displayMessage || 'Không thể lấy thông tin profile');
        } catch (error) {
            const message = error.response?.data?.status?.displayMessage || error.message;
            throw new Error(message);
        }
    }

    // Cập nhật thông tin profile (đã thêm email)
    async updateProfile(profileData) {
        try {
            // Payload giờ đây bao gồm cả email để khớp với API docs
            const payload = {
                displayName: profileData.displayName,
                phoneNumber: profileData.phoneNumber || '',
                email: profileData.email || '',
                birthday: profileData.birthday || null
            };
            const response = await api.put('/users/profile', payload);

            const { status, data } = response.data;
            if (status?.code === '00') {
                return data;
            } else {
                throw new Error(status?.displayMessage || 'Cập nhật profile thất bại');
            }
        } catch (error) {
            const message = error.response?.data?.status?.displayMessage || error.message;
            throw new Error(message);
        }
    }

    // Đổi mật khẩu (đã sửa tên trường để khớp API)
    async changePassword(currentPassword, newPassword) {
        try {
            // Sửa tên trường `oldPassword` -> `currentPassword`
            const response = await api.put('/users/change-password', {
                currentPassword,
                newPassword
            });

            const { status } = response.data;

            if (status?.code === '00') {
                return status.displayMessage || 'Đổi mật khẩu thành công';
            } else {
                throw new Error(status?.displayMessage || 'Đổi mật khẩu thất bại');
            }
        } catch (error) {
            const message = error.response?.data?.status?.displayMessage || error.message;
            throw new Error(message);
        }
    }
}

const editProfileService = new EditProfileService();
export default editProfileService;