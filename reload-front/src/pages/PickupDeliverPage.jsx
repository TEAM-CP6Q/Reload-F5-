import React, { useEffect, useState } from "react";
import { Clock, MapPin, Truck, ListChecks, Check, X } from "lucide-react";
import "../CSS/PickupDeliverPage.css";
import makerlogo from "../images/makerlogo.png";
import { useNavigate } from "react-router-dom";
import { List, Avatar, Button ,Card, Descriptions} from "antd"; // 안트디자인 컴포넌트

// 시간 포맷 함수 (기존과 동일)
const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};


const PickupDeliverPage = () => {
  // 모든 기존 상태 변수 유지
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
  const [watchId, setWatchId] = useState(null);
  const [pickupList, setPickupList] = useState([]);
  const [selectedPickupStatus, setSelectedPickupStatus] = useState({});
  const [trackingId, setTrackingId] = useState(null); // 현재 수거 중인 픽업 ID


  // 카카오맵 API 키
  const js_key = process.env.REACT_APP_KAKAO_MAP_JS_KEY;
  const navi_key = process.env.REACT_APP_KAKAO_NAVI_KEY;
  

  // 오늘 날짜 가져오기 함수
  const getToday = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

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

  // 픽업 정보 가져오기 함수 (픽업 리스트 추가)
  const fetchPickups = async () => {
    try {
      const response = await fetch(
        `https://refresh-f5-server.o-r.kr/api/pickup/get-today-pickup?today=${getToday()}`,
        { method: "GET", headers: { "Content-Type": "application/json" } }
      );
      if (!response.ok) throw new Error("수거지 정보를 불러올 수 없습니다.");
      const data = await response.json();
      setPickups(data);
      setPickupList(data);

      // 픽업 상태 초기화
      const initialStatus = data.reduce((acc, pickup) => {
        acc[pickup.pickupId] = false;
        return acc;
      }, {});
      setSelectedPickupStatus(initialStatus);
    } catch (error) {
      console.error("수거지 정보 가져오기 오류:", error);
    }
  };

  // 픽업 상세 정보 가져오기 함수 (기존과 동일)
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

  

  // 픽업 리스트 아이템 클릭 핸들러 (새로 추가)
  const handlePickupListItemClick = (pickup) => {
    // 수거 중일 때 다른 항목 클릭 불가
    if (trackingId && trackingId !== pickup.pickupId) {
      console.log("다른 항목을 클릭할 수 없습니다.");
      return;
    }
  
    // 선택한 픽업 정보를 상태에 저장
    setSelectedPickup(pickup);
  
    // 선택한 픽업의 상세 정보를 가져옴
    fetchPickupDetails(pickup.pickupId);
  
    // 선택 상태 업데이트
    setSelectedPickupStatus((prev) => {
      const newStatus = { ...prev };
      Object.keys(newStatus).forEach((key) => {
        newStatus[key] = key === pickup.pickupId.toString();
      });
      return newStatus;
    });
  
    // 지도 중심을 선택된 픽업 위치로 이동
    if (map) {
      const geocoder = new window.kakao.maps.services.Geocoder();
      const fullAddress = `${pickup.address.roadNameAddress} ${pickup.address.detailedAddress}`;
      
      geocoder.addressSearch(fullAddress, (result, status) => {
        if (status === window.kakao.maps.services.Status.OK) {
          const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);
          map.setCenter(coords); // 지도 중심 이동
          map.setLevel(3); // 확대 수준 설정
        }
      });
    }
  };
  

  // 마커 추가 함수 (기존과 동일)
  const addPickupMarkers = () => {
    const geocoder = new window.kakao.maps.services.Geocoder();
    const newMarkers = {}; // 새롭게 추가될 마커 객체
  
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
  
          // 새 마커 저장: pickupId를 키로 사용
          newMarkers[pickup.pickupId] = marker;
        }
      });
    });
  
    // 기존 상태와 병합
    setPickupMarkers((prevMarkers) => ({ ...prevMarkers, ...newMarkers }));
  };
  
  

  // 위치 추적 시작 함수 (기존과 동일)
  const startTracking = () => {
    if (!selectedPickup) {
      console.error("수거지를 선택해야 위치 전송을 시작할 수 있습니다.");
      return;
    }
  
    setTrackingId(selectedPickup.pickupId); // 현재 수거 중인 픽업 ID 저장
    setTracking(true);
    setModalVisible(false);
  
    // 선택된 마커만 보이도록 설정
    Object.entries(pickupMarkers).forEach(([id, marker]) => {
      if (parseInt(id) === selectedPickup.pickupId) {
        marker.setMap(map); // 선택된 마커만 표시
      } else {
        marker.setMap(null); // 다른 마커 숨김
      }
    });
  
    const timerId = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);
    setTimer(timerId);
  
    const id = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        updateDriverMarker(latitude, longitude);
  
        // 클릭한 마커의 픽업 ID로 위치 전송
        sendLocationUpdate(selectedPickup.pickupId, latitude, longitude);
  
        // 폴리라인 업데이트
        if (selectedPickup) {
          const { roadNameAddress, detailedAddress } = selectedPickup.address;
          const geocoder = new window.kakao.maps.services.Geocoder();
          geocoder.addressSearch(
            `${roadNameAddress} ${detailedAddress}`,
            (result, status) => {
              if (status === window.kakao.maps.services.Status.OK) {
                const endCoords = new window.kakao.maps.LatLng(result[0].y, result[0].x);
                const startCoords = new window.kakao.maps.LatLng(latitude, longitude);
                updatePolylineWithNaviAPI(startCoords, endCoords);
              }
            }
          );
        }
      },
      (error) => {
        console.error("위치 추적 중 오류 발생:", error);
      },
      { enableHighAccuracy: true }
    );
  
    setWatchId(id); // watchPosition ID 저장
  };
  
  

  // 위치 추적 중지 함수 (기존과 동일)
  const stopTracking = async (pickupId) => {
    if (!pickupId) {
      console.error("픽업 ID가 제공되지 않았습니다.");
      return;
    }
    setTrackingId(null);
    setTracking(false);
    clearInterval(timer);
    setTimer(null);
  
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId); // 위치 추적 중단
      console.log("위치 추적이 중단되었습니다.");
      setWatchId(null); // watchId 초기화
    }
  
    console.log(`픽업 ID ${pickupId}에 대한 위치 전송이 중단되었습니다.`);
  
    // 위치 삭제 API 호출
    try {
      const token = localStorage.getItem("token");
  
      const response = await fetch(`https://refresh-f5-server.o-r.kr/api/pickup/delete-location?pickupId=${pickupId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error("위치 삭제에 실패했습니다.");
      }
      console.log(`픽업 ID ${pickupId}의 위치가 성공적으로 삭제되었습니다.`);
    } catch (error) {
      console.error("위치 삭제 오류:", error);
    }
  };
  

  // 로그아웃 함수 (기존과 동일)
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("role");
    localStorage.removeItem("id");
    window.location.href = '/login';
  };

  // 마커 클릭 및 폴리라인 업데이트 함수들 (기존과 동일)
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

  // useEffect 훅들 (기존 로직 유지)
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

  // 렌더링 로직 (픽업 리스트 사이드바 추가)
  return (
    <div className="pickup-page-wrapper">
      <header className="page-header">
        <h1 className="page-title">수거지 현황</h1>
        <Button type="primary" danger  onClick={handleLogout}>
          로그아웃
        </Button>
      </header>

      <div className="main-content-wrapper">
        {/* 지도와 상세 정보 */}
        <div className="map-and-details-container">
          <div id="map-container" className="map-display"></div>

          {selectedPickup && (
  <section className="pickup-details-section">
    <Card
      title="선택한 수거지 정보"
      bordered={false}
      styles={{
        header: {
          backgroundColor: "var(--primary-color)",
          color: "white",
          textAlign: "center",
          borderTopLeftRadius: "12px",
          borderTopRightRadius: "12px",
        },
        body: {
          padding: "20px",
        },
      }}
    >
      <Descriptions column={1}>
        <Descriptions.Item label="수거지">
          <span style={{ fontWeight: "bold", color: "var(--primary-color)" }}>
            {selectedPickup.address.name}
          </span>
        </Descriptions.Item>
        <Descriptions.Item label="주소">
          {selectedPickup.address.roadNameAddress}
        </Descriptions.Item>
        <Descriptions.Item label="수거 ID">
          {selectedPickup.pickupId}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  </section>
)}
        </div>

        {/* 하단 수거지 리스트 */}
        <div className="pickup-list-container">
          <h2>오늘의 수거지</h2>
          <List
            itemLayout="horizontal"
            dataSource={pickupList}
            renderItem={(pickup) => (
              <List.Item
                className={`pickup-list-item ${
                  selectedPickupStatus[pickup.pickupId] ? "selected" : ""
                }`}
                onClick={() => handlePickupListItemClick(pickup)}
                style={{
                  pointerEvents:
                    trackingId && trackingId !== pickup.pickupId
                      ? "none"
                      : "auto",
                  opacity:
                    trackingId && trackingId !== pickup.pickupId ? 0.5 : 1,
                }}
                actions={[
                  trackingId === pickup.pickupId ? (
                    <Button
                      type="danger"
                      onClick={() => stopTracking(pickup.pickupId)}
                    >
                      수거 종료
                    </Button>
                  ) : (
                    <Button
                      type="primary"
                      disabled={!!trackingId}
                      onClick={() => startTracking(pickup.pickupId)}
                    >
                      수거 시작
                    </Button>
                  ),
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <Avatar
                      style={{
                        backgroundColor: selectedPickupStatus[pickup.pickupId]
                          ? "green"
                          : "gray",
                      }}
                      icon={
                        selectedPickupStatus[pickup.pickupId] ? (
                          <Check size={16} />
                        ) : (
                          <X size={16} />
                        )
                      }
                    />
                  }
                  title={pickup.address.name}
                  description={pickup.address.roadNameAddress}
                />
              </List.Item>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default PickupDeliverPage;