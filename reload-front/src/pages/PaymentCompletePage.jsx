// PaymentCompletePage.jsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import '../CSS/PaymentCompletePage.css';

const PaymentCompletePage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { orderInfo, paymentInfo } = location.state || {};

    return (
        <div className="payment-complete-container">
            <Header />
            <div className="payment-complete-content">
                <div className="payment-complete-icon">✓</div>
                <div className="payment-complete-message">
                    <h2>결제가 완료되었습니다</h2>
                    <p>주문해 주셔서 감사합니다.</p>
                </div>
                
                {orderInfo && (
                    <div className="payment-complete-details">
                        <div className="payment-info-row">
                            <span>주문 번호</span>
                            <span>{orderInfo.orderId}</span>
                        </div>
                        <div className="payment-info-row">
                            <span>결제 금액</span>
                            <span>{orderInfo.orderDTO.totalPrice.toLocaleString()}원</span>
                        </div>
                        <div className="payment-info-row">
                            <span>주문 상품</span>
                            <span>{orderInfo.orderItemList.length}종류</span>
                        </div>
                    </div>
                )}

                <div className="payment-complete-actions">
                    <button 
                        className="order-details-button"
                        onClick={() => navigate('/order-list')}
                    >
                        주문 내역 보기
                    </button>
                    <button 
                        className="continue-shopping-button"
                        onClick={() => navigate('/')}
                    >
                        쇼핑 계속하기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentCompletePage;