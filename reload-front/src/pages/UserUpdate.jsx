import React, { useState, useEffect } from "react";
import "../CSS/UserUpdate.css";
import Header from "../components/Header";
import Modal from "react-modal";
import DaumPostcode from "react-daum-postcode";
import { useNavigate } from "react-router-dom";
import logo from "../images/Logo.png";
import mainLogo from '../images/mainLogo.png';

const UserUpdate = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [phoneNumber, setPhonenumber] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [roadAddress, setRoadAddress] = useState("");
  const [detailAddress, setDetailAddress] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const completeHandler = (data) => {
    setZipCode(data.zonecode);
    setRoadAddress(data.roadAddress);
    setIsOpen(false);
  };

  const validatePasswords = (password, confirmPassword) => {
    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
    } else {
      setError("");
    }
  };

  const customStyles = {
    overlay: {
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    content: {
      left: "0",
      margin: "auto",
      width: "100%",
      height: "80%",
      padding: "0",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
    },
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
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (response.status === 200) {
   
        setUserName(result.name);
        setPhonenumber(result.phoneNumber);
        setZipCode(result.postalCode);
        setRoadAddress(result.roadNameAddress);
        setDetailAddress(result.detailedAddress);
      } else {
        alert("로그인 부탁: " + result.message);
      }
    };
    handleGet();
  }, []);

  //회원정보 수정
  const handleUserUpdate = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem("token");
    const id = localStorage.getItem("id");
    const response = await fetch(
      "https://refresh-f5-server.o-r.kr/api/account/update-account",
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: id,
          name: userName,
          postalCode: zipCode,
          roadNameAddress: roadAddress,
          detailedAddress: detailAddress,
          phoneNumber: phoneNumber,
        }),
      }
    );

    const result = await response.json();

    if (response.status === 200) {
      console.log("회원정보 수정 성공");
      alert("회원정보 수정 성공");
      navigate("/");
    } else {
      console.log("회원정보 수정 실패");
      alert("회원정보 수정 실패: " + result.message);
    }
  };

  return (
    <div style={{height: '100vh'}}>
      <Header />
      <div className="user-update-logo">
        <img src={mainLogo} className="user-update-logo-image" alt="로그인로고" />
      </div>
      <div className="user-update-inner">
        {/* 이름 입력 */}
        <div className="user-update-form-group">
          <input
            type="text"
            id="username"
            value={userName}
            className="user-update-input"
            onChange={(e) => setUserName(e.target.value)}
          />
        </div>

        {/* 연락처 입력 및 인증번호 발송 */}
        <div className="user-update-form-group">
          <div className="phone-container">
            <input
              type="text"
              id="phonenumber"
              value={phoneNumber}
              className="user-update-input phone-input"
              onChange={(e) => setPhonenumber(e.target.value)}
            />
            {/* <button className="userupdate-verification-btn">인증번호 발송</button> */}
          </div>
        </div>

        {/* 주소 입력 */}
        <div className="user-update-form-group">
          <div className="address">
            <div className="address-serch">
              <input value={zipCode} readOnly className="user-update-input" />
              <button onClick={() => setIsOpen(true)}>주소 찾기</button>
            </div>
            <div className="address-detail">
              <input
                value={roadAddress}
                readOnly
                className="user-update-input"
              />
              <input
                type="text"
                value={detailAddress}
                className="user-update-input"
                onChange={(e) => setDetailAddress(e.target.value)}
              />
            </div>
          </div>
        </div>

        <Modal isOpen={isOpen} ariaHideApp={false} style={customStyles}>
          <button
            onClick={() => setIsOpen(false)}
            style={{
              alignSelf: "center",
              padding: "10px 20px",
              fontSize: "16px",
              marginTop: "20px",
            }}
          >
            닫기
          </button>
          <DaumPostcode onComplete={completeHandler} height="100%" />
        </Modal>

        <div className="user-update-btn">
          <button className="user-update-btn-cancle"  onClick={() => navigate("/mypage")}>취소</button>
          <button className="user-update-btn-ok" onClick={handleUserUpdate}>
            수정
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserUpdate;
