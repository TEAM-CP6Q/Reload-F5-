import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft, Home } from 'lucide-react';
import "../CSS/PickupResultPage.css";
import Header from '../components/Header';

const PickupResultPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { selectedDate, selectedTime, userData, selectedItems, totalPrice } = location.state;

    // 시간 포맷팅 함수
    const formatTime = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
    };

    // 날짜 표시용 포맷팅
    const formattedDisplayDate = `${selectedDate.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })} ${formatTime(selectedTime)}`;

    const handleSubmit = async () => {
        try {
            const hours = Math.floor(selectedTime / 60);
            const minutes = selectedTime % 60;
            
            // YYYY-MM-DD HH:mm:ss 형식으로 포맷팅
            const year = selectedDate.getFullYear();
            const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
            const day = String(selectedDate.getDate()).padStart(2, '0');
            const formattedDateTime = `${year}-${month}-${day} ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`;

            const requestData = {
                Info: {
                    notes: "",
                    pricePreview: totalPrice,
                    pickupDate: formattedDateTime
                },
                Address: {
                    name: userData.name,
                    email: userData.email,
                    phone: userData.phoneNumber,
                    postalCode: userData.postalCode || "000000",
                    roadNameAddress: userData.roadNameAddress,
                    detailedAddress: userData.detailedAddress
                },
                Details: selectedItems.map(item => ({
                    wasteId: item.id,
                    weight: item.quantity,
                    pricePreview: item.totalPrice
                }))
            };

            console.log('Request Data:', requestData);

            const response = await fetch('http://3.37.122.192:8000/api/pickup/new-pickup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(requestData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || '수거 신청에 실패했습니다.');
            }

            const result = await response.json();
            console.log('API Response:', result);
            
            navigate('/pickup/complete', { 
                state: { 
                    pickupId: result.pickupId,
                    name: result.name,
                    email: result.email
                }
            });

        } catch (error) {
            console.error('수거 신청 실패:', error);
            alert('수거 신청 중 오류가 발생했습니다. 다시 시도해주세요.');
        }
    };

    return (
        <div className="pickup-result-container">
            <Header/>
            <div className="pickup-result-content">
                <div className="pickup-result-card">
                    {/* Title 섹션은 동일 */}
                    <div className="pickup-result-section-header">
                        <svg
                            className="pickup-result-section-icon"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path d="M14 2H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
                            <path d="M14 3v5h5M16 13H8M16 17H8M10 9H8" />
                        </svg>
                        <span className="pickup-result-section-title">신청 정보를 확인해주세요</span>
                    </div>

                    {/* Personal Info 섹션은 동일 */}
                    <div className="pickup-result-section">
                        <h3 className="pickup-result-subsection-title">신청자 정보</h3>
                        <div className="pickup-result-grid">
                            <div className="pickup-result-grid-row">
                                <span className="pickup-result-label">이름</span>
                                <span className="pickup-result-value">{userData.name}</span>
                            </div>
                            <div className="pickup-result-grid-row">
                                <span className="pickup-result-label">연락처</span>
                                <span className="pickup-result-value">{userData.phoneNumber}</span>
                            </div>
                            <div className="pickup-result-grid-row">
                                <span className="pickup-result-label">이메일</span>
                                <span className="pickup-result-value">{userData.email}</span>
                            </div>
                        </div>
                    </div>

                    {/* Pickup Info 섹션 수정된 시간 표시 */}
                    <div className="pickup-result-section">
                        <h3 className="pickup-result-subsection-title">수거 정보</h3>
                        <div className="pickup-result-grid">
                            <div className="pickup-result-grid-row">
                                <span className="pickup-result-label">수거 주소</span>
                                <div className="pickup-result-address">
                                    <p className="pickup-result-value">{userData.roadNameAddress}</p>
                                    <p className="pickup-result-address-detail">{userData.detailedAddress}</p>
                                </div>
                            </div>
                            <div className="pickup-result-grid-row">
                                <span className="pickup-result-label">수거 날짜 및 시간</span>
                                <span className="pickup-result-value">
                                    {formattedDisplayDate}
                                </span>
                            </div>
                            <div className="pickup-result-grid-row">
                                <span className="pickup-result-label">수거 예상 금액</span>
                                <span className="pickup-result-price">
                                    {totalPrice.toLocaleString()}원
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Waste Items 섹션은 동일 */}
                    <div className="pickup-result-section">
                        <h3 className="pickup-result-subsection-title">폐기물 정보</h3>
                        <div className="pickup-result-waste-list">
                            {selectedItems.map((item, index) => (
                                <div
                                    key={index}
                                    className="pickup-result-waste-item"
                                >
                                    <div className="pickup-result-waste-info">
                                        <span className="pickup-result-waste-type">
                                            {item.type} {item.description && `(${item.description})`}
                                        </span>
                                        <span className="pickup-result-waste-quantity">
                                            {item.quantity}{item.category === "재활용품" ? "kg" : "개"}
                                        </span>
                                    </div>
                                    <span className="pickup-result-waste-price">
                                        {item.totalPrice.toLocaleString()}원
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <button 
                    className="pickup-result-submit-button"
                    onClick={handleSubmit}
                >
                    신청하기
                </button>
            </div>
        </div>
    );
};

export default PickupResultPage;