import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import Header from "../components/Header";
import "../CSS/PickupLocation.css";

const PickupLocation = () => {
  const location = useLocation();
  const { pickupId } = location.state || {};
  const js_key = process.env.REACT_APP_KAKAO_MAP_JS_KEY;

  const [map, setMap] = useState(null);
  const [pickupMarker, setPickupMarker] = useState(null);
  const [driverMarker, setDriverMarker] = useState(null);
  const [driverLocation, setDriverLocation] = useState(null);
  const [pickupLocation, setPickupLocation] = useState(null);
  const [path, setPath] = useState([]);
  const [polyline, setPolyline] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [estimatedTime, setEstimatedTime] = useState(null);
  const [isPermissionModalOpen, setPermissionModalOpen] = useState(false);

  const isMobile = /Mobi|Android/i.test(navigator.userAgent);

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

      const existingScript = document.querySelector(
        `script[src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=${js_key}&libraries=services&autoload=false"]`
      );

      if (existingScript) {
        existingScript.onload = resolve;
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

  const requestLocationPermission = () => {
    if (!navigator.geolocation) {
      setError("이 브라우저는 위치 추적을 지원하지 않습니다.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setDriverLocation({ lat: latitude, lng: longitude });
        initializeMap(latitude, longitude); // 맵 초기화
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          setError("위치 권한이 거부되었습니다.");
        } else {
          setError("위치를 가져오는 데 실패했습니다.");
        }
        setPermissionModalOpen(true); // 위치 권한 요청 모달 열기
      }
    );
  };

  const updateDriverLocation = () => {
    if (!navigator.geolocation) {
      setError("이 브라우저는 위치 추적을 지원하지 않습니다.");
      return;
    }

    navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const currentDriverLocation = {
          lat: latitude,
          lng: longitude,
        };
        setDriverLocation(currentDriverLocation);

        if (map) {
          const coords = new window.kakao.maps.LatLng(latitude, longitude);

          // 마커가 없는 경우에만 생성
          if (!driverMarker) {
            const driverImage = new window.kakao.maps.MarkerImage(
              "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png",
              new window.kakao.maps.Size(24, 35)
            );
            const newDriverMarker = new window.kakao.maps.Marker({
              position: coords,
              map: map,
              image: driverImage,
            });
            setDriverMarker(newDriverMarker);
          } else {
            // 마커가 이미 있는 경우 위치만 업데이트
            driverMarker.setPosition(coords);
          }

          if (pickupLocation) {
            calculateEstimatedTime(currentDriverLocation, pickupLocation);
            updatePolyline(coords);
          }
        }
      },
      () => {
        setError("기사 위치를 가져오는 데 실패했습니다.");
      }
    );
  };

  const updatePolyline = (newCoords) => {
    const updatedPath = [...path, newCoords];
    setPath(updatedPath);

    if (polyline) {
      polyline.setMap(null);
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

  const calculateEstimatedTime = (driverLoc, pickupLoc) => {
    if (!driverLoc || !pickupLoc) return;

    const R = 6371;
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

  const fetchPickupDetails = async () => {
    if (!pickupId || !map) return;

    const token = localStorage.getItem("token");

    try {
      setLoading(true);
      const response = await fetch(
        `http://3.37.122.192:8000/api/pickup/get-details?pickupId=${pickupId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
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

  const geocodePickupAddress = (address) => {
    if (!window.kakao || !window.kakao.maps || !map) {
      setError("지도 서비스를 초기화하는 데 실패했습니다.");
      return;
    }

    window.kakao.maps.load(() => {
      const geocoder = new window.kakao.maps.services.Geocoder();
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

          if (pickupMarker) pickupMarker.setMap(null);

          const newPickupMarker = new window.kakao.maps.Marker({
            position: coords,
            map: map,
            image: pickupMarkerImage,
          });
          setPickupMarker(newPickupMarker);
        } else {
          setError("주소를 찾을 수 없습니다.");
        }
      });
    });
  };

  useEffect(() => {
    loadKakaoScript()
      .then(() => {
        if (isMobile) {
          requestLocationPermission();
        } else {
          requestLocationPermission();
        }
      })
      .catch((error) => setError(error));
  }, []);

  useEffect(() => {
    if (map) {
      updateDriverLocation();
      fetchPickupDetails();
    }
  }, [map]);

  const handlePermissionRetry = () => {
    setPermissionModalOpen(false);
    requestLocationPermission();
  };

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

        {isPermissionModalOpen && (
          <div className="permission-modal-overlay">
            <div className="permission-modal">
              <h3>위치 권한 필요</h3>
              <p>서비스를 사용하려면 위치 권한을 허용해야 합니다.</p>
              <button onClick={handlePermissionRetry} className="retry-button">
                다시 시도
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default PickupLocation;
