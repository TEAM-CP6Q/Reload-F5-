// PickupCompletePage.jsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Home } from 'lucide-react';
import "../CSS/PickupCompletePage.css";

const PickupCompletePage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { pickupId, name, email } = location.state || {};

    return (
        <div className="pickup-complete-container">
            <div className="pickup-complete-header">
                <h1>쓰레기 수거 신청 완료</h1>
                <Home 
                    className="home-icon"
                    onClick={() => navigate('/')} 
                />
            </div>

            <div className="pickup-complete-content">
                <div className="pickup-complete-card">
                    <CheckCircle className="success-icon" />
                    <h2>수거 신청이 성공적으로<br/>접수되었습니다.</h2>
                    <p className="complete-description">곧바로 수거를 준비하겠습니다.</p>
                    
                    <div className="pickup-info">
                        <div className="info-item">
                            <span className="info-label">신청 번호</span>
                            <span className="info-value">{pickupId}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">신청자</span>
                            <span className="info-value">{name}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">이메일</span>
                            <span className="info-value">{email}</span>
                        </div>
                    </div>

                    <button 
                        className="home-button"
                        onClick={() => navigate('/')}
                    >
                        홈으로
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PickupCompletePage;