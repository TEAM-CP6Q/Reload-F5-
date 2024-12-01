import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import "../CSS/SearchResultsPage.css";
import Header from '../components/Header';

const SearchResultsPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { searchResults, searchQuery } = location.state || { searchResults: [], searchQuery: '' };

    const ProductCard = ({ product }) => {
        const [isPressed, setIsPressed] = useState(false);
        
        const handleClick = () => {
            navigate('/product-detail', {
                state: { product }
            });
        };

        return (
            <div 
                className={`main-product-card ${isPressed ? 'card-pressed' : ''}`}
                onClick={handleClick}
                onMouseDown={() => setIsPressed(true)}
                onMouseUp={() => setIsPressed(false)}
                onMouseLeave={() => setIsPressed(false)}
            >
                <div className="main-product-card-image-container">
                    <div className="new-product-card">
                        <img src={product.imageUrls[0]} alt={product.name} className="new-product-image" />
                    </div>
                </div>
                <div className="main-product-card-content">
                    <div className="new-product-designer">{product.designer?.name || '브랜드명'}</div>
                    <div className="new-product-name">{product.name}</div>
                    <div className="new-product-price">{product.price?.toLocaleString()}원</div>
                </div>
            </div>
        );
    };

    return (
        <>
            <Header />
            <div className="search-results-container">
                <div className="search-term-result">
                    '{searchQuery}' 검색 결과
                </div>
                <div className="main-new-products-container">
                    <div className="main-products-subContanier">
                        <div className="main-new-products-grid">
                            {searchResults.map((product) => (
                                <ProductCard key={product.pid} product={product} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SearchResultsPage;