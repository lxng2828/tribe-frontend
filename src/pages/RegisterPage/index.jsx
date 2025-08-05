import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { Form, Input, Button, Typography, message } from 'antd';
import { MailOutlined, LockOutlined, UserOutlined, PhoneOutlined } from '@ant-design/icons';
import { signUpWithEmail } from '../../services/authService';
import { updateProfile } from 'firebase/auth';

const { Title, Link, Text } = Typography;

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const gradientAnimation = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

const shimmer = keyframes`
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
`;

const RegisterPageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(-45deg, #8B5CF6, #A78BFA, #C084FC, #DDD6FE, #EDE9FE);
  background-size: 400% 400%;
  animation: ${gradientAnimation} 15s ease infinite;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(5px);
  }
`;

const RegisterCard = styled.div`
  width: 420px;
  padding: 48px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  text-align: center;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  animation: ${fadeInUp} 0.8s ease-out;
  position: relative;
  z-index: 2;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.1), transparent);
    animation: ${shimmer} 3s infinite;
  }
`;

const RegisterPage = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm(); // Thêm useForm để quản lý form tốt hơn

    const onFinish = async (values) => {
        if (values.password !== values.confirm_password) {
            message.error('Mật khẩu xác nhận không khớp!');
            return;
        }
        try {
            const userCredential = await signUpWithEmail(values.email, values.password);
            await updateProfile(userCredential.user, {
                displayName: values.fullName,
            });
            message.success('Đăng ký thành công! Vui lòng đăng nhập.');
            form.resetFields(); // Reset form sau khi đăng ký thành công
            navigate('/login');
        } catch (error) {
            message.error(error.message || 'Đăng ký thất bại, vui lòng thử lại!');
        }
    };

    return (
        <RegisterPageWrapper>
            <RegisterCard>
                <Title level={2} style={{ marginBottom: 8, color: '#8B5CF6' }}>
                    Tham gia cùng chúng tôi! 🚀
                </Title>
                <Text type="secondary" style={{ fontSize: 16, marginBottom: 32 }}>
                    Tạo tài khoản để bắt đầu hành trình mới
                </Text>
                <Form
                    form={form}
                    name="register"
                    onFinish={onFinish}
                    style={{ marginTop: '24px' }}
                    layout="vertical" // Sử dụng layout vertical để nhãn rõ ràng hơn
                >
                    <Form.Item
                        name="fullName"
                        label="Họ và Tên"
                        rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
                    >
                        <Input prefix={<UserOutlined />} placeholder="Họ và Tên" size="large" />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            { required: true, message: 'Vui lòng nhập email!' },
                            { type: 'email', message: 'Vui lòng nhập email hợp lệ!' },
                        ]}
                    >
                        <Input prefix={<MailOutlined />} placeholder="Email" size="large" />
                    </Form.Item>
                    <Form.Item
                        name="number"
                        label="Số điện thoại"
                        rules={[
                            { required: true, message: 'Vui lòng nhập số điện thoại!' },
                            {
                                pattern: /^[0-9]{10,11}$/,
                                message: 'Số điện thoại phải có 10-11 chữ số!',
                            },
                        ]}
                    >
                        <Input prefix={<PhoneOutlined />} placeholder="Số điện thoại" size="large" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        label="Mật khẩu"
                        rules={[
                            { required: true, message: 'Vui lòng nhập mật khẩu!' },
                            { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' },
                        ]}
                    >
                        <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" size="large" />
                    </Form.Item>
                    <Form.Item
                        name="confirm_password"
                        label="Xác nhận mật khẩu"
                        dependencies={['password']}
                        rules={[
                            { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password prefix={<LockOutlined />} placeholder="Xác nhận mật khẩu" size="large" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" block size="large">
                            Đăng ký
                        </Button>
                    </Form.Item>
                    <Link onClick={() => navigate('/login')}>
                        Đã có tài khoản? Đăng nhập
                    </Link>
                </Form>
            </RegisterCard>
        </RegisterPageWrapper>
    );
};

export default RegisterPage;