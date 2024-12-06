import React, { useState } from "react";
import '../CSS/Header.css';
import { useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faBars, faCartShopping, faHouse } from '@fortawesome/free-solid-svg-icons';
import SideBar from './SideBar';
import mainLogo from '../images/mainLogo.png';

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isSideBarOpen, setIsSideBarOpen] = useState(false);
    const isDirectPurchase = location.state?.isDirectPurchase;

    const handleShoppingCart = () => {
        const token = localStorage.getItem("token");
        const email = localStorage.getItem("email");

        if (token && email) {
            navigate('/cart');
        } else {
            navigate('/login');
        }
    };

    const handleBackClick = () => {
        if (location.pathname === '/pickup-request') {
            if (window.confirm('정말 나가시겠습니까? 현재 진행중인 과정은 초기화됩니다.')) {
                navigate(-1);
            }
        } else if (location.pathname === '/payment-check' && isDirectPurchase) {
            // 즉시구매 데이터 정리 후 이동
            localStorage.removeItem('directPurchaseItem');
            
            // 기존 장바구니가 임시 저장되어 있다면 복원
            const tempCartItems = localStorage.getItem('tempCartItems');
            if (tempCartItems) {
                localStorage.setItem('cartItems', tempCartItems);
                localStorage.removeItem('tempCartItems');
            }
            
            navigate(-1);
        } else {
            navigate(-1);
        }
    };

    const handleHomeClick = () => {
        if (location.pathname === '/pickup-request') {
            if (window.confirm('정말 나가시겠습니까? 현재 진행중인 과정은 초기화됩니다.')) {
                navigate('/');
            }
        } else if (location.pathname === '/payment-check' && isDirectPurchase) {
            // 즉시구매 데이터 정리 후 홈으로 이동
            localStorage.removeItem('directPurchaseItem');
            
            // 기존 장바구니가 임시 저장되어 있다면 복원
            const tempCartItems = localStorage.getItem('tempCartItems');
            if (tempCartItems) {
                localStorage.setItem('cartItems', tempCartItems);
                localStorage.removeItem('tempCartItems');
            }
            
            navigate('/');
        } else {
            navigate('/');
        }
    };

    const handleOpenMenuBar = () => {
        setIsSideBarOpen(true);
    };

    const handleCloseSideBar = () => {
        setIsSideBarOpen(false);
    };

    const getPageTitle = () => {
        const path = location.pathname;
        if (path.startsWith('/pickup-list-detail/')) {
            return '수거 상세 내역';
        }
        switch (location.pathname) {
            case '/login':
                return '로그인';
            case '/signup':
                return '회원가입';
            case '/mypage':
                return '마이페이지';
            case '/user-update':
                return '내정보 수정';
            case '/signup-type':
                return '회원가입';
            case '/order-list':
                return '주문내역';
            case '/order-list-detail':
                return '주문 상세 내역';
            case '/chat':
                return '문의하기';
            case '/pickup-request':
                return '수거 신청하기';
            case '/pickup/result':
                return '수거 신청하기';
            case '/pickup-list':
                return '수거 내역 확인';
            case '/pickup-location':
                return '수거 기사님 위치 확인';
            case '/product-detail':
                return '상품 상세';
            case '/search':
                return '상품 검색';
            case '/designer':
                return '디자이너';
            case "/category-products":
                return '카테고리별 상품';
            case "/cart":
                return '장바구니';
            case "/payment-check":
                return '결제';
            case "/payment-failed":
                return '결제 실패';
            case "/payment-complete":
                return '결제 완료';
            default:
                return 'Main Page';
        }
    };

    const isMainPage = location.pathname === '/';

    return (
        <>
            <header>
                <div className="header-contents">
                    {!isMainPage && (
                        <div className="header-other_page_header">
                            <span className="header-back_btn" onClick={handleBackClick}>
                                <FontAwesomeIcon icon={faArrowLeft} className="faArrowLeft" style={{ cursor: 'pointer', fontSize: '20px' }} />
                            </span>
                            <span className="header-other_page_title">{getPageTitle()}</span>
                            <span onClick={handleHomeClick} className="header-home_btn">
                                <FontAwesomeIcon icon={faHouse} style={{ fontSize: '25px' }} />
                            </span>
                        </div>
                    )}
                    {isMainPage && (
                        <div className="header-main_page_header">
                            <span className="header-menu_btn" onClick={handleOpenMenuBar}>
                                <FontAwesomeIcon icon={faBars} style={{ fontSize: '25px' }} />
                            </span>
                            <img src={mainLogo} className='header-mainLogo' alt="메인로고" />
                            <span onClick={handleShoppingCart} className="header-cart_btn">
                                <FontAwesomeIcon icon={faCartShopping} style={{ fontSize: '25px' }} />
                            </span>
                        </div>
                    )}
                </div>
            </header>
            <SideBar isOpen={isSideBarOpen} onClose={handleCloseSideBar} />
        </>
    );
};

export default Header;