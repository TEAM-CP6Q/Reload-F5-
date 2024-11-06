import React, { useState, useEffect } from 'react';
import { Layout, Menu, Avatar, Typography, Table, Card, Divider, Button, List } from 'antd';
import { UserOutlined, DashboardOutlined, ApartmentOutlined, ShoppingCartOutlined, UploadOutlined, RocketOutlined, UserAddOutlined, LogoutOutlined, CommentOutlined } from '@ant-design/icons';
import '../../CSS/admin/AdminMain.css';
import AdminDash from './AdminDash';
import AdminProduct from './AdminProduct';
import AdminDesigner from './AdminDesigner';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

// 수거 관리 컴포넌트
const PickupManagementContent = () => {
  const pickupData = [
    { key: '1', name: '김철수', status: '수거 대기', date: '2024-11-05' },
    { key: '2', name: '이영희', status: '수거 완료', date: '2024-11-04' },
  ];
  return (
    <div>
      <h2>수거 관리</h2>
      <Table dataSource={pickupData} columns={[{ title: '이름', dataIndex: 'name' }, { title: '상태', dataIndex: 'status' }, { title: '날짜', dataIndex: 'date' }]} pagination={false} />
    </div>
  );
};

// 주문 관리 컴포넌트
const OrderManagementContent = () => {
  const orderData = [
    { key: '1', orderNumber: '20241105-001', customer: '김철수', total: '$150' },
    { key: '2', orderNumber: '20241105-002', customer: '박영희', total: '$200' },
  ];
  return (
    <div>
      <h2>주문 관리</h2>
      <Table dataSource={orderData} columns={[{ title: '주문 번호', dataIndex: 'orderNumber' }, { title: '고객 이름', dataIndex: 'customer' }, { title: '총액', dataIndex: 'total' }]} pagination={false} />
    </div>
  );
};

// 상품 등록 컴포넌트
const ProductUploadContent = () => {
  const productData = [
    { key: '1', productName: '상품 A', status: '등록 완료' },
    { key: '2', productName: '상품 B', status: '대기 중' },
  ];
  return (
    <div>
      <h2>상품 등록</h2>
      <Table dataSource={productData} columns={[{ title: '상품명', dataIndex: 'productName' }, { title: '상태', dataIndex: 'status' }]} pagination={false} />
    </div>
  );
};

// 배송 관리 컴포넌트
const DeliveryManagementContent = () => {
  const deliveryData = [
    { key: '1', deliveryId: 'DEL-001', status: '배송 중', date: '2024-11-05' },
    { key: '2', deliveryId: 'DEL-002', status: '배송 완료', date: '2024-11-04' },
  ];
  return (
    <div>
      <h2>배송 관리</h2>
      <Table dataSource={deliveryData} columns={[{ title: '배송 ID', dataIndex: 'deliveryId' }, { title: '상태', dataIndex: 'status' }, { title: '날짜', dataIndex: 'date' }]} pagination={false} />
    </div>
  );
};

// 디자이너 등록 컴포넌트
const DesignerRegistrationContent = () => {
  const designerData = [
    { key: '1', name: '곽팔수', registrationDate: '2024-11-03', status: '승인 완료' },
    { key: '2', name: '홍길동', registrationDate: '2024-11-04', status: '대기 중' },
  ];
  return (
    <div>
      <h2>디자이너 등록</h2>
      <Table dataSource={designerData} columns={[{ title: '이름', dataIndex: 'name' }, { title: '등록 날짜', dataIndex: 'registrationDate' }, { title: '상태', dataIndex: 'status' }]} pagination={false} />
    </div>
  );
};

// 문의 채팅 컴포넌트
const CustomerSupportContent = () => {
  const chatData = [
    { key: '1', name: '윤산하', inquiry: '배송 문의', message: '상품 출고 배송은 언제 되나요?' },
    { key: '2', name: '차은우', inquiry: '재입고 문의', message: '이 옷 언제 재입고 되나요?' },
    { key: '3', name: '문빈', inquiry: '수거 문의', message: '쓰레기 수거 오는 건가요?' },
  ];

  return (
    <div>
      <h2>문의 채팅</h2>
      <List
        dataSource={chatData}
        renderItem={(item) => (
          <List.Item key={item.key}>
            <List.Item.Meta
              title={`${item.name} (${item.inquiry})`}
              description={item.message}
            />
          </List.Item>
        )}
      />
    </div>
  );
};

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
    window.location.href = '/login';
  };

  const menuItems = [
    { label: '대시보드', key: 'dashboard', icon: <DashboardOutlined /> },
    { label: '수거 관리', key: 'pickup', icon: <ApartmentOutlined /> },
    { label: '주문 관리', key: 'orders', icon: <ShoppingCartOutlined /> },
    { label: '상품 등록', key: 'product-upload', icon: <UploadOutlined /> },
    { label: '배송 관리', key: 'delivery', icon: <RocketOutlined /> },
    { label: '디자이너 등록', key: 'designer-register', icon: <UserAddOutlined /> },
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
        return <DesignerRegistrationContent />;
      case 'customer-support':
        return <CustomerSupportContent />;
      default:
        return <AdminDash onMoreClick={() => setActiveTab('customer-support')} />;
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
            <Text style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff', letterSpacing: '1px' }}>
              지구를 다시 고칠 때까지, <span style={{ color: '#52c41a' }}>새로고침</span>
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
