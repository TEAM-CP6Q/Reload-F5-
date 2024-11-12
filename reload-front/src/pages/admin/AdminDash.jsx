import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Typography, Table, message, Tag } from 'antd'; // Button을 제거했습니다
import AdminAllUser from './AdminAllUser';

const { Text } = Typography;

const AdminDash = ({ setActiveTab }) => {
  const [pickupData, setPickupData] = useState([]);
  const [loading, setLoading] = useState(true);

  // 데이터 가져오기
  useEffect(() => {
    const fetchPickupData = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch('http://3.37.122.192:8000/api/pickup/get-all-pickups', {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setPickupData(data.map(item => ({
            pickupId: item.pickupId,
            requestDate: item.requestDate,
            payment: item.payment,
            accepted: item.accepted,
            key: item.pickupId,
          })));
        } else {
          message.error('수거 데이터를 불러오는 데 실패했습니다.');
        }
      } catch (error) {
        console.error("데이터 로드 오류:", error);
        message.error('데이터를 가져오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchPickupData();
  }, []);

  // 필요한 필드만 테이블에 표시
  const pickupColumns = [
    { title: '신청 날짜', dataIndex: 'requestDate', key: 'requestDate' },
    { 
      title: '결제 상태', 
      dataIndex: 'payment', 
      key: 'payment', 
      render: (payment) => (
        payment ? <Tag color="green">결제 완료</Tag> : <Tag color="red">미결제</Tag>
      ),
    },
    {
      title: '승인 상태',
      dataIndex: 'accepted',
      key: 'accepted',
      render: (accepted) => (
        accepted ? <Tag color="blue">승인됨</Tag> : <Tag color="gray">미승인</Tag>
      ),
    },
  ];

  return (
    <div>
      <Row gutter={16}>
        <Col span={24}>
          <Card
            title="유저 정보"
            bordered={false}
            extra={<span onClick={() => setActiveTab('user-management')}>더보기</span>} // Button 제거 후 텍스트로 수정
          >
            <AdminAllUser showTopUsers={true} />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: '20px' }}>
        <Col span={24}>
          <Card title="수거 관리 상태" bordered={false}>
            <Table
              dataSource={pickupData}
              columns={pickupColumns}
              pagination={false}
              loading={loading}
              rowKey="pickupId"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDash;
