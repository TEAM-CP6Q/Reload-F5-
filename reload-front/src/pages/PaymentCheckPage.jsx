import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import '../CSS/PaymentCheckPage.css';

const PaymentCheckPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const [userInfo, setUserInfo] = useState({
        name: '',
        phoneNumber: '',
        postalCode: '',
        roadNameAddress: '',
        detailedAddress: ''
    });
    const [totalPrice, setTotalPrice] = useState(0);
    const [deliveryAddress, setDeliveryAddress] = useState({
        postalCode: '',
        roadNameAddress: '',
        detailedAddress: ''
    });
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // 장바구니 아이템 로드
        const savedCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        setCartItems(savedCartItems);

        // 총 가격 계산
        const total = savedCartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        setTotalPrice(total);

        // 사용자 정보 로드
        const fetchUserInfo = async () => {
            const token = localStorage.getItem("token");
            const email = localStorage.getItem("email");

            if (!token || !email) {
                alert('로그인이 필요합니다.');
                navigate('/login');
                return;
            }

            try {
                const response = await fetch(
                    `https://refresh-f5-server.o-r.kr/api/account/search-account/${email}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        },
                    }
                );

                if (response.status === 200) {
                    const userData = await response.json();
                    setUserInfo(userData);
                    // 배송지 정보 초기화
                    setDeliveryAddress({
                        postalCode: userData.postalCode,
                        roadNameAddress: userData.roadNameAddress,
                        detailedAddress: userData.detailedAddress
                    });
                } else {
                    alert('사용자 정보를 불러오는데 실패했습니다.');
                    navigate(-1);
                }
            } catch (error) {
                console.error("사용자 정보 로드 실패:", error);
                alert('사용자 정보를 불러오는데 실패했습니다.');
                navigate(-1);
            }
        };

        fetchUserInfo();
    }, [navigate]);

    const handleAddressChange = () => {
        setIsAddressModalOpen(true);
    };

    const handlePayment = async () => {
        if (!deliveryAddress.roadNameAddress || !deliveryAddress.detailedAddress) {
            alert('배송지를 입력해주세요.');
            return;
        }
    
        try {
            const token = localStorage.getItem("token");
            
            if (!token) {
                alert('로그인이 필요합니다.');
                navigate('/login');
                return;
            }
    
            const orderData = {
                order: {
                    consumer: userInfo.name,
                    totalPrice: totalPrice,
                    createdOn: new Date().toISOString()
                },
                orderProduct: cartItems.map(item => ({
                    productId: item.pid,
                    price: item.price,
                    amount: item.quantity
                }))
            };
    
            const response = await fetch(
                'https://refresh-f5-server.o-r.kr/api/payment/order/create-order-list',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(orderData)
                }
            );
    
            if (response.status === 200) {
                const result = await response.json();
                console.log('주문 생성 결과:', result);
                alert('결제가 완료되었습니다.');
                localStorage.removeItem('cartItems');
                navigate('/order-complete');
            } else {
                const errorData = await response.text();
                console.error('주문 생성 실패:', errorData);
                alert('주문 처리 중 오류가 발생했습니다.');
            }
        } catch (error) {
            console.error("결제 처리 실패:", error);
            alert('결제 처리 중 오류가 발생했습니다.');
        }
    };

    const handleModalSave = () => {
        setIsAddressModalOpen(false);
    };

    return (
        <div className="payCheck-container">
            <Header />
            <div className="payCheck-content">
                <h2 className="payCheck-title">주문/결제</h2>

                {/* 주문 상품 목록 */}
                <section className="payCheck-items-section">
                    <h3>주문 상품</h3>
                    <div className="payCheck-items-list">
                        {cartItems.map(item => (
                            <div key={item.pid} className="payCheck-item">
                                <img src={item.imageUrl} alt={item.name} className="payCheck-item-image" />
                                <div className="payCheck-item-details">
                                    <div className="payCheck-item-name">{item.name}</div>
                                    <div className="payCheck-item-designer">{item.designerName}</div>
                                    <div className="payCheck-item-quantity">수량: {item.quantity}개</div>
                                    <div className="payCheck-item-price">
                                        {(item.price * item.quantity).toLocaleString()}원
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 주문자 정보 */}
                <section className="payCheck-info-section">
                    <h3>주문자 정보</h3>
                    <div className="payCheck-info-row">
                        <span className="payCheck-info-label">이름</span>
                        <span className="payCheck-info-value">{userInfo.name}</span>
                    </div>
                    <div className="payCheck-info-row">
                        <span className="payCheck-info-label">연락처</span>
                        <span className="payCheck-info-value">{userInfo.phoneNumber}</span>
                    </div>
                </section>

                {/* 배송지 정보 */}
                <section className="payCheck-delivery-section">
                    <h3>배송지 정보</h3>
                    <div className="payCheck-delivery-address">
                        <div className="payCheck-info-row">
                            <span className="payCheck-info-label">우편번호</span>
                            <span className="payCheck-info-value">{deliveryAddress.postalCode}</span>
                        </div>
                        <div className="payCheck-info-row">
                            <span className="payCheck-info-label">도로명 주소</span>
                            <span className="payCheck-info-value">{deliveryAddress.roadNameAddress}</span>
                        </div>
                        <div className="payCheck-info-row">
                            <span className="payCheck-info-label">상세 주소</span>
                            <div className="payCheck-address-input-container">
                                <input
                                    type="text"
                                    value={deliveryAddress.detailedAddress}
                                    onChange={(e) => setDeliveryAddress({
                                        ...deliveryAddress,
                                        detailedAddress: e.target.value
                                    })}
                                    placeholder="상세 주소를 입력해주세요"
                                    className="payCheck-address-input"
                                />
                                <button 
                                    className="payCheck-address-change-button"
                                    onClick={handleAddressChange}
                                >
                                    주소 변경
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 결제 금액 */}
                <section className="payCheck-summary-section">
                    <h3>결제 금액</h3>
                    <div className="payCheck-summary">
                        <div className="payCheck-summary-row">
                            <span>상품 금액</span>
                            <span>{totalPrice.toLocaleString()}원</span>
                        </div>
                        <div className="payCheck-summary-row">
                            <span>배송비</span>
                            <span>무료</span>
                        </div>
                        <div className="payCheck-summary-row payCheck-total">
                            <span>총 결제 금액</span>
                            <span>{totalPrice.toLocaleString()}원</span>
                        </div>
                    </div>
                </section>

                <div className="payCheck-button-container">
                    <button className="payCheck-button" onClick={handlePayment}>
                        {totalPrice.toLocaleString()}원 결제하기
                    </button>
                </div>

                {/* 주소 변경 모달 */}
                {isAddressModalOpen && (
                    <div className="payCheck-address-modal">
                        <div className="payCheck-address-modal-content">
                            <h4>배송지 변경</h4>
                            <input
                                type="text"
                                value={deliveryAddress.postalCode}
                                onChange={(e) => setDeliveryAddress({
                                    ...deliveryAddress,
                                    postalCode: e.target.value
                                })}
                                placeholder="우편번호"
                                className="payCheck-modal-address-input"
                            />
                            <input
                                type="text"
                                value={deliveryAddress.roadNameAddress}
                                onChange={(e) => setDeliveryAddress({
                                    ...deliveryAddress,
                                    roadNameAddress: e.target.value
                                })}
                                placeholder="도로명 주소"
                                className="payCheck-modal-address-input"
                            />
                            <input
                                type="text"
                                value={deliveryAddress.detailedAddress}
                                onChange={(e) => setDeliveryAddress({
                                    ...deliveryAddress,
                                    detailedAddress: e.target.value
                                })}
                                placeholder="상세 주소"
                                className="payCheck-modal-address-input"
                            />
                            <div className="payCheck-modal-buttons">
                                <button 
                                    className="payCheck-modal-cancel-button"
                                    onClick={() => setIsAddressModalOpen(false)}
                                >
                                    취소
                                </button>
                                <button 
                                    className="payCheck-modal-save-button"
                                    onClick={handleModalSave}
                                >
                                    저장
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentCheckPage;