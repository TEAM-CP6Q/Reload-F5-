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
import PickupRequestPage from './pages/PickupRequestPage';
import PickupResultPage from './pages/PickupResultPage';
import PickupCompletePage from './pages/PickupCompletePage';
import PickupList from './pages/PickupList';
import PickupListDetail from './pages/PickupListDetail';
import PickupLocation from './pages/PickupLocation';
import PickupDeliverPage from './pages/PickupDeliverPage';

function AppContent() {
  const [role, setRole] = useState('user'); // 기본값을 'user'로 설정
  const navigate = useNavigate();

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (storedRole) {
      setRole(storedRole);
      if (storedRole === 'admin') {
        navigate("/admin-main");
      } else if (storedRole === 'Deliver') {
        navigate("/deliver-main");
      }
    }
  }, [navigate]);

  useEffect(() => {
    if (role === 'admin') {
      navigate("/admin-main");
    } else if (role === 'Deliver') {
      navigate("/deliver-main");
    }
  }, [role, navigate]);

  return (
    <div className={role === 'admin' ? 'web-container' : role === 'Deliver' ? 'mobile-container' : 'mobile-container'}>
      <Routes>
        {role === 'admin' ? (
          <Route path="/admin-main" element={<AdminMain setRole={setRole} />} />
        ) : role === 'Deliver' ? (
          <Route path="/deliver-main" element={<PickupDeliverPage setRole={setRole} />} />
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
            <Route path="/pickup-request" element={<PickupRequestPage />} />
            <Route path="/pickup/result" element={<PickupResultPage />} />
            <Route path="/pickup/complete" element={<PickupCompletePage />} />
            <Route path="/pickup-list" element={<PickupList />} />
            <Route path="/pickup-list-detail/:pickupId" element={<PickupListDetail />} />
            <Route path="/pickup-location" element={<PickupLocation />} />
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
