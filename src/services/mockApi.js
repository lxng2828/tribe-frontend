// Mock API service cho development
// Sử dụng localStorage để mô phỏng database

const MOCK_USERS = [
    {
        id: 1,
        email: 'admin@tribe.com',
        password: '123456',
        fullName: 'Admin User',
        avatar: null
    },
    {
        id: 2,
        email: 'user@tribe.com',
        password: 'password',
        fullName: 'Demo User',
        avatar: null
    }
];

// Delay để mô phỏng network request
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API responses
const mockApi = {
    async post(endpoint, data) {
        await delay(1000); // Mô phỏng network delay

        switch (endpoint) {
            case '/auth/login':
                return this.handleLogin(data);

            case '/auth/register':
                return this.handleRegister(data);

            case '/auth/refresh':
                return this.handleRefreshToken();

            default:
                throw new Error(`Endpoint ${endpoint} not implemented`);
        }
    },

    handleLogin({ email, password }) {
        const user = MOCK_USERS.find(u => u.email === email && u.password === password);

        if (!user) {
            const error = new Error('Email hoặc mật khẩu không đúng');
            error.response = {
                status: 401,
                data: { message: 'Email hoặc mật khẩu không đúng' }
            };
            throw error;
        }

        const token = `mock-token-${user.id}-${Date.now()}`;
        const { password: _, ...userWithoutPassword } = user;

        return {
            data: {
                token,
                user: userWithoutPassword
            }
        };
    },

    handleRegister({ email, password, fullName }) {
        // Kiểm tra email đã tồn tại
        const existingUser = MOCK_USERS.find(u => u.email === email);
        if (existingUser) {
            const error = new Error('Email đã được sử dụng');
            error.response = {
                status: 400,
                data: { message: 'Email đã được sử dụng' }
            };
            throw error;
        }

        // Tạo user mới
        const newUser = {
            id: MOCK_USERS.length + 1,
            email,
            password,
            fullName,
            avatar: null
        };

        MOCK_USERS.push(newUser);

        const token = `mock-token-${newUser.id}-${Date.now()}`;
        const { password: _, ...userWithoutPassword } = newUser;

        return {
            data: {
                token,
                user: userWithoutPassword
            }
        };
    },

    handleRefreshToken() {
        const token = localStorage.getItem('token');
        if (!token || !token.startsWith('mock-token-')) {
            const error = new Error('Invalid token');
            error.response = { status: 401 };
            throw error;
        }

        // Tạo token mới
        const userId = token.split('-')[2];
        const newToken = `mock-token-${userId}-${Date.now()}`;

        return {
            data: {
                token: newToken
            }
        };
    }
};

export default mockApi;
