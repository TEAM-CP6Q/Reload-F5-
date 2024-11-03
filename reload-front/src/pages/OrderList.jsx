import React, { useEffect, useState } from 'react';
import { Card, Button, Typography, Row, Col, Divider } from 'antd';
import Header from '../components/Header';
import '../CSS/OrderList.css';
import logo from '../images/Logo.png';

const { Title, Text } = Typography;

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const exampleData = [
      {
        id: 1,
        date: '2024-10-01',
        name: 'D. 김철수',
        description: '기깔나는 식탁',
        price: '120,000',
        image: 'https://example.com/table-image.jpg'
      },
      {
        id: 2,
        date: '2024-10-01',
        name: 'D. 김철수',
        description: '기깔나는 식탁',
        price: '120,000',
        image: 'https://example.com/table-image.jpg'
      },
      {
        id: 3,
        date: '2024-10-10',
        name: 'D. 김철수',
        description: '기깔나는 식탁',
        price: '120,000',
        image: 'https://example.com/table-image.jpg'
      }
    ];

    setOrders(exampleData);
  }, []);

  const groupOrdersByDate = (orders) => {
    return orders.reduce((acc, order) => {
      const orderDate = new Date(order.date).toISOString().split('T')[0];
      if (!acc[orderDate]) {
        acc[orderDate] = [];
      }
      acc[orderDate].push(order);
      return acc;
    }, {});
  };

  const groupedOrders = groupOrdersByDate(orders);

  return (
    <div className="order-history-container">
      <Header />
      <Title level={3} className="order-history-title">최근 주문 내역</Title>
      <div className="order-history-content">
        {Object.keys(groupedOrders).map((date) => (
          <Card
            key={date}
            hoverable
            className="order-card"
           
          
          >
            <div className="order-card-header">
              <Title level={4} className="order-date">{date}</Title>
              <Text className="order-detail-info">상세정보</Text>
            </div>
            {groupedOrders[date].map((order, index) => (
              <div key={order.id} className="order-item">
                <Row align="middle">
                  <Col span={4}>
                    <img
                      src={logo}
                      alt={order.name}
                      className="order-image"
                    />
                  </Col>
                  <Col span={14} className="order-details">
                    <Title level={5} className="order-name">{order.name}</Title>
                    <Text type="secondary" className="order-description">{order.description}</Text>
                    <br />
                    <Text strong className="order-price">{order.price}원</Text>
                  </Col>
                  <Col span={6} className="order-actions">
                    <Button size="small" className="order-button">환불 요청</Button>
                    <Button size="small" className="order-button">배송 조회</Button>
                  </Col>
                </Row>
                {index < groupedOrders[date].length - 1 && <Divider />}
              </div>
            ))}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default OrderHistory;
