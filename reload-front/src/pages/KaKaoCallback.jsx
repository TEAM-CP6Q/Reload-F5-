import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../CSS/KakaoCallback.css'; // 스피너 스타일을 정의한 CSS 파일

const KakaoCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const queryParams = new URLSearchParams(location.search);
    const authCode = queryParams.get('code');
    const state = queryParams.get('state'); // state 값으로 회원가입 여부 확인

    if (authCode) {
      console.log('인가 코드:', authCode);
      setIsLoading(true);
      state === 'signup' ? handleRegister(authCode) : handleLogin(authCode);
    } else {
      console.log('인가 코드가 없습니다.');
    }
  }, [location, navigate]);

  const handleLogin = async (authCode) => {
    try {
      const response = await fetch('https://refresh-f5-server.o-r.kr/api/auth/kakao/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: authCode }),
      });

      if (response.status === 405) {
        const confirmIntegration = window.confirm('통합하시겠습니까?');
        if (confirmIntegration) {
          await handleIntegration(authCode);
        }
      } else if (response.status === 200) {
        const result = await response.json();
        if (result.token) {
          console.log(result);
          console.log(result.user.email);
          localStorage.setItem('token', result.token);
          localStorage.setItem('email', result.user.email);
          navigate('/');
        } else {
          console.error('로그인 응답에 토큰이 없습니다:', result);
        }
      } else {
        const errorData = await response.json();
        console.error(`로그인 실패 - 상태 코드 ${response.status}:`, errorData);
      }
    } catch (error) {
      console.error('로그인 요청 오류:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleIntegration = async (authCode) => {
    try {
      const response = await fetch('https://refresh-f5-server.o-r.kr/api/auth/kakao/integration', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: authCode }),
      });

      if (response.status === 200) {
        const result = await response.json();
        localStorage.setItem('token', result.token);
        navigate('/');
      } else {
        console.error('통합 실패:', await response.json());
      }
    } catch (error) {
      console.error('통합 요청 오류:', error);
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
