import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import "../CSS/SearchResultsPage.css";
import Header from '../components/Header';

const SearchResultsPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { searchResults, searchQuery } = location.state || { searchResults: [], searchQuery: '' };

    const fetchDesigner = async (designerId) => {
        const response = await fetch(`https://refresh-f5-server.o-r.kr/api/account/designer/get-designer/${designerId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        const data = await response.json();
        return data;
    };

    const ProductCard = ({ product }) => {
        const [isPressed, setIsPressed] = useState(false);
        const [designer, setDesigner] = useState(null);

        useEffect(() => {
            const fetchDesignerData = async () => {
                try {
                    const designerData = await fetchDesigner(product.designerIndex);
                    setDesigner(designerData);
                } catch (error) {
                    console.error('디자이너 데이터를 가져오는 중 오류가 발생했습니다:', error);
                }
            };

            if (product.designerIndex) {
                fetchDesignerData();
            }
        }, [product.designerIndex]);
        
        const handleClick = () => {
            navigate('/product-detail', {
                state: { product }
            });
        };

        return (
            <div 
                className={`search-results-card ${isPressed ? 'search-results-card-pressed' : ''}`}
                onClick={handleClick}
                onMouseDown={() => setIsPressed(true)}
                onMouseUp={() => setIsPressed(false)}
                onMouseLeave={() => setIsPressed(false)}
            >
                <div className="search-results-image-container">
                    <div className="search-results-card-wrapper">
                        <img src={product.imageUrls[0]} alt={product.name} className="search-results-image" />
                    </div>
                </div>
                <div className="search-results-content">
                    <div className="search-results-designer">{designer?.name}</div>
                    <div className="search-results-name">{product.name}</div>
                    <div className="search-results-price">{product.price?.toLocaleString()}원</div>
                </div>
            </div>
        );
    };

    const EmptyState = () => (
        <div className="search-results-empty">
            <div className="search-results-empty-icon">🔍</div>
            <div className="search-results-empty-title">
                '{searchQuery}' 검색 결과가 없습니다
            </div>
            <div className="search-results-empty-description">
                다른 검색어로 다시 시도해보세요
            </div>
            <button 
                className="search-results-empty-button"
                onClick={() => navigate('/')}
            >
                홈으로 돌아가기
            </button>
        </div>
    );

    return (
        <>
            <Header />
            <div className="search-results-container">
                <div className="search-results-term">
                    '{searchQuery}' 검색 결과
                </div>
                <div className="search-results-products-container">
                    {searchResults.length > 0 ? (
                        <div className="search-results-subcontainer">
                            <div className="search-results-grid">
                                {searchResults.map((product) => (
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

export default SearchResultsPage;