import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Menu, Avatar, Dropdown, Space, message } from 'antd';
import {
    HomeOutlined,
    UserOutlined,
    TeamOutlined,
    SettingOutlined,
    LogoutOutlined,
} from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';
import { logout } from '../../services/authService';
import tribeLogo from '../../assets/images/submark.png';

const { Header, Content, Sider } = Layout;

const MainLayout = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false);
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            message.success('Đăng xuất thành công!');
            navigate('/login');
        } catch (error) {
            message.error('Đã có lỗi xảy ra khi đăng xuất.');
        }
    };

    const menu = (
        <Menu
            items={[
                {
                    key: '1',
                    icon: <UserOutlined />,
                    label: 'Trang cá nhân',
                    onClick: () => navigate('/profile/' + currentUser.uid),
                },
                {
                    key: '2',
                    icon: <SettingOutlined />,
                    label: 'Cài đặt',
                },
                {
                    key: '3',
                    danger: true,
                    icon: <LogoutOutlined />,
                    label: 'Đăng xuất',
                    onClick: handleLogout,
                },
            ]}
        />
    );

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                <div style={{ height: '32px', margin: '16px', background: 'rgba(255, 255, 255, 0.2)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <img src={tribeLogo} style={{ height: '30px' }} alt="logo" />
                </div>
                <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline"
                    items={[
                        { key: '1', icon: <HomeOutlined />, label: 'Bảng tin', onClick: () => navigate('/') },
                        { key: '2', icon: <TeamOutlined />, label: 'Bạn bè' },
                    ]}
                />
            </Sider>
            <Layout className="site-layout">
                <Header style={{ padding: '0 24px', background: '#fff', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                    <Dropdown overlay={menu} trigger={['click']}>
                        <a onClick={(e) => e.preventDefault()}>
                            <Space>
                                <Avatar src={currentUser?.photoURL} icon={<UserOutlined />} />
                                {currentUser?.displayName || currentUser?.email}
                            </Space>
                        </a>
                    </Dropdown>
                </Header>
                <Content style={{ margin: '24px 16px', padding: 24, minHeight: 280, background: '#f0f2f5' }}>
                    {children}
                </Content>
            </Layout>
        </Layout>
    );
};

export default MainLayout;