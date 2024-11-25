import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import "../CSS/ProductDetailPage.css";
import Header from '../components/Header';
import product01 from '../images/product01.png';

const ProductDetailPage = () => {
    const { state } = useLocation();
    const id = state?.id;
    const name = state?.name;

    return (
        <div className='productDetail-main-container'>
            <Header />
            <div className='productDetail-main'>
                <div className="product-detail-content">
                    <h2>{id} and {name}</h2>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;