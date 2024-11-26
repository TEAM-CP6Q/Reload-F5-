import React, { useEffect, useState } from "react";
import { Clock, MapPin, Truck, Package, Weight } from "lucide-react";
import "../CSS/PickupDeliverPage.css";
import makerlogo from '../images/makerlogo.png';

const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

const Modal = ({ message, onConfirm, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2 className="modal-title">{message}</h2>
        </div>
        <div className="modal-actions">
          {onConfirm && (
            <button onClick={onConfirm} className="modal-btn modal-btn-confirm">
              예
            </button>
          )}
          <button onClick={onClose} className="modal-btn modal-btn-cancel">
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

const PickupDeliverPage = () => {
  const [tracking, setTracking] = useState(false);
  const [positions, setPositions] = useState([]);
  const [distance, setDistance] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [pickupMarkers, setPickupMarkers] = useState([]);
  const [polyline, setPolyline] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [timer, setTimer] = useState(null);
  const [pickups, setPickups] = useState([]);
  const [pickupDetails, setPickupDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const js_key = process.env.REACT_APP_KAKAO_MAP_JS_KEY;

  const getToday = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };




  const addCurrentLocationMarker = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const coords = new window.kakao.maps.LatLng(latitude, longitude);
  
          // 커스텀 오버레이 생성
          const content = `
            <div style="position: relative; width: 36px; height: 48px; text-align: center;">
              <!-- 외부 마커 스타일 -->
              <div style="
                width: 36px;
                height: 36px;
       
                border-radius: 50%; 
                border: 2px solid #388E3C; 
                display: flex; 
                justify-content: center; 
                align-items: center;
                box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.3);">
                <!-- 내부 이미지 -->
                <img src="${makerlogo}" alt="현재 위치" style="width: 50px; height: 30px; border-radius: 50%;" />
              </div>
              <!-- 마커 꼬리 -->
              <div style="
                width: 0; 
                height: 0; 
                border-left: 9px solid transparent; 
                border-right: 9px solid transparent; 
                border-top: 12px solid #4285f4; 
                margin: -2px auto 0;">
              </div>
            </div>
          `;
  
          const customOverlay = new window.kakao.maps.CustomOverlay({
            position: coords,
            content: content,
            map: map,
          });
  
          // 마커 상태 관리
          setMarkers((prevMarkers) => [...prevMarkers, customOverlay]);
  
          // 지도 중심 좌표 이동
          map.setCenter(coords);
        },
        (error) => {
          console.error("현재 위치를 가져오는 중 오류 발생:", error);
        }
      );
    } else {
      console.error("브라우저에서 Geolocation API를 지원하지 않습니다.");
    }
  };
  const addPolylinePosition = (latitude, longitude) => {
    const newCoords = new window.kakao.maps.LatLng(latitude, longitude);
    setPositions((prevPositions) => {
      const updatedPositions = [...prevPositions, newCoords];
      if (polyline) {
        polyline.setPath(updatedPositions); // polyline 경로 업데이트
      }
      return updatedPositions;
    });
  };

  const handleTrackingPosition = () => {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          addPolylinePosition(latitude, longitude); // 위치 추가 및 경로 업데이트
        },
        (error) => {
          console.error("위치 추적 중 오류 발생:", error);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 0,
          timeout: 5000,
        }
      );
    } else {
      console.error("브라우저에서 Geolocation API를 지원하지 않습니다.");
    }
  };
  
  

  const fetchPickups = async () => {
    const today = getToday();
    try {
      const response = await fetch(
        // `https://refresh-f5-server.o-r.kr/api/pickup/get-today-pickup?today=${today}`,
        `https://refresh-f5-server.o-r.kr/api/pickup/get-today-pickup?today=2024-11-29`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 402) {
        setModalMessage("오늘은 수거지가 없습니다!");
        setModalVisible(true);
        return;
      }
      if (response.status === 403) {
        setModalMessage("접근 권한이 없습니다.");
        setModalVisible(true);
        return;
      }
      if (!response.ok) throw new Error("데이터를 불러오지 못했습니다.");
      const data = await response.json();
      setPickups(data);
    } catch (error) {
      console.error("수거 정보를 불러오는 중 오류 발생:", error);
    }
  };

  // useEffect로 fetchPickups 자동 호출
  useEffect(() => {
    fetchPickups();
  }, []); // 빈 배열로 설정하여 컴포넌트가 마운트될 때 한 번만 호출

  const fetchPickupDetails = async (pickupId) => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://refresh-f5-server.o-r.kr/api/pickup/get-details?pickupId=${pickupId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setPickupDetails(data.details);
      } else {
        console.error("수거 상세 내역을 불러오는 데 실패했습니다.");
      }
    } catch (error) {
      console.error("데이터 로드 오류:", error);
    } finally {
      setLoading(false);
    }
  };

  const addPickupMarkers = () => {
    const geocoder = new window.kakao.maps.services.Geocoder();
  
    pickups.forEach((pickup) => {
      const fullAddress = `${pickup.address.roadNameAddress} ${pickup.address.detailedAddress}`;
  
      geocoder.addressSearch(fullAddress, (result, status) => {
        if (status === window.kakao.maps.services.Status.OK) {
          const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);
  
          const marker = new window.kakao.maps.Marker({
            position: coords,
            map: map,
          });
  
          const infowindow = new window.kakao.maps.InfoWindow({
            content: `
              <div style="padding:5px;">
                <strong>${pickup.address.name}</strong><br>
                ${fullAddress}
              </div>`,
          });
  
          // 마커의 상태를 개별적으로 관리
          let markerIsOpen = false;
  
          window.kakao.maps.event.addListener(marker, "click", () => {
            if (markerIsOpen) {
              infowindow.close();
              setPickupDetails([]); // 상세 정보를 초기화
            } else {
              infowindow.open(map, marker);
              fetchPickupDetails(pickup.pickupId); // 클릭한 마커에 대한 세부 정보 가져오기
            }
            markerIsOpen = !markerIsOpen;
          });
  
          setPickupMarkers((prevMarkers) => [...prevMarkers, marker]);
        } else {
          console.error(`주소 변환 실패: ${fullAddress}`);
        }
      });
    });
  };
  
  useEffect(() => {
    const script = document.createElement("script");
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${js_key}&libraries=services&clusterer&autoload=false`;
    script.async = true;
    script.onload = () => {
      window.kakao.maps.load(() => {
        const container = document.getElementById("map-container");
        const options = {
          center: new window.kakao.maps.LatLng(37.5665, 126.978),
          level: 3,
        };
        const mapInstance = new window.kakao.maps.Map(container, options);

        const polylineInstance = new window.kakao.maps.Polyline({
          path: [],
          strokeWeight: 5,
          strokeColor: "#FF6B6B",
          strokeOpacity: 0.7,
          strokeStyle: "solid",
        });
        polylineInstance.setMap(mapInstance);

        setMap(mapInstance);
        setPolyline(polylineInstance);
      });
    };
    document.head.appendChild(script);

    return () => {
      const scriptToRemove = document.head.querySelector(
        `script[src="//dapi.kakao.com/v2/maps/sdk.js?appkey=${js_key}&libraries=services&clusterer&autoload=false"]`
      );
      if (scriptToRemove) {
        document.head.removeChild(scriptToRemove);
      }
      markers.forEach((marker) => marker.setMap(null));
      pickupMarkers.forEach((marker) => marker.setMap(null));
    };
  }, [js_key]);

  useEffect(() => {
    if (map) {
      fetchPickups();
      addCurrentLocationMarker();
    }
  }, [map]);

  useEffect(() => {
    if (map && pickups.length > 0) {
      addPickupMarkers();
    }
  }, [map, pickups]);

  const handleStartTracking = () => {
    setModalMessage("수거를 시작하시겠습니까?");
    setModalVisible(true);
  };

  const startTimer = () => {
    setTracking(true);
    setModalVisible(false);
    const timerId = setInterval(() => {
      setElapsedTime((prevTime) => prevTime + 1);
    }, 1000);
    setTimer(timerId);
    handleTrackingPosition(); // 위치 추적 시작
  };
  

  const handleStopTracking = () => {
    setTracking(false);
    clearInterval(timer);
    setTimer(null);
    setElapsedTime(0);
    setDistance(0);
    setPositions([]);
    if (polyline) {
      polyline.setPath([]); // 폴리라인 경로 초기화
    }
  };
  
  useEffect(() => {
    if (map) {
      const polylineInstance = new window.kakao.maps.Polyline({
        path: positions, // 초기 경로 설정
        strokeWeight: 5,
        strokeColor: "#FF6B6B",
        strokeOpacity: 0.7,
        strokeStyle: "solid",
      });
      polylineInstance.setMap(map); // 지도에 폴리라인 추가
      setPolyline(polylineInstance);
    }
  }, [map]);
  

  return (
    <div className="pickup-page-wrapper">
      <div className="pickup-container">
        <header className="page-header">
          <div className="header-content">
            <div className="header-icon">
              <Truck size={36} strokeWidth={2} className="truck-icon" />
            </div>
            <h1 className="page-title">수거지 현황</h1>
          </div>
        </header>

        <section className="map-section">
          <div id="map-container" className="map-display"></div>
        </section>

        <section className="tracking-statistics">
          <div className="stat-grid">
            <div className="stat-card">
              <div className="stat-icon-wrapper">
                <Clock size={28} className="stat-icon" />
              </div>
              <div className="stat-info">
                <span className="stat-label">소요 시간</span>
                <span className="stat-value">{formatTime(elapsedTime)}</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon-wrapper">
                <MapPin size={28} className="stat-icon" />
              </div>
              <div className="stat-info">
                <span className="stat-label">주행 거리</span>
                <span className="stat-value">{distance.toFixed(2)} km</span>
              </div>
            </div>
          </div>
        </section>

        <section className="action-section">
          {!tracking ? (
            <button 
              onClick={handleStartTracking} 
              className="action-button start-button"
            >
              수거 시작하기
            </button>
          ) : (
            <button 
              onClick={handleStopTracking} 
              className="action-button stop-button"
            >
              수거 종료하기
            </button>
          )}
        </section>

        <section className="pickup-details-section">
          <h3 className="details-title">수거 품목 정보</h3>
          {loading ? (
            <p className="loading-text">로딩 중...</p>
          ) : pickupDetails.length > 0 ? (
            <ul className="details-list">
              {pickupDetails.map((item) => (
                <li key={item.wasteId} className="details-item">
                  <div className="item-name">{item.wasteName}</div>
                  <div className="item-weight">{item.weight}kg</div>
                  <div className="item-price">예상 가격: {item.pricePreview}원</div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-details-text">수거 품목이 없습니다.</p>
          )}
        </section>

        {modalVisible && (
          <Modal
            message={modalMessage}
            onConfirm={modalMessage === "수거를 시작하시겠습니까?" ? startTimer : null}
            onClose={() => setModalVisible(false)}
          />
        )}
      </div>
    </div>
  );
};

export default PickupDeliverPage;