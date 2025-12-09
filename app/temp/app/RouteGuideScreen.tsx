// app/temp/RouteGuideScreen.tsx
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";

import EndGuideModal from "../Guide/EndGuideModal";
import RouteGuideHeader from "../Guide/RouteGuideHeader";
import useCurrentLocation from "../app/hooks/useCurrentLocation";

// ─────────────────────────
// 타입 정의
// ─────────────────────────
type Waypoint = {
  name: string;
  lat: number;
  lng: number;
};

type RouteParams = {
  routeId?: string;
  endLat?: string;
  endLon?: string;
};

// ─────────────────────────
// 이 파일 안에서만 쓰는 작은 UI 컴포넌트들
// ─────────────────────────

// 화살표
type ArrowDirection = "left" | "right" | "up";
type ArrowProps = { direction: ArrowDirection };

function DirectionArrow({ direction }: ArrowProps) {
  const arrowChar =
    direction === "left" ? "←" : direction === "right" ? "→" : "↑";
  const label =
    direction === "left" ? "좌회전" : direction === "right" ? "우회전" : "직진";

  return (
    <View style={arrowStyles.container}>
      <Text style={arrowStyles.arrow}>{arrowChar}</Text>
      <Text style={arrowStyles.label}>{label}</Text>
    </View>
  );
}

// 현위치 버튼
type CurrentLocationButtonProps = { onPress?: () => void };
function CurrentLocationButton({ onPress }: CurrentLocationButtonProps) {
  return (
    <TouchableOpacity
      style={currentBtnStyles.container}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <Text style={currentBtnStyles.text}>현위치</Text>
    </TouchableOpacity>
  );
}

// 하단 바
type BottomDistanceBarProps = {
  distance: number; // m
  direction: string;
};
function BottomDistanceBar({ distance, direction }: BottomDistanceBarProps) {
  const km = distance / 1000;
  const distanceText =
    distance >= 1000 ? `${km.toFixed(1)}km` : `${distance}m`;

  return (
    <View style={bottomStyles.container}>
      <Text style={bottomStyles.distance}>{distanceText}</Text>
      <Text style={bottomStyles.direction}>{direction}</Text>
      <View style={bottomStyles.progressOuter}>
        <View style={bottomStyles.progressInner} />
      </View>
    </View>
  );
}

// ─────────────────────────
// 메인 화면 컴포넌트 (expo-router 방식)
// ─────────────────────────

