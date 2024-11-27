import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css'; // Swiper 기본 CSS
import 'swiper/css/navigation'; // Navigation 모듈의 CSS
import 'swiper/css/pagination'; // Pagination 모듈의 CSS
import "../CSS/ProductDetailPage.css";
import Header from '../components/Header';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

const ProductDetailPage = () => {
    const { state } = useLocation();
    const product = state?.product;


    return (
        <div className='productDetail-main-container'>
            <Header />
            <div className='productDetail-main'>
                {/* <div className="productDetail-main-image-container">
                    <img src={product01} alt={product.name} className="productDetail-main-image" />
                </div> */}
                <Swiper
                    spaceBetween={50}
                    slidesPerView={1}
                    navigation
                    pagination={{
                        type: "fraction"
                    }}
                    autoplay={{ delay: 5000, disableOnInteraction: false }}
                    modules={[Navigation, Pagination, Autoplay]}
                    style={{ height: '230px' }}
                >
                    <SwiperSlide className="slide-content"><img src={product.image} className="productDetail-banner-image" /></SwiperSlide>
                    <SwiperSlide className="slide-content"><img src={product.image} className="productDetail-banner-image" /></SwiperSlide>
                    <SwiperSlide className="slide-content"><img src={product.image} className="productDetail-banner-image" /></SwiperSlide>
                </Swiper>
            </div>
            <div className='productDetail-designer-container'>
                <div className='productDetail-designer-sub-container'>
                    <div className='productDetail-designer-profile'>
                        <div className='productDetail-designer-image'>
                            {/* 사진 */}
                        </div>
                        <div className='productDetail-designer-name'>
                            {product.designer}
                        </div>
                    </div>
                    <div className='productDetail-designer-button'>
                        <span style={{ fontSize: '10px', margin: '5px' }}>디자이너 보러가기</span>

                        <FontAwesomeIcon icon={faArrowRight} style={{ fontSize: '10px' }} />

                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;