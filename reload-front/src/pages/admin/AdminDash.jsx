import React from 'react';
import { Card, Col, Row, Typography, List, Avatar } from 'antd';
import { MessageOutlined, UserOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

const AdminDash = () => {
  // 채팅 데이터 예시
  const chatData = [
    { id: '1', name: '윤산하', inquiry: '배송 문의', message: '상품 출고 배송은 언제 되나요?' },
    { id: '2', name: '차은우', inquiry: '재입고 문의', message: '이 옷 언제 재입고 되나요?' },
    { id: '3', name: '문빈', inquiry: '수거 문의', message: '쓰레기 수거 오는 건가요?' },
    { id: '4', name: '박진우', inquiry: '수거 문의', message: '수거 신청했는데 되지 않았어요.' },
    { id: '5', name: '김명준', inquiry: '디자이너 문의', message: '디자이너 관련해서 문의는 어디로 하면 되나요?' },
  ];

  return (
    <div>

      
      <Row gutter={16}>
        {/* 총 사용자 수 카드 */}
        <Col span={8}>
          <Card title="총 사용자 수" bordered={false} style={{ textAlign: 'center' }}>
            <Text style={{ fontSize: '24px', fontWeight: 'bold' }}>120명</Text>
          </Card>
        </Col>

        {/* 총 주문 수 카드 */}
        <Col span={8}>
          <Card title="총 주문 수" bordered={false} style={{ textAlign: 'center' }}>
            <Text style={{ fontSize: '24px', fontWeight: 'bold' }}>75건</Text>
          </Card>
        </Col>

        {/* 총 수익 카드 */}
        <Col span={8}>
          <Card title="총 수익" bordered={false} style={{ textAlign: 'center' }}>
            <Text style={{ fontSize: '24px', fontWeight: 'bold' }}>$4500</Text>
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: '20px' }}>
        {/* 수거 관리 카드 */}
        <Col span={8}>
          <Card title="수거 관리" bordered={false} style={{ textAlign: 'center' }}>
            <Text>대기: 10건</Text>
            <br />
            <Text>완료: 15건</Text>
          </Card>
        </Col>

        {/* 주문 관리 카드 */}
        <Col span={8}>
          <Card title="주문 관리" bordered={false} style={{ textAlign: 'center' }}>
            <Text>신규 주문: 20건</Text>
            <br />
            <Text>처리 중: 5건</Text>
          </Card>
        </Col>

        {/* 배송 관리 카드 */}
        <Col span={8}>
          <Card title="배송 관리" bordered={false} style={{ textAlign: 'center' }}>
            <Text>배송 중: 7건</Text>
            <br />
            <Text>완료: 13건</Text>
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: '20px' }}>
        {/* 상품 등록 카드 */}
        <Col span={12}>
          <Card title="상품 등록" bordered={false} style={{ textAlign: 'center' }}>
            <Text>신규 등록 상품: 5개</Text>
            <br />
            <Text>승인 대기: 2개</Text>
          </Card>
        </Col>

        {/* 디자이너 등록 카드 */}
        <Col span={12}>
          <Card title="디자이너 등록" bordered={false} style={{ textAlign: 'center' }}>
            <Text>신규 디자이너: 3명</Text>
            <br />
            <Text>승인 대기: 1명</Text>
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: '20px' }}>
        {/* 최근 문의 채팅 카드 */}
        <Col span={24}>
          <Card title={<><MessageOutlined /> 최근 문의 채팅</>} bordered={false}>
            <List
              itemLayout="horizontal"
              dataSource={chatData}
              renderItem={item => (
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
