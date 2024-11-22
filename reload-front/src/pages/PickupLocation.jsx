import React, { useEffect, useState } from "react";
import "../CSS/PickupLocation.css";
import Header from "../components/Header";

const PickupLocation = () => {
  const js_key = process.env.REACT_APP_KAKAO_MAP_JS_KEY;
  const [userLocation, setUserLocation] = useState({
    lat: 33.450701, // 초기 위치
    lng: 126.570667,
  });
  const [path, setPath] = useState([]); // 경로 좌표 배열
  const [permission, setPermission] = useState(null); // 위치 권한 상태 (null, "granted", "denied")

  useEffect(() => {
    if (!js_key) {
      console.error("카카오 지도 API 키가 설정되지 않았습니다. .env 파일을 확인하세요.");
      return;
    }

    let map, marker, polyline;
    let watchId;

    const loadKakaoMap = () => {
      if (window.kakao && window.kakao.maps) {
        window.kakao.maps.load(() => {
          const container = document.getElementById("map");
          const options = {
            center: new window.kakao.maps.LatLng(userLocation.lat, userLocation.lng),
            level: 3,
          };

          map = new window.kakao.maps.Map(container, options);

          // 마커 초기화
          marker = new window.kakao.maps.Marker({
            position: new window.kakao.maps.LatLng(userLocation.lat, userLocation.lng),
          });
          marker.setMap(map);

          // Polyline 초기화
          polyline = new window.kakao.maps.Polyline({
            map: map, // 지도에 표시
            path: [new window.kakao.maps.LatLng(userLocation.lat, userLocation.lng)], // 초기 경로
            strokeWeight: 5,
            strokeColor: "#FF0000",
            strokeOpacity: 0.8,
            strokeStyle: "solid",
          });

          // 위치 추적 시작
          startTracking(map, marker, polyline);
        });
      } else {
        console.error("카카오 지도 API를 로드하는 데 실패했습니다.");
      }
    };

    const startTracking = (map, marker, polyline) => {
      if (navigator.geolocation) {
        watchId = navigator.geolocation.watchPosition(
          (position) => {
            const { latitude, longitude } = position.coords;

            const newPosition = new window.kakao.maps.LatLng(latitude, longitude);

            // 상태 업데이트
            setUserLocation({
              lat: latitude,
              lng: longitude,
            });

            setPath((prevPath) => {
              const updatedPath = [...prevPath, newPosition];
              polyline.setPath(updatedPath); // 경로 업데이트
              return updatedPath;
            });

            // 지도 및 마커 업데이트
            map.setCenter(newPosition);
            marker.setPosition(newPosition);
          },
          (error) => {
            if (error.code === error.PERMISSION_DENIED) {
              setPermission("denied");
              console.error("위치 권한이 거부되었습니다.");
            } else {
              console.error("위치 정보를 가져오는 데 실패했습니다:", error);
            }
          },
          {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 5000,
          }
        );
      } else {
        console.error("Geolocation API가 지원되지 않는 브라우저입니다.");
      }
    };

    const injectKakaoMapScript = () => {
      const existingScript = document.querySelector(
        `script[src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=${js_key}&libraries=services&autoload=false"]`
      );
      if (!existingScript) {
        const script = document.createElement("script");
        script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${js_key}&libraries=services&autoload=false`;
        script.async = true;
        script.onload = loadKakaoMap;
        document.body.appendChild(script);
      } else {
        existingScript.onload = loadKakaoMap;
      }
    };

    injectKakaoMapScript();

    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId); // 위치 추적 중지
      }

      const existingScript = document.querySelector(
        `script[src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=${js_key}&libraries=services&autoload=false"]`
      );
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, [js_key]);

  return (
    <div className="pickup-container">
      <Header />
      {permission === "denied" ? (
        <div className="permission-denied">
          <h3>위치 권한이 필요합니다</h3>
          <p>앱의 설정에서 위치 권한을 허용해주세요.</p>
        </div>
      ) : (
        <>
          <div id="map" className="pickup-map"></div>
          <div className="pickup-details">
            <h3>내 위치 정보</h3>
            <p>
              현재 위치: {userLocation.lat.toFixed(5)}, {userLocation.lng.toFixed(5)}
            </p>
            <span className="pickup-status">실시간 위치 추적 중</span>
          </div>
        </>
      )}
    </div>
  );
};

export default PickupLocation;
