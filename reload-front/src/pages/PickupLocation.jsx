import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import Header from "../components/Header";
import "../CSS/PickupLocation.css";
import makerlogo from '../images/makerlogo.png';

const PickupLocation = () => {
  const location = useLocation();
  const { pickupId } = location.state || {};
  const js_key = process.env.REACT_APP_KAKAO_MAP_JS_KEY;

  const [map, setMap] = useState(null);
  const [pickupMarker, setPickupMarker] = useState(null);
  const [driverMarker, setDriverMarker] = useState(null);
  const [pickupLocation, setPickupLocation] = useState(null);
  const [path, setPath] = useState([]);
  const [polyline, setPolyline] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [estimatedTime, setEstimatedTime] = useState(null);

  // 지도 초기화
  const initializeMap = (lat, lng) => {
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
  };

  const loadKakaoScript = () => {
    return new Promise((resolve, reject) => {
      if (window.kakao && window.kakao.maps) {
        resolve();
        return;
      }

      const script = document.createElement("script");
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${js_key}&libraries=services&autoload=false`;
      script.async = true;
      script.onload = resolve;
      script.onerror = () => reject("카카오맵 API 스크립트를 로드할 수 없습니다.");
      document.body.appendChild(script);
    });
  };

  // 기사 위치를 받아와 지도에 표시


  // 수거지 주소를 받아와 지도에 표시
  const fetchPickupDetails = async () => {
    if (!pickupId || !map) return;

    const token = localStorage.getItem("token");

    try {
      setLoading(true);
      const response = await fetch(
        `https://refresh-f5-server.o-r.kr/api/pickup/get-details?pickupId=${pickupId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json", // 요청 데이터 형식을 명시
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        const fullAddress = `${data.roadNameAddress} ${data.detailedAddress}`;
        geocodePickupAddress(fullAddress);
      } else {
        setError("수거 상세 정보를 불러오는 데 실패했습니다.");
      }
    } catch (error) {
      setError("데이터 로드 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 수거지 주소를 지도 위에 마커로 표시
  const geocodePickupAddress = (address) => {
    if (!window.kakao || !window.kakao.maps || !map) {
      setError("지도 서비스를 초기화하는 데 실패했습니다.");
      return;
    }
  
    window.kakao.maps.load(() => {
      const geocoder = new window.kakao.maps.services.Geocoder();
  
      // 입력 주소 출력 (디버깅용)
      console.log("검색 중인 주소:", address);
  
      geocoder.addressSearch(address, (result, status) => {
        if (status === window.kakao.maps.services.Status.OK) {
          const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);
          const newPickupLocation = {
            lat: parseFloat(result[0].y),
            lng: parseFloat(result[0].x),
          };
          setPickupLocation(newPickupLocation);
  
          const pickupMarkerImage = new window.kakao.maps.MarkerImage(
            "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png",
            new window.kakao.maps.Size(24, 35)
          );
  
          if (pickupMarker) {
            pickupMarker.setMap(null); // 기존 마커 제거
          }
  
          // 새 마커 생성 및 지도 중심 이동
          const newPickupMarker = new window.kakao.maps.Marker({
            position: coords,
            map: map,
            image: pickupMarkerImage,
          });
          setPickupMarker(newPickupMarker);
  
          // 지도 중심을 수거지 위치로 이동
          map.setCenter(coords);
          map.setLevel(3); // 지도 줌 레벨 설정 (3: 가까운 거리)
        } else if (status === window.kakao.maps.services.Status.ZERO_RESULT) {
          setError("주소를 찾을 수 없습니다. 입력한 주소를 확인하세요.");
          console.error("Geocoding 실패: 결과 없음", address);
        } else {
          setError("주소 검색 중 오류 발생. 다시 시도하세요.");
          console.error("Geocoding 오류:", status);
        }
      });
    });
  };
    // 기사 위치를 받아와 지도에 표시
    const fetchDriverLocation = async () => {
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
          const errorText = await response.text();
          console.error(`Error: ${response.status} - ${response.statusText} - ${errorText}`);
          throw new Error("기사 위치를 가져오는 데 실패했습니다.");
        }
    
        const { latitude, longitude } = await response.json();
        console.log("기사 현재 위치:", { latitude, longitude });
    
        if (!latitude || !longitude) {
          console.error("응답에 유효한 좌표가 없습니다.");
          return;
        }
    
        const coords = new window.kakao.maps.LatLng(latitude, longitude);
    
        if (!map) {
          console.error("지도 객체가 초기화되지 않았습니다.");
          return;
        }
    
        if (!driverMarker) {
          // 최초 호출 시 마커 생성
          console.log("새로운 마커 생성 중...");
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
                <img src="${makerlogo}" alt="현재 위치" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover;" />
              </div>
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
    
          const newMarker = new window.kakao.maps.CustomOverlay({
            position: coords,
            content: content,
            map: map, // 지도에 마커 추가
          });
    
          setDriverMarker(newMarker); // 최초 생성된 마커 저장
          console.log("마커가 생성되었습니다.");
        } else {
          // 기존 마커가 있는 경우 위치만 업데이트
          console.log("기존 마커 위치 업데이트 중...");
          driverMarker.setPosition(coords); // 기존 마커의 위치만 업데이트
        }
    
        // 지도 중심 이동
        map.setCenter(coords);
      } catch (error) {
        console.error("기사 위치 업데이트 오류:", error);
      }
    };
    
    
    
    
    
    // 기사와 수거지 사이 경로 표시 및 폴리라인 업데이트
    const updatePolyline = (newCoords) => {
      const updatedPath = [...path, newCoords];
      setPath(updatedPath);
  
      if (polyline) {
        polyline.setMap(null); // 기존 폴리라인 제거
      }
  
      const newPolyline = new window.kakao.maps.Polyline({
        path: updatedPath,
        strokeWeight: 4,
        strokeColor: "#4A90E2",
        strokeOpacity: 0.7,
        strokeStyle: "solid",
      });
  
      newPolyline.setMap(map);
      setPolyline(newPolyline);
    };
  
  


  // 예상 도착 시간 계산
  const calculateEstimatedTime = (driverLoc, pickupLoc) => {
    if (!driverLoc || !pickupLoc) return;

    const R = 6371; // 지구 반지름 (km)
    const dLat = (pickupLoc.lat - driverLoc.lat) * (Math.PI / 180);
    const dLon = (pickupLoc.lng - driverLoc.lng) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(driverLoc.lat * (Math.PI / 180)) *
        Math.cos(pickupLoc.lat * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    const estimatedMinutes = Math.round((distance / 2) * 60); // 2km/h 기준
    setEstimatedTime(estimatedMinutes);
  };

  useEffect(() => {
    loadKakaoScript()
      .then(() => {
        initializeMap(37.5665, 126.978); // 초기 지도 위치 설정
      })
      .catch((error) => setError(error));
  }, []);

  useEffect(() => {
    if (map) {
      fetchPickupDetails();
      const intervalId = setInterval(fetchDriverLocation, 5000); // 기사 위치 5초마다 업데이트
      return () => clearInterval(intervalId);
    }
  }, [map]);

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