export default function RouteGuideScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<RouteParams>();

  const routeIdParam = params.routeId ? Number(params.routeId) : null;
  const endLatParam = params.endLat ? Number(params.endLat) : null;
  const endLonParam = params.endLon ? Number(params.endLon) : null;
  // 지금은 endLat/endLon 안 쓰고 목업 경로 사용 중

  const [waypoints, setWaypoints] = useState<Waypoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showEndModal, setShowEndModal] = useState(false);

  const hookLocation = useCurrentLocation();
  const fallbackLocation = useRef({ lat: 37.485, lng: 126.887 }); // 구로 근처
  const currentLocation = hookLocation ?? fallbackLocation.current;

  const [walkStartTime, setWalkStartTime] = useState<number | null>(null);
  const arrivedRef = useRef(false);

  // 지도 ref (현위치 버튼용)
  const mapRef = useRef<MapView | null>(null);

  // ───────── 유틸 함수들 ─────────
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

  // 간단한 방향 텍스트 (나중에 개선 가능)
  const getDirectionText = () => {
    if (currentIndex === 0) return "직진";
    if (currentIndex === waypoints.length - 1) return "직진";
    // 목업이라 대충 번갈아가며 좌/우 줘도 됨
    return currentIndex % 2 === 0 ? "좌회전" : "우회전";
  };

  // ───────── 1) 목업 경로 생성 ─────────
  useEffect(() => {
    const baseLat = currentLocation.lat;
    const baseLng = currentLocation.lng;

    const mock: Waypoint[] = [
      { name: "출발 지점", lat: baseLat, lng: baseLng },
      { name: "경유지 1", lat: baseLat + 0.001, lng: baseLng + 0.001 },
      { name: "경유지 2", lat: baseLat + 0.002, lng: baseLng + 0.0015 },
      { name: "도착 지점", lat: baseLat + 0.003, lng: baseLng + 0.002 },
    ];

    setWaypoints(mock);
    setWalkStartTime(Date.now());
    setLoading(false);
  }, [currentLocation.lat, currentLocation.lng]);

  // 현재 목표 지점/거리
  const nextPoint = waypoints?.[currentIndex] ?? null;

  const distanceToNext = nextPoint
    ? getDistanceMeters(
        currentLocation.lat,
        currentLocation.lng,
        nextPoint.lat,
        nextPoint.lng
      )
    : Infinity;

  const directionText = getDirectionText();

  // ───────── 2) waypoint 자동 진행 & 도착 처리 ─────────
  useEffect(() => {
    if (!nextPoint || !isFinite(distanceToNext)) return;

    // 마지막 waypoint 도착
    if (currentIndex === waypoints.length - 1) {
      if (distanceToNext <= 20 && !arrivedRef.current) {
        arrivedRef.current = true;

        const now = Date.now();
        const totalDistance = Math.round(calcTotalDistance(waypoints));
        const totalDurationSec =
          walkStartTime != null ? Math.round((now - walkStartTime) / 1000) : 0;

        // 👉 완료 페이지로 교체 이동 (expo-router)
        router.replace({
          pathname: "../temp/RouteCompletePage",
          params: {
            routeId: "", // 목업이라 일단 빈값
            distance: String(totalDistance),
            duration: String(totalDurationSec),
            startedAt: walkStartTime ? String(walkStartTime) : "",
            endedAt: String(now),
          },
        });

        return;
      }
      return;
    }

    // 다음 waypoint 로 이동
    if (distanceToNext <= 20) {
      setCurrentIndex((idx) => Math.min(idx + 1, waypoints.length - 1));
    }
  }, [distanceToNext, currentIndex, nextPoint, waypoints, walkStartTime, router]);

  // 헤더 crumb 텍스트
  const headerCrumbs = waypoints.map((wp, idx) => {
    if (idx < currentIndex) return `✔ ${wp.name}`;
    if (idx === currentIndex) return `➡ ${wp.name}`;
    return wp.name;
  });

  // ───────── 로딩 ─────────
  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>경로를 준비하는 중입니다...</Text>
      </View>
    );
  }

  if (!waypoints || waypoints.length === 0) {
    return (
      <View style={styles.loading}>
        <Text style={styles.errorText}>경로 데이터가 없습니다.</Text>
      </View>
    );
  }

  // ───────── 현위치 버튼 눌렀을 때 지도 중심 이동 ─────────
  const handleRecenter = () => {
    if (!mapRef.current) return;
    mapRef.current.animateToRegion(
      {
        latitude: currentLocation.lat,
        longitude: currentLocation.lng,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      500
    );
  };

  // ───────── 실제 UI ─────────
  return (
    <View style={styles.container}>
      <RouteGuideHeader crumbs={headerCrumbs} />

      <View style={styles.mapWrapper}>
        <MapView
          ref={mapRef}
          style={StyleSheet.absoluteFillObject}
          initialRegion={{
            latitude: waypoints[0].lat,
            longitude: waypoints[0].lng,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          {waypoints.length > 1 && (
            <Polyline
              coordinates={waypoints.map((wp) => ({
                latitude: wp.lat,
                longitude: wp.lng,
              }))}
              strokeWidth={5}
            />
          )}

          {waypoints[0] && (
            <Marker
              coordinate={{
                latitude: waypoints[0].lat,
                longitude: waypoints[0].lng,
              }}
              title="출발 지점"
            />
          )}

          {waypoints[waypoints.length - 1] && (
            <Marker
              coordinate={{
                latitude: waypoints[waypoints.length - 1].lat,
                longitude: waypoints[waypoints.length - 1].lng,
              }}
              title="도착 지점"
            />
          )}

          <Marker
            coordinate={{
              latitude: currentLocation.lat,
              longitude: currentLocation.lng,
            }}
            title="현재 위치"
          />
        </MapView>

        {/* 가운데 화살표 */}
        <View style={styles.arrowWrapper}>
          <DirectionArrow
            direction={
              directionText === "좌회전"
                ? "left"
                : directionText === "우회전"
                ? "right"
                : "up"
            }
          />
        </View>

        {/* 현위치 버튼 */}
        <View style={styles.currentBtnWrapper}>
          <CurrentLocationButton onPress={handleRecenter} />
        </View>
      </View>

      <BottomDistanceBar
        distance={Math.round(distanceToNext)}
        direction={directionText}
      />

      <View style={styles.endButton}>
        <TouchableOpacity
          style={styles.endButtonInner}
          onPress={() => setShowEndModal(true)}
        >
          <Text style={styles.endButtonText}>산책 종료</Text>
        </TouchableOpacity>
      </View>

      <Modal transparent visible={showEndModal} animationType="fade">
        <EndGuideModal
          onCancel={() => setShowEndModal(false)}
          onEnd={() => {
            setShowEndModal(false);
            // 👉 expo-router로 탭 홈으로 이동
            router.replace("/(tabs)/home");
          }}
        />
      </Modal>
    </View>
  );
}

// ─────────────────────────
// 스타일들
// ─────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FB",
  },
  mapWrapper: {
    flex: 1,
    marginHorizontal: 12,
    marginTop: 8,
    marginBottom: 12,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#ddd",
  },
  arrowWrapper: {
    position: "absolute",
    bottom: 50, // 🔽 더 아래로
    alignSelf: "center",
  },
  currentBtnWrapper: {
    position: "absolute",
    right: 16,
    bottom: 20, // 🔽 더 아래로
  },
  endButton: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 4,
  },
  endButtonInner: {
    height: 48,
    borderRadius: 24,
    backgroundColor: "#12306B",
    alignItems: "center",
    justifyContent: "center",
  },
  endButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5F7FB",
    paddingHorizontal: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#555",
  },
  errorText: {
    fontSize: 15,
    color: "#333",
    textAlign: "center",
  },
});

// 화살표
const arrowStyles = StyleSheet.create({
  container: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  arrow: {
    fontSize: 26,
    fontWeight: "700",
    color: "#111",
    marginBottom: 2,
  },
  label: {
    fontSize: 11,
    color: "#666",
  },
});

// 현위치 버튼
const currentBtnStyles = StyleSheet.create({
  container: {
    minWidth: 72,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  text: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
  },
});

// 하단 바
const bottomStyles = StyleSheet.create({
  container: {
    height: 80,
    backgroundColor: "#F3F4F7",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#E0E2E8",
  },
  distance: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111",
  },
  direction: {
    marginTop: 2,
    fontSize: 13,
    color: "#666",
  },
  progressOuter: {
    marginTop: 8,
    width: "70%",
    height: 4,
    borderRadius: 2,
    backgroundColor: "#D1D4DD",
    overflow: "hidden",
  },
  progressInner: {
    width: "40%",
    height: "100%",
    backgroundColor: "#111",
  },
});
