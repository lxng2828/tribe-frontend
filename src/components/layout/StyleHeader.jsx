import React from 'react';
import styled from 'styled-components';
import { 
    Layout, 
    Avatar, 
    Button, 
    Input, 
    Badge
} from 'antd';
import {
    UserOutlined,
    TeamOutlined,
    MessageOutlined,
    HomeOutlined,
    BellOutlined,
    SearchOutlined,
    VideoCameraOutlined,
    PictureOutlined
} from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';

const { Header } = Layout;

const FacebookHeader = styled(Header)`
  background: #ffffff !important;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const HeaderCenter = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Logo = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: #8B5CF6;
  cursor: pointer;
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background: #f0f2f5;
  border-radius: 20px;
  padding: 8px 16px;
  width: 240px;
  
  .ant-input {
    border: none;
    background: transparent;
    box-shadow: none;
    
    &:focus {
      box-shadow: none;
    }
  }
`;

const IconButton = styled(Button)`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: #f0f2f5;
  
  &:hover {
    background: #e4e6eb;
  }
`;

const StyleHeader = () => {
    const { currentUser } = useAuth();

    return (
        <FacebookHeader>
            <HeaderLeft>
                <Logo>Tribe</Logo>
                <SearchBar>
                    <SearchOutlined style={{ color: '#65676b' }} />
                    <Input placeholder="Tìm kiếm trên Tribe" />
                </SearchBar>
            </HeaderLeft>

            {/* <HeaderCenter>
                <IconButton icon={<HomeOutlined />} />
                <IconButton icon={<TeamOutlined />} />
                <IconButton icon={<VideoCameraOutlined />} />
                <IconButton icon={<PictureOutlined />} />
            </HeaderCenter> */}

            <HeaderRight>
                <Badge count={3}>
                    <IconButton icon={<BellOutlined />} />
                </Badge>
                <IconButton icon={<MessageOutlined />} />
                <Avatar 
                    src={currentUser?.photoURL} 
                    icon={<UserOutlined />}
                    size={40}
                />
            </HeaderRight>
        </FacebookHeader>
    );
};

export default StyleHeader; 