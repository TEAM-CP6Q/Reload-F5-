import React, { useState, useEffect } from 'react';
import '../CSS/PickupList.css';
import Header from '../components/Header';

const PickupList = () => {
  const [pickupData, setPickupData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPickupData = async () => {
      const token = localStorage.getItem("token");
      const email = localStorage.getItem("email");
      
      try {
        setLoading(true);
        const response = await fetch(`http://3.37.122.192:8000/api/pickup/my-pickup?email=${email}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setPickupData(data);
        } else {
          console.error('수거 데이터를 불러오는 데 실패했습니다.');
        }
      } catch (error) {
        console.error('데이터 로드 오류:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPickupData();
  }, []);

  const handlePayment = (pickupId, isPaymentPending) => {
    if (isPaymentPending) {
      alert("관리자가 금액을 입력하지 않았습니다. 금액이 입력된 후 결제를 진행해주세요.");
    } else {
      console.log('결제 처리:', pickupId);
      // 실제 결제 처리 로직 추가
    }
  };

  const getStatusDisplay = (pickup) => {
    if (pickup.payment) return '결제 완료';
    if (pickup.approved) return '승인 완료';
    if (pickup.pickupProgress) return '수거 완료 - 결제 대기';
    if (!pickup.pickupProgress) return '수거 진행 중';
    return '신청 완료';
  };

  const getStatusClass = (status) => {
    switch (status) {
      case '수거 완료 - 결제 대기':
        return 'waiting';
      case '승인 완료':
        return 'approved';
      case '수거 진행 중':
        return 'inprogress';
      case '결제 완료':
        return 'completed';
      default:
        return 'pending';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear().toString().slice(2)}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
  };

  const formatPrice = (price) => {
    if (price == null || price === 0) {
      return '입력 대기 중';
    }
    return `${price.toLocaleString('ko-KR')}원`;
  };

  if (loading) {
    return (
      <div className="pickup-history">
        <div className="loading">데이터를 불러오는 중...</div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="pickup-history">
        {pickupData.length === 0 ? (
          <div className="no-data">아직 신청 내역이 없습니다.</div>
        ) : (
          <div className="pickup-list">
            {pickupData.map((pickup) => {
              const statusText = getStatusDisplay(pickup);
              const isPaymentPending = pickup.price == null || pickup.price === 0;
              
              return (
                <div key={pickup.pickupId} className="pickup-item">
                  <div className="pickup-date">
                    <span>{formatDate(pickup.requestDate)}</span>
                    <span className="pickup-number">No.{pickup.pickupId}</span>
                  </div>

                  <div className="pickup-details">
                    <div className="status-row">
                      <span className={`status ${getStatusClass(statusText)}`}>
                        {statusText}
                      </span>
                    </div>
                    <div className="amount-row">
                      <span className="amount">
                        {statusText === '수거 완료 - 결제 대기'
                          ? `실제 결제 금액: ${formatPrice(pickup.price)}`
                          : statusText === '결제 완료'
                          ? `최종 결제 금액: ${formatPrice(pickup.price)}`
                          : `${statusText === '결제 완료' ? '최종' : '예상'} 결제 금액: ${formatPrice(pickup.pricePreview)}`}
                      </span>
                    </div>
                  </div>

                  {statusText === '수거 완료 - 결제 대기' && (
                    <button 
                      className="payment-button"
                      onClick={() => handlePayment(pickup.pickupId, isPaymentPending)}
                    >
                      결제하기
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default PickupList;
