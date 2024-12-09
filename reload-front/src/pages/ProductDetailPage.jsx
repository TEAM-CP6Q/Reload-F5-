import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import "../CSS/ProductDetailPage.css";
import Header from '../components/Header';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

const ProductDetailPage = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const product = state?.product;
    const [designer, setDesigner] = useState(null);
    const [showCartModal, setShowCartModal] = useState(false);
    const [showQuantityModal, setShowQuantityModal] = useState(false);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        window.scrollTo(0, 0);
        
        const fetchDesignerData = async () => {
            try {
                if (product?.designerIndex) {
                    const response = await fetch(`https://refresh-f5-server.o-r.kr/api/account/designer/get-designer/${product.designerIndex}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    });
                    const designerData = await response.json();
                    setDesigner(designerData);
                }
            } catch (error) {
                console.error('디자이너 데이터를 가져오는 중 오류가 발생했습니다:', error);
            }
        };

        fetchDesignerData();
    }, [product?.designerIndex]);

    if (!product) {
        return <div>상품을 찾을 수 없습니다.</div>;
    }

    const handleDesignerClick = () => {
        if (designer?.id) {
            navigate('/designer', {
                state: { designerId: designer.id }
            });
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
    };

    const handleAddToCart = () => {
        const token = localStorage.getItem("token");
        const email = localStorage.getItem("email");

        if (token && email) {
            const existingCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

            const existingItemIndex = existingCartItems.findIndex(item => item.pid === product.pid);

            if (existingItemIndex !== -1) {
                existingCartItems[existingItemIndex].quantity += 1;
            } else {
                existingCartItems.push({
                    pid: product.pid,
                    name: product.name,
                    price: product.price,
                    imageUrl: product.imageUrls[0],
                    designerName: designer?.name || '',
                    quantity: 1
                });
            }

            localStorage.setItem('cartItems', JSON.stringify(existingCartItems));
            setShowCartModal(true);
        } else {
            navigate('/login');
        }
    };

    const handleDirectPurchase = () => {
        const token = localStorage.getItem("token");
        const email = localStorage.getItem("email");
    
        if (token && email) {
            setShowQuantityModal(true); // 수량 선택 모달 표시
        } else {
            navigate('/login');
        }
    };

    const handleGoToCart = () => {
        setShowCartModal(false);
        navigate('/cart');
    };

    const handleContinueShopping = () => {
        setShowCartModal(false);
    };

    // 모달 컴포넌트
    const CartModal = () => {
        if (!showCartModal) return null;

        return (
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                animation: 'fadeIn 0.3s ease-out'
            }}>
                <div style={{
                    backgroundColor: 'white',
                    padding: '30px',
                    borderRadius: '12px',
                    width: '80%',
                    maxWidth: '400px',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                    animation: 'slideIn 0.3s ease-out',
                    textAlign: 'center'
                }}>
                    <div style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '50%',
                        backgroundColor: '#e8f5e9',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 20px',
                    }}>
                        <svg
                            width="24"
                            height="24"
                            viewBox="2 0 24 24"
                            fill="none"
                            stroke="#4caf50"
                            strokeWidth="4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M9 11l3 3L22 4" />
                        </svg>
                    </div>
                    <h3 style={{
                        margin: '0 0 15px 0',
                        fontSize: '20px',
                        fontWeight: '600',
                        color: '#333',
                        letterSpacing: '-0.5px'
                    }}>
                        장바구니 추가 완료
                    </h3>
                    <p style={{
                        margin: '0 0 25px 0',
                        color: '#666',
                        lineHeight: '1.5',
                        fontSize: '15px'
                    }}>
                        장바구니에 해당 상품이 추가되었습니다!<br />
                        장바구니로 이동하시겠습니까?
                    </p>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '10px'
                    }}>
                        <button
                            onClick={handleContinueShopping}
                            style={{
                                padding: '12px 20px',
                                border: '1px solid #e0e0e0',
                                borderRadius: '10px',
                                backgroundColor: 'white',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: '500',
                                color: '#666',
                                transition: 'all 0.2s',
                                flex: 1,
                                maxWidth: '150px',
                                ':hover': {
                                    backgroundColor: '#f5f5f5'
                                }
                            }}
                        >
                            계속 쇼핑하기
                        </button>
                        <button
                            onClick={handleGoToCart}
                            style={{
                                padding: '12px 20px',
                                border: 'none',
                                borderRadius: '10px',
                                backgroundColor: '#4CAF50',
                                color: 'white',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: '500',
                                transition: 'all 0.2s',
                                flex: 1,
                                maxWidth: '150px',
                                ':hover': {
                                    backgroundColor: '#43A047'
                                }
                            }}
                        >
                            장바구니로 이동
                        </button>
                    </div>
                </div>
                <style>
                    {`
                        @keyframes fadeIn {
                            from { opacity: 0; }
                            to { opacity: 1; }
                        }
                        @keyframes slideIn {
                            from { 
                                opacity: 0;
                                transform: translateY(-20px);
                            }
                            to { 
                                opacity: 1;
                                transform: translateY(0);
                            }
                        }
                    `}
                </style>
            </div>
        );
    };

    const handleQuantityChange = (newQuantity) => {
        if (newQuantity >= 1) {
            setQuantity(newQuantity);
        }
    };

    const handlePurchaseConfirm = () => {
        // 즉시구매용 상품 생성
        const directPurchaseItem = [{
            pid: product.pid,
            name: product.name,
            price: product.price,
            imageUrl: product.imageUrls[0],
            designerName: designer?.name || '',
            quantity: quantity,
            isDirectPurchase: true // 즉시구매 상품 표시
        }];
    
        // 직접 구매 상품을 별도의 키에 저장
        localStorage.setItem('directPurchaseItem', JSON.stringify(directPurchaseItem));
        
        setShowQuantityModal(false);
        navigate('/payment-check', { 
            state: { isDirectPurchase: true }  // 결제 페이지에 즉시구매 여부 전달
        });
    };

    // 수량 선택 모달 컴포넌트
    const QuantityModal = () => {
        if (!showQuantityModal) return null;
    
        return (
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                backdropFilter: 'blur(4px)',
                animation: 'fadeIn 0.3s ease-out'
            }}>
                <div style={{
                    backgroundColor: 'white',
                    padding: '24px',
                    borderRadius: '16px',
                    width: '90%',
                    maxWidth: '400px',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
                    animation: 'slideIn 0.3s ease-out',
                }}>
                    <h3 style={{
                        margin: '0 0 24px 0',
                        fontSize: '20px',
                        fontWeight: '600',
                        color: '#1a1a1a',
                        textAlign: 'center',
                        letterSpacing: '-0.5px'
                    }}>
                        구매 수량 선택
                    </h3>
                    
                    <div style={{ 
                        backgroundColor: '#f8faf9',
                        borderRadius: '12px',
                        padding: '16px',
                        marginBottom: '24px'
                    }}>
                        <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '16px'
                        }}>
                            <span style={{ 
                                fontWeight: '500',
                                color: '#2d2d2d',
                                fontSize: '15px'
                            }}>
                                {product.name}
                            </span>
                            <span style={{
                                color: '#4CAF50',
                                fontWeight: '600',
                                fontSize: '15px'
                            }}>
                                {product.price?.toLocaleString()}원
                            </span>
                        </div>
                        
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '16px',
                            padding: '8px 0'
                        }}>
                            <button
                                onClick={() => handleQuantityChange(quantity - 1)}
                                style={{
                                    width: '40px',
                                    height: '40px',
                                    border: '1.5px solid #e0e0e0',
                                    borderRadius: '50%',
                                    backgroundColor: 'white',
                                    cursor: 'pointer',
                                    fontSize: '20px',
                                    color: '#666',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                −
                            </button>
                            <span style={{ 
                                fontSize: '20px',
                                fontWeight: '600',
                                color: '#1a1a1a',
                                minWidth: '40px',
                                textAlign: 'center'
                            }}>
                                {quantity}
                            </span>
                            <button
                                onClick={() => handleQuantityChange(quantity + 1)}
                                style={{
                                    width: '40px',
                                    height: '40px',
                                    border: '1.5px solid #e0e0e0',
                                    borderRadius: '50%',
                                    backgroundColor: 'white',
                                    cursor: 'pointer',
                                    fontSize: '20px',
                                    color: '#666',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                +
                            </button>
                        </div>
                    </div>
    
                    <div style={{
                        backgroundColor: '#f0f7f1',
                        borderRadius: '12px',
                        padding: '16px',
                        marginBottom: '24px'
                    }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <span style={{
                                color: '#2d2d2d',
                                fontWeight: '600',
                                fontSize: '15px'
                            }}>
                                총 결제금액
                            </span>
                            <span style={{
                                color: '#4CAF50',
                                fontWeight: '700',
                                fontSize: '18px'
                            }}>
                                {(product.price * quantity).toLocaleString()}원
                            </span>
                        </div>
                    </div>
    
                    <div style={{
                        display: 'flex',
                        gap: '10px',
                    }}>
                        <button
                            onClick={() => setShowQuantityModal(false)}
                            style={{
                                flex: '1',
                                padding: '15px',
                                border: '1.5px solid #e0e0e0',
                                borderRadius: '12px',
                                backgroundColor: 'white',
                                cursor: 'pointer',
                                fontSize: '15px',
                                fontWeight: '600',
                                color: '#666',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            취소
                        </button>
                        <button
                            onClick={handlePurchaseConfirm}
                            style={{
                                flex: '1',
                                padding: '15px',
                                border: 'none',
                                borderRadius: '12px',
                                backgroundColor: '#4CAF50',
                                color: 'white',
                                cursor: 'pointer',
                                fontSize: '15px',
                                fontWeight: '600',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            구매하기
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className='productDetail-main-container'>
            <Header />
            <div className='productDetail-main'>
                <img
                    src={product.imageUrls[0]}
                    alt={product.name}
                    className="productDetail-banner-image"
                />
            </div>
            <div className='productDetail-designer-container'>
                <div className='productDetail-designer-sub-container' onClick={handleDesignerClick}>
                    <div className='productDetail-designer-profile'>
                        <div className='productDetail-designer-image'>
                            {designer?.image && (
                                <img
                                    src={designer.image}
                                    alt={designer?.name}
                                    className="productDetail-designer-profile-pic"
                                />
                            )}
                        </div>
                        <div className='productDetail-designer-name'>
                            {designer?.name || '로딩 중...'}
                        </div>
                    </div>
                    <div
                        className='productDetail-designer-button'
                        style={{ cursor: 'pointer' }}
                    >
                        <span style={{ fontSize: '10px', margin: '5px' }}>디자이너 보러가기</span>
                        <FontAwesomeIcon icon={faArrowRight} style={{ fontSize: '10px' }} />
                    </div>
                </div>
            </div>

            <div className="productDetail-divider" />

            <div className='productDetail-title-container'>
                <div className='productDetail-title-label'>{product.name}</div>
                <div className='productDetail-title-price'>{product.price?.toLocaleString()}원</div>
            </div>

            <div className='productDetail-buttons-container'>
                <button className='productDetail-cart-button' onClick={handleAddToCart}>장바구니</button>
                <button className='productDetail-buy-button' onClick={handleDirectPurchase}>즉시구매</button>
            </div>

            <div className="productDetail-divider" />

            <div className='productDetail-info-container'>
                <h3 style={{ fontWeight: '600', marginBottom: '15px' }}>상품 정보</h3>
                <div className='productDetail-info-item'>
                    <span className='productDetail-info-label'>품명</span>
                    <span className='productDetail-info-value'>{product.name}</span>
                </div>
                <div className='productDetail-info-item'>
                    <span className='productDetail-info-label'>카테고리</span>
                    <span className='productDetail-info-value'>{product.categoryIndex.value}</span>
                </div>
                <div className='productDetail-info-item'>
                    <span className='productDetail-info-label'>디자이너</span>
                    <span className='productDetail-info-value'>{designer?.name}</span>
                </div>
                <div className='productDetail-info-item'>
                    <span className='productDetail-info-label'>가격</span>
                    <span className='productDetail-info-value'>{product.price?.toLocaleString()}원</span>
                </div>
                <div className='productDetail-info-item'>
                    <span className='productDetail-info-label'>출시 일자</span>
                    <span className='productDetail-info-value'>{formatDate(product.createdOn)}</span>
                </div>
                <div className='productDetail-info-item'>
                    <span className='productDetail-info-label'>제품 ID</span>
                    <span className='productDetail-info-value'>{product.pid}</span>
                </div>
                <div className='productDetail-info-item'>
                    <span className='productDetail-info-label'>상품 설명</span>
                    <span className='productDetail-info-value'>{product.content}</span>
                </div>
            </div>

            <div className="productDetail-divider" />

            <div className='productDetail-additional-images'>
                {product.imageUrls.slice(1).map((imageUrl, index) => (
                    <img
                        key={index + 1}
                        src={imageUrl}
                        alt={`${product.name} 추가 이미지 ${index + 1}`}
                        className="productDetail-additional-image"
                    />
                ))}
            </div>

            <div className='productDetail-fixed-bottom-buttons'>
                <button className='productDetail-fixed-cart-button' onClick={handleAddToCart}>장바구니</button>
                <button className='productDetail-fixed-buy-button' onClick={handleDirectPurchase}>즉시구매</button>
            </div>

            <CartModal />
            <QuantityModal />
        </div>
    );
};

export default ProductDetailPage;