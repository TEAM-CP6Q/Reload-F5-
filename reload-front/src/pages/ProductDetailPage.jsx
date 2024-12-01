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

    useEffect(() => {
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
        navigate(`/designer/${designer.id}`);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
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
                <div className='productDetail-designer-sub-container'>
                    <div className='productDetail-designer-profile'>
                        <div className='productDetail-designer-image'>
                            {designer?.profileImage && (
                                <img 
                                    src={designer.profileImage} 
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
                        onClick={handleDesignerClick}
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
                <button className='productDetail-cart-button'>장바구니</button>
                <button className='productDetail-buy-button'>즉시구매</button>
            </div>

            <div className="productDetail-divider" />

            <div className='productDetail-info-container'>
                <h3 style={{fontWeight: '600', marginBottom: '15px'}}>상품 정보</h3>
                <div className='productDetail-info-item'>
                    <span className='productDetail-info-label'>품명</span>
                    <span className='productDetail-info-value'>{product.name}</span>
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
                <button className='productDetail-fixed-cart-button'>장바구니</button>
                <button className='productDetail-fixed-buy-button'>즉시구매</button>
            </div>
        </div>
    );
};

export default ProductDetailPage;