import React, { useEffect, useState } from "react";
import { Clock, MapPin, Truck } from "lucide-react";
import "../CSS/PickupDeliverPage.css";
import makerlogo from "../images/makerlogo.png";

const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

const Modal = ({ message, onConfirm, onClose }) => (
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

const PickupDeliverPage = () => {
  const [map, setMap] = useState(null);
  const [driverMarker, setDriverMarker] = useState(null);
  const [pickupMarkers, setPickupMarkers] = useState([]);
  const [polyline, setPolyline] = useState(null);
  const [positions, setPositions] = useState([]);
  const [pickups, setPickups] = useState([]);
  const [selectedPickup, setSelectedPickup] = useState(null);
  const [pickupDetails, setPickupDetails] = useState([]);
  const [tracking, setTracking] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const js_key = process.env.REACT_APP_KAKAO_MAP_JS_KEY;
  const navi_key = process.env.REACT_APP_KAKAO_NAVI_KEY;

  const getToday = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  // 위치 전송 함수
  const sendLocationUpdate = async (pickupId, latitude, longitude) => {
    try {
      const response = await fetch(`https://refresh-f5-server.o-r.kr/api/pickup/update-location`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pickupId, latitude, longitude }),
      });

      if (!response.ok) {
        console.error("위치 업데이트 실패:", response.status);
      } else {
        console.log("위치 업데이트 성공");
      }
    } catch (error) {
      console.error("위치 업데이트 오류:", error);
    }
  };

  const updateDriverMarker = (latitude, longitude) => {
    if (!map) return;
  
    const coords = new window.kakao.maps.LatLng(latitude, longitude);
  
    if (!driverMarker) {
      // 마커가 없을 경우 새롭게 생성
      const content = `
        <div style="position: relative; width: 36px; height: 48px; text-align: center;">
          <div style="
            width: 36px;
            height: 36px;
            border-radius: 50%; 
            border: 2px solid #388E3C; 
            display: flex; 
            justify-content: center; 
            align-items: center;
            box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.3);">
            <img src="${makerlogo}" alt="현재 위치" 
              style="
                width: 32px; 
                height: 35px; 
                border-radius: 50%; 
                object-fit: cover; 
              " />
          </div>
          <div style="
            width: 0; 
            height: 0; 
            border-left: 9px solid transparent; 
            border-right: 9px solid transparent; 
            border-top: 12px solid #388E3C; 
            margin: -2px auto 0;">
          </div>
        </div>
      `;
  
      const customOverlay = new window.kakao.maps.CustomOverlay({
        position: coords,
        content: content,
        map: map, // 마커를 지도에 표시
      });
  
      setDriverMarker(customOverlay); // 상태에 저장
    } else {
      // 기존 마커가 있으면 위치만 업데이트
      driverMarker.setPosition(coords);
    }
  
    map.setCenter(coords); // 지도 중심 이동
  
    // 폴리라인 경로 업데이트
    setPositions((prev) => {
      const updatedPositions = [...prev, coords];
      if (polyline) {
        polyline.setPath(updatedPositions);
      }
      return updatedPositions;
    });
  };
  
  // 페이지 로드 시 현재 위치 마커 표시
  useEffect(() => {
    if (map && !driverMarker) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          updateDriverMarker(latitude, longitude); // 초기 위치로 마커 설정
        },
        (error) => {
          console.error("현재 위치를 가져올 수 없습니다:", error);
        },
        { enableHighAccuracy: true }
      );
    }
  }, [map, driverMarker]);
  

  const fetchPickups = async () => {
    try {
      const response = await fetch(
        `https://refresh-f5-server.o-r.kr/api/pickup/get-today-pickup?today=${getToday()}`,
        { method: "GET", headers: { "Content-Type": "application/json" } }
      );
      if (!response.ok) throw new Error("수거지 정보를 불러올 수 없습니다.");
      const data = await response.json();
      setPickups(data);
    } catch (error) {
      console.error("수거지 정보 가져오기 오류:", error);
    }
  };

  const fetchPickupDetails = async (pickupId) => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://refresh-f5-server.o-r.kr/api/pickup/get-details?pickupId=${pickupId}`,
        { method: "GET", headers: { "Content-Type": "application/json" } }
      );
      if (!response.ok) throw new Error("수거지 상세 정보를 불러올 수 없습니다.");
      const data = await response.json();
      setPickupDetails(data.details);
    } catch (error) {
      console.error("수거지 상세 정보 가져오기 오류:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkerClick = (pickupLat, pickupLng) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // 내 현재 위치 (출발지)
        const startCoords = new window.kakao.maps.LatLng(
          position.coords.latitude,
          position.coords.longitude
        );
  
        // 수거지 위치 (도착지)
        const endCoords = new window.kakao.maps.LatLng(pickupLat, pickupLng);
  
        console.log("출발지 좌표:", startCoords.getLng(), startCoords.getLat());
        console.log("도착지 좌표:", endCoords.getLng(), endCoords.getLat());
  
        // 폴리라인 업데이트
        updatePolylineWithNaviAPI(startCoords, endCoords);
      },
      (error) => {
        console.error("현재 위치를 가져오는 데 실패했습니다:", error);
      },
      { enableHighAccuracy: true }
    );
  };
  
  const updatePolylineWithNaviAPI = async (startCoords, endCoords) => {
    try {
      const response = await fetch(
        `https://apis-navi.kakaomobility.com/v1/waypoints/directions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `KakaoAK ${navi_key}`, // REST API 키
          },
          body: JSON.stringify({
            origin: { x: startCoords.getLng(), y: startCoords.getLat() },
            destination: { x: endCoords.getLng(), y: endCoords.getLat() },
          }),
        }
      );
  
      if (!response.ok) {
        throw new Error("경로를 가져오는 데 실패했습니다.");
      }
  
      const data = await response.json();
  
      // 도로를 따라가는 폴리라인 경로 추출
      const points = data.routes[0].sections
        .flatMap((section) =>
          section.roads.flatMap((road) =>
            road.vertexes.reduce((coords, _, index, array) => {
              if (index % 2 === 0) {
                coords.push(
                  new window.kakao.maps.LatLng(array[index + 1], array[index])
                );
              }
              return coords;
            }, [])
          )
        );
  
      if (!polyline) {
        const polylineInstance = new window.kakao.maps.Polyline({
          path: points,
          strokeWeight: 5,
          strokeColor: "#FF6B6B",
          strokeOpacity: 0.7,
        });
        polylineInstance.setMap(map);
        setPolyline(polylineInstance);
      } else {
        polyline.setPath(points);
      }
    } catch (error) {
      console.error("카카오내비 경로 업데이트 오류:", error);
    }
  };
  

// 마커를 클릭했을 때 selectedPickup 업데이트
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
  
          // 마커 클릭 이벤트
          window.kakao.maps.event.addListener(marker, "click", () => {
            setSelectedPickup(pickup); // 클릭한 픽업 정보를 상태로 설정
            fetchPickupDetails(pickup.pickupId); // 픽업 상세 정보 가져오기
            console.log(`선택된 픽업 ID: ${pickup.pickupId}`);
                 // 기사 위치와 수거지 위치 기반으로 폴리라인 업데이트
                 if (driverMarker) {
                  updatePolylineWithNaviAPI(driverMarker.getPosition(), coords);
                }
              
          });

          


  
          setPickupMarkers((prevMarkers) => [...prevMarkers, marker]);
        }
      });
    });
  };
  
  // 수거 시작 시 위치 전송
  const startTracking = () => {
    if (!selectedPickup) {
      console.error("수거지를 선택해야 위치 전송을 시작할 수 있습니다.");
      return;
    }
  
    setTracking(true);
    setModalVisible(false);
    const timerId = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);
    setTimer(timerId);
  
    navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        updateDriverMarker(latitude, longitude);
  
        // 클릭한 마커의 픽업 ID로 위치 전송
        sendLocationUpdate(selectedPickup.pickupId, latitude, longitude);
      },
      (error) => {
        console.error("위치 추적 중 오류 발생:", error);
      },
      { enableHighAccuracy: true }
    );
  };
  
  const stopTracking = () => {
    setTracking(false);
    clearInterval(timer);
    setTimer(null);
    console.log("위치 전송이 중단되었습니다.");
  };
  



  useEffect(() => {
    const script = document.createElement("script");
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${js_key}&libraries=services&autoload=false`;
    script.async = true;
    script.onload = () => {
      window.kakao.maps.load(() => {
        const container = document.getElementById("map-container");
        const options = {
          center: new window.kakao.maps.LatLng(37.5665, 126.978), // 초기 중심 (서울)
          level: 3, // 확대 레벨
        };
        const mapInstance = new window.kakao.maps.Map(container, options);
  
        const polylineInstance = new window.kakao.maps.Polyline({
          path: [],
          strokeWeight: 5,
          strokeColor: "#FF6B6B",
          strokeOpacity: 0.7,
        });
        polylineInstance.setMap(mapInstance);
  
        setMap(mapInstance); // 지도 상태 설정
        setPolyline(polylineInstance);
  
        // 지도 초기화 시 한 번만 현재 위치로 이동
        if (!driverMarker) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              const currentPosition = new window.kakao.maps.LatLng(latitude, longitude);
              mapInstance.setCenter(currentPosition); // 초기 지도 중심을 현재 위치로 설정
              updateDriverMarker(latitude, longitude);
            },
            (error) => {
              console.error("현재 위치를 가져올 수 없습니다:", error);
            },
            { enableHighAccuracy: true }
          );
        }
      });
    };
    document.head.appendChild(script);
  
    return () => {
      script.remove(); // 언마운트 시 스크립트 제거
      if (driverMarker) driverMarker.setMap(null); // 기사 마커 제거
      pickupMarkers.forEach((marker) => marker.setMap(null)); // 수거지 마커 제거
    };
  }, [js_key]);

  useEffect(() => {
    if (map) fetchPickups();
  }, [map]);

  useEffect(() => {
    if (map && pickups.length > 0) addPickupMarkers();
  }, [map, pickups]);

  return (
    <div className="pickup-page-wrapper">
      <div className="pickup-container">
        <header className="page-header">
          <div className="header-content">
            <Truck size={36} strokeWidth={2} className="truck-icon" />
            <h1 className="page-title">수거지 현황</h1>
          </div>
        </header>

        <div id="map-container" className="map-display"></div>

        {selectedPickup && (
          <section className="pickup-details-section">
            <h3>선택한 수거지 정보</h3>
            <p><strong>수거지:</strong> {selectedPickup.address.name}</p>
            <p><strong>주소:</strong> {selectedPickup.address.roadNameAddress}</p>
            <p><strong>수거 ID:</strong> {selectedPickup.pickupId}</p>
            <h4>수거 품목 정보</h4>
            {loading ? (
              <p>로딩 중...</p>
            ) : pickupDetails.length > 0 ? (
              <ul>
                {pickupDetails.map((item, index) => (
                  <li key={index}>
                    {item.wasteName} - {item.weight}kg (예상 가격: {item.pricePreview}원)
                  </li>
                ))}
              </ul>
            ) : (
              <p>수거 품목 정보가 없습니다.</p>
            )}
            {!tracking && (
              <button
                onClick={() => setModalVisible(true)}
                className="action-button start-button"
              >
                수거 시작하기
              </button>
            )}
            {tracking && (
              <button
                onClick={stopTracking}
                className="action-button stop-button"
              >
                수거 종료하기
              </button>
            )}
          </section>
        )}

        {modalVisible && (
          <Modal
            message="수거를 시작하시겠습니까?"
            onConfirm={startTracking}
            onClose={() => setModalVisible(false)}
          />
        )}
      </div>
    </div>
  );
};

export default PickupDeliverPage;

