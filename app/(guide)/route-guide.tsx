// app/(guide)/route-guide.tsx
import Slider from "@react-native-community/slider";
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

import BottomDistanceBar from "../../src/components/Guide/BottomDistanceBar";
import DirectionArrow from "../../src/components/Guide/DirectionArrow";
import EndGuideModal from "../../src/components/Guide/EndGuideModal";
import RouteGuideHeader from "../../src/components/Guide/RouteGuideHeader";
import { dataService } from "../../src/services/data.service";
import { useRouteStore } from "../../src/store/routeStore";
import { PathNode, WalkRouteCompleteRequest } from "../../src/types/data.types";

type Waypoint = { name: string; lat: number; lng: number };
type RouteParams = { routeId?: string; routeType?: string };

export default function RouteGuideScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<RouteParams>();
  const { currentPathResult, loopPathResult } = useRouteStore();

  const initialRouteId = params.routeId ?? null;
  const routeType = params.routeType || "shortest";

  const pathResult = routeType === "loop" ? loopPathResult : currentPathResult;
  const pathData = pathResult?.path;

  const [waypoints, setWaypoints] = useState<Waypoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showEndModal, setShowEndModal] = useState(false);
  const [routeId, setRouteId] = useState<string | null>(initialRouteId);

  const [simulatedLocation, setSimulatedLocation] = useState<{
    lat: number;
    lng: number;
  }>({
    lat: 37.485,
    lng: 126.887,
  });
  const [walkStartTime, setWalkStartTime] = useState<number | null>(null);
  const [speed, setSpeed] = useState(1);
  const arrivedRef = useRef(false);
  const mapRef = useRef<MapView | null>(null);

  const startedRef = useRef(false);

  const getDistanceMeters = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const toRad = (v: number) => (v * Math.PI) / 180;
    const R = 6371000;
    const φ1 = toRad(lat1);
    const φ2 = toRad(lat2);
    const Δφ = toRad(lat2 - lat1);
    const Δλ = toRad(lon2 - lon1);
    const a =
      Math.sin(Δφ / 2) ** 2 +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const calcTotalDistance = (points: Waypoint[]) => {
    if (!points || points.length < 2) return 0;
    return points.reduce((sum, p, i) => {
      if (i === points.length - 1) return sum;
      return (
        sum +
        getDistanceMeters(p.lat, p.lng, points[i + 1].lat, points[i + 1].lng)
      );
    }, 0);
  };

  // -----------------------------
  // ★ 방향 각도 계산 함수 추가
  // -----------------------------
  const getHeading = (
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ) => {
    const toRad = (x: number) => (x * Math.PI) / 180;
    const toDeg = (x: number) => (x * 180) / Math.PI;

    const dLon = toRad(lng2 - lng1);

    const y = Math.sin(dLon) * Math.cos(toRad(lat2));
    const x =
      Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
      Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(dLon);

    let brng = toDeg(Math.atan2(y, x));
    return (brng + 360) % 360;
  };

  // -------------------------------------
  // ★ 자연스러운 방향 텍스트 계산 함수
  // -------------------------------------
  const getDirectionText = () => {
    if (currentIndex === 0 || currentIndex >= waypoints.length - 1)
      return "직진";

    const prev = waypoints[currentIndex - 1];
    const current = waypoints[currentIndex];
    const next = waypoints[currentIndex + 1];

    const heading1 = getHeading(prev.lat, prev.lng, current.lat, current.lng);
    const heading2 = getHeading(current.lat, current.lng, next.lat, next.lng);

    let diff = heading2 - heading1;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;

    const THRESHOLD = 20;

    if (diff > THRESHOLD) return "우회전";
    if (diff < -THRESHOLD) return "좌회전";
    return "직진";
  };

  const startWalk = async () => {
    const distanceMeters =
      routeType === "loop" && loopPathResult?.actualDistance !== undefined
        ? loopPathResult.actualDistance * 1000
        : currentPathResult?.totalDistance;

    if (!distanceMeters || !pathData || pathData.length < 2) {
      console.error("경로 데이터가 없어 산책 시작 API를 호출할 수 없습니다.");
      return;
    }

    if (routeId) {
      console.log(
        `[산책 재개] 기존 routeId ${routeId}로 시작합니다. API 호출 스킵.`
      );
      return;
    }

    try {
      const expectedDistance = Math.round(distanceMeters);
      const expectedDuration = Math.round(expectedDistance / 1.5);
      const pathDataJson = JSON.stringify(pathData);

      const request = {
        expectedDistance: expectedDistance,
        expectedDuration: expectedDuration,
        pathData: pathDataJson,
      };

      const response = await dataService.startWalk(request);
      const actualRouteId = response?.data;

      if (typeof actualRouteId !== "number") {
        console.error("Route ID 형식 오류:", response);
        setRouteId(null);
        return;
      }

      setRouteId(String(actualRouteId));
      console.log(`[API 호출 성공] startWalk → routeId: ${actualRouteId}`);
    } catch (error) {
      console.error("산책 시작 API 오류:", error);
    }
  };

  useEffect(() => {
    if (startedRef.current) return;

    if (!pathData || pathData.length === 0) {
      const baseLat = simulatedLocation.lat;
      const baseLng = simulatedLocation.lng;
      const dummyWaypoints = [
        { name: "출발 지점", lat: baseLat, lng: baseLng },
        { name: "경유지 1", lat: baseLat + 0.001, lng: baseLng + 0.001 },
        { name: "경유지 2", lat: baseLat + 0.002, lng: baseLng + 0.0015 },
        { name: "도착 지점", lat: baseLat + 0.003, lng: baseLng + 0.002 },
      ];
      setWaypoints(dummyWaypoints);
      setSimulatedLocation({
        lat: dummyWaypoints[0].lat,
        lng: dummyWaypoints[0].lng,
      });
      setWalkStartTime(Date.now());
      setLoading(false);
      startedRef.current = true;
      return;
    }

    const waypointsMapped: Waypoint[] = pathData.map(
      (node: PathNode, idx: number) => ({
        name:
          idx === 0
            ? "출발 지점"
            : idx === pathData.length - 1
            ? "도착 지점"
            : `경유지 ${idx}`,
        lat: node.latitude,
        lng: node.longitude,
      })
    );

    setWaypoints(waypointsMapped);
    setSimulatedLocation({
      lat: waypointsMapped[0].lat,
      lng: waypointsMapped[0].lng,
    });
    setWalkStartTime(Date.now());
    setLoading(false);
    startedRef.current = true;

    startWalk();
  }, [routeType, currentPathResult, loopPathResult]);

  const finishWalk = async (
    id: string | null,
    distance: number,
    duration: number
  ) => {
    if (!id || isNaN(Number(id))) {
      console.warn("routeId가 유효하지 않음. 완료 API 스킵.");
      return;
    }

    const routeIdNumber = Number(id);

    const requestBody: WalkRouteCompleteRequest = {
      distance: Math.round(distance),
      duration: Math.round(duration),
    };

    try {
      await dataService.completeWalk(routeIdNumber, requestBody);
      console.log(
        `[API 성공] completeWalk → routeId ${routeIdNumber}, distance ${requestBody.distance}, duration ${requestBody.duration}`
      );
    } catch (error) {
      console.error("산책 완료 API 오류:", error);
    }
  };

  useEffect(() => {
    if (!waypoints || waypoints.length === 0) return;

    const interval = setInterval(() => {
      const target = waypoints[currentIndex];
      if (!target) return;

      const dist = getDistanceMeters(
        simulatedLocation.lat,
        simulatedLocation.lng,
        target.lat,
        target.lng
      );

      if (dist < 2) {
        if (currentIndex < waypoints.length - 1) {
          setCurrentIndex((idx) => idx + 1);
        } else if (!arrivedRef.current) {
          arrivedRef.current = true;
          const now = Date.now();
          const totalDistance = calcTotalDistance(waypoints);
          const totalDurationSec = walkStartTime
            ? (now - walkStartTime) / 1000
            : 0;

          finishWalk(routeId, totalDistance, totalDurationSec);

          router.replace({
            pathname: "/(guide)/route-complete",
            params: {
              routeId: routeId ?? "",
              distance: String(Math.round(totalDistance)),
              duration: String(Math.round(totalDurationSec)),
              startedAt: walkStartTime ? String(walkStartTime) : "",
              endedAt: String(now),
            },
          });
        }
        return;
      }

      const step = 0.00001 * speed;
      const latStep = target.lat > simulatedLocation.lat ? step : -step;
      const lngStep = target.lng > simulatedLocation.lng ? step : -step;

      setSimulatedLocation((loc) => ({
        lat:
          Math.abs(target.lat - loc.lat) < step
            ? target.lat
            : loc.lat + latStep,
        lng:
          Math.abs(target.lng - loc.lng) < step
            ? target.lng
            : loc.lng + lngStep,
      }));
    }, 100);

    return () => clearInterval(interval);
  }, [
    waypoints,
    currentIndex,
    simulatedLocation,
    speed,
    routeId,
    walkStartTime,
  ]);

  const nextPoint = waypoints?.[currentIndex] ?? null;
  const distanceToNext = nextPoint
    ? getDistanceMeters(
        simulatedLocation.lat,
        simulatedLocation.lng,
        nextPoint.lat,
        nextPoint.lng
      )
    : Infinity;

  const directionText = getDirectionText();

  const headerCrumbs = waypoints.map((wp, idx) =>
    idx < currentIndex
      ? `✔ ${wp.name}`
      : idx === currentIndex
      ? `➡ ${wp.name}`
      : wp.name
  );

  return loading ? (
    <View style={styles.loading}>
      <ActivityIndicator size="large" />
      <Text style={styles.loadingText}>경로를 준비하는 중입니다...</Text>
    </View>
  ) : (
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
          <Marker
            coordinate={{
              latitude: waypoints[0].lat,
              longitude: waypoints[0].lng,
            }}
            title="출발 지점"
          />
          <Marker
            coordinate={{
              latitude: waypoints[waypoints.length - 1].lat,
              longitude: waypoints[waypoints.length - 1].lng,
            }}
            title="도착 지점"
          />
          <Marker
            coordinate={{
              latitude: simulatedLocation.lat,
              longitude: simulatedLocation.lng,
            }}
            title="현재 위치"
          />
        </MapView>

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
      </View>

      <BottomDistanceBar
        distance={Math.round(distanceToNext)}
        direction={directionText}
      />

      <View style={{ paddingHorizontal: 20, paddingBottom: 20 }}>
        <Text>속도 조절: {speed.toFixed(1)}배</Text>
        <Slider
          minimumValue={0.1}
          maximumValue={100}
          value={speed}
          onValueChange={(v) => setSpeed(v)}
          step={0.1}
        />
      </View>

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
          onEnd={() => router.push("/(tabs)/home")}
        />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F7FB" },
  mapWrapper: {
    flex: 1,
    marginHorizontal: 12,
    marginTop: 8,
    marginBottom: 12,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#ddd",
  },
  arrowWrapper: { position: "absolute", bottom: 50, alignSelf: "center" },
  endButton: { paddingHorizontal: 20, paddingBottom: 20, paddingTop: 4 },
  endButtonInner: {
    height: 48,
    borderRadius: 24,
    backgroundColor: "#12306B",
    alignItems: "center",
    justifyContent: "center",
  },
  endButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5F7FB",
    paddingHorizontal: 24,
  },
  loadingText: { marginTop: 12, fontSize: 14, color: "#555" },
});
