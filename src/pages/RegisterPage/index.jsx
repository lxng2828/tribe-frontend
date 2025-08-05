import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Form, Input, Button, Typography, message } from 'antd';
import { MailOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import { signUpWithEmail } from '../../services/authService';
import { updateProfile } from 'firebase/auth';

const { Title, Link } = Typography;

const RegisterPageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f0f2f5;
`;

const RegisterCard = styled.div`
  width: 400px;
  padding: 40px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const RegisterPage = () => {
    const navigate = useNavigate();

    const onFinish = async (values) => {
        if (values.password !== values.confirm_password) {
            message.error('Mật khẩu xác nhận không khớp!');
            return;
        }
        try {
            const userCredential = await signUpWithEmail(values.email, values.password);
            await updateProfile(userCredential.user, {
                displayName: values.fullName
            });
            message.success('Đăng ký thành công! Vui lòng đăng nhập.');
            navigate('/login');
        } catch (error) {
            message.error(error.message);
        }
    };

    return (
        <RegisterPageWrapper>
            <RegisterCard>
                <Title level={3}>Tham gia Tribe</Title>
                <Form name="register" onFinish={onFinish} style={{ marginTop: '24px' }}>
                    <Form.Item name="fullName" rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}>
                        <Input prefix={<UserOutlined />} placeholder="Họ và Tên" size="large" />
                    </Form.Item>
                    <Form.Item name="email" rules={[{ required: true, type: 'email', message: 'Vui lòng nhập email hợp lệ!' }]}>
                        <Input prefix={<MailOutlined />} placeholder="Email" size="large" />
                    </Form.Item>
                    <Form.Item name="password" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}>
                        <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" size="large" />
                    </Form.Item>
                    <Form.Item name="confirm_password" rules={[{ required: true, message: 'Vui lòng xác nhận mật khẩu!' }]}>
                        <Input.Password prefix={<LockOutlined />} placeholder="Xác nhận mật khẩu" size="large" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" block size="large">Đăng ký</Button>
                    </Form.Item>
                    <Link onClick={() => navigate('/login')}>Đã có tài khoản? Đăng nhập</Link>
                </Form>
            </RegisterCard>
        </RegisterPageWrapper>
    );
};

export default RegisterPage;