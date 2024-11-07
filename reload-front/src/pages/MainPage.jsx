import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css'; // Swiper 기본 CSS
import 'swiper/css/navigation'; // Navigation 모듈의 CSS
import 'swiper/css/pagination'; // Pagination 모듈의 CSS
import '../CSS/MainPage.css'; // MainPage 관련 CSS
import Header from '../components/Header';
import { Navigation, Pagination, Autoplay } from 'swiper/modules'; // 모듈을 swiper/modules에서 가져오기
import { Input } from 'antd'; // Ant Design의 Input 모듈을 가져오기

const { Search } = Input;

const CategoryButtons = () => {
    const categories = [
        { id: 1, name: '인테리어', icon: '🏠' },
        { id: 2, name: '수납/정리', icon: '📦' },
        { id: 3, name: '문구/팬시', icon: '✏️' },
        { id: 4, name: '원구', icon: '🛍️' },
        { id: 5, name: '패션/잡화', icon: '👕' },
        { id: 6, name: '반려동물', icon: '🐾' },
        { id: 7, name: '가구', icon: '🪑' },
        { id: 8, name: '기타', icon: '📌' }
    ];

    return (
        <div className="category-container">
            <div className="category-grid">
                {categories.map(category => (
                    <div className="category-button-container">
                        <button key={category.id} className="category-button">
                            <div className="category-icon">{category.icon}</div>
                        </button>
                        <span className="category-name">{category.name}</span>
                    </div>
                ))}
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
                style={{ height: '25vh' }}
            >
                <SwiperSlide className="slide-content">1</SwiperSlide>
                <SwiperSlide className="slide-content">2</SwiperSlide>
                <SwiperSlide className="slide-content">3</SwiperSlide>
                <SwiperSlide className="slide-content">4</SwiperSlide>
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
        </>
    );
};

export default MainPage;