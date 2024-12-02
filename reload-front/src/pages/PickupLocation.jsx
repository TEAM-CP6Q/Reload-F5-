import React, { useEffect, useState, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import Header from "../components/Header";
import "../CSS/PickupLocation.css";
import makerlogo from "../images/makerlogo.png";

const PickupLocation = () => {
  const location = useLocation();
  const { pickupId } = location.state || {};
  const js_key = process.env.REACT_APP_KAKAO_MAP_JS_KEY;

  const [map, setMap] = useState(null);
  const [pickupLocation, setPickupLocation] = useState(null);
  const [path, setPath] = useState([]);
  const [polyline, setPolyline] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [estimatedTime, setEstimatedTime] = useState(null);
  const [addressCache, setAddressCache] = useState({});

  const driverMarkerRef = useRef(null);
  const pickupMarkerRef = useRef(null);

  const initializeMap = useCallback((lat, lng) => {
    if (!window.kakao || !window.kakao.maps) {
      setError("카카오맵 API가 로드되지 않았습니다.");
      return;
    }

    window.kakao.maps.load(() => {
      const container = document.getElementById("map");
      const options = {
        center: new window.kakao.maps.LatLng(lat, lng),
        level: 3,
      };

      const newMap = new window.kakao.maps.Map(container, options);
      setMap(newMap);
    });
  }, []);

  const loadKakaoScript = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (window.kakao && window.kakao.maps) {
        window.kakao.maps.load(() => {
          resolve();
        });
        return;
      }

      const script = document.createElement("script");
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${js_key}&libraries=services&autoload=false`;
      script.async = true;
      script.onload = () => {
        window.kakao.maps.load(() => {
          resolve();
        });
      };
      script.onerror = () => reject("카카오맵 API 스크립트를 로드할 수 없습니다.");
      document.head.appendChild(script);
    });
  }, [js_key]);

// geocoder를 컴포넌트 상단에서 한 번만 생성
const geocoderRef = useRef(null);

// 주소 검색 함수
const geocodePickupAddress = useCallback((roadAddress, detailAddress) => {
  if (!window.kakao || !window.kakao.maps || !map) {
    console.error("Kakao maps 초기화 상태:", {
      kakao: !!window.kakao,
      maps: !!window.kakao?.maps,
      map: !!map
    });
    setError("지도 서비스를 초기화하는 데 실패했습니다.");
    return;
  }

  // geocoder 초기화가 안 되어있으면 초기화
  if (!geocoderRef.current) {
    geocoderRef.current = new window.kakao.maps.services.Geocoder();
  }

  const callback = (result, status) => {
    if (status === window.kakao.maps.services.Status.OK) {
      const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);

      if (pickupMarkerRef.current) {
        pickupMarkerRef.current.setMap(null);
      }

      const marker = new window.kakao.maps.Marker({
        position: coords,
        map: map
      });

      const infowindow = new window.kakao.maps.InfoWindow({
        content: `<div style="padding:5px;font-size:12px;">상세주소: ${detailAddress}</div>`
      });

      window.kakao.maps.event.addListener(marker, 'click', () => {
        infowindow.open(map, marker);
      });

      pickupMarkerRef.current = marker;
      map.setCenter(coords);
    } else {
      console.error("주소 검색 실패", {
        status,
        errorCode: window.kakao.maps.services.Status,
        address: roadAddress
      });
      setError("주소를 찾을 수 없습니다.");
    }
  };

  geocoderRef.current.addressSearch(roadAddress, callback);
}, [map]); // addressCache 의존성 제거

  const displayMarker = useCallback((coords, detailAddress) => {
    if (pickupMarkerRef.current) {
      pickupMarkerRef.current.setMap(null);
    }

    const marker = new window.kakao.maps.Marker({
      position: coords,
      map: map
    });

    const infowindow = new window.kakao.maps.InfoWindow({
      content: `<div style="padding:5px;font-size:12px;">상세주소: ${detailAddress}</div>`
    });

    window.kakao.maps.event.addListener(marker, 'click', () => {
      infowindow.open(map, marker);
    });

    pickupMarkerRef.current = marker;
    map.setCenter(coords);
  }, [map]);






  const fetchPickupDetails = useCallback(async () => {
    if (!pickupId || !map) return;

    const token = localStorage.getItem("token");

    try {
      setLoading(true);
      const response = await fetch(
        `https://refresh-f5-server.o-r.kr/api/pickup/get-details?pickupId=${pickupId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("받은 데이터:", data);
        geocodePickupAddress(data.roadNameAddress, data.detailedAddress);
      } else {
        setError("수거 상세 정보를 불러오는 데 실패했습니다.");
      }
    } catch (error) {
      setError("데이터 로드 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }, [pickupId, map, geocodePickupAddress]);

  const updateDriverMarker = useCallback((coords) => {
    // 기존 폴리라인 제거
    if (polyline) {
      polyline.setMap(null);
    }
  
    // 기사 마커 업데이트
    if (driverMarkerRef.current) {
      console.log("기존 마커 위치 업데이트 중...");
      driverMarkerRef.current.setPosition(coords);
    } else {
      console.log("새로운 마커 생성 중...");
      const content = `
        <div style="position: relative; width: 36px; height: 48px; text-align: center;">
          <div style="
            position: relative;
            z-index: 2;
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
            position: relative;
            z-index: 1;
            width: 0; 
            height: 0; 
            border-left: 9px solid transparent; 
            border-right: 9px solid transparent; 
            border-top: 12px solid #388E3C; 
            margin: -2px auto 0;">
          </div>
        </div>
      `;
  
      const newCustomOverlay = new window.kakao.maps.CustomOverlay({
        position: coords,
        content: content,
        map: map,
        zIndex: 3  // 폴리라인보다 높은 z-index
      });
  
      driverMarkerRef.current = newCustomOverlay;
    }
  
    // 이전 경로에 새로운 위치 추가
    const newPath = [...path, coords];
    setPath(newPath);
  
    // 새로운 폴리라인 생성 및 표시
    const newPolyline = new window.kakao.maps.Polyline({
      path: newPath,
      strokeWeight: 3,
      strokeColor: '#388E3C',
      strokeOpacity: 0.8,
      strokeStyle: 'solid',
      zIndex: 1  // 폴리라인의 z-index
    });
  
    newPolyline.setMap(map);
    setPolyline(newPolyline);
  
    // 예상 시간 계산 (수거지 마커가 있는 경우만)
    if (pickupMarkerRef.current) {
      const pickupPosition = pickupMarkerRef.current.getPosition();
      const distance = Math.round(coords.getDistance(pickupPosition));
      const estimatedMinutes = Math.ceil((distance / 1000) * (60 / 40));
      setEstimatedTime(estimatedMinutes);
    }
  }, [map, polyline]);

  const fetchDriverLocation = useCallback(async () => {
    if (!pickupId) {
      console.error("수거 ID가 설정되지 않았습니다.");
      return;
    }
  
    try {
      const response = await fetch(
        `https://refresh-f5-server.o-r.kr/api/pickup/get-location?pickupId=${pickupId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      if (!response.ok) {
        setError("기사님이 수거를 시작하지 않았습니다.");
        return;
      }
  
      const text = await response.text();
      
      // 응답이 비어있거나 유효하지 않은 경우
      if (!text || text === "null" || text === "{}") {
        setError("기사님이 수거를 시작하지 않았습니다.");
        return;
      }
  
      const data = JSON.parse(text);
      
      // 위치 데이터가 있는 경우
      if (data && data.latitude && data.longitude) {
        const coords = new window.kakao.maps.LatLng(data.latitude, data.longitude);
        updateDriverMarker(coords);
        setError(null); // 에러 메시지 제거
      } else {
        setError("기사님이 수거를 시작하지 않았습니다.");
      }
  
    } catch (error) {
      console.error("기사 위치 업데이트 오류:", error);
      setError("기사님이 수거를 시작하지 않았습니다.");
    }
  }, [pickupId, updateDriverMarker]);

  // 기존 useEffect들을 제거하고 아래와 같이 분리

// 1. 지도 초기화를 위한 useEffect
useEffect(() => {
  loadKakaoScript()
    .then(() => initializeMap(37.5665, 126.978))
    .catch((error) => setError(error));
}, [loadKakaoScript, initializeMap]);

// 2. 수거지 마커를 위한 useEffect - 한 번만 실행
useEffect(() => {
  if (map && pickupId) {
    fetchPickupDetails();
  }
}, [map]); // pickupId 제거, map이 로드된 후 한 번만 실행

// 3. 기사 위치 추적을 위한 useEffect
useEffect(() => {
  if (map && pickupId) {
    let isSubscribed = true;

    const intervalId = setInterval(async () => {
      if (isSubscribed) {
        await fetchDriverLocation();
      }
    }, 5000);

    return () => {
      clearInterval(intervalId);
      isSubscribed = false;
    };
  }
}, [map, pickupId, fetchDriverLocation]);

  return (
    <div className="pickuplocation-container">
      <Header />
      <main className="pickuplocation-main-content">
        <div className="pickuplocation-map-section">
          {error && <div className="pickuplocation-error-message">{error}</div>}
          <div className="pickuplocation-map-container">
            <div id="map" className="pickuplocation-map"></div>
            {loading && (
              <div className="pickuplocation-loading-overlay">
                <div className="pickuplocation-loading-content">
                  <Loader2 className="pickuplocation-loading-spinner" />
                  <span>로딩 중...</span>
                </div>
              </div>
            )}
          </div>
        </div>
        {estimatedTime && (
          <div className="pickuplocation-info-section">
            <h3 className="pickuplocation-info-heading">예상 도착 시간</h3>
            <p className="pickuplocation-info-text">약 {estimatedTime}분 소요 예정</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default PickupLocation;