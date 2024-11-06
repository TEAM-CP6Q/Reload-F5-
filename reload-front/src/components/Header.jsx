import React, { useState, useEffect } from "react";
import '../CSS/Header.css';
import { useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faBars, faCartShopping, faHouse } from '@fortawesome/free-solid-svg-icons';
import SideBar from './SideBar';  // SideBar 컴포넌트를 import

const Header = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const [isSideBarOpen, setIsSideBarOpen] = useState(false);

    // 장바구니 버튼
    const handleShoppingCart = () => {
        navigate('/login');
    };

    // 뒤로가기 버튼
    const handleBackClick = () => {
        navigate(-1);
    };

    const handleHomeClick = () => {
        navigate('/');
    }

    // 메뉴바 버튼 눌렀을 때, 왼쪽에서 오른쪽으로 사이드 바 펼치기
    const handleOpenMenuBar = () => {
        setIsSideBarOpen(true);
    };

    const handleCloseSideBar = () => {
        setIsSideBarOpen(false);
    };

    const getPageTitle = () => {
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
            default:
                return 'Main Page';
        }
    };

    const isMainPage = location.pathname === '/';
    const isLoginPage = location.pathname === '/login';

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
                        <>
                            <div className="header-main_page_header">
                                <span className="header-menu_btn" onClick={handleOpenMenuBar}>
                                    <FontAwesomeIcon icon={faBars} style={{ fontSize: '25px' }} />
                                </span>
                                <span className="header-main_page_title">새로고침</span>
                                <span onClick={handleShoppingCart} className="header-cart_btn">
                                    <FontAwesomeIcon icon={faCartShopping} style={{ fontSize: '25px' }} />
                                </span>
                            </div>
                        </>
                    )}
                </div>
            </header>
            <SideBar isOpen={isSideBarOpen} onClose={handleCloseSideBar} />
        </>
    );
};

export default Header;