import React, { useEffect, useState } from 'react';
import kakao from '../images/kakao_login_large_wide.png';
import '../CSS/KakaoLogin.css';

const KakaoLogin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);



  const handleKakaoLogin = () => {
    const clientId = process.env.REACT_APP_KAKAO_CLIENT_ID_TEST;
    const redirectUri = process.env.REACT_APP_KAKAO_REDIRECT_URI_DOMAIN;

    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}`;

    window.location.href = kakaoAuthUrl;
  };

  const handleLogout = async () => {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      try {
        // 카카오 앱 연결 해제 API 호출
        await fetch('https://kapi.kakao.com/v1/user/unlink', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
          },
        });

        // 로컬 스토리지에서 토큰 및 이메일 삭제
        localStorage.removeItem('access_token');
        localStorage.removeItem('email');
        setIsLoggedIn(false);
        console.log('카카오 계정 연결 해제 성공');
      } catch (error) {
        console.error('카카오 계정 연결 해제 실패:', error);
      }
    } else {
      console.log('로그인 상태가 아닙니다.');
    }
  };



  return (
    <div className="kakao-login">
      {isLoggedIn ? (
        <button onClick={handleLogout} className="logout-button">
          로그아웃
        </button>
      ) : (
        <img
          src={kakao}
          alt="카카오 로그인"
          onClick={handleKakaoLogin}
          className="kakao-login-button"
        />
      )}
    </div>
  );
};

export default KakaoLogin;
