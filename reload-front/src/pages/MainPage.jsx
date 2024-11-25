import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css'; // Swiper 기본 CSS
import 'swiper/css/navigation'; // Navigation 모듈의 CSS
import 'swiper/css/pagination'; // Pagination 모듈의 CSS
import '../CSS/MainPage.css'; // MainPage 관련 CSS
import Header from '../components/Header';
import { Navigation, Pagination, Autoplay } from 'swiper/modules'; // 모듈을 swiper/modules에서 가져오기
import { Input } from 'antd'; // Ant Design의 Input 모듈을 가져오기

import product01 from '../images/product01.png';
import product02 from '../images/product02.png';
import product03 from '../images/product03.png';
import product04 from '../images/product04.png';
import product05 from '../images/product05.png';
import product06 from '../images/product06.png';
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

const NewProductCard = ({ image, designer, name, price }) => {
    return (
        <div className="main-product-card">
            <div className="main-product-card-image-container">
                <div className="new-product-card">
                    <img src={image} alt={name} className="new-product-image" />
                </div>
            </div>
            <div className="main-product-card-content">
                <div className="new-product-designer">{designer}</div>
                <div className="new-product-name">{name}</div>
                <div className="new-product-price">{price}원</div>
            </div>
        </div>
    );
};

const MainPage = () => {
    const [searchValue, setSearchValue] = useState('');

    const onSearch = () => {
        console.log(searchValue);
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            onSearch();
        }
    };

    // 일단 하드코딩
    const newProducts = [
        {
            id: 1,
            image: product01,
            designer: 'Designer A',
            name: '데스커 기본형 테이블 6인',
            price: '53,000'
        },
        {
            id: 2,
            image: product02,
            designer: 'Designer B',
            name: '폴인퍼니 미엘 세라믹 식탁',
            price: '42,000'
        },
        {
            id: 3,
            image: product03,
            designer: 'Designer C',
            name: '스칸디무드 접이식 식탁 테이블',
            price: '89,000'
        },
        {
            id: 4,
            image: product04,
            designer: 'Designer D',
            name: '썸앤데코 라곰 고무나무 원목식탁',
            price: '75,000'
        },
        {
            id: 5,
            image: product05,
            designer: 'Designer E',
            name: '레트로하우스 원목 원형 테이블',
            price: '42,000'
        },
        {
            id: 6,
            image: product06,
            designer: 'Designer F',
            name: '라움에스알 빈티지 원형 식탁',
            price: '35,000'
        },
    ];

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
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                modules={[Navigation, Pagination, Autoplay]}
                style={{ height: '200px' }}
            >
                <SwiperSlide className="slide-content"><img src={mainBanner01} className="main-banner-image" /></SwiperSlide>
                <SwiperSlide className="slide-content"><img src={mainBanner02} className="main-banner-image" /></SwiperSlide>
                <SwiperSlide className="slide-content"><img src={mainBanner03} className="main-banner-image" /></SwiperSlide>
                {/* <SwiperSlide className="slide-content">3</SwiperSlide>
                <SwiperSlide className="slide-content">4</SwiperSlide> */}
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
                    <div className="main-new-products-grid">
                        {newProducts.map((product) => (
                            <NewProductCard
                                key={product.id}
                                image={product.image}
                                designer={product.designer}
                                name={product.name}
                                price={product.price}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default MainPage;