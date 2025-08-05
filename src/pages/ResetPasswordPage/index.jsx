import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { Form, Input, Button, Typography, message, Space } from 'antd';
import { LockOutlined, ArrowLeftOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';

const { Title, Text, Link } = Typography;

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

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
`;

const ResetPasswordWrapper = styled.div`
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

const AnimatedBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  z-index: 0;
`;

const FloatingShape = styled.div`
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  animation: ${float} 6s ease-in-out infinite;
  
  &:nth-child(1) {
    width: 80px;
    height: 80px;
    top: 20%;
    left: 10%;
    animation-delay: 0s;
  }
  
  &:nth-child(2) {
    width: 120px;
    height: 120px;
    top: 60%;
    right: 15%;
    animation-delay: 2s;
  }
  
  &:nth-child(3) {
    width: 60px;
    height: 60px;
    bottom: 20%;
    left: 20%;
    animation-delay: 4s;
  }
`;

const ResetPasswordContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 1200px;
  padding: 20px;
  position: relative;
  z-index: 1;
`;

const ResetPasswordCard = styled.div`
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
`;

const LockIcon = styled.div`
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
  
  &::after {
    content: '🔓';
    font-size: 60px;
    animation: ${float} 4s ease-in-out infinite;
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

const BackButton = styled(Button)`
  position: absolute;
  top: 20px;
  left: 20px;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  
  &:hover {
    background: rgba(255, 255, 255, 1);
    transform: translateY(-2px);
  }
`;

const ResetPasswordPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    
    const email = location.state?.email || '';

    const onFinish = async (values) => {
        if (values.newPassword !== values.confirmPassword) {
            message.error('Mật khẩu xác nhận không khớp!');
            return;
        }
        
        setLoading(true);
        try {
            // Simulate password reset
            await new Promise(resolve => setTimeout(resolve, 2000));
            message.success('Đổi mật khẩu thành công! Vui lòng đăng nhập.');
            navigate('/login');
        } catch (error) {
            message.error('Có lỗi xảy ra khi đổi mật khẩu. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ResetPasswordWrapper>
            <AnimatedBackground>
                <FloatingShape />
                <FloatingShape />
                <FloatingShape />
            </AnimatedBackground>
            
            <BackButton 
                icon={<ArrowLeftOutlined />} 
                onClick={() => navigate('/verify-otp')}
            />
            
            <ResetPasswordContainer>
                <ResetPasswordCard>
                    <LockIcon />
                    <Title level={2} style={{ marginBottom: 8, color: '#8B5CF6' }}>
                        Đặt lại mật khẩu 🔓
                    </Title>
                    <Text type="secondary" style={{ fontSize: 16, marginBottom: 32 }}>
                        Tạo mật khẩu mới cho tài khoản của bạn
                    </Text>

                    <Form
                        name="reset_password"
                        onFinish={onFinish}
                        layout="vertical"
                        size="large"
                    >
                        <Form.Item
                            name="newPassword"
                            rules={[
                                { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
                                { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
                            ]}
                        >
                            <StyledPasswordInput 
                                prefix={<LockOutlined style={{ color: '#65676b' }} />} 
                                placeholder="Mật khẩu mới"
                                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                            />
                        </Form.Item>

                        <Form.Item
                            name="confirmPassword"
                            rules={[
                                { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                                { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
                            ]}
                        >
                            <StyledPasswordInput 
                                prefix={<LockOutlined style={{ color: '#65676b' }} />} 
                                placeholder="Xác nhận mật khẩu mới"
                                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                            />
                        </Form.Item>

                        <Form.Item>
                            <StyledButton 
                                type="primary" 
                                htmlType="submit" 
                                block 
                                loading={loading}
                                style={{ background: '#8B5CF6', borderColor: '#8B5CF6' }}
                            >
                                Đổi mật khẩu
                            </StyledButton>
                        </Form.Item>
                    </Form>

                    <Space direction="vertical" style={{ marginTop: 32, width: '100%' }}>
                        <Text style={{ color: '#65676b', fontSize: 14 }}>
                            Nhớ mật khẩu?{' '}
                            <Link 
                                onClick={() => navigate('/login')}
                                style={{ color: '#8B5CF6', fontWeight: 600 }}
                            >
                                Đăng nhập
                            </Link>
                        </Text>
                    </Space>
                </ResetPasswordCard>
            </ResetPasswordContainer>
        </ResetPasswordWrapper>
    );
};

export default ResetPasswordPage; 