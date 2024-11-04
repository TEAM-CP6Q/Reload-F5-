import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

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
      const response = await fetch('http://3.37.122.192:8000/api/auth/kakao/login', {
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
        localStorage.setItem('token', result.token);
        navigate('/');
      } else {
        console.error('로그인 실패:', await response.json());
      }
    } catch (error) {
      console.error('로그인 요청 오류:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleIntegration = async (authCode) => {
    try {
      const response = await fetch('http://3.37.122.192:8000/api/auth/kakao/integration', {
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
      const response = await fetch('http://3.37.122.192:8000/api/auth/kakao/register', {
        method: 'POST',
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
