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

const LoginCard = styled.div`
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

const LogoContainer = styled.div`
  width: 120px;
  height: 120px;
  margin: 0 auto 32px;
  background: linear-gradient(135deg, #8B5CF6, #A78BFA);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  animation: ${pulse} 2s ease-in-out infinite;
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    animation: ${gradientAnimation} 3s ease infinite;
  }
  
  img {
    width: 80px;
    height: 80px;
    animation: ${float} 4s ease-in-out infinite;
    z-index: 1;
    position: relative;
  }
`;

const StyledButton = styled(Button)`
  height: 48px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 16px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(139, 92, 246, 0.3);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const StyledInput = styled(Input)`
  border-radius: 12px;
  height: 48px;
  font-size: 16px;
  border: 2px solid #e4e6eb;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.9);
  
  &:hover, &:focus {
    border-color: #8B5CF6;
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
    background: rgba(255, 255, 255, 1);
  }
`;

const StyledPasswordInput = styled(Input.Password)`
  border-radius: 12px;
  height: 48px;
  font-size: 16px;
  border: 2px solid #e4e6eb;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.9);
  
  &:hover, &:focus {
    border-color: #8B5CF6;
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
    background: rgba(255, 255, 255, 1);
  }
`;

const GoogleButton = styled(Button)`
  height: 48px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 16px;
  border: 2px solid #e4e6eb;
  color: #6B7280;
  background: rgba(255, 255, 255, 0.9);
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #8B5CF6;
    color: #8B5CF6;
    background: rgba(255, 255, 255, 1);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(139, 92, 246, 0.2);
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
                <LogoContainer>
                    <img src={tribeLogo} alt="Tribe Logo" />
                </LogoContainer>
                <Title level={2} style={{ marginBottom: 8, color: '#8B5CF6' }}>
                    Chào mừng trở lại! 👋
                </Title>
                <Text type="secondary" style={{ fontSize: 16, marginBottom: 32 }}>
                    Đăng nhập để tiếp tục hành trình của bạn
                </Text>

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
                        <StyledInput prefix={<MailOutlined />} placeholder="Email" size="large" />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                    >
                        <StyledPasswordInput prefix={<LockOutlined />} placeholder="Mật khẩu" size="large" />
                    </Form.Item>

                    <Form.Item>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Checkbox style={{ color: '#65676b' }}>Ghi nhớ đăng nhập</Checkbox>
                            <Link 
                                onClick={() => navigate('/forgot-password')}
                                style={{ color: '#8B5CF6', fontWeight: 500 }}
                            >
                                Quên mật khẩu?
                            </Link>
                        </div>
                    </Form.Item>

                    <Form.Item>
                        <StyledButton type="primary" htmlType="submit" block size="large">
                            Đăng nhập
                        </StyledButton>
                    </Form.Item>
                </Form>

                <Divider>Hoặc đăng nhập với</Divider>

                <GoogleButton
                    icon={<GoogleOutlined />}
                    size="large"
                    block
                    onClick={handleGoogleLogin}
                >
                    Tiếp tục với Google
                </GoogleButton>

                <Text style={{ marginTop: '24px', display: 'block' }}>
                    Chưa có tài khoản? <Link onClick={() => navigate('/register')}>Đăng ký ngay</Link>
                </Text>
            </LoginCard>
        </LoginPageWrapper>
    );
};

export default LoginPage;