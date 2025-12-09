// screens/RouteGuideScreen.tsx
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import BottomDistanceBar from "../Guide/BottomDistanceBar";
import CurrentLocationButton from "../Guide/CurrentLocationButton";
import DirectionArrow from "../Guide/DirectionArrow";
import EndGuideModal from "../Guide/EndGuideModal";
import LocationTooltip from "../Guide/LocationTooltip";
import RouteGuideHeader from "../Guide/RouteGuideHeader";

import useCurrentLocation from "../app/hooks/useCurrentLocation";

const API_BASE_URL = "http://rmate.kro.kr:4080";

type Waypoint = {
  name: string;
  lat: number;
  lng: number;
};

type RouteGuideScreenProps = {
  route: { params?: { routeId?: number; endLat?: number; endLon?: number } };
  navigation: {
    replace: (name: string, params?: any) => void;
    navigate: (name: string, params?: any) => void;
  };
};

export default function RouteGuideScreen({
  route,
  navigation,
}: RouteGuideScreenProps) {
  const routeIdParam = route?.params?.routeId ?? 1;
  const endLatParam = route?.params?.endLat;
  const endLonParam = route?.params?.endLon;

  const [waypoints, setWaypoints] = useState<Waypoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showEndModal, setShowEndModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // 백엔드에서 발급한 routeId / 시작 시간 / 예상 거리
  const [startedRouteId, setStartedRouteId] = useState<number | null>(null);
  const [walkStartTime, setWalkStartTime] = useState<number | null>(null);
  const [expectedDistance, setExpectedDistance] = useState<number>(0);

  const hookLocation = useCurrentLocation();
  const fallbackLocation = useRef({ lat: 37.13, lng: 127.25 });
  const currentLocation = hookLocation ?? fallbackLocation.current;

  const arrivedRef = useRef(false);

  const getDistanceMeters = (
    lat1: number | null,
    lon1: number | null,
    lat2: number | null,
    lon2: number | null
  ) => {
    if (lat1 == null || lon1 == null || lat2 == null || lon2 == null)
      return Infinity;

    const toRad = (v: number) => (v * Math.PI) / 180;
    const R = 6371000;
    const φ1 = toRad(lat1);
    const φ2 = toRad(lat2);
    const Δφ = toRad(lat2 - lat1);
    const Δλ = toRad(lon2 - lon1);

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  const getBearing = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const toRad = (v: number) => (v * Math.PI) / 180;
    const toDeg = (v: number) => (v * 180) / Math.PI;

    const φ1 = toRad(lat1);
    const φ2 = toRad(lat2);
    const λ1 = toRad(lon1);
    const λ2 = toRad(lon2);

    const y = Math.sin(λ2 - λ1) * Math.cos(φ2);
    const x =
      Math.cos(φ1) * Math.sin(φ2) -
      Math.sin(φ1) * Math.cos(φ2) * Math.cos(λ2 - λ1);

    return (toDeg(Math.atan2(y, x)) + 360) % 360;
  };

  const convertBearingToText = (bearing: number) => {
    if (bearing > 45 && bearing <= 135) return "우회전";
    if (bearing > 225 && bearing <= 315) return "좌회전";
    return "직진";
  };

  const calcTotalDistance = (points: Waypoint[]) => {
    if (!points || points.length < 2) return 0;
    let sum = 0;
    for (let i = 0; i < points.length - 1; i++) {
      sum += getDistanceMeters(
        points[i].lat,
        points[i].lng,
        points[i + 1].lat,
        points[i + 1].lng
      );
    }
    return sum;
  };

  // 1) 최단 경로 가져오기 (현재 위치 → params 로 받은 목적지)
  useEffect(() => {
    let cancelled = false;

    async function loadShortestPath() {
      try {
        // 목적지 좌표가 없으면 에러 처리
        if (endLatParam == null || endLonParam == null) {
          setErrorMsg("목적지 정보가 없어 경로를 불러올 수 없습니다.");
          setWaypoints([]);
          setLoading(false);
          return;
        }

        setLoading(true);
        setErrorMsg(null);

        const startLat = currentLocation.lat;
        const startLon = currentLocation.lng;
        const endLat = endLatParam;
        const endLon = endLonParam;

        const qs = new URLSearchParams({
          startLat: String(startLat),
          startLon: String(startLon),
          endLat: String(endLat),
          endLon: String(endLon),
        }).toString();

        const res = await fetch(
          `${API_BASE_URL}/api/path/shortest?${qs}`
        );
        const data = await res.json();

        if (cancelled) return;

        const path: { latitude: number; longitude: number }[] = data.path ?? [];

        const converted: Waypoint[] = path.map((p, idx) => ({
          name:
            idx === 0
              ? "출발 지점"
              : idx === path.length - 1
              ? "도착 지점"
              : `경유지 ${idx}`,
          lat: p.latitude,
          lng: p.longitude,
        }));

        setWaypoints(converted);

        const total = data.totalDistance ?? calcTotalDistance(converted);
        setExpectedDistance(total);
      } catch (err) {
        console.warn("최단 경로 불러오기 실패:", err);
        if (!cancelled) {
          setErrorMsg("경로를 불러오는 중 오류가 발생했습니다.");
          setWaypoints([]);
          setExpectedDistance(0);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadShortestPath();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeIdParam, currentLocation.lat, currentLocation.lng, endLatParam, endLonParam]);

  // 2) 경로 준비 후 한 번만 산책 시작 API 호출 (POST /api/routes/start)
  useEffect(() => {
    if (loading) return;
    if (!waypoints || waypoints.length === 0) return;
    if (startedRouteId !== null) return;

    async function startWalk() {
      try {
        const distance = expectedDistance || calcTotalDistance(waypoints);
        const walkingSpeed = 1.4; // m/s (약 5km/h)
        const expectedDurationSec = Math.round(distance / walkingSpeed);

        const body = {
          expectedDistance: Math.round(distance),
          expectedDuration: expectedDurationSec,
          pathData: JSON.stringify(waypoints),
        };

        const res = await fetch(`${API_BASE_URL}/api/routes/start`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        const json = await res.json();

        if (json && json.success) {
          // data 에 routeId 가 들어있다고 가정
          setStartedRouteId(json.data);
          setWalkStartTime(Date.now());
        } else {
          console.warn("산책 시작 실패 응답:", json);
        }
      } catch (err) {
        console.warn("산책 시작 API 호출 실패:", err);
      }
    }

    startWalk();
  }, [loading, waypoints, expectedDistance, startedRouteId]);

  // 3) 실제 완료 API (목적지 도착 시에만 사용)
  const completeWalk = async () => {
    if (startedRouteId == null || walkStartTime == null) return;

    const now = Date.now();
    const durationSec = Math.round((now - walkStartTime) / 1000);
    const distanceMeters = Math.round(
      expectedDistance || calcTotalDistance(waypoints)
    );

    try {
      const body = {
        distance: distanceMeters,
        duration: durationSec,
      };

      const res = await fetch(
        `${API_BASE_URL}/api/routes/${startedRouteId}/complete`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      const json = await res.json();
      if (!json?.success) {
        console.warn("산책 완료 응답 에러:", json);
      }
    } catch (err) {
      console.warn("산책 완료 API 호출 실패:", err);
    }
  };

  const nextPoint = waypoints?.[currentIndex] ?? null;

  const distanceToNext = nextPoint
    ? getDistanceMeters(
        currentLocation.lat,
        currentLocation.lng,
        nextPoint.lat,
        nextPoint.lng
      )
    : Infinity;

  const bearingToNext = nextPoint
    ? getBearing(
        currentLocation.lat,
        currentLocation.lng,
        nextPoint.lat,
        nextPoint.lng
      )
    : 0;

  const directionText = convertBearingToText(bearingToNext);

  // 4) waypoint 자동 진행 & 최종 도착 시 complete + EndPage 이동
  useEffect(() => {
    if (!nextPoint || !isFinite(distanceToNext)) return;

    // 도착 판정 useEffect 안에서, 마지막 waypoint 이고 20m 이내일 때:
if (currentIndex === waypoints.length - 1) {
  if (distanceToNext <= 20 && !arrivedRef.current) {
    arrivedRef.current = true;

    const now = Date.now();
    const totalDistance = Math.round(
      expectedDistance || calcTotalDistance(waypoints)
    );
    const totalDurationSec =
      walkStartTime != null ? Math.round((now - walkStartTime) / 1000) : 0;

    (async () => {
      await completeWalk(); // 산책 완료 API 호출 (distance/duration 같이 보냄)

      navigation.replace("RouteCompletePage", {
        routeId: startedRouteId,
        distance: totalDistance,      // m 단위
        duration: totalDurationSec,   // 초 단위
        startedAt: walkStartTime,     // timestamp
        endedAt: now,                 // timestamp
      });
    })();
  }
  return;
}

    // 다음 포인트로 자동 진행
    if (distanceToNext <= 20) {
      setCurrentIndex((idx) => Math.min(idx + 1, waypoints.length - 1));
    }
  }, [
    distanceToNext,
    currentIndex,
    nextPoint,
    waypoints.length,
    navigation,
    startedRouteId,
    expectedDistance,
    waypoints,
  ]);

  const headerCrumbs = waypoints.map((wp, idx) => {
    if (idx < currentIndex) return `✔ ${wp.name}`;
    if (idx === currentIndex) return `➡ ${wp.name}`;
    return wp.name;
  });

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (errorMsg) {
    return (
      <View style={styles.loading}>
        <Text>{errorMsg}</Text>
      </View>
    );
  }

  if (!waypoints || waypoints.length === 0) {
    return (
      <View style={styles.loading}>
        <Text>경로 데이터가 없습니다.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <RouteGuideHeader crumbs={headerCrumbs} />

      <View style={styles.mapPlaceholder}>
  <MapView
    style={{ flex: 1 }}
    initialRegion={{
      latitude: waypoints[0]?.lat ?? currentLocation.lat,
      longitude: waypoints[0]?.lng ?? currentLocation.lng,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    }}
    region={{
      latitude: currentLocation.lat,
      longitude: currentLocation.lng,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    }}
  >
    {/* 1) 경로 라인 (PolyLine) */}
    {waypoints.length > 1 && (
      <Polyline
        coordinates={waypoints.map((wp) => ({
          latitude: wp.lat,
          longitude: wp.lng,
        }))}
        strokeWidth={4}
      />
    )}

    {/* 2) 출발 지점 마커 */}
    {waypoints[0] && (
      <Marker
        coordinate={{
          latitude: waypoints[0].lat,
          longitude: waypoints[0].lng,
        }}
        title="출발 지점"
        pinColor="green"
      />
    )}

    {/* 3) 도착 지점 마커 */}
    {waypoints[waypoints.length - 1] && (
      <Marker
        coordinate={{
          latitude: waypoints[waypoints.length - 1].lat,
          longitude: waypoints[waypoints.length - 1].lng,
        }}
        title="도착 지점"
        pinColor="red"
      />
    )}

    {/* 4) 현재 위치 마커 */}
    <Marker
      coordinate={{
        latitude: currentLocation.lat,
        longitude: currentLocation.lng,
      }}
      title="현재 위치"
    />
  </MapView>
</View>


      {nextPoint && (
        <LocationTooltip
          name={nextPoint.name}
          sub={`${Math.round(distanceToNext)}m 남음`}
        />
      )}

      <DirectionArrow
        direction={
          directionText === "좌회전"
            ? "left"
            : directionText === "우회전"
            ? "right"
            : "up"
        }
      />

      <BottomDistanceBar
        distance={Math.round(distanceToNext)}
        direction={directionText}
      />

      <CurrentLocationButton />

      <View style={styles.endButton}>
        <TouchableOpacity onPress={() => setShowEndModal(true)}>
          <Text>종료</Text>
        </TouchableOpacity>
      </View>

      {/* 여기서 "종료"는 중간 종료: complete 호출 X, 바로 Home으로 */}
      <Modal transparent visible={showEndModal} animationType="fade">
        <EndGuideModal
          onCancel={() => setShowEndModal(false)}
          onEnd={() => {
            setShowEndModal(false);
            navigation.navigate("Home");
          }}
        />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: "#eee",
    marginHorizontal: 12,
    borderRadius: 8,
  },
  endButton: {
    position: "absolute",
    bottom: 40,
    right: 20,
  },
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
