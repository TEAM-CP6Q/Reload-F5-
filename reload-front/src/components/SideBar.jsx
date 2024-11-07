// SideBar.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import loginlogo from '../images/Logo.png';
import '../CSS/SideBar.css';

const SideBar = ({ isOpen, onClose }) => {
    const navigate = useNavigate();

    const handleNavigation = (path) => {
        navigate(path);
        onClose();
    };

    const handleMyPageClick = () => {
        navigate('/mypage');
        onClose();
    }

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
                        <button className="sidebar-menu-item" onClick={() => handleNavigation('/')}>
                            수거 신청
                        </button>
                        <div className="sidebar-menu-divider" />
                        <button className="sidebar-menu-item" onClick={() => handleNavigation('/')}>
                            기업 파트너십 신청
                        </button>
                        <div className="sidebar-menu-divider" />
                        <button className="sidebar-menu-item" onClick={() => handleNavigation('/')}>
                            상품 문의
                        </button>
                    </div>
                </div>
                <div>
                    <button className="sidebar-bottom" onClick={() => handleNavigation('/login')}>
                        로그인
                    </button>
                </div>
            </div>
        </>
    );
};

export default SideBar;