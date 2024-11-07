import './App.css';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import MainPage from './pages/MainPage';
import LoginPage from './pages/LoginPage';
import { useEffect, useState } from 'react';
import SignupPage from './pages/SignupPage';
import KakaoCallback from './pages/KaKaoCallback';
import MyPage from './pages/MyPage';
import UserUpdate from './pages/UserUpdate';
import SignupType from './pages/SignupType';
import OrderListDetail from './pages/OrderListDetail';
import OrderList from './pages/OrderList';
import AdminMain from './pages/admin/AdminMain';
import ChattingPage from './pages/ChattingPage';

function AppContent() {
  const [role, setRole] = useState('user'); // 기본값을 'user'로 설정
  const navigate = useNavigate();

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (storedRole) {
      setRole(storedRole);
      if (storedRole === 'admin') {
        navigate("/admin-main");
      }
    }
  }, [navigate]);

  useEffect(() => {
    if (role === 'admin') {
      navigate("/admin-main");
    }
  }, [role, navigate]);

  return (
    <div className={role === 'admin' ? 'web-container' : 'mobile-container'}>
      <Routes>
        {role === 'admin' ? (
          <Route path="/admin-main" element={<AdminMain setRole={setRole} />} />
        ) : (
          <>
            <Route path="/" element={<MainPage />} />
            <Route path="/login" element={<LoginPage setRole={setRole} />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/auth" element={<KakaoCallback />} />
            <Route path="/mypage" element={<MyPage />} />
            <Route path="/user-update" element={<UserUpdate />} />
            <Route path="/signup-type" element={<SignupType />} />
            <Route path="/order-list" element={<OrderList />} />
            <Route path="/order-list-detail" element={<OrderListDetail />} />
            <Route path="/chat" element={<ChattingPage />} />
          </>
        )}
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
