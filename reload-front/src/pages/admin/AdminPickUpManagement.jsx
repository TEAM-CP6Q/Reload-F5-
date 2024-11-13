import React, { useEffect, useState } from 'react';
import { Table, Switch, InputNumber, Button, Tag, Typography, message, Modal, Descriptions } from 'antd';

const { Text } = Typography;

const AdminPickupManagement = () => {
  const [pickupData, setPickupData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPickup, setSelectedPickup] = useState(null);
  const [pickupDetails, setPickupDetails] = useState(null);
  const [totalRealPrice, setTotalRealPrice] = useState(0);

  useEffect(() => {
    const fetchPickupData = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await fetch('http://3.37.122.192:8000/api/pickup/get-all-pickups', {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
        });

        const data = await response.json();

        if (response.ok && Array.isArray(data)) {
          setPickupData(data);
        } else {
          console.error("API 응답이 배열이 아닙니다:", data);
          setPickupData([]);
        }
      } catch (error) {
        console.error("수거 신청 데이터를 가져오는 중 오류 발생:", error);
        message.error('수거 신청 데이터를 가져오는 데 실패했습니다.');
        setPickupData([]);
      }
    };

    fetchPickupData();
  }, []);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'pickupId',
      key: 'pickupId',
    },
    {
      title: '신청 날짜',
      dataIndex: 'requestDate',
      key: 'requestDate',
    },
    {
      title: '결제 여부',
      dataIndex: 'payment',
      key: 'payment',
      render: (payment) => (payment ? <Tag color="green">결제 완료</Tag> : <Tag color="red">미결제</Tag>),
    },
    {
      title: '수거 상태',
      dataIndex: 'pickupProgress',
      key: 'pickupProgress',
      render: (pickupProgress) => (pickupProgress ? <Tag color="blue">완료</Tag> : <Tag color="orange">진행 중</Tag>),
    },
    {
      title: '총 예상 가격',
      dataIndex: 'pricePreview',
      key: 'pricePreview',
      render: (pricePreview) => <Text>{pricePreview.toLocaleString()} 원</Text>,
    },
    {
      title: '총 실제 가격',
      dataIndex: 'price',
      key: 'price',
      render: (price) => <Text>{price ? `${price.toLocaleString()} 원` : '미정'}</Text>,
    },
    {
      title: '승인 여부',
      dataIndex: 'accepted',
      key: 'accepted',
      render: (accepted, record) => (
        <Switch
          checked={accepted}
          onChange={(checked) => handleAcceptedChange(checked, record.pickupId)}
          checkedChildren="승인"
          unCheckedChildren="미승인"
        />
      ),
    },
  ];

  const handleRowClick = async (record) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://3.37.122.192:8000/api/pickup/get-details?pickupId=${record.pickupId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSelectedPickup(record);
        setPickupDetails(data);
        calculateTotalRealPrice(data.details);
        setIsModalOpen(true);
      } else {
        const errorData = await response.json();
        message.error('상세 정보를 가져오는 데 실패했습니다: ' + (errorData.message || ''));
      }
    } catch (error) {
      console.error("상세 정보 로드 중 오류 발생:", error);
      message.error('상세 정보를 가져오는 중 오류가 발생했습니다.');
    }
  };

  const handleProgressChange = (checked) => {
    setPickupDetails((prev) => ({ ...prev, pickupProgress: checked }));
  };

  const handlePaymentChange = (checked) => {
    setPickupDetails((prev) => ({ ...prev, payment: checked }));
  };

  const handleAcceptedChange = (checked) => {
    setPickupDetails((prev) => ({ ...prev, accepted: checked }));
  };

  const handleDetailPriceChange = (value, wasteId) => {
    setPickupDetails((prev) => {
      const updatedDetails = prev.details.map((detail) =>
        detail.wasteId === wasteId ? { ...detail, price: value } : detail
      );
      calculateTotalRealPrice(updatedDetails);
      return { ...prev, details: updatedDetails };
    });
  };

  const calculateTotalRealPrice = (details) => {
    const total = details.reduce((sum, detail) => sum + (detail.price || 0), 0);
    setTotalRealPrice(total);
  };

  const saveChanges = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch('http://3.37.122.192:8000/api/pickup/update-pickup', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          pickupId: selectedPickup.pickupId,
          price: totalRealPrice,
          payment: pickupDetails.payment,
          pickupProgress: pickupDetails.pickupProgress,
          accepted: pickupDetails.accepted,
          details: pickupDetails.details.map(({ wasteId, price }) => ({ wasteId, price })),
        }),
      });

      if (response.ok) {
        message.success('변경 사항이 저장되었습니다.');

        // 업데이트된 정보를 pickupData에 반영
        setPickupData(prevData =>
          prevData.map(item =>
            item.pickupId === selectedPickup.pickupId
              ? { ...item, price: totalRealPrice, payment: pickupDetails.payment, pickupProgress: pickupDetails.pickupProgress, accepted: pickupDetails.accepted }
              : item
          )
        );

        setIsModalOpen(false);
      } else {
        message.error('변경 사항 저장에 실패했습니다.');
      }
    } catch (error) {
      message.error('변경 사항 저장 중 오류가 발생했습니다.');
    }
  };

  return (
    <div>
      <h2>수거 신청 관리</h2>
      <Table
        columns={columns}
        dataSource={pickupData}
        rowKey="pickupId"
        pagination={false}
        onRow={(record) => ({
          onClick: () => handleRowClick(record),
        })}
      />
      <Modal
        title="수거 상세 내역"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={saveChanges}
        okText="저장"
        width={800}
        styles={{ body: { maxHeight: '70vh', overflowY: 'auto' } }}
      >
        {pickupDetails && (
          <div>
            <Descriptions bordered column={4}>
              <Descriptions.Item label="이름" span={1}>{pickupDetails.name}</Descriptions.Item>
              <Descriptions.Item label="전화번호" span={1}>{pickupDetails.phone}</Descriptions.Item>
              <Descriptions.Item label="이메일" span={2}>{pickupDetails.email}</Descriptions.Item>
              <Descriptions.Item label="주소" span={3}>{pickupDetails.roadNameAddress}, {pickupDetails.detailedAddress}</Descriptions.Item>
              <Descriptions.Item label="우편번호" span={1}>{pickupDetails.postalCode}</Descriptions.Item>
              <Descriptions.Item label="총 예상 가격" span={1}>{pickupDetails.pricePreview} 원</Descriptions.Item>
              <Descriptions.Item label="총 실제 가격" span={1}>{totalRealPrice.toLocaleString()} 원</Descriptions.Item>
              <Descriptions.Item label="결제 여부" span={1}>
                <Switch
                  checked={pickupDetails.payment}
                  onChange={handlePaymentChange}
                  disabled={!pickupDetails.accepted}
                  checkedChildren="완료"
                  unCheckedChildren="미결제"
                />
              </Descriptions.Item>
              <Descriptions.Item label="수거 상태" span={1}>
                <Switch
                  checked={pickupDetails.pickupProgress}
                  onChange={handleProgressChange}
                  disabled={!pickupDetails.accepted}
                  checkedChildren="완료"
                  unCheckedChildren="진행 중"
                />
              </Descriptions.Item>
              <Descriptions.Item label="승인 여부" span={1}>
                <Switch
                  checked={pickupDetails.accepted}
                  onChange={handleAcceptedChange}
                  checkedChildren="승인"
                  unCheckedChildren="미승인"
                />
              </Descriptions.Item>
            </Descriptions>

            <h3>상세 정보</h3>
            <Table
              dataSource={pickupDetails.details}
              rowKey="wasteId"
              pagination={false}
              columns={[
                {
                  title: '폐기물 이름',
                  dataIndex: 'wasteName',
                  key: 'wasteName',
                },
                {
                  title: '무게(kg)',
                  dataIndex: 'weight',
                  key: 'weight',
                },
                {
                  title: '예상 가격',
                  dataIndex: 'pricePreview',
                  key: 'pricePreview',
                  render: (price) => `${price} 원`,
                },
                {
                  title: '실제 가격',
                  dataIndex: 'price',
                  key: 'price',
                  render: (price, record) => (
                    <InputNumber
                      value={price}
                      onChange={(value) => handleDetailPriceChange(value, record.wasteId)}
                      disabled={!pickupDetails.accepted}
                      formatter={(value) => `${value} 원`}
                      parser={(value) => value.replace(' 원', '')}
                    />
                  ),
                },
              ]}
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminPickupManagement;
