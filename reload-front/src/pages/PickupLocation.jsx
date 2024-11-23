import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import Header from "../components/Header";
import "../CSS/PickupLocation.css";

const PickupLocation = () => {
  const location = useLocation();
  const { pickupId } = location.state || {};
  const jsKey = "YOUR_JAVASCRIPT_KEY"; // JavaScript 키를 직접 설정

  const [map, setMap] = useState(null);
  const [pickupMarker, setPickupMarker] = useState(null);
  const [driverMarker, setDriverMarker] = useState(null);
  const [pickupLocation, setPickupLocation] = useState(null);
  const [polyline, setPolyline] = useState(null); // 폴리라인 객체
  const [path, setPath] = useState([]); // 폴리라인 경로
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPermissionModalOpen, setPermissionModalOpen] = useState(false);

  const isMobile = /Mobi|Android/i.test(navigator.userAgent); // 모바일 여부 확인

  // 지도 초기화
  const initializeMap = (lat, lng) => {
    if (!window.kakao || !window.kakao.maps) {
      setError("카카오맵 API가 로드되지 않았습니다.");
      return;
    }

    const container = document.getElementById("map");
    const options = {
      center: new window.kakao.maps.LatLng(lat, lng),
      level: 3,
    };

    const newMap = new window.kakao.maps.Map(container, options);
    setMap(newMap);
    setLoading(false);
  };

  // 카카오맵 스크립트 로드
  const loadKakaoScript = () => {
    return new Promise((resolve, reject) => {
      if (window.kakao && window.kakao.maps) {
        resolve();
        return;
      }

      const scriptUrl = `http://dapi.kakao.com/v2/maps/sdk.js?appkey=${jsKey}&libraries=services&autoload=false`;

      const existingScript = document.querySelector(`script[src="${scriptUrl}"]`);

      if (existingScript) {
        existingScript.onload = () => {
          window.kakao.maps.load(resolve);
        };
        existingScript.onerror = () => {
          console.error("카카오맵 스크립트 로드 실패: 기존 스크립트 오류");
          reject(new Error("카카오맵 API 스크립트를 로드할 수 없습니다. 도메인 등록 또는 네트워크 상태를 확인하세요."));
        };
        return;
      }

      const script = document.createElement("script");
      script.src = scriptUrl;
      script.async = true;

      script.onload = () => {
        console.log("카카오맵 스크립트 로드 성공");
        window.kakao.maps.load(resolve);
      };

      script.onerror = () => {
        console.error("카카오맵 스크립트 로드 실패: 새로운 스크립트 오류");
        reject(new Error("카카오맵 API 스크립트를 로드할 수 없습니다. 도메인 등록 또는 네트워크 상태를 확인하세요."));
      };

      document.body.appendChild(script);
    });
  };

  // 위치 권한 요청 및 지도 초기화
  const requestLocationPermission = () => {
    if (!navigator.geolocation) {
      setError("이 브라우저는 위치 추적을 지원하지 않습니다.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        // 지도 초기화
        initializeMap(latitude, longitude);
        setPermissionModalOpen(false);
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          setError("위치 권한이 거부되었습니다. 브라우저 설정에서 권한을 허용해주세요.");
          setPermissionModalOpen(true);
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          setError("현재 위치 정보를 사용할 수 없습니다. 네트워크를 확인해주세요.");
        } else {
          setError("위치를 가져오는 데 실패했습니다.");
        }
      }
    );
  };

  // 기사 위치 실시간 업데이트
  const updateDriverLocation = () => {
    if (!map) {
      console.error("지도(map)가 초기화되지 않았습니다.");
      return;
    }

    const fetchDriverLocation = () => {
      if (!navigator.geolocation) {
        console.error("이 브라우저는 Geolocation을 지원하지 않습니다.");
        setError("위치 추적이 지원되지 않습니다.");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          const currentDriverLocation = new window.kakao.maps.LatLng(lat, lng);

          // 폴리라인 경로 업데이트
          setPath((prevPath) => {
            const updatedPath = [...prevPath, currentDriverLocation];
            updatePolyline(updatedPath); // 폴리라인 업데이트
            return updatedPath;
          });

          // 기사 마커 위치 업데이트
          if (driverMarker) {
            driverMarker.setPosition(currentDriverLocation);
          } else {
            const driverImage = new window.kakao.maps.MarkerImage(
              "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png",
              new window.kakao.maps.Size(24, 35)
            );

            const newDriverMarker = new window.kakao.maps.Marker({
              position: currentDriverLocation,
              map: map,
              image: driverImage,
            });
            setDriverMarker(newDriverMarker);
          }
        },
        (error) => {
          console.error("Geolocation에서 위치를 가져오는 데 실패했습니다:", error);
          setError("기사 위치를 가져오는 데 실패했습니다.");
        }
      );
    };

    const intervalId = setInterval(fetchDriverLocation, 5000); // 5초마다 위치 갱신
    return () => clearInterval(intervalId);
  };

  // 폴리라인 업데이트
  const updatePolyline = (updatedPath) => {
    if (polyline) {
      polyline.setMap(null); // 기존 폴리라인 제거
    }

    const newPolyline = new window.kakao.maps.Polyline({
      path: updatedPath,
      strokeWeight: 4, // 선 두께
      strokeColor: "#4A90E2", // 선 색상
      strokeOpacity: 0.7, // 선 투명도
      strokeStyle: "solid", // 선 스타일
    });

    newPolyline.setMap(map);
    setPolyline(newPolyline); // 새 폴리라인 설정
  };

  // 수거지 주소를 좌표로 변환 후 마커 표시
  const geocodePickupAddress = (address) => {
    if (!window.kakao || !window.kakao.maps || !map) {
      setError("지도 서비스를 초기화하는 데 실패했습니다.");
      return;
    }

    const geocoder = new window.kakao.maps.services.Geocoder();
    geocoder.addressSearch(address, (result, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);
        setPickupLocation({ lat: parseFloat(result[0].y), lng: parseFloat(result[0].x) });

        const pickupMarkerImage = new window.kakao.maps.MarkerImage(
          "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png",
          new window.kakao.maps.Size(24, 35)
        );

        if (pickupMarker) pickupMarker.setMap(null);

        const newPickupMarker = new window.kakao.maps.Marker({
          position: coords,
          map: map,
          image: pickupMarkerImage,
        });
        setPickupMarker(newPickupMarker);
      } else {
        setError("수거지 주소를 좌표로 변환할 수 없습니다.");
      }
    });
  };

  // 지도 초기화 완료 후 동작
  useEffect(() => {
    if (map) {
      updateDriverLocation();
    }
  }, [map]);

  // 컴포넌트 마운트 시 동작
  useEffect(() => {
    loadKakaoScript()
      .then(() => {
        if (isMobile) {
          setPermissionModalOpen(true);
        } else {
          requestLocationPermission();
        }
      })
      .catch((error) => setError(error.message));
  }, []);

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
        {isPermissionModalOpen && (
          <div className="permission-modal-overlay">
            <div className="permission-modal">
              <h3>위치 권한 필요</h3>
              <p>서비스를 사용하려면 위치 권한을 허용해주세요.</p>
              <button onClick={requestLocationPermission} className="retry-button">
                권한 허용
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default PickupLocation;
