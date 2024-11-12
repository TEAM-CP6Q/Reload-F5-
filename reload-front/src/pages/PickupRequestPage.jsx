import React, { useState, useEffect } from "react";
import "../CSS/PickupRequestPage.css";
import { Calendar, ChevronLeft, ChevronRight, Home } from "lucide-react";
import Header from "../components/Header";

const PickupRequestPage = () => {
    const [currentScreen, setCurrentScreen] = useState(1);
    const [slideDirection, setSlideDirection] = useState("none");

    // Calendar state
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState(null);
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

    // Second screen state with default user data
    const [userData, setUserData] = useState("");


    // 사용자 정보 가져오기
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const email = localStorage.getItem('email');
                const token = localStorage.getItem('token');

                if (!email || !token) {
                    console.error('이메일 또는 토큰이 없습니다.');
                    return;
                }

                const response = await fetch(`http://3.37.122.192:8000/api/account/search-account/${email}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.status === 200) {
                    const data = await response.json();
                    setUserData({
                        name: data.name,
                        phoneNumber: data.phoneNumber,
                        email: email,
                        postalCode: data.postalCode || '',
                        roadNameAddress: data.roadNameAddress || '',
                        detailedAddress: data.detailedAddress || ''
                    });
                } else {
                    console.error('사용자 정보를 가져오는데 실패했습니다.');
                    // 에러 처리를 위한 상태 관리나 사용자 피드백을 추가할 수 있습니다.
                }
            } catch (error) {
                console.error('API 호출 중 에러 발생:', error);
                // 에러 처리를 위한 상태 관리나 사용자 피드백을 추가할 수 있습니다.
            }
        };

        fetchUserData();
    }, []); // 컴포넌트 마운트 시 한 번만 실행

    const generateCalendarDates = () => {
        const firstDay = new Date(currentYear, currentMonth, 1).getDay();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

        const dates = [];
        for (let i = 0; i < firstDay; i++) {
            dates.push(null);
        }

        for (let i = 1; i <= daysInMonth; i++) {
            dates.push(new Date(currentYear, currentMonth, i));
        }

        return dates;
    };

    const timeSlots = {
        morning: ["06:00", "06:30", "07:00", "07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30"],
        afternoon: ["12:00", "12:30", "01:00", "01:30", "02:00", "02:30", "03:00", "03:30", "04:00", "04:30", "05:00", "05:30"]
    };

    const handleNextScreen = () => {
        if (currentScreen === 1) {
            if (!selectedDate || !selectedTime) {
                alert("날짜와 시간을 선택해주세요.");
                return;
            }

            const formattedDate = selectedDate.toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            console.log("선택된 수거 일정:", {
                date: formattedDate,
                time: selectedTime,
                fullDateTime: `${formattedDate} ${selectedTime}`
            });
        }

        setSlideDirection("left");
        setTimeout(() => {
            setCurrentScreen(prev => prev + 1);
            setSlideDirection("none");
        }, 300);
    };

    const handlePrevScreen = () => {
        setSlideDirection("right");
        setTimeout(() => {
            setCurrentScreen(prev => prev - 1);
            setSlideDirection("none");
        }, 300);
    };

    const handleInputChange = (field, value) => {
        if (field !== 'email') {
            setUserData(prev => ({
                ...prev,
                [field]: value
            }));
        }
    };

    const handlePrevMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(prev => prev - 1);
        } else {
            setCurrentMonth(prev => prev - 1);
        }
    };

    const handleNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(prev => prev + 1);
        } else {
            setCurrentMonth(prev => prev + 1);
        }
    };

    const isToday = (date) => {
        if (!date) return false;
        const today = new Date();
        return date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
    };

    const isPastDate = (date) => {
        if (!date) return false;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date < today;
    };

    return (
        <div className="pickupRequest-main-container">
            <Header />

            <div className="pickupRequest-content">
                <div className={`pickupRequest-screen-container ${slideDirection === "left" ? "slide-left" : ""} ${slideDirection === "right" ? "slide-right" : ""}`}>
                    {currentScreen === 1 ? (
                        <div className="pickupRequest-calendar-section">
                            <div className="pickupRequest-instruction">
                                <Calendar className="w-5 h-5" />
                                <span>수거 날짜와 시간을 선택해 주세요</span>
                            </div>

                            <div className="pickupRequest-calendar-header">
                                <div className="pickupRequest-calendar-title">
                                    {currentYear}.{currentMonth + 1}
                                </div>
                                <div className="pickupRequest-flex gap-2">
                                    <ChevronLeft className="w-5 h-5 calendar-arrow" onClick={handlePrevMonth} />
                                    <ChevronRight className="w-5 h-5 calendar-arrow" onClick={handleNextMonth} />
                                </div>
                            </div>

                            <div className="pickupRequest-calendar-grid">
                                {["일", "월", "화", "수", "목", "금", "토"].map(day => (
                                    <div key={day} className="pickupRequest-calendar-day-header">{day}</div>
                                ))}
                                {generateCalendarDates().map((date, idx) => (
                                    <div
                                        key={idx}
                                        className={`pickupRequest-calendar-date 
                      ${date ? 'cursor-pointer' : ''} 
                      ${isToday(date) ? 'today' : ''} 
                      ${date && selectedDate && date.getDate() === selectedDate.getDate() &&
                                                date.getMonth() === selectedDate.getMonth() ? "selected" : ""}
                      ${isPastDate(date) ? 'past-date' : ''}
                    `}
                                        onClick={() => date && !isPastDate(date) && setSelectedDate(date)}
                                    >
                                        {date?.getDate()}
                                    </div>
                                ))}
                            </div>

                            <div className="pickupRequest-time-section">
                                <div>
                                    <h3 className="pickupRequest-time-section-title">오전</h3>
                                    <div className="pickupRequest-time-grid">
                                        {timeSlots.morning.map(time => (
                                            <button
                                                key={time}
                                                className={`pickupRequest-time-slot ${selectedTime === time ? "selected" : ""}`}
                                                onClick={() => setSelectedTime(time)}
                                            >
                                                {time}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="pickupRequest-time-section">
                                    <h3 className="pickupRequest-time-section-title">오후</h3>
                                    <div className="pickupRequest-time-grid">
                                        {timeSlots.afternoon.map(time => (
                                            <button
                                                key={time}
                                                className={`pickupRequest-time-slot ${selectedTime === time ? "selected" : ""}`}
                                                onClick={() => setSelectedTime(time)}
                                            >
                                                {time}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="pickupRequest-form-section">
                            <div className="pickupRequest-form-group">
                                <label className="pickupRequest-form-label">이름</label>
                                <input
                                    type="text"
                                    value={userData.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    className="pickupRequest-form-input"
                                />
                            </div>

                            <div className="pickupRequest-form-group">
                                <label className="pickupRequest-form-label">연락처</label>
                                <input
                                    type="tel"
                                    value={userData.phoneNumber}
                                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                                    className="pickupRequest-form-input"
                                />
                            </div>

                            <div className="pickupRequest-form-group">
                                <label className="pickupRequest-form-label">이메일</label>
                                <input
                                    type="email"
                                    value={userData.email}
                                    disabled
                                    className="pickupRequest-form-input"
                                />
                            </div>

                            <div className="pickupRequest-form-group">
                                <label className="pickupRequest-form-label">우편번호</label>
                                <div className="pickupRequest-postal-code-group">
                                    <input
                                        type="text"
                                        value={userData.postalCode}
                                        className="pickupRequest-form-input postal-code-input"
                                        onChange={(e) => handleInputChange('postalCode', e.target.value)}
                                    />
                                    <button className="pickupRequest-postal-code-button">
                                        주소 검색
                                    </button>
                                </div>
                            </div>

                            <div className="pickupRequest-form-group">
                                <label className="pickupRequest-form-label">주소</label>
                                <input
                                    type="text"
                                    value={userData.roadNameAddress}
                                    onChange={(e) => handleInputChange('roadNameAddress', e.target.value)}
                                    className="pickupRequest-form-input"
                                />
                            </div>

                            <div className="pickupRequest-form-group">
                                <label className="pickupRequest-form-label">상세주소</label>
                                <input
                                    type="text"
                                    value={userData.detailedAddress}
                                    onChange={(e) => handleInputChange('detailedAddress', e.target.value)}
                                    className="pickupRequest-form-input"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="pickupRequest-footer-container">
                {currentScreen > 1 && (
                    <button onClick={handlePrevScreen} className="pickupRequest-prev-button">
                        이전으로
                    </button>
                )}
                <button
                    onClick={handleNextScreen}
                    className={`pickupRequest-next-button ${currentScreen > 1 ? 'with-prev' : ''}`}
                >
                    다음으로 ({currentScreen}/3)
                </button>
            </div>
        </div>
    );
};

export default PickupRequestPage;