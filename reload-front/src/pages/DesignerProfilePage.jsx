import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { useLocation, useNavigate } from 'react-router-dom';
import '../CSS/DesignerProfilePage.css';

const DesignerProfilePage = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const designerId = state?.designerId;
    const [designer, setDesigner] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const accessToken = localStorage.getItem('accessToken');

                const designerResponse = await fetch(`https://refresh-f5-server.o-r.kr/api/account/designer/get-designer/${designerId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                if (!designerResponse.ok) {
                    throw new Error('디자이너 정보를 불러오는데 실패했습니다.');
                }

                const designerData = await designerResponse.json();
                setDesigner(designerData);

                const productsResponse = await fetch('https://refresh-f5-server.o-r.kr/api/product/latest-product-list', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`
                    }
                });

                if (!productsResponse.ok) {
                    throw new Error('상품 목록을 불러오는데 실패했습니다.');
                }

                const productsData = await productsResponse.json();
                const designerProducts = productsData.filter(
                    product => product.designerIndex === designerId
                );
                setProducts(designerProducts);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        if (designerId) {
            fetchData();
        }
    }, [designerId]);

    const ProductCard = ({ product }) => {
        const [isPressed, setIsPressed] = useState(false);

        const handleClick = () => {
            navigate('/product-detail', {
                state: { product }
            });
        };

        return (
            <div
                className={`designer-profile-card ${isPressed ? 'designer-profile-card-pressed' : ''}`}
                onClick={handleClick}
                onMouseDown={() => setIsPressed(true)}
                onMouseUp={() => setIsPressed(false)}
                onMouseLeave={() => setIsPressed(false)}
            >
                <div className="designer-profile-image-container">
                    <div className="designer-profile-card-wrapper">
                        <img src={product.imageUrls[0]} alt={product.name} className="designer-profile-product-image" />
                    </div>
                </div>
                <div className="designer-profile-content">
                    <div className="designer-profile-product-designer">{designer?.name || '브랜드명'}</div>
                    <div className="designer-profile-product-name">{product.name}</div>
                    <div className="designer-profile-product-price">{product.price?.toLocaleString()}원</div>
                </div>
            </div>
        );
    };

    if (loading) return (
        <div className="designer-profile-container">
            <Header />
            <div className="designer-profile-loading-container">
                <div className="designer-profile-loading-spinner"></div>
                <div className="designer-profile-loading-text">디자이너 정보를 불러오는 중...</div>
            </div>
        </div>
    );

    if (error) return <div>에러: {error}</div>;

    if (!designer) return <div>디자이너를 찾을 수 없습니다.</div>;

    return (
        <div className="designer-profile-container">
            <Header />
            <div className="designer-profile-info-container">
                <div className="designer-profile-sub-container">
                    <div className="designer-profile-header">
                        <img
                            src={designer.image}
                            alt={designer.name}
                            className="designer-profile-image"
                        />
                        {/* <h1 className="designer-profile-name">{designer.name}</h1> */}
                    </div>

                    <div className="designer-profile-info">
                        <div className="designer-profile-info-item">
                            <span className="designer-profile-label">이름:</span>
                            <span>{designer.name}</span>
                        </div>
                        <div className="designer-profile-info-item">
                            <span className="designer-profile-label">소개:</span>
                            <p>{designer.pr}</p>
                        </div>
                        <div className="designer-profile-info-item">
                            <span className="designer-profile-label">고용상태:</span>
                            <span>{designer.empStatus ? '재직중' : '미재직'}</span>
                        </div>
                        <div className="designer-profile-info-item">
                            <span className="designer-profile-label">경력:</span>
                            <span>{designer.career}</span>
                        </div>
                        <div className="designer-profile-info-item">
                            <span className="designer-profile-label">카테고리:</span>
                            <span>{designer.category}</span>
                        </div>
                    </div>
                </div>


                <div className="designer-profile-products-container">
                    <div className="designer-profile-products-subcontainer">
                        <div className="designer-profile-grid">
                            {products.length > 0 ? (
                                products.map(product => (
                                    <ProductCard key={product.pid} product={product} />
                                ))
                            ) : (
                                <p className="designer-profile-no-products">등록된 제품이 없습니다.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DesignerProfilePage;