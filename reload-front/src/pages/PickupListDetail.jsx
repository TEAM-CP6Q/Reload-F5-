import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Typography, Spin, Alert, Descriptions, List, Divider } from 'antd';
import '../CSS/PickupListDetail.css';
import Header from '../components/Header';

const { Text } = Typography;

const PickupListDetail = () => {
  const { pickupId } = useParams();
  const location = useLocation();
  const [pickupDetails, setPickupDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const pickupDate = location.state?.pickupDate || '날짜 정보 없음';

  useEffect(() => {
    const fetchPickupDetails = async () => {
      const token = localStorage.getItem("token");

      try {
        setLoading(true);
        const response = await fetch(`https://refresh-f5-server.o-r.kr/api/pickup/get-details?pickupId=${pickupId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setPickupDetails(data);
        } else {
          console.error('수거 상세 내역을 불러오는 데 실패했습니다.');
        }
      } catch (error) {
        console.error('데이터 로드 오류:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPickupDetails();
  }, [pickupId]);

  if (loading) {
    return <Spin className="pickup-loading" tip="데이터를 불러오는 중..." />;
  }

  if (!pickupDetails) {
    return <Alert message="수거 내역을 불러오는 데 실패했습니다." type="error" className="pickup-error" />;
  }

  return (
    <>
      <Header />
      <div className="pickup-detail-container">
        {/* 신청자 정보 */}
        <Descriptions title="신청자 정보" bordered column={1} className="pickup-section">
          <Descriptions.Item label={<span className="pickup-label">신청자</span>}>{pickupDetails.name}</Descriptions.Item>
          <Descriptions.Item label={<span className="pickup-label">연락처</span>}>{pickupDetails.phone}</Descriptions.Item>
          <Descriptions.Item label={<span className="pickup-label">이메일</span>}>{pickupDetails.email}</Descriptions.Item>
        </Descriptions>

        {/* 폐기물 정보 */}
        <Descriptions title="수거 정보" bordered column={1} className="pickup-section" style={{ marginTop: '16px' }}>
          <Descriptions.Item label={<span className="pickup-label">수거 주소</span>}>{pickupDetails.roadNameAddress}, {pickupDetails.detailedAddress}</Descriptions.Item>
          <Descriptions.Item label={<span className="pickup-label">수거 날짜 및 시간</span>}>{pickupDate}</Descriptions.Item>
          <Descriptions.Item label={<span className="pickup-label">수거 예상 금액</span>}>{pickupDetails.pricePreview?.toLocaleString('ko-KR')}원</Descriptions.Item>
          <Descriptions.Item label={<span className="pickup-label">수거 실제 금액</span>}>
            <span className="final-amount">{pickupDetails.price ? `${pickupDetails.price.toLocaleString('ko-KR')}원` : "입력 대기 중"}</span>
          </Descriptions.Item>
        </Descriptions>

        {/* 폐기물 세부 내역 */}
        <Divider orientation="left" className="pickup-detail-divider">폐기물 세부 내역</Divider>
        <div className="pickup-detail-list">
          {pickupDetails.details.map((detail, index) => (
            <Descriptions bordered column={1} key={index} className="pickup-detail-item">
              <Descriptions.Item label={`품목 ${index + 1}`}>
                <div className="pickup-info-row">
                  <span className="pickup-label">품목:</span> {detail.wasteName}
                </div>
                <div className="pickup-info-row">
                  <span className="pickup-label">무게:</span> {detail.weight}kg
                </div>
                <div className="pickup-info-row">
                  <span className="pickup-label">예상 금액:</span> {detail.pricePreview.toLocaleString('ko-KR')}원
                </div>
                <div className="pickup-info-row">
                  <span className="pickup-label">실제 금액:</span> {detail.price ? `${detail.price.toLocaleString('ko-KR')}원` : "입력 대기 중"}
                </div>
              </Descriptions.Item>
            </Descriptions>
          ))}
        </div>
      </div>
    </>
  );
};

export default PickupListDetail;
