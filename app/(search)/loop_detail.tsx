// app/(search)/loop_detail.tsx
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react"; // useRef 추가
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
import { LoopPathResponse } from "../../src/types/data.types";

interface LoopDetailDisplay {
  title: string;
  distance: string;
  estimatedTime: string;
  targetDistance: string;
  tolerance: string;
  withinTolerance: boolean;
  segments: {
    name: string;
    distance: string;
    nodeCount: number;
  }[];
  message: string;
}

const initialDetail: LoopDetailDisplay = {
  title: "루프 경로를 찾을 수 없습니다",
  distance: "0.00 km",
  estimatedTime: "0 분",
  targetDistance: "0.00 km",
  tolerance: "0.00 km",
  withinTolerance: false,
  segments: [],
  message: "경로 데이터를 불러오는 데 실패했습니다.",
};

export default function LoopDetail() {
  const router = useRouter();
  const { loopPathResult, isLoadingLoop } = useRouteStore();

  // MapView 참조를 위한 useRef 추가
  const mapRef = useRef<MapView>(null);

  const [detail, setDetail] = useState<LoopDetailDisplay>(initialDetail);
  const [error, setError] = useState<string | null>(null);

  // 경로 데이터 로드 및 정보 계산 로직
  useEffect(() => {
    if (isLoadingLoop) return;

    if (
      !loopPathResult ||
      !loopPathResult.path ||
      loopPathResult.path.length === 0
    ) {
      setError("유효한 루프 경로가 없습니다.");
      setDetail(initialDetail);
      return;
    }

    try {
      const loop: LoopPathResponse = loopPathResult;

      // 예상 시간 계산 (평균 시속 5km 기준)
      const estimatedMinutes = Math.round((loop.actualDistance / 5) * 60);

      const mapped: LoopDetailDisplay = {
        title: "루프 산책 경로",
        distance: `${loop.actualDistance.toFixed(2)} km`,
        estimatedTime: `${estimatedMinutes} 분`,
        targetDistance: `${loop.targetDistance.toFixed(2)} km`,
        tolerance: `${loop.tolerance.toFixed(2)} km`,
        withinTolerance: loop.withinTolerance,
        segments: [
          {
            name: `구간 1: ${loop.segment1.from} → ${loop.segment1.to}`,
            distance: `${loop.segment1.distance.toFixed(2)} km`,
            nodeCount: loop.segment1.nodeCount,
          },
          {
            name: `구간 2: ${loop.segment2.from} → ${loop.segment2.to}`,
            distance: `${loop.segment2.distance.toFixed(2)} km`,
            nodeCount: loop.segment2.nodeCount,
          },
          {
            name: `구간 3: ${loop.segment3.from} → ${loop.segment3.to}`,
            distance: `${loop.segment3.distance.toFixed(2)} km`,
            nodeCount: loop.segment3.nodeCount,
          },
          {
            name: `구간 4: ${loop.segment4.from} → ${loop.segment4.to}`,
            distance: `${loop.segment4.distance.toFixed(2)} km`,
            nodeCount: loop.segment4.nodeCount,
          },
        ],
        message: loop.message,
      };

      setDetail(mapped);
      setError(null);
    } catch (err: any) {
      console.error("루프 경로 표시 실패:", err);
      setError(err.message || "경로를 표시하는 중 오류 발생.");
      setDetail(initialDetail);
    }
  }, [loopPathResult, isLoadingLoop]);

  // 경로 전체를 보여주기 위해 맵 영역을 조정하는 함수 (추가됨)
  const fitPathToMap = () => {
    if (mapRef.current && loopPathResult?.path?.length) {
      const coordinates = loopPathResult.path.map((node) => ({
        latitude: node.latitude,
        longitude: node.longitude,
      }));

      // 모든 좌표를 포함하도록 지도 영역 조정 (여백 50 픽셀 추가)
      mapRef.current.fitToCoordinates(coordinates, {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true,
      });
    }
  };

  const handleStartWalk = () => {
    if (
      !loopPathResult ||
      !loopPathResult.path ||
      loopPathResult.path.length === 0
    ) {
      Alert.alert("오류", "시작할 경로가 없습니다.");
      return;
    }

    // TODO: 실제 산책 시작 화면으로 이동 (경로 데이터 전달)
    Alert.alert("산책 시작", "루프 경로로 산책을 시작하시겠습니까?", [
      { text: "취소", style: "cancel" },
      {
        text: "시작",
        onPress: () => {
          console.log("루프 산책 시작:", loopPathResult);
          // router.push("/walk_start") 등으로 이동
        },
      },
    ]);
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
        <Text style={styles.headerTitle}>루프 경로 상세</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* 로딩 및 에러 처리 */}
      {isLoadingLoop && (
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
      {!isLoadingLoop && !error && (
        <>
          {/* 지도/경로 표시 */}
          <View style={styles.mapContainer}>
            {loopPathResult?.path && loopPathResult.path.length > 0 ? (
              <MapView
                ref={mapRef} // mapRef 연결
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                initialRegion={{
                  // 초기 영역은 임시로 첫 노드를 사용
                  latitude: loopPathResult.path[0].latitude,
                  longitude: loopPathResult.path[0].longitude,
                  latitudeDelta: 0.02,
                  longitudeDelta: 0.02,
                }}
                // 지도가 로드되면 fitPathToMap 호출
                onLayout={fitPathToMap}
                onMapReady={fitPathToMap}
              >
                {/* 경로 선 (눈에 잘 띄도록 스타일 적용) */}
                <Polyline
                  coordinates={loopPathResult.path.map((node) => ({
                    latitude: node.latitude,
                    longitude: node.longitude,
                  }))}
                  strokeColor="#FF0000" // 루프 경로: 밝은 빨간색
                  strokeWidth={6} // 두께 6
                  zIndex={1} // 기본 zIndex
                />

                {/* 시작점 = 종료점 마커 */}
                <Marker
                  coordinate={{
                    latitude: loopPathResult.path[0].latitude,
                    longitude: loopPathResult.path[0].longitude,
                  }}
                  title="시작/종료 지점"
                  pinColor="green"
                />

                {/* 중간 지점 마커 (경로의 중간쯤) */}
                {loopPathResult.path.length > 2 && (
                  <Marker
                    coordinate={{
                      latitude:
                        loopPathResult.path[
                          Math.floor(loopPathResult.path.length / 2)
                        ].latitude,
                      longitude:
                        loopPathResult.path[
                          Math.floor(loopPathResult.path.length / 2)
                        ].longitude,
                    }}
                    title="중간 경유지"
                    pinColor="blue"
                  />
                )}
              </MapView>
            ) : (
              <View style={styles.mapPlaceholder}>
                <Text style={styles.imageText}>경로 데이터 없음</Text>
              </View>
            )}
          </View>

          {/* 제목 + 기본 정보 */}
          <Text style={styles.title}>{detail.title}</Text>

          {detail.message && (
            <View style={styles.messageContainer}>
              <Text style={styles.messageText}>{detail.message}</Text>
            </View>
          )}

          <View style={styles.infoRow}>
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>실제 거리</Text>
              <Text style={styles.infoValue}>{detail.distance}</Text>
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>예상 시간</Text>
              <Text style={styles.infoValue}>{detail.estimatedTime}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>목표 거리</Text>
              <Text style={styles.infoValue}>{detail.targetDistance}</Text>
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>허용 오차</Text>
              <Text style={styles.infoValue}>{detail.tolerance}</Text>
            </View>
          </View>

          {/* 정확도 표시 */}
          <View
            style={[
              styles.accuracyBadge,
              detail.withinTolerance
                ? styles.accuracyGood
                : styles.accuracyWarning,
            ]}
          >
            <Text style={styles.accuracyText}>
              {detail.withinTolerance
                ? "✓ 목표 거리 허용 범위 내"
                : "⚠ 목표 거리 범위 초과"}
            </Text>
          </View>

          {/* 구간 정보 */}
          <Text style={styles.sectionTitle}>구간별 상세 정보</Text>
          {detail.segments.map((segment, index) => (
            <View key={index} style={styles.segmentCard}>
              <Text style={styles.segmentName}>{segment.name}</Text>
              <View style={styles.segmentInfo}>
                <Text style={styles.segmentText}>거리: {segment.distance}</Text>
                <Text style={styles.segmentText}>
                  노드: {segment.nodeCount}개
                </Text>
              </View>
            </View>
          ))}

          {/* 경로 시작 버튼 */}
          <TouchableOpacity style={styles.startBtn} onPress={handleStartWalk}>
            <Text style={styles.startText}>루프 경로 시작하기</Text>
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
  detailImage: {
    height: 220,
    backgroundColor: "#E4E7ED",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
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
  imageSubText: {
    color: "#999",
    fontSize: 14,
    marginTop: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#14194A",
    marginBottom: 16,
  },
  messageContainer: {
    backgroundColor: "#F0F4FF",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#001A72",
  },
  messageText: {
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
  accuracyBadge: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 24,
    alignItems: "center",
  },
  accuracyGood: {
    backgroundColor: "#E8F5E9",
  },
  accuracyWarning: {
    backgroundColor: "#FFF3E0",
  },
  accuracyText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#14194A",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#14194A",
    marginBottom: 12,
  },
  segmentCard: {
    backgroundColor: "#F9FAFC",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E1E4EC",
  },
  segmentName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#14194A",
    marginBottom: 8,
  },
  segmentInfo: {
    flexDirection: "row",
    gap: 16,
  },
  segmentText: {
    fontSize: 13,
    color: "#666",
  },
  startBtn: {
    marginTop: 32,
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
