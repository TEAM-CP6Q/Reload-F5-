import React, { useState } from 'react';
import '../CSS/LoginPage.css'; // 스타일을 따로 관리
import { Link, useNavigate } from 'react-router-dom'; // Link 컴포넌트 가져오기
import Header from '../components/Header';
import loginlogo from '../images/Logo.png';
import KakaoLogin from '../pages/KakaoLogin';


const LoginPage = () => {
  const [activeTab, setActiveTab] = useState('user');
  const [email, setEmail] = useState(''); // 아이디 상태
  const [password, setPassword] = useState(''); // 비밀번호 상태
  const [adminCode, setAdminCode] = useState(''); // 관리자 코드 상태

  const handleUserIdChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleAdminCodeChange = (e) => setAdminCode(e.target.value);
  const navigate = useNavigate();

  // 슬라이더 위치 계산
  const sliderPosition = activeTab === 'user' ? '0%' : '50%';

  // User login fetch 함수
  const handleUserLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('https://refresh-f5-server.o-r.kr/api/auth/login', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const result = await response.json();

      if (response.status === 200) {
        console.log(result);
        localStorage.setItem("token", result.token);
        localStorage.setItem("email", result.user.email);
        localStorage.setItem("id", result.user.id);
        localStorage.setItem("role", "user"); // 역할을 로컬 스토리지에 저장
        console.log("로그인 성공");
        navigate('/');
      } else {
        console.log("로그인 실패");
        alert("로그인 실패: " + result.message);
      }
    } catch (error) {
      console.error("Fetch error: ", error);
    }
  };

  // Admin login fetch 함수
  const handleAdminLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('https://refresh-f5-server.o-r.kr/api/auth/admin/login', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          adminCode: adminCode
        }),
      });

      const result = await response.json();

      if (response.status === 200) {
        console.log(result);
        localStorage.setItem("token", result.token);
        localStorage.setItem("role", "admin"); // 역할을 로컬 스토리지에 저장
        localStorage.setItem("adminname", result.admin.adminName);
      
        console.log("로그인 성공");
        navigate('/admin-main');
      } else {
        console.log("로그인 실패");
        alert("로그인 실패: " + result.message);
      }
    } catch (error) {
      console.error("Fetch error: ", error);
    }
  };


  return (
    <div style={{height: '100vh'}}>
      <Header />
      <div className="login-page">
        <div className='loginlogo-con'>
          <img src={loginlogo} className='loginlogo' alt="로그인로고" />
        </div>
    
      <div className="login-tabs">
        <button
          className={activeTab === 'user' ? 'active' : ''}
          onClick={() => setActiveTab('user')}
        >
          일반 회원
        </button>
        <button
          className={activeTab === 'admin' ? 'active' : ''}
          onClick={() => setActiveTab('admin')}
        >
          관리자
        </button>
           {/* 고정된 밑줄 */}
           <div className="tab-underline"></div>

          {/* 슬라이더 바 */}
          <div className="tab-slider" style={{ left: sliderPosition }}></div>
        </div>

        {activeTab === 'user' && (
          <div className="login-form">
            <div className="form-group">
              <label>이메일</label>
              <input
              className='login-id'
                type="text"
                value={email}
                onChange={handleUserIdChange}
                placeholder="이메일을 입력해 주세요."
              />
            </div>

            <div className="form-group">
              <label>비밀번호</label>
              <input
                 className='login-pw'
                type="password"
                value={password}
                onChange={handlePasswordChange}
                placeholder="비밀번호를 입력해 주세요."
              />
            </div>


            <button className="login-button" onClick={handleUserLogin}>로그인</button>

            <div className="link-group">
              <Link to="/signup-type">회원가입</Link> | <Link to="/find-account">아이디/비밀번호 찾기</Link>
            </div>

          <div className="social-login">
            <p>소셜 계정으로 간편 로그인</p>
        
              <KakaoLogin/>
          
          </div>
        </div>
      )}

        {activeTab === 'admin' && (
          <div className="login-form">
            <div className="form-group">
              <label>관리자 코드</label>
              <input
               className='adm-login-code'
                type="text"
                value={adminCode}
                onChange={handleAdminCodeChange}
                placeholder="관리자 코드를 입력해 주세요."
              />
            </div>
            <button className="login-button" onClick={handleAdminLogin}>관리자 로그인</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
