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



const ROUTE_API_URL = "";

type Waypoint = {
  name: string;
  lat: number;
  lng: number;
};

type RouteGuideScreenProps = {
  route: { params?: { routeId?: number } };
  navigation: {
    replace: (name: string, params?: any) => void;
    navigate: (name: string, params?: any) => void;
  };
};

export default function RouteGuideScreen({
  route,
  navigation,
}: RouteGuideScreenProps) {
  const routeId = route?.params?.routeId ?? 1;

  const [waypoints, setWaypoints] = useState<Waypoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showEndModal, setShowEndModal] = useState(false);

  const hookLocation = useCurrentLocation();
  const fallbackLocation = useRef({ lat: 37.13, lng: 127.25 });

  // ✅ 훅 값이 없으면 fallback 사용
  const currentLocation = hookLocation ?? fallbackLocation.current;

  // 1) 경로 불러오기
  useEffect(() => {
    let cancelled = false;

    async function loadGuideRoute() {
      try {
        setLoading(true);
        const res = await fetch(`${ROUTE_API_URL}/${routeId}`);
        const data = await res.json();

        if (!cancelled) {
          setWaypoints(Array.isArray(data.waypoints) ? data.waypoints : []);
        }
      } catch (err) {
        console.warn("경로 불러오기 실패:", err);
        if (!cancelled) setWaypoints([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadGuideRoute();
    return () => {
      cancelled = true;
    };
  }, [routeId]);

  // 2) 거리 계산
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

  // 3) bearing 계산
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

  // 5) waypoint 자동 갱신 & 완주 처리
  useEffect(() => {
    if (!nextPoint || !isFinite(distanceToNext)) return;

    if (currentIndex === waypoints.length - 1) {
      if (distanceToNext <= 20) {
        // 완주 화면으로 넘어가기
        navigation.replace("CompleteCourseScreen", {
          finishedAt: Date.now(),
          finishedIndex: currentIndex,
        });
      }
      return;
    }

    if (distanceToNext <= 20) {
      setCurrentIndex((idx) => Math.min(idx + 1, waypoints.length - 1));
    }
  }, [distanceToNext, currentIndex, nextPoint, waypoints.length, navigation]);

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

      <View style={styles.mapPlaceholder} />

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
