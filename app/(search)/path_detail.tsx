// app/(search)/path_detail.tsx
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import { useRouteStore } from "../../src/store/routeStore";
import { PathResult } from "../../src/types/data.types";

interface PathDetailDisplay {
  title: string;
  distance: string;
  estimatedTime: string;
  nodeCount: number;
  averageSpeed: string;
}

const initialDetail: PathDetailDisplay = {
  title: "최단 경로를 찾을 수 없습니다",
  distance: "0.00 km",
  estimatedTime: "0 분",
  nodeCount: 0,
  averageSpeed: "5.0 km/h",
};

export default function PathDetail() {
  const router = useRouter();
  const { currentPathResult, isLoadingPath } = useRouteStore();

  const mapRef = useRef<MapView>(null);

  const [detail, setDetail] = useState<PathDetailDisplay>(initialDetail);
  const [error, setError] = useState<string | null>(null);

  // 경로 데이터 로드 및 정보 계산 로직
  useEffect(() => {
    if (isLoadingPath) return;

    if (
      !currentPathResult ||
      !currentPathResult.path ||
      currentPathResult.path.length === 0
    ) {
      setError("유효한 경로가 없습니다.");
      setDetail(initialDetail);
      return;
    }

    try {
      const path: PathResult = currentPathResult;

      const distanceKm = path.totalDistance / 1000;
      const estimatedMinutes = Math.round((distanceKm / 5) * 60);

      const mapped: PathDetailDisplay = {
        title: "최단 경로",
        distance: `${distanceKm.toFixed(2)} km`,
        estimatedTime: `${estimatedMinutes} 분`,
        nodeCount: path.path.length,
        averageSpeed: "5.0 km/h",
      };

      setDetail(mapped);
      setError(null);
    } catch (err: any) {
      console.error("경로 표시 실패:", err);
      setError(err.message || "경로를 표시하는 중 오류 발생.");
      setDetail(initialDetail);
    }
  }, [currentPathResult, isLoadingPath]);

  const fitPathToMap = () => {
    if (mapRef.current && currentPathResult?.path?.length) {
      const coordinates = currentPathResult.path.map((node) => ({
        latitude: node.latitude,
        longitude: node.longitude,
      }));

      mapRef.current.fitToCoordinates(coordinates, {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true,
      });
    }
  };

  // 산책 시작 버튼 핸들러 - route-guide로 이동
  const handleStartWalk = () => {
    if (
      !currentPathResult ||
      !currentPathResult.path ||
      currentPathResult.path.length === 0
    ) {
      Alert.alert("오류", "시작할 경로가 없습니다.");
      return;
    }

    // route-guide로 이동 (최단 경로)
    router.push({
      pathname: "/(guide)/route-guide",
      params: {
        routeType: "shortest",
      },
    });
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      {/* 헤더 */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>최단 경로 상세</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* 로딩 및 에러 처리 */}
      {isLoadingPath && (
        <ActivityIndicator
          style={{ marginVertical: 40 }}
          size="large"
          color="#001A72"
        />
      )}

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => router.back()}
          >
            <Text style={styles.retryText}>다시 검색하기</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* 데이터 표시 */}
      {!isLoadingPath && !error && (
        <>
          {/* 지도/경로 표시 */}
          <View style={styles.mapContainer}>
            {currentPathResult?.path && currentPathResult.path.length > 0 ? (
              <MapView
                ref={mapRef}
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                initialRegion={{
                  latitude: currentPathResult.path[0].latitude,
                  longitude: currentPathResult.path[0].longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
                onLayout={fitPathToMap}
                onMapReady={fitPathToMap}
              >
                <Polyline
                  coordinates={currentPathResult.path.map((node) => ({
                    latitude: node.latitude,
                    longitude: node.longitude,
                  }))}
                  strokeColor="#00FF00"
                  strokeWidth={6}
                  zIndex={2}
                />

                <Marker
                  coordinate={{
                    latitude: currentPathResult.path[0].latitude,
                    longitude: currentPathResult.path[0].longitude,
                  }}
                  title="출발지"
                  pinColor="green"
                />

                <Marker
                  coordinate={{
                    latitude:
                      currentPathResult.path[currentPathResult.path.length - 1]
                        .latitude,
                    longitude:
                      currentPathResult.path[currentPathResult.path.length - 1]
                        .longitude,
                  }}
                  title="도착지"
                  pinColor="red"
                />
              </MapView>
            ) : (
              <View style={styles.mapPlaceholder}>
                <Text style={styles.imageText}>경로 데이터 없음</Text>
              </View>
            )}
          </View>

          <Text style={styles.title}>{detail.title}</Text>

          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionText}>
              출발지에서 목적지까지의 최단 거리 경로입니다.
            </Text>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>총 거리</Text>
              <Text style={styles.infoValue}>{detail.distance}</Text>
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>예상 시간</Text>
              <Text style={styles.infoValue}>{detail.estimatedTime}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>경로 노드</Text>
              <Text style={styles.infoValue}>{detail.nodeCount}개</Text>
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>평균 속도</Text>
              <Text style={styles.infoValue}>{detail.averageSpeed}</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>경로 특징</Text>
          <View style={styles.featureCard}>
            <View style={styles.featureItem}>
              <Text style={styles.featureBullet}>•</Text>
              <Text style={styles.featureText}>
                최단 거리로 목적지까지 안내합니다
              </Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureBullet}>•</Text>
              <Text style={styles.featureText}>
                도로 및 보행자 경로를 고려한 실제 경로입니다
              </Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureBullet}>•</Text>
              <Text style={styles.featureText}>
                평균 보행 속도 {detail.averageSpeed} 기준으로 계산됩니다
              </Text>
            </View>
          </View>

          <View style={styles.noticeContainer}>
            <Text style={styles.noticeTitle}>💡 산책 팁</Text>
            <Text style={styles.noticeText}>
              • 출발 전 날씨를 확인하세요{"\n"}• 편한 신발을 착용하세요{"\n"}•
              충분한 수분을 준비하세요
            </Text>
          </View>

          <TouchableOpacity style={styles.startBtn} onPress={handleStartWalk}>
            <Text style={styles.startText}>경로 시작하기</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 24,
    paddingTop: 56,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    justifyContent: "space-between",
  },
  backText: {
    fontSize: 24,
    color: "#14194A",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#14194A",
  },
  mapContainer: {
    height: 300,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#E1E4EC",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: "#E4E7ED",
    justifyContent: "center",
    alignItems: "center",
  },
  imageText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "600",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#14194A",
    marginBottom: 12,
  },
  descriptionContainer: {
    backgroundColor: "#F0F4FF",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#001A72",
  },
  descriptionText: {
    fontSize: 14,
    color: "#001A72",
    lineHeight: 20,
  },
  infoRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  infoCard: {
    flex: 1,
    backgroundColor: "#F9FAFC",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E1E4EC",
  },
  infoLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#14194A",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#14194A",
    marginTop: 12,
    marginBottom: 12,
  },
  featureCard: {
    backgroundColor: "#F9FAFC",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E1E4EC",
  },
  featureItem: {
    flexDirection: "row",
    marginBottom: 8,
    alignItems: "flex-start",
  },
  featureBullet: {
    fontSize: 16,
    color: "#001A72",
    marginRight: 8,
    fontWeight: "700",
  },
  featureText: {
    flex: 1,
    fontSize: 14,
    color: "#444",
    lineHeight: 20,
  },
  noticeContainer: {
    backgroundColor: "#FFFBF0",
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#FFE7A3",
  },
  noticeTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#14194A",
    marginBottom: 8,
  },
  noticeText: {
    fontSize: 13,
    color: "#666",
    lineHeight: 20,
  },
  startBtn: {
    marginTop: 8,
    marginBottom: 32,
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#001A72",
  },
  startText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
  },
  errorContainer: {
    alignItems: "center",
    marginVertical: 40,
  },
  errorText: {
    color: "#D32F2F",
    textAlign: "center",
    fontSize: 16,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#001A72",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "600",
  },
});
