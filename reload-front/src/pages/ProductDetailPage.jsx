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
                                    className="designer-profile-pic"
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
        </div>
    );
};

export default ProductDetailPage;