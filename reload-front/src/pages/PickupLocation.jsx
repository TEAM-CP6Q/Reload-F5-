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
  const [permissionStatus, setPermissionStatus] = useState(null); // 권한 상태 관리 ("pending", "granted", "denied")

  useEffect(() => {
    if (!js_key) {
      console.error("카카오 지도 API 키가 설정되지 않았습니다. .env 파일을 확인하세요.");
      return;
    }

    let map, marker, polyline;
    let watchId;

    const requestPermission = async () => {
      if (!navigator.geolocation) {
        setPermissionStatus("unsupported");
        console.error("Geolocation API가 지원되지 않는 브라우저입니다.");
        return;
      }

      try {
        // 권한 상태 확인 (navigator.permissions는 일부 브라우저에서만 지원됨)
        if (navigator.permissions) {
          const permission = await navigator.permissions.query({ name: "geolocation" });
          if (permission.state === "granted") {
            setPermissionStatus("granted");
            initializeTracking();
          } else if (permission.state === "prompt") {
            setPermissionStatus("pending");
          } else {
            setPermissionStatus("denied");
          }
        } else {
          // 권한 상태를 확인할 수 없는 경우 기본값으로 요청
          setPermissionStatus("pending");
        }
      } catch (error) {
        console.error("권한 상태를 확인하는 데 실패했습니다:", error);
        setPermissionStatus("denied");
      }
    };

    const initializeTracking = () => {
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
              map: map,
              path: [new window.kakao.maps.LatLng(userLocation.lat, userLocation.lng)],
              strokeWeight: 5,
              strokeColor: "#FF0000",
              strokeOpacity: 0.8,
              strokeStyle: "solid",
            });

            startTracking(map, marker, polyline);
          });
        } else {
          console.error("카카오 지도 API를 로드하는 데 실패했습니다.");
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
    };

    const startTracking = (map, marker, polyline) => {
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
            polyline.setPath(updatedPath);
            return updatedPath;
          });

          // 지도 및 마커 업데이트
          map.setCenter(newPosition);
          marker.setPosition(newPosition);
        },
        (error) => {
          if (error.code === error.PERMISSION_DENIED) {
            setPermissionStatus("denied");
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
    };

    requestPermission();

    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [js_key]);

  return (
    <div className="pickup-container">
      <Header />
      {permissionStatus === "pending" && (
        <div className="permission-request">
          <h3>위치 권한 요청</h3>
          <p>위치를 추적하려면 권한을 허용해주세요.</p>
        </div>
      )}
      {permissionStatus === "granted" && (
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
      {permissionStatus === "denied" && (
        <div className="permission-denied">
          <h3>위치 권한이 필요합니다</h3>
          <p>앱의 설정에서 위치 권한을 허용해주세요.</p>
        </div>
      )}
      {permissionStatus === "unsupported" && (
        <div className="unsupported">
          <h3>지원되지 않는 브라우저</h3>
          <p>이 브라우저는 위치 추적을 지원하지 않습니다.</p>
        </div>
      )}
    </div>
  );
};

export default PickupLocation;
