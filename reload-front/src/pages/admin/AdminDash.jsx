import React from 'react';
import { Card, Col, Row, Typography, List, Avatar, Table, Button } from 'antd';
import { MessageOutlined, UserOutlined } from '@ant-design/icons';
import AdminAllUser from './AdminAllUser';


const { Text } = Typography;

const AdminDash = ({ setActiveTab }) => {
  const pickupData = [
    { key: '1', name: '김철수', status: '수거 대기' },
    { key: '2', name: '이영희', status: '수거 완료' },
  ];

  const chatData = [
    { id: '1', name: '윤산하', inquiry: '배송 문의', message: '상품 출고 배송은 언제 되나요?' },
    { id: '2', name: '차은우', inquiry: '재입고 문의', message: '이 옷 언제 재입고 되나요?' },
    { id: '3', name: '문빈', inquiry: '수거 문의', message: '쓰레기 수거 오는 건가요?' },
    { id: '4', name: '박진우', inquiry: '수거 문의', message: '수거 신청했는데 되지 않았어요.' },
    { id: '5', name: '김명준', inquiry: '디자이너 문의', message: '디자이너 관련해서 문의는 어디로 하면 되나요?' },
  ];

  const pickupColumns = [
    { title: '이름', dataIndex: 'name', key: 'name' },
    { title: '상태', dataIndex: 'status', key: 'status' },
  ];

  return (
    <div>
      <Row gutter={16}>
        <Col span={24}>
          <Card
            title="유저 정보"
            bordered={false}
            extra={<Button type="link" onClick={() => setActiveTab('user-management')}>더보기</Button>}
          >
            <AdminAllUser showTopUsers={true} />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: '20px' }}>
        <Col span={12}>
          <Card title="수거 관리 상태" bordered={false}>
            <Table dataSource={pickupData} columns={pickupColumns} pagination={false} />
          </Card>
        </Col>

        <Col span={12}>
          <Card title={<><MessageOutlined /> 최근 문의 채팅</>} bordered={false}>
            <List
              itemLayout="horizontal"
              dataSource={chatData}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar icon={<UserOutlined />} />}
                    title={<Text strong>{item.name} ({item.inquiry})</Text>}
                    description={item.message}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDash;
