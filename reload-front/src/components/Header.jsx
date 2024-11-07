// Header.js
import React, { useState } from "react";
import '../CSS/Header.css';
import { useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faBars, faCartShopping, faHouse } from '@fortawesome/free-solid-svg-icons';
import SideBar from './SideBar';

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isSideBarOpen, setIsSideBarOpen] = useState(false);

    const handleShoppingCart = () => {
        navigate('/login');
    };

    const handleBackClick = () => {
        navigate(-1);
    };

    const handleHomeClick = () => {
        navigate('/');
    }

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
            case '/chat':
                return '문의하기';
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
                            <span className="header-main_page_title">새로고침</span>
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