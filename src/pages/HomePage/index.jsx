import React from 'react';
import { Typography } from 'antd';
import { useAuth } from '../../contexts/AuthContext';

const { Title } = Typography;

const HomePage = () => {
    const { currentUser } = useAuth();
    return (
        <div>
            <Title level={2}>Chào mừng đến với Tribe!</Title>
            <p>Email: {currentUser.email}</p>
        </div>
    );
};

export default HomePage;