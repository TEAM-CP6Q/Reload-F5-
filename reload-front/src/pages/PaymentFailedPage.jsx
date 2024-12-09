// PaymentFailedPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { XCircle } from 'lucide-react';
import '../CSS/PaymentFailedPage.css';

const PaymentFailedPage = () => {
    const navigate = useNavigate();

    return (
        <div className="payment-failed-container">
            <Header />
            <div className="payment-failed-content">
                <div className="payment-failed-icon">
                    <XCircle size={64} />
                </div>
                <div className="payment-failed-message">
                    <h2>결제에 실패했습니다</h2>
                    <p className="payment-failed-description">
                        죄송합니다. 결제 처리 중 문제가 발생했습니다.<br />
                        잠시 후 다시 시도해 주시기 바랍니다.
                    </p>
                </div>
                <div className="payment-failed-divider"></div>
                <div className="payment-failed-actions">
                    <button 
                        className="retry-button"
                        onClick={() => navigate('/cart')}
                    >
                        장바구니로 돌아가기
                    </button>
                    <button 
                        className="home-button"
                        onClick={() => navigate('/')}
                    >
                        메인으로 돌아가기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentFailedPage;