import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import loginlogo from '../images/Logo.png';
import '../CSS/SideBar.css';

const SideBar = ({ isOpen, onClose }) => {
    const [isLogin, setIsLogin] = useState(false);
    const navigate = useNavigate();

    const handleNavigation = (path) => {
        if (!isLogin && path !== '/login') {
            navigate('/login');
        } else {
            navigate(path);
        }
        onClose();
    };

    const handleMyPageClick = () => {
        if (!isLogin) {
            navigate('/login');
        } else {
            navigate('/mypage');
        }
        onClose();
    }

    // 로그아웃 함수
    const handleLogout = () => {
        // 사용자에게 확인 요청
        const isConfirmed = window.confirm("정말 로그아웃 하시겠습니까?");
        
        // 사용자가 확인을 클릭한 경우에만 로그아웃 진행
        if (isConfirmed) {
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            localStorage.removeItem("email");
            localStorage.removeItem("username");
            localStorage.removeItem("id");
            localStorage.removeItem("access_token");
            window.location.reload();
        }
    };

    useEffect(() => {
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
    }, [])

    return (
        <>
            <div className={`sidebar-overlay ${isOpen ? 'active' : ''}`} onClick={onClose} />
            <div className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
                <div className="sidebar-header">
                    <div className="sidebar-header-content">
                        <img src={loginlogo} className='sidebar-logo' alt="로그인로고" />
                        <div style={{ fontWeight: '600', fontSize: '18px' }}>새로고침 - F5</div>
                    </div>
                    <button className="sidebar-header-close-button" onClick={onClose}>
                        <FontAwesomeIcon icon={faXmark} />
                    </button>
                </div>
                <div className="sidebar-content-wrapper">
                    <div className="sidebar-content">
                        <button className="sidebar-menu-item" onClick={handleMyPageClick}>
                            마이페이지
                        </button>
                        <div className="sidebar-menu-divider" />
                        <button className="sidebar-menu-item" onClick={() => handleNavigation('/pickup-request')}>
                            수거 신청
                        </button>
                        {/* <div className="sidebar-menu-divider" />
                        <button className="sidebar-menu-item" onClick={() => handleNavigation('/')}>
                            기업 파트너십 신청
                        </button> */}
                        <div className="sidebar-menu-divider" />
                        <button className="sidebar-menu-item" onClick={() => handleNavigation('/chat')}>
                            상품 문의
                        </button>
                    </div>
                </div>
                <div>
                    {!isLogin ?
                        <button className="sidebar-bottom-login" onClick={() => handleNavigation('/login')}>
                            로그인
                        </button>
                        :
                        <button className="sidebar-logout-button" onClick={handleLogout}>
                            로그아웃
                        </button>
                    }
                </div>
            </div>
        </>
    );
};

export default SideBar;