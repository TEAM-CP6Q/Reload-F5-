// AdminMain.jsx

import React, { useState, useEffect } from 'react';
import { Layout, Menu, Avatar, Typography, Divider } from 'antd';
import { 
  UserOutlined, DashboardOutlined, ApartmentOutlined, ShoppingCartOutlined, 
  UploadOutlined, RocketOutlined, UserAddOutlined, LogoutOutlined, 
  CommentOutlined, TeamOutlined 
} from '@ant-design/icons';
import '../../CSS/admin/AdminMain.css';
import AdminDash from './AdminDash';
import AdminProduct from './AdminProduct';
import AdminDesigner from './AdminDesigner';
import AdminAllUser from './AdminAllUser';
import AdminChat from './AdminChat';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

// 하드코딩된 컴포넌트 정의
const PickupManagementContent = () => (
  <div>
    <h2>수거 관리</h2>
    <p>수거 관리 콘텐츠를 여기에 표시합니다.</p>
  </div>
);

const OrderManagementContent = () => (
  <div>
    <h2>주문 관리</h2>
    <p>주문 관리 콘텐츠를 여기에 표시합니다.</p>
  </div>
);

const DeliveryManagementContent = () => (
  <div>
    <h2>배송 관리</h2>
    <p>배송 관리 콘텐츠를 여기에 표시합니다.</p>
  </div>
);

const CustomerSupportContent = () => (
  <div>
    <h2>문의 채팅</h2>
    <p>문의 채팅 콘텐츠를 여기에 표시합니다.</p>
  </div>
);

const AdminMain = () => {
  const [adminName, setAdminName] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    const storedAdminName = localStorage.getItem("adminname");
    if (storedAdminName) {
      setAdminName(storedAdminName);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('adminname');
    window.location.href = '/login';
  };

  const menuItems = [
    { label: '대시보드', key: 'dashboard', icon: <DashboardOutlined /> },
    { label: '유저 관리', key: 'user-management', icon: <TeamOutlined /> },
    { label: '디자이너 등록', key: 'designer-register', icon: <UserAddOutlined /> },
    { label: '상품 등록', key: 'product-upload', icon: <UploadOutlined /> },
    { label: '주문 관리', key: 'orders', icon: <ShoppingCartOutlined /> },
    { label: '배송 관리', key: 'delivery', icon: <RocketOutlined /> },
    { label: '수거 관리', key: 'pickup', icon: <ApartmentOutlined /> },
    { label: '문의 채팅', key: 'customer-support', icon: <CommentOutlined /> },
    { label: '로그아웃', key: 'logout', icon: <LogoutOutlined />, onClick: handleLogout },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'pickup':
        return <PickupManagementContent />;
      case 'orders':
        return <OrderManagementContent />;
      case 'product-upload':
        return <AdminProduct />;
      case 'delivery':
        return <DeliveryManagementContent />;
      case 'designer-register':
        return <AdminDesigner />;
      case 'customer-support':
        return <AdminChat />;
      case 'user-management':
        return <AdminAllUser />;
      default:
        return <AdminDash setActiveTab={setActiveTab} />;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={250} className="sider">
        <div className="logo">
          <Avatar size={64} icon={<UserOutlined />} />
          <Text className="user-name">관리자 <br/> {adminName}</Text>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['dashboard']}
          selectedKeys={[activeTab]}
          onClick={(e) => setActiveTab(e.key)}
          items={menuItems}
          className="menu"
        />
      </Sider>

      <Layout className="main-layout">
        <Header className="header" style={{ backgroundColor: '#f0f2f5', textAlign: 'center', padding: '20px 0' }}>
          <Divider>
            <Text style={{ fontSize: '24px', fontWeight: 'bold', color: '#323232', letterSpacing: '1px' }}>
              지구를 다시 고칠 때까지, <span style={{ color: '#388E3C' }}>새로고침</span>
            </Text>
          </Divider>
        </Header>

        <Content className="content">
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminMain;
