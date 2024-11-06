import React, { useState, useEffect } from 'react';
import { Layout, Menu, Avatar, Typography, Table, Card, List,Divider } from 'antd';
import { UserOutlined, DashboardOutlined, ApartmentOutlined, ShoppingCartOutlined, UploadOutlined, RocketOutlined, UserAddOutlined, LogoutOutlined } from '@ant-design/icons';
import '/Users/dongsebi/Desktop/Reload_F5/reload-front/src/CSS/admin/AdminMain.css';
import AdminDash from './AdminDash';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

// 각 탭에 표시할 컴포넌트를 정의합니다.
const DashboardContent = () => {
  const dashboardData = [
    { key: '1', metric: '총 사용자 수', value: 120 },
    { key: '2', metric: '총 주문 수', value: 75 },
    { key: '3', metric: '총 수익', value: '$4500' },
  ];

  return (
    <div>
      <h2>대시보드</h2>
      <Table dataSource={dashboardData} columns={[{ title: '지표', dataIndex: 'metric' }, { title: '값', dataIndex: 'value' }]} pagination={false} />
    </div>
  );
};

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
    { label: '로그아웃', key: 'logout', icon: <LogoutOutlined />, onClick: handleLogout },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'pickup':
        return <PickupManagementContent />;
      case 'orders':
        return <OrderManagementContent />;
      case 'product-upload':
        return <ProductUploadContent />;
      case 'delivery':
        return <DeliveryManagementContent />;
      case 'designer-register':
        return <DesignerRegistrationContent />;
      default:
        return <AdminDash />;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={250} className="sider">
        <div className="logo">
          <Avatar size={64} icon={<UserOutlined />} />
          <Text className="user-name">{adminName}</Text>
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
