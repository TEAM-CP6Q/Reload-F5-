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
  const [verificationCode, setVerificationCode] = useState("");
  const [inputVerificationCode, setInputVerificationCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isEmailCheckModalOpen, setIsEmailCheckModalOpen] = useState(false);
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

  // 이메일 중복확인 함수
  const checkEmailExists = async () => {
    try {
      const response = await fetch(
        `http://3.37.122.192:8000/api/auth/register/exist-email/${email}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      if (response.ok) {
        const result = await response.json();
        if (result.exists) {
          setEmailError("이미 사용 중인 이메일입니다.");
        } else {
          setEmailError("사용 가능한 이메일입니다.");
        }
        await new Promise((resolve) => setIsEmailCheckModalOpen(true) && resolve()); // 모달 열기 후 대기
      } else {
        console.error("이메일 중복 확인 실패:", response.statusText);
        setEmailError("이메일 중복 확인에 실패했습니다. 다시 시도해주세요.");
        await new Promise((resolve) => setIsEmailCheckModalOpen(true) && resolve()); // 에러 메시지를 표시하기 위해 모달 열기
      }
    } catch (error) {
      console.error("오류 발생:", error);
      setEmailError("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
      await new Promise((resolve) => setIsEmailCheckModalOpen(true) && resolve()); // 에러 메시지를 표시하기 위해 모달 열기
    }
  };
  

  //회원가입
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

    const result = await response.json();

    if (response.status === 200) {
      console.log(result);
      alert("회원가입 성공하였습니다. 로그인 해주세요.");
      navigate("/login");
    } else {
      console.log("회원가입 실패");
      alert("회원가입 실패: " + result.message);
    }
  };

  return (
    <div className="social-login-container" style={{ height: '100vh' }}>
      <Header />
      <div className="signup-inner">
        <div className="signuplogo-con">
          <img src={signuplogo} className="signuplogo" alt="로그인로고" />
        </div>

       {/* 이메일 입력과 중복확인 버튼 */}
       <div className="form-group email-group">
          <input
            type="text"
            id="email"
            value={email}
            className="signup-input"
            placeholder="이메일을 입력해주세요."
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError("");
            }}
          />
          <button  className="email-check-btn"  onClick={checkEmailExists}>
            중복<br/>확인하기
          </button>
        </div>

        {/* 이메일 중복 확인 모달 */}
        <Modal
          isOpen={isEmailCheckModalOpen}
          onRequestClose={() => setIsEmailCheckModalOpen(false)}
          style={customStyles}
          ariaHideApp={false}
        >
          <div className="email-check-modal">
            <p>{emailError}</p>
            <button
              onClick={() => setIsEmailCheckModalOpen(false)}
              className="close-btn"
            >
              닫기
            </button>
          </div>
        </Modal>

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

        <div className="form-group phone-group">
          <input
            type="text"
            id="phonenumber"
            value={phoneNumber}
            className="signup-input phone-input"
            placeholder="연락처를 입력해주세요"
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <button className="verification-btn">
            인증번호<br/>발송
          </button>
        </div>

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

        <button className="signup-btn" onClick={handleSignup}>
          회원가입
        </button>
      </div>
    </div>
  );
};

export default SignupPage;
