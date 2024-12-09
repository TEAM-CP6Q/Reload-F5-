import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../CSS/KakaoCallback.css';

const KakaoCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const hasFetched = useRef(false);

  useEffect(() => {
    // 이미 처리된 요청이거나 로딩 중이면 중복 실행 방지
    if (hasFetched.current || isLoading) return;
    
    const queryParams = new URLSearchParams(location.search);
    const authCode = queryParams.get('code');
    const state = queryParams.get('state');
  
    if (!authCode) {
      console.log('인가 코드가 없습니다.');
      return;
    }
  
    console.log('인가 코드:', authCode);
    setIsLoading(true);
    hasFetched.current = true;
  
    // state 값에 따라 다른 처리
    if (state === 'signup') {
      handleRegister(authCode);
    } else if (state === 'integration') {
      console.log('통합 진행을 위한 인가 코드:', authCode);  // 통합 시 인가 코드 확인
      handleIntegration(authCode);
    } else {
      handleLogin(authCode);
    }
  }, [location.search]); // location.search만 dependency로 설정
  
  const handleLogin = async (authCode) => {
    try {
      const response = await fetch('https://refresh-f5-server.o-r.kr/api/auth/kakao/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: authCode }),
      });
  
      const errorData = await response.json();
  
      if (!response.ok) {
        switch (response.status) {
          case 404:
            alert('카카오 회원가입을 진행해주세요.');
            navigate('/register');
            break;
              
            case 405:
              const confirmIntegration = window.confirm('통합을 진행하시겠습니까?');
              if (confirmIntegration) {
                const clientId = process.env.REACT_APP_KAKAO_CLIENT_ID_TEST;
                const integrationRedirectUri = process.env.REACT_APP_KAKAO_INTEGRATION_REDIRECT_URI;
                
                // 1. 카카오 계정 완전 로그아웃 페이지로 이동
                window.location.href = 'https://accounts.kakao.com/logout';
                
                // 2. 로그아웃 후 사용자에게 안내
                alert('카카오 계정에서 로그아웃되었습니다. 확인을 누르시면 다시 로그인 페이지로 이동합니다.');
                
                // 3. 새로운 인가 코드를 받기 위한 로그인
                setTimeout(() => {
                  const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(integrationRedirectUri)}&state=integration&prompt=login`;
                  window.location.href = kakaoAuthUrl;
                }, 500);
              }
              break;
              
          case 406:
            alert('토큰 처리 중 서버 오류가 발생했습니다.');
            break;
              
          default:
            alert(`로그인 실패: ${errorData.Msg || '알 수 없는 오류가 발생했습니다.'}`);
        }
        return;
      }
  
      if (errorData.token) {
        localStorage.setItem('token', errorData.token);
        localStorage.setItem('email', errorData.user.email);
        navigate('/');
      } else {
        alert('로그인 정보가 올바르지 않습니다.');
      }
  
    } catch (error) {
      console.error('로그인 요청 오류:', error);
      alert('로그인 처리 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleIntegration = async (integrationAuthCode) => {
    try {
      const response = await fetch('https://refresh-f5-server.o-r.kr/api/auth/kakao/integration', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: integrationAuthCode }),
      });

      if (response.status === 200) {
        const result = await response.json();
        localStorage.setItem('token', result.token);
        alert('계정 통합이 완료되었습니다.');
        navigate('/');
      } else {
        const errorData = await response.json();
        alert(`통합 실패: ${errorData.Msg || '알 수 없는 오류가 발생했습니다.'}`);
      }
    } catch (error) {
      console.error('통합 요청 오류:', error);
      alert('계정 통합 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };


  const handleRegister = async (authCode) => {
    try {
      const response = await fetch('https://refresh-f5-server.o-r.kr/api/auth/kakao/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: authCode }),
      });

      if (response.status === 200) {
        const result = await response.json();
        alert('회원가입이 완료되었습니다. 로그인 해주세요');
        navigate('/login');
      } else if (response.status === 405) {
        alert('이미 회원가입되었습니다.');
        navigate('/login');
      } else {
        console.error('회원가입 실패:', await response.json());
      }
    } catch (error) {
      console.error('회원가입 요청 오류:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="kakao-callback">
      {isLoading && <div className="spinner"></div>}
    </div>
  );
};

export default KakaoCallback;
