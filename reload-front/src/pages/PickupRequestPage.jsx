import React, { useState, useEffect } from "react";
import "../CSS/PickupRequestPage.css";
import { Calendar, ChevronLeft, ChevronRight, Home, Trash2 } from "lucide-react";
import Header from "../components/Header";
import Modal from "react-modal";
import DaumPostcode from "react-daum-postcode";
import { useNavigate } from "react-router-dom";

const PickupRequestPage = () => {
    const navigate = useNavigate(); // 상단에 추가
    const [currentScreen, setCurrentScreen] = useState(1);
    const [slideDirection, setSlideDirection] = useState("none");
    const [isOpen, setIsOpen] = useState(false); // 주소검색 모달 상태 추가

    // Calendar state
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState(null);
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

    // Second screen state with default user data
    const [userData, setUserData] = useState("");

    // Modal 스타일 추가
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

    // 주소 검색 완료 핸들러 추가
    const completeHandler = (data) => {
        setUserData(prev => ({
            ...prev,
            postalCode: data.zonecode,
            roadNameAddress: data.roadAddress
        }));
        setIsOpen(false);
    };

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
                }
            } catch (error) {
                console.error('API 호출 중 에러 발생:', error);
            }
        };

        fetchUserData();
    }, []);

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

    // timeSlots 객체를 수정하여 24시간 형식으로 변경
    const timeSlots = {
        morning: [
            { display: "06:00", minutes: 360 },
            { display: "06:30", minutes: 390 },
            { display: "07:00", minutes: 420 },
            { display: "07:30", minutes: 450 },
            { display: "08:00", minutes: 480 },
            { display: "08:30", minutes: 510 },
            { display: "09:00", minutes: 540 },
            { display: "09:30", minutes: 570 },
            { display: "10:00", minutes: 600 },
            { display: "10:30", minutes: 630 },
            { display: "11:00", minutes: 660 },
            { display: "11:30", minutes: 690 }
        ],
        afternoon: [
            { display: "12:00", minutes: 720 },
            { display: "12:30", minutes: 750 },
            { display: "13:00", minutes: 780 },
            { display: "13:30", minutes: 810 },
            { display: "14:00", minutes: 840 },
            { display: "14:30", minutes: 870 },
            { display: "15:00", minutes: 900 },
            { display: "15:30", minutes: 930 },
            { display: "16:00", minutes: 960 },
            { display: "16:30", minutes: 990 },
            { display: "17:00", minutes: 1020 },
            { display: "17:30", minutes: 1050 }
        ]
    };

    const handleNextScreen = () => {
        if (currentScreen === 1) {
            if (!selectedDate || selectedTime === null) {
                alert("날짜와 시간을 선택해주세요.");
                return;
            }
        } else if (currentScreen === 2) {
            if (!userData.name || !userData.phoneNumber || !userData.roadNameAddress) {
                alert("모든 필수 정보를 입력해주세요.");
                return;
            }
        } else if (currentScreen === 3) {
            if (selectedItems.length === 0) {
                alert("최소 하나 이상의 폐기물을 선택해주세요.");
                return;
            }
            // Navigate to result page with all data
            navigate('/pickup/result', {
                state: {
                    selectedDate,
                    selectedTime,
                    userData,
                    selectedItems,
                    totalPrice
                }
            });
            return;
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

    // 시간 표시를 위한 유틸리티 함수 추가
    const formatTimeDisplay = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
    };

    // 폐기물 관련 state 추가
    const [wasteTypes, setWasteTypes] = useState({}); // 전체 폐기물 타입 데이터
    const [selectedItems, setSelectedItems] = useState([]); // 선택된 폐기물 목록
    const [currentWaste, setCurrentWaste] = useState({ // 현재 선택된 폐기물 정보
        category: "",
        item: null,
        quantity: 1
    });
    const [totalPrice, setTotalPrice] = useState(0);

    // 폐기물 타입 데이터 불러오기
    useEffect(() => {
        const fetchWasteTypes = async () => {
            try {
                const response = await fetch('http://3.37.122.192:8000/api/pickup/waste/type-list', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setWasteTypes(data);
                }
            } catch (error) {
                console.error('폐기물 타입 데이터 로드 실패:', error);
            }
        };

        fetchWasteTypes();
    }, []);

    // 수량 변경 핸들러
    const handleQuantityChange = (value) => {
        setCurrentWaste(prev => ({
            ...prev,
            quantity: Math.max(1, value) // 최소 1개/kg 보장
        }));
    };

    // 폐기물 추가 핸들러
    const handleAddWaste = () => {
        if (!currentWaste.item) return;

        const newItem = {
            ...currentWaste.item,
            category: currentWaste.category,  // 카테고리 정보 추가
            quantity: currentWaste.quantity,
            totalPrice: currentWaste.item.price * currentWaste.quantity
        };

        setSelectedItems(prev => [...prev, newItem]);
        setTotalPrice(prev => prev + newItem.totalPrice);
    };

    // 폐기물 삭제 핸들러
    const handleRemoveWaste = (index) => {
        const removedItem = selectedItems[index];
        setSelectedItems(prev => prev.filter((_, i) => i !== index));
        setTotalPrice(prev => prev - removedItem.totalPrice);
    };

    return (
        <div className="pickupRequest-main-container" style={{ height: '100%' }}>
            <Header />

            <div className="pickupRequest-content">
                <div className={`pickupRequest-screen-container ${slideDirection === "left" ? "slide-left" : ""} ${slideDirection === "right" ? "slide-right" : ""}`}>
                    {currentScreen === 1 ? (
                        <div className="pickupRequest-calendar-section">
                            <div className="pickupRequest-instruction">
                                <Calendar className="w-5 h-5" />
                                <span>수거 날짜와 시간을 선택해 주세요</span>
                            </div>

                            {/* 선택된 날짜와 시간 표시 섹션 추가 */}
                            {(selectedDate || selectedTime !== null) && (
                                <div className="pickupRequest-selected-datetime">
                                    <span className="pickupRequest-selected-label">선택된 일시:</span>
                                    <span className="pickupRequest-selected-value">
                                        {selectedDate?.toLocaleDateString('ko-KR', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                        {selectedTime !== null ? ` ${formatTimeDisplay(selectedTime)}` : ''}
                                    </span>
                                </div>
                            )}

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
                                        {timeSlots.morning.map(slot => (
                                            <button
                                                key={slot.display}
                                                className={`pickupRequest-time-slot ${selectedTime === slot.minutes ? "selected" : ""}`}
                                                onClick={() => setSelectedTime(slot.minutes)}
                                            >
                                                {slot.display}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="pickupRequest-time-section">
                                    <h3 className="pickupRequest-time-section-title">오후</h3>
                                    <div className="pickupRequest-time-grid">
                                        {timeSlots.afternoon.map(slot => (
                                            <button
                                                key={slot.display}
                                                className={`pickupRequest-time-slot ${selectedTime === slot.minutes ? "selected" : ""}`}
                                                onClick={() => setSelectedTime(slot.minutes)}
                                            >
                                                {slot.display}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : currentScreen === 2 ? (
                        <div className="pickupRequest-form-section">
                            <div className="pickupRequest-instruction">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
                                    <path d="M14 3v5h5M16 13H8M16 17H8M10 9H8" />
                                </svg>
                                <span>신청자 정보를 확인해 주세요</span>
                            </div>

                            <div className="pickupRequest-form-group">
                                <label className="pickupRequest-form-label">이름</label>
                                <input
                                    type="text"
                                    value={userData.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    className="pickupRequest-form-input"
                                    placeholder="이름을 입력해주세요."
                                />
                            </div>

                            <div className="pickupRequest-form-group">
                                <label className="pickupRequest-form-label">연락처</label>
                                <input
                                    type="tel"
                                    value={userData.phoneNumber}
                                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                                    className="pickupRequest-form-input"
                                    placeholder="연락처를 입력해주세요."
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
                                <label className="pickupRequest-form-label">수거지 주소</label>
                                <div className="pickupRequest-postal-code-group">
                                    <input
                                        type="text"
                                        value={userData.postalCode}
                                        className="pickupRequest-form-input postal-code-input"
                                        onChange={(e) => handleInputChange('postalCode', e.target.value)}
                                        placeholder="우편번호"
                                        readOnly
                                    />
                                    <button
                                        className="pickupRequest-postal-code-button"
                                        onClick={() => setIsOpen(true)}
                                    >
                                        주소 검색
                                    </button>
                                </div>
                                <input
                                    type="text"
                                    value={userData.roadNameAddress}
                                    onChange={(e) => handleInputChange('roadNameAddress', e.target.value)}
                                    className="pickupRequest-form-input"
                                    placeholder="주소를 입력해주세요."
                                    style={{ marginTop: '0.5rem' }}
                                    readOnly
                                />
                                <textarea
                                    value={userData.detailedAddress}
                                    onChange={(e) => handleInputChange('detailedAddress', e.target.value)}
                                    className="pickupRequest-form-input"
                                    placeholder="상세주소와 함께 추가 요청사항을 작성해주세요."
                                    style={{ marginTop: '0.5rem', height: '5rem', resize: 'none' }}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="pickupRequest-waste-section">
                            <div className="pickupRequest-instruction">
                                <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M3 6h18" />
                                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                </svg>
                                <span>폐기물 종류를 선택해 주세요</span>
                            </div>

                            {/* 폐기물 카테고리 선택 */}
                            {Object.entries(wasteTypes).map(([category, items]) => (
                                <div key={category} className="pickupRequest-waste-category">
                                    <div
                                        className="pickupRequest-category-header"
                                        onClick={() => setCurrentWaste(prev => ({
                                            ...prev,
                                            category,
                                            item: items[0]
                                        }))}
                                    >
                                        <span>{category}({items.length})</span>
                                        <ChevronRight className="w-5 h-5" />
                                    </div>

                                    {currentWaste.category === category && (
                                        <div className="pickupRequest-waste-details">
                                            <div className="pickupRequest-waste-select-group">
                                                <select
                                                    value={currentWaste.item?.id || ''}
                                                    onChange={(e) => {
                                                        const selectedItem = items.find(item => item.id === e.target.value);
                                                        setCurrentWaste(prev => ({
                                                            ...prev,
                                                            item: selectedItem
                                                        }));
                                                    }}
                                                    className="pickupRequest-waste-select"
                                                >
                                                    {items.map(item => (
                                                        <option key={item.id} value={item.id}>
                                                            {item.type} {item.description}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="pickupRequest-quantity-group">
                                                <div className="pickupRequest-quantity-control">
                                                    <input
                                                        type="number"
                                                        value={currentWaste.quantity}
                                                        onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
                                                        min="1"
                                                        className="pickupRequest-quantity-input"
                                                    />
                                                    <span className="pickupRequest-quantity-unit">
                                                        (단위: {currentWaste.category === "재활용품" ? "kg" : "개"})
                                                    </span>
                                                </div>
                                                <div className="pickupRequest-estimated-price">
                                                    예상 금액: {currentWaste.item ? (currentWaste.item.price * currentWaste.quantity).toLocaleString() : 0}원
                                                </div>
                                                <button
                                                    className="pickupRequest-add-button"
                                                    onClick={handleAddWaste}
                                                >
                                                    추가하기
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}

                            {/* 선택된 폐기물 목록 */}
                            <div className="pickupRequest-selected-items">
                                <h3>선택한 폐기물</h3>
                                {selectedItems.length === 0 ? (
                                    <div className="pickupRequest-no-items">현재 선택한 폐기물이 없습니다.</div>
                                ) : (
                                    selectedItems.map((item, index) => (
                                        <div key={index} className="pickupRequest-selected-item">
                                            <span>
                                                {item.type} {item.description && `(${item.description})`} - {item.quantity}{item.category === "재활용품" ? "kg" : "개"} : {item.totalPrice.toLocaleString()}원
                                            </span>
                                            <Trash2
                                                className="w-5 h-5 cursor-pointer"
                                                onClick={() => handleRemoveWaste(index)}
                                            />
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* 총 예상 금액 */}
                            <div className="pickupRequest-total">
                                <div className="pickupRequest-total-price">
                                    총 예상 금액: {totalPrice.toLocaleString()}원
                                </div>
                                <div className="pickupRequest-price-note">
                                    *실제 결제 금액은 예상 금액과 다를 수 있습니다.
                                </div>
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

            <Modal
                isOpen={isOpen}
                onRequestClose={() => setIsOpen(false)}
                style={customStyles}
                contentLabel="주소 검색"
            >
                <DaumPostcode
                    onComplete={completeHandler}
                    style={{ height: "100%" }}
                />
            </Modal>
        </div>
    );
};

export default PickupRequestPage;