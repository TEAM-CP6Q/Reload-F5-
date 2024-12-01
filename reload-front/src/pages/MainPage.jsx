import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useNavigate } from 'react-router-dom';
import 'swiper/css'; // Swiper 기본 CSS
import 'swiper/css/navigation'; // Navigation 모듈의 CSS
import 'swiper/css/pagination'; // Pagination 모듈의 CSS
import '../CSS/MainPage.css'; // MainPage 관련 CSS
import Header from '../components/Header';
import { Navigation, Pagination, Autoplay } from 'swiper/modules'; // 모듈을 swiper/modules에서 가져오기
import { Input } from 'antd'; // Ant Design의 Input 모듈을 가져오기

import mainBanner01 from '../images/mainBanner01.png';
import mainBanner02 from '../images/mainBanner02.png';
import mainBanner03 from '../images/mainBanner03.png';

const { Search } = Input;

const CategoryButtons = () => {
    const categories = [
        { id: 1, name: '인테리어', icon: '🏠' },
        { id: 2, name: '수납/정리', icon: '📦' },
        { id: 3, name: '문구/팬시', icon: '✏️' },
        { id: 4, name: '완구', icon: '🛍️' },
        { id: 5, name: '패션/잡화', icon: '👕' },
        { id: 6, name: '반려동물', icon: '🐾' },
        { id: 7, name: '가구', icon: '🪑' },
        { id: 8, name: '기타', icon: '📌' }
    ];

    return (
        <div className="category-container">
            <div className="category-grid">
                {categories.map(category => (
                    <div key={category.id} className="category-button-container"> {/* key 속성을 div에 추가 */}
                        <button className="category-button">
                            <div className="category-icon">{category.icon}</div>
                        </button>
                        <span className="category-name">{category.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

// fetch 디자이너 데이터
const fetchDesigner = async (designerId) => {
    const response = await fetch(`https://refresh-f5-server.o-r.kr/api/account/designer/get-designer/${designerId}`, {
      method: 'GET', // 메소드 설정 (GET)
      headers: {
        'Content-Type': 'application/json', // 요청 헤더 추가
      }
    });
    const data = await response.json();
    return data;
  };
  

const NewProductCard = ({ product }) => {
    const navigate = useNavigate();
    const [isPressed, setIsPressed] = useState(false);
    const [designer, setDesigner] = useState(null);

    useEffect(() => {
        const fetchDesignerData = async () => {
            try {
                const designerData = await fetchDesigner(product.designerIndex);
                setDesigner(designerData);
                console.log("디자이너 : " + product.designerIndex);
            } catch (error) {
                console.error('디자이너 데이터를 가져오는 중 오류가 발생했습니다:', error);
            }
        };

        fetchDesignerData();
    }, [product.designerIndex]);

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
                <div className="new-product-designer">{designer ? designer.name : '로딩 중...'}</div>
                <div className="new-product-name">{product.name}</div>
                <div className="new-product-price">{product.price.toLocaleString()}원</div>
            </div>
        </div>
    );
};

const MainPage = () => {
    const navigate = useNavigate();

    const [searchValue, setSearchValue] = useState('');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isLogin, setIsLogin] = useState(false);

    const handleImageClick = () => {
        if (window.confirm('수거신청 페이지로 이동하시겠습니까?')) {
            if(isLogin) {
                navigate('/pickup-request');
            }
            else {
                navigate('/login');
            }
        }
      };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Get access token from localStorage or your auth management system
                const accessToken = localStorage.getItem('accessToken');
                
                const response = await fetch('https://refresh-f5-server.o-r.kr/api/product/latest-product-list', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }

                const data = await response.json();
                setProducts(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        const handleget = async () => {
            const token = localStorage.getItem("token");
            const email = localStorage.getItem("email");

            if (token && email) {
                console.log("로그인 성공");
                setIsLogin(true);
            } else {
                console.log("로그인 실패");
                setIsLogin(false);
            }
        };
        handleget();

        fetchProducts();
    }, []);

    const onSearch = () => {
        console.log(searchValue);
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            onSearch();
        }
    };

    return (
        <>
            <Header />
            <Swiper
                spaceBetween={50}
                slidesPerView={1}
                navigation
                pagination={{
                    type: "fraction"
                }}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                modules={[Navigation, Pagination, Autoplay]}
                style={{ height: '200px' }}
            >
                <SwiperSlide className="slide-content"><img src={mainBanner03} className="main-banner-image" /></SwiperSlide>
                <SwiperSlide className="slide-content"><img src={mainBanner01} onClick={handleImageClick} className="main-banner-image" style={{cursor: 'pointer'}}/></SwiperSlide>
                <SwiperSlide className="slide-content"><img src={mainBanner02} onClick={handleImageClick} className="main-banner-image" style={{cursor: 'pointer'}}/></SwiperSlide>
            </Swiper>

            <div className="search-container">
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="지구를 세로 고칠 때까지, 새로고침"
                        className="search-input"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                    />
                    <button className="search-button" onClick={onSearch}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                    </button>
                </div>
            </div>

            <CategoryButtons />

            <div className='main-divider'>
                <div className="main-divider-bar" />
            </div>

            <div className="main-new-products-header">
                <div className="main-new-products-text">
                    최신 상품
                </div>
                <div className="main-new-products-array">
                    최신순
                </div>
            </div>

            <div className="main-new-products-container">
                <div className="main-products-subContanier">
                    {loading ? (
                        <div>Loading...</div>
                    ) : error ? (
                        <div>Error: {error}</div>
                    ) : (
                        <div className="main-new-products-grid">
                            {products.map((product) => (
                                <NewProductCard
                                    key={product.pid}
                                    product={product}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default MainPage;