import React, { useState } from 'react';
import '../CSS/LoginPage.css';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import loginlogo from '../images/Logo.png';
import KakaoLogin from '../pages/KakaoLogin';

const LoginPage = () => {
  const [activeTab, setActiveTab] = useState('user');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminCode, setAdminCode] = useState('');

  const handleUserIdChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleAdminCodeChange = (e) => setAdminCode(e.target.value);
  const navigate = useNavigate();

  const sliderPosition = activeTab === 'user' ? '0%' : '50%';

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
        localStorage.setItem("role", result.user.role); 
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
        localStorage.setItem("role", "admin");
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
          <div className="tab-underline"></div>
          <div className="tab-slider" style={{ left: sliderPosition }}></div>
        </div>

        {activeTab === 'user' && (
          <form className="login-form" onSubmit={handleUserLogin}>
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

            <button type="submit" className="login-button">로그인</button>

            <div className="link-group">
              <Link to="/signup-type">회원가입</Link> | <Link to="/find-account">아이디/비밀번호 찾기</Link>
            </div>

            <div className="social-login">
              <p>소셜 계정으로 간편 로그인</p>
              <KakaoLogin/>
            </div>
          </form>
        )}

        {activeTab === 'admin' && (
          <form className="login-form" onSubmit={handleAdminLogin}>
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
            <button type="submit" className="login-button">관리자 로그인</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginPage;