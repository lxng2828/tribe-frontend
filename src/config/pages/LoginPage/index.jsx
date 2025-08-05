import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Form, Input, Button, Checkbox, Typography, Divider, message } from 'antd';
import { MailOutlined, LockOutlined, GoogleOutlined } from '@ant-design/icons';
import { logInWithEmail, signInWithGoogle } from '../../../services/authService';

import tribeLogo from '../../../assets/images/primary_logo.png';

const { Title, Text, Link } = Typography;

const LoginPageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f0f2f5;
`;

const LoginCard = styled.div`
  width: 400px;
  padding: 40px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const LogoImage = styled.img`
  width: 150px;
  margin-bottom: 24px;
`;

const StyledButton = styled(Button)`
  transition: all 0.3s ease;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const LoginPage = () => {
    const navigate = useNavigate();

    const onFinish = async (values) => {
        try {
            await logInWithEmail(values.email, values.password);
            message.success('Đăng nhập thành công!');
            navigate('/');
        } catch (error) {
            message.error('Email hoặc mật khẩu không đúng. Vui lòng thử lại.');
            console.error("Login Error:", error);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            await signInWithGoogle();
            message.success('Đăng nhập với Google thành công!');
            navigate('/');
        } catch (error) {
            message.error('Đã có lỗi xảy ra khi đăng nhập với Google.');
            console.error("Google Login Error:", error);
        }
    };


    return (
        <LoginPageWrapper>
            <LoginCard>
                <LogoImage src={tribeLogo} alt="Tribe Logo" />
                <Title level={3}>Chào mừng trở lại!</Title>
                <Text type="secondary">Đăng nhập để tiếp tục với Tribe</Text>

                <Form
                    name="normal_login"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    style={{ marginTop: '24px' }}
                >
                    <Form.Item
                        name="email"
                        rules={[{ required: true, type: 'email', message: 'Vui lòng nhập email hợp lệ!' }]}
                    >
                        <Input prefix={<MailOutlined />} placeholder="Email" size="large" />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                    >
                        <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" size="large" />
                    </Form.Item>

                    <Form.Item>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Checkbox>Ghi nhớ tôi</Checkbox>
                            <Link href="#">Quên mật khẩu?</Link>
                        </div>
                    </Form.Item>

                    <Form.Item>
                        <StyledButton type="primary" htmlType="submit" block size="large">
                            Đăng nhập
                        </StyledButton>
                    </Form.Item>
                </Form>

                <Divider>Hoặc đăng nhập với</Divider>

                <StyledButton
                    icon={<GoogleOutlined />}
                    size="large"
                    block
                    onClick={handleGoogleLogin}
                >
                    Google
                </StyledButton>

                <Text style={{ marginTop: '24px', display: 'block' }}>
                    Chưa có tài khoản? <Link onClick={() => navigate('/register')}>Đăng ký ngay</Link>
                </Text>
            </LoginCard>
        </LoginPageWrapper>
    );
};

export default LoginPage;