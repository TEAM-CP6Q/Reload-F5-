import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import '../CSS/ShoppingCart.css';
import { ShoppingCart as CartIcon } from 'lucide-react';

const ShoppingCart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        // Get cart items from localStorage
        const savedCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        setCartItems(savedCartItems);
    }, []);

    useEffect(() => {
        const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        setTotalPrice(total);
    }, [cartItems]);

    const handleQuantityChange = (itemId, newQuantity) => {
        if (newQuantity < 1) return;
        const updatedItems = cartItems.map(item =>
            item.pid === itemId ? { ...item, quantity: newQuantity } : item
        );
        setCartItems(updatedItems);
        localStorage.setItem('cartItems', JSON.stringify(updatedItems));
    };

    const handleRemoveItem = (itemId) => {
        const updatedItems = cartItems.filter(item => item.pid !== itemId);
        setCartItems(updatedItems);
        localStorage.setItem('cartItems', JSON.stringify(updatedItems));
    };


    const handleCheckout = () => {
        // Implement checkout logic
        navigate('/payment-check');
    };

    const handleContinueShopping = () => {
        navigate('/');
    };

    return (
        <div className="cart-container">
            <Header />
            <div className="cart-content">
                {cartItems.length === 0 ? (
                    <div className="cart-empty">
                        <CartIcon className="cart-empty-icon" />
                        <p style={{fontWeight: '600'}}>장바구니가 비어있습니다!</p>
                        <div className="sub-text">
                            원하는 상품을 장바구니에 담아보세요
                        </div>
                        <button
                            className="continue-shopping-button"
                            onClick={handleContinueShopping}
                        >
                            쇼핑 시작하기
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="cart-items">
                            {cartItems.map(item => (
                                <div key={item.pid} className="cart-item">
                                    <img
                                        src={item.imageUrl}
                                        alt={item.name}
                                        className="cart-item-image"
                                    />
                                    <div className="cart-item-details">
                                        <div className="cart-item-name">{item.name}</div>
                                        <div className="cart-item-designer">{item.designerName}</div>
                                        <div className="cart-item-price">
                                            {item.price.toLocaleString()}원
                                        </div>
                                        <div className="cart-item-actions">
                                            <div className="quantity-controls">
                                                <button
                                                    onClick={() => handleQuantityChange(item.pid, item.quantity - 1)}
                                                >
                                                    -
                                                </button>
                                                <span>{item.quantity}</span>
                                                <button
                                                    onClick={() => handleQuantityChange(item.pid, item.quantity + 1)}
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <button
                                                className="remove-button"
                                                onClick={() => handleRemoveItem(item.pid)}
                                            >
                                                삭제
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="cart-summary">
                            <div className="cart-total">
                                <span>총 결제금액</span>
                                <span>{totalPrice.toLocaleString()}원</span>
                            </div>
                        </div>

                        <div className="cart-buttons">
                            <button
                                className="continue-shopping-button"
                                onClick={handleContinueShopping}
                            >
                                쇼핑 계속하기
                            </button>
                            <button
                                className="checkout-button"
                                onClick={handleCheckout}
                            >
                                구매하기
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ShoppingCart;