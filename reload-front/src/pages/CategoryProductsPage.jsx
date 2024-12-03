import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import "../CSS/CategoryProductsPage.css";
import Header from '../components/Header';

const CategoryProductsPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { categoryProducts, categoryName } = location.state || { categoryProducts: [], categoryName: '' };

    const ProductCard = ({ product }) => {
        const [isPressed, setIsPressed] = useState(false);
        
        const handleClick = () => {
            navigate('/product-detail', {
                state: { product }
            });
        };

        return (
            <div 
                className={`category-products-card ${isPressed ? 'category-products-card-pressed' : ''}`}
                onClick={handleClick}
                onMouseDown={() => setIsPressed(true)}
                onMouseUp={() => setIsPressed(false)}
                onMouseLeave={() => setIsPressed(false)}
            >
                <div className="category-products-image-container">
                    <div className="category-products-card-wrapper">
                        <img src={product.imageUrls[0]} alt={product.name} className="category-products-image" />
                    </div>
                </div>
                <div className="category-products-content">
                    <div className="category-products-designer">{product.designer?.name || '브랜드명'}</div>
                    <div className="category-products-name">{product.name}</div>
                    <div className="category-products-price">{product.price?.toLocaleString()}원</div>
                </div>
            </div>
        );
    };

    const EmptyState = () => (
        <div className="category-products-empty">
            <div className="category-products-empty-icon">🏷️</div>
            <div className="category-products-empty-title">
                {categoryName} 카테고리에 상품이 없습니다
            </div>
            <div className="category-products-empty-description">
                현재 이 카테고리에 등록된 상품이 없습니다
            </div>
            <button 
                className="category-products-empty-button"
                onClick={() => navigate('/')}
            >
                홈으로 돌아가기
            </button>
        </div>
    );

    return (
        <>
            <Header />
            <div className="category-products-container">
                <div className="category-products-term">
                    {categoryName} 카테고리
                </div>
                <div className="category-products-products-container">
                    {categoryProducts.length > 0 ? (
                        <div className="category-products-subcontainer">
                            <div className="category-products-grid">
                                {categoryProducts.map((product) => (
                                    <ProductCard key={product.pid} product={product} />
                                ))}
                            </div>
                        </div>
                    ) : (
                        <EmptyState />
                    )}
                </div>
            </div>
        </>
    );
};

export default CategoryProductsPage;