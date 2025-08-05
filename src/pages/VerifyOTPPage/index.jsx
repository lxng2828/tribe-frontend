import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { Form, Input, Button, Typography, message, Space } from 'antd';
import { KeyOutlined, ArrowLeftOutlined, ReloadOutlined } from '@ant-design/icons';

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

const VerifyOTPWrapper = styled.div`
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

const VerifyOTPContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 1200px;
  padding: 20px;
  position: relative;
  z-index: 1;
`;

const VerifyOTPCard = styled.div`
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

const OTPIcon = styled.div`
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
    content: '🔐';
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

const OTPInput = styled(Input)`
  border-radius: 12px;
  height: 48px;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  border: 2px solid #e4e6eb;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.9);
  letter-spacing: 8px;
  
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

const TimerText = styled(Text)`
  font-size: 14px;
  color: #65676b;
  margin-top: 16px;
  display: block;
`;

const VerifyOTPPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [timeLeft, setTimeLeft] = useState(60);
    const [canResend, setCanResend] = useState(false);
    
    const email = location.state?.email || '';

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setCanResend(true);
        }
    }, [timeLeft]);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            // Simulate OTP verification
            await new Promise(resolve => setTimeout(resolve, 2000));
            message.success('Xác minh OTP thành công!');
            navigate('/reset-password', { state: { email } });
        } catch (error) {
            message.error('Mã OTP không đúng. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        setCanResend(false);
        setTimeLeft(60);
        message.success('Mã OTP mới đã được gửi!');
    };

    return (
        <VerifyOTPWrapper>
            <AnimatedBackground>
                <FloatingShape />
                <FloatingShape />
                <FloatingShape />
            </AnimatedBackground>
            
            <BackButton 
                icon={<ArrowLeftOutlined />} 
                onClick={() => navigate('/forgot-password')}
            />
            
            <VerifyOTPContainer>
                <VerifyOTPCard>
                    <OTPIcon />
                    <Title level={2} style={{ marginBottom: 8, color: '#8B5CF6' }}>
                        Xác minh OTP 🔐
                    </Title>
                    <Text type="secondary" style={{ fontSize: 16, marginBottom: 8 }}>
                        Nhập mã 6 số đã được gửi đến
                    </Text>
                    <Text strong style={{ color: '#8B5CF6', fontSize: 16, marginBottom: 32 }}>
                        {email}
                    </Text>

                    <Form
                        name="verify_otp"
                        onFinish={onFinish}
                        layout="vertical"
                        size="large"
                    >
                        <Form.Item
                            name="otp"
                            rules={[
                                { required: true, message: 'Vui lòng nhập mã OTP!' },
                                { len: 6, message: 'Mã OTP phải có 6 số!' }
                            ]}
                        >
                            <OTPInput 
                                prefix={<KeyOutlined style={{ color: '#65676b' }} />} 
                                placeholder="000000" 
                                maxLength={6}
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
                                Xác minh OTP
                            </StyledButton>
                        </Form.Item>
                    </Form>

                    <TimerText>
                        {canResend ? (
                            <Link onClick={handleResendOTP} style={{ color: '#8B5CF6' }}>
                                Gửi lại mã OTP
                            </Link>
                        ) : (
                            `Gửi lại mã sau ${timeLeft}s`
                        )}
                    </TimerText>

                    <Space direction="vertical" style={{ marginTop: 32, width: '100%' }}>
                        <Text style={{ color: '#65676b', fontSize: 14 }}>
                            Không nhận được mã?{' '}
                            <Link 
                                onClick={() => navigate('/forgot-password')}
                                style={{ color: '#8B5CF6', fontWeight: 600 }}
                            >
                                Thử lại
                            </Link>
                        </Text>
                    </Space>
                </VerifyOTPCard>
            </VerifyOTPContainer>
        </VerifyOTPWrapper>
    );
};

export default VerifyOTPPage; 