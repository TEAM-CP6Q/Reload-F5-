import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../CSS/SignupPage.css";
import Header from "../components/Header";
import Modal from "react-modal";
import DaumPostcode from "react-daum-postcode";
import signuplogo from "../images/Logo.png";

const SignupPage = () => {
  const [userID, serUserID] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [roadAddress, setRoadAddress] = useState("");
  const [detailAddress, setDetailAddress] = useState("");
  const [verificationCode, setVerificationCode] = useState(""); // 인증번호 상태 추가
  const [inputVerificationCode, setInputVerificationCode] = useState(""); // 사용자가 입력하는 인증번호
  const [isCodeSent, setIsCodeSent] = useState(false); // 인증번호 발송 여부 상태 추가
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // 인증번호 발송 함수
  const sendVerificationCode = () => {
    if (!phoneNumber) {
      alert("연락처를 입력해주세요.");
      return;
    }
    // 여기에 인증번호를 실제로 발송하는 로직을 추가
    const generatedCode = Math.floor(1000 + Math.random() * 9000);
    setVerificationCode(generatedCode.toString());
    setIsCodeSent(true);
    alert(`인증번호가 ${phoneNumber}로 발송되었습니다.`);
  };

  // 인증번호 확인 함수
  const verifyCode = () => {
    if (verificationCode === inputVerificationCode) {
      alert("인증번호가 확인되었습니다.");
    } else {
      alert("인증번호가 일치하지 않습니다. 다시 입력해주세요.");
    }
  };

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

  //회원가입 fetch
  const handleSignup = async (event) => {
    event.preventDefault();

    const response = await fetch("http://3.37.122.192:8000/api/auth/register", {

      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password: password,
        name: userName,
        postalCode: zipCode,
        roadNameAddress: roadAddress,
        detailedAddress: detailAddress,
        email: email,
        phoneNumber: phoneNumber,
      }),
    });

    const result = await response.json(); // 응답이 JSON 형식일 경우 이를 JavaScript 객체로 변환

    if (response.status === 200) {
      // 응답 status가 200 OK 일 경우
      console.log(result);
      alert("회원가입 성공하였습니다. 로그인 해주세요.");
      navigate("/login");
    } else {
      console.log("회원가입 실패");
      alert("회원가입 실패: " + result.message);
    }
  };

  return (
    <>
      <Header />
      <div className="signup-inner">
        <div className="signuplogo-con">
          <img src={signuplogo} className="signuplogo" alt="로그인로고" />
        </div>

        {/* email 입력 */}
        <div className="form-group">
          <input
            type="text"
            id="email"
            value={email}
            className="signup-input"
            placeholder="이메일을 입력해주세요."
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* 비밀번호 입력 */}
        <div className="form-group">
          <input
            type="password"
            id="password"
            value={password}
            className="signup-input"
            placeholder="비밀번호를 입력해주세요"
            onChange={(e) => {
              setPassword(e.target.value);
              validatePasswords(e.target.value, confirmPassword);
            }}
          />
        </div>

        {/* 비밀번호 확인 */}
        <div className="form-group">
          <input
            type="password"
            id="confirm-password"
            value={confirmPassword}
            className="signup-input"
            placeholder="비밀번호 확인"
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              validatePasswords(password, e.target.value);
            }}
          />
          {error && <div className="error-message">{error}</div>}
        </div>

        {/* 이름 입력 */}
        <div className="form-group">
          <input
            type="text"
            id="username"
            value={userName}
            className="signup-input"
            placeholder="이름을 입력해주세요."
            onChange={(e) => setUserName(e.target.value)}
          />
        </div>

        {/* 연락처 입력 및 인증번호 발송 */}
        <div className="form-group">
          <div className="phone-container">
            <input
              type="text"
              id="phonenumber"
              value={phoneNumber}
              className="signup-input phone-input"
              placeholder="연락처를 입력해주세요"
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <button className="verification-btn" onClick={sendVerificationCode}>
              인증번호 발송
            </button>
          </div>
        </div>

        {/* 인증번호 입력 */}
        {isCodeSent && (
          <div className="form-group">
            <div className="verification-container">
              <input
                type="text"
                value={inputVerificationCode}
                className="signup-input verification-input"
                placeholder="인증번호 입력"
                onChange={(e) => setInputVerificationCode(e.target.value)}
              />
              <button className="verification-btn" onClick={verifyCode}>
                인증번호 확인
              </button>
            </div>
          </div>
        )}

        {/* 주소 입력 */}
        <div className="form-group">
          <div className="address">
            <div className="address-serch">
              <input
                value={zipCode}
                readOnly
                className="signup-input"
                placeholder="우편번호"
              />
              <button onClick={() => setIsOpen(true)}>주소 찾기</button>
            </div>
            <div className="address-detail">
              <input
                value={roadAddress}
                readOnly
                className="signup-input"
                placeholder="도로명 주소"
              />
              <input
                type="text"
                value={detailAddress}
                className="signup-input"
                placeholder="상세주소"
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

        {/* 회원가입 버튼 */}
        <button className="signup-btn" onClick={handleSignup}>
          회원가입
        </button>
      </div>
    </>
  );
};

export default SignupPage;
