import React, { useState, useEffect } from "react";
import "../CSS/Mypage.css";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import logo from "../images/Logo.png";
import mainLogo from '../images/mainLogo.png';

const MyPage = () => {
  const [name, setName] = useState("");
  const [phonenumber, setPhonenumber] = useState("");
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false); // 로그아웃 모달 상태
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false); // 회원탈퇴 모달 상태
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false); // 전화 모달 상태
  const [password, setPassword] = useState(""); // 비밀번호 상태
  const [isPasswordFieldVisible, setIsPasswordFieldVisible] = useState(false);
  const navigate = useNavigate();

  // 로그아웃 함수
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    localStorage.removeItem("username");
    localStorage.removeItem("id");
    localStorage.removeItem("access_token");
    navigate("/");
  };

  // 로그아웃 모달 열기/닫기 함수
  const openLogoutModal = () => setIsLogoutModalOpen(true);
  const closeLogoutModal = () => setIsLogoutModalOpen(false);

  // 회원탈퇴 모달 열기/닫기 함수
  const openWithdrawModal = () => setIsWithdrawModalOpen(true);
  const closeWithdrawModal = () => {
    setIsWithdrawModalOpen(false);
    setPassword("");
    setIsPasswordFieldVisible(false);
  };

  // 전화 모달 열기/닫기 함수
  const openPhoneModal = () => setIsPhoneModalOpen(true);
  const closePhoneModal = () => setIsPhoneModalOpen(false);

  // 전화 연결 함수
  const handleCall = () => {
    window.location.href = "tel:010-1111-2222"; 
  };

  // 회원정보 조회
  useEffect(() => {
    const handleGet = async () => {
      const token = localStorage.getItem("token");
      const email = localStorage.getItem("email");

      const response = await fetch(
        `https://refresh-f5-server.o-r.kr/api/account/search-account/${email}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
        }
      );

      const result = await response.json();

      if (response.status === 200) {
        setName(result.name);
        setPhonenumber(result.phoneNumber);
      } else {
        alert("로그인 부탁: " + result.message);
      }
    };
    handleGet();
  }, []);

  // 회원탈퇴 처리 함수
  const handleUserOut = async (event) => {
    event.preventDefault();

    if (!isPasswordFieldVisible) {
      setIsPasswordFieldVisible(true);
      return;
    }

    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");

    try {
      const response = await fetch(
        "https://refresh-f5-server.o-r.kr/api/auth/withdraw",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        }
      );

      const result = await response.json();

      if (response.status === 200) {
        alert("탈퇴가 완료되었습니다.");
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("email");
        localStorage.removeItem("username");
        localStorage.removeItem("id");
        localStorage.removeItem("access_token");
        navigate("/");
      } else {
        alert("탈퇴 실패: " + result.message);
      }
    } catch (error) {
      console.error("Fetch error: ", error);
    }
  };

  return (
    <div className="my-page">
      <Header />

      <div className="my-page-inner">
        <div className="user-info">
          <div className="user-details">
            <div className="user-details-name">{name}</div>
            <div className="user-details-phone">{phonenumber}</div>
            <hr className="divider" /> {/* 번호 아래 구분선 */}
          </div>

          <div className="user-actions">
            <div className="refresh-section">
              <img src={mainLogo} className="mypage-logo" alt="로고" />
              <span className="refresh-text">새로고침</span>
            </div>
            <span
              className="update-info-button"
              onClick={() => navigate("/user-update")}
            >
              내정보 수정 &gt;
            </span>
          </div>
        </div>

        <section className="activity-section">
          <h3 className="section-title">활동 내역</h3>
          <div
            className="activity-item"
            onClick={() => navigate("/order-list")}
          >
            <div className="icon-wrapper">
              <i className="fas fa-file-alt activity-icon"></i>
            </div>
            <div className="activity-details">
              <h4 className="activity-title">주문 내역</h4>
              <p className="activity-description">
                내가 주문한 상품을 알고 싶다면?
              </p>
            </div>
            <button className="next-button activity-next">&gt;</button>
          </div>
          <div
            className="activity-item"
            onClick={() => navigate("/pickup-list")}
          >
            <div className="icon-wrapper">
              <i className="fas fa-shipping-fast activity-icon"></i>
            </div>
            <div className="activity-details">
              <h4 className="activity-title">수거 신청 내역</h4>
              <p className="activity-description">
                내가 신청한 수거 신청 내역을 알고 싶다면?
              </p>
            </div>
            <button className="next-button activity-next">&gt;</button>
          </div>
        </section>

        <section className="inquiry-section">
          <h3 className="section-title">문의/안내</h3>
          <div
            className="inquiry-item"
           
          >
            <div className="icon-wrapper">
              <i className="fas fa-comments inquiry-icon"></i>
            </div>
            <div className="inquiry-details"  onClick={() => navigate("/chat")}>
              <h4 className="inquiry-title">채팅 상담</h4>
              <p className="inquiry-description">
                문의 사항은 채팅으로 빠르게!
              </p>
            </div>
            <button className="next-button inquiry-next">&gt;</button>
          </div>
          <div className="inquiry-item" onClick={openPhoneModal}>
            <div className="icon-wrapper">
              <i className="fas fa-phone inquiry-icon"></i>
            </div>
            <div className="inquiry-details">
              <h4 className="inquiry-title">전화 상담</h4>
              <p className="inquiry-description">상담원 연결이 필요할때!</p>
            </div>
            <button className="next-button inquiry-next">&gt;</button>
          </div>
        </section>

        <section className="account-section">
          <h3 className="section-title">계정</h3>
          <div className="account-item" onClick={openLogoutModal}>
            <div className="icon-wrapper">
              <i className="fas fa-sign-out-alt account-icon"></i>
            </div>
            <div className="account-details">
              <h4 className="account-title">로그아웃</h4>
            </div>
            <button className="next-button account-next">&gt;</button>
          </div>
          <div className="account-item" onClick={openWithdrawModal}>
            <div className="icon-wrapper">
              <i className="fas fa-user-times account-icon"></i>
            </div>
            <div className="account-details">
              <h4 className="account-title">회원탈퇴</h4>
              <p className="account-description">
                정말 새로고침을 떠나실 건가요?
              </p>
            </div>
            <button className="next-button account-next">&gt;</button>
          </div>
        </section>

        {/* 로그아웃 모달 */}
        {isLogoutModalOpen && (
          <div className="logout-modal">
            <div className="logout-modal-content">
              <p className="logout-text">로그아웃 하시겠어요?</p>
              <div className="logout-modal-buttons">
                <button className="cancel-button" onClick={closeLogoutModal}>
                  취소
                </button>
                <button className="logout-button" onClick={handleLogout}>
                  로그아웃
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 회원탈퇴 모달 */}
        {isWithdrawModalOpen && (
          <div className="logout-modal">
            <div className="logout-modal-content">
              {!isPasswordFieldVisible ? (
                <p className="logout-text">정말 회원탈퇴 하시겠습니까?</p>
              ) : (
                <p className="password-text">비밀번호를 입력해주세요.</p>
              )}
              {isPasswordFieldVisible && (
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="withdraw-password-input"
                />
              )}
              <div className="logout-modal-buttons">
                <button className="cancel-button" onClick={closeWithdrawModal}>
                  취소
                </button>
                <button className="logout-button" onClick={handleUserOut}>
                  {isPasswordFieldVisible ? "확인" : "회원탈퇴"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 전화 모달 */}
        {isPhoneModalOpen && (
          <div className="phone-modal">
            <div className="phone-modal-content">
              <p className="phone-text">전화 상담을 원하시면 아래 번호로 전화하세요.</p>
              <p className="phone-number">010-1111-2222</p>
              <div className="phone-modal-buttons">
                <button className="call-cancel-button" onClick={closePhoneModal}>
                  취소
                </button>
                <button className="call-button" onClick={handleCall}>
                  전화하기
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPage;
