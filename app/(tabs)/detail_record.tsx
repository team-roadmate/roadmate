import RecordMapPreview from "@/src/components/RecordMapPreview";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { dataService } from "../../src/services/data.service";
import { useRouteStore } from "../../src/store/routeStore";
import { PathNode, WalkRoute } from "../../src/types/data.types";

interface DetailDisplayData {
  id: string;
  title: string;
  distance: string;
  duration: string;
  memo: string | null;
  isCourse: boolean;
  tags: string[];
  places: string[];
}

const initialDetail: DetailDisplayData = {
  id: "0",
  title: "기록을 찾을 수 없습니다",
  distance: "0.00 km",
  duration: "0 분",
  memo: "상세 기록을 불러오는 데 실패했습니다.",
  isCourse: false,
  tags: ["#데이터_없음"],
  places: [],
};

export default function DetailRecord() {
  const router = useRouter();
  const { routeId: routeIdParam } = useLocalSearchParams<{
    routeId?: string;
  }>();
  const routeId = routeIdParam ? Number(routeIdParam) : null;

  const [detail, setDetail] = useState<DetailDisplayData>(initialDetail);
  const [routeData, setRouteData] = useState<WalkRoute | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const deleteRoute = useRouteStore((state) => state.deleteRoute);
  const setCurrentPathResult = useRouteStore(
    (state) => state.setCurrentPathResult
  );
  const setLoopPathResult = useRouteStore((state) => state.setLoopPathResult);

  useEffect(() => {
    const loadDetail = async () => {
      if (!routeId) {
        setDetail(initialDetail);
        setIsLoading(false);
        setError("유효한 경로 ID가 없습니다.");
        return;
      }
      setIsLoading(true);
      setError(null);

      try {
        const response = await dataService.getRouteById(routeId);

        if (!response.success || !response.data) {
          throw new Error(response.message || "기록을 찾을 수 없습니다.");
        }

        const found: WalkRoute = response.data;
        setRouteData(found);

        const formatDateTitle = (dateString: string): string => {
          try {
            const date = new Date(dateString);
            const month = date.getMonth() + 1;
            const day = date.getDate();
            return `${month}월 ${day}일 산책`;
          } catch {
            return "산책 기록";
          }
        };

        const mapped: DetailDisplayData = {
          id: String(found.routeId),
          title: found.title || formatDateTitle(found.startTime),
          distance:
            ((found.distance || found.expectedDistance) / 1000).toFixed(2) +
            " km",
          duration:
            Math.round((found.duration || found.expectedDuration) / 60) + " 분",
          memo: found.memo,
          isCourse: found.isCourse,
          tags: found.title
            ? ["#나의_기록", `#평점_${found.rating || "N/A"}`]
            : initialDetail.tags,
          places: ["이곳은 추후 경로 데이터에서 추출 예정입니다"],
        };

        setDetail(mapped);
        setIsLoading(false);
      } catch (err: any) {
        console.error("상세 조회 실패:", err);
        setError(err.message || "기록을 불러오는 중 오류 발생.");
        setDetail(initialDetail);
        setIsLoading(false);
        setRouteData(null);
      }
    };

    loadDetail();
  }, [routeId]);

  const handleDelete = () => {
    if (!routeId) return;

    Alert.alert("기록 삭제", "정말로 이 산책 기록을 삭제하시겠습니까?", [
      { text: "취소", style: "cancel" },
      {
        text: "삭제",
        onPress: async () => {
          try {
            await deleteRoute(routeId);
            Alert.alert("삭제 완료", "기록이 성공적으로 삭제되었습니다.");
            router.back();
          } catch (e: any) {
            Alert.alert("삭제 실패", e.message || "기록 삭제 중 오류 발생");
          }
        },
        style: "destructive",
      },
    ]);
  };

  const parsePathData = (pathData: string | undefined): PathNode[] => {
    if (!pathData) return [];
    try {
      const parsedData = JSON.parse(pathData);
      if (
        Array.isArray(parsedData) &&
        parsedData.every((item) => "latitude" in item && "longitude" in item)
      ) {
        return parsedData as PathNode[];
      }
      return [];
    } catch (e) {
      console.error("PathData 파싱 실패:", e);
      return [];
    }
  };

  const pathNodes = parsePathData(routeData?.pathData);

  const handleStartRoute = () => {
    if (!routeData) {
      Alert.alert("경로 데이터 없음", "산책을 시작할 수 없습니다.");
      return;
    }

    const path = parsePathData(routeData.pathData);
    if (path.length < 2) {
      Alert.alert("경로 데이터 부족", "유효한 경로 데이터가 없습니다.");
      return;
    }

    const isOngoing = routeData.status === "STARTED";
    const routeStatus = isOngoing ? "진행 중" : "완료/취소된";
    const buttonText = isOngoing ? "재개" : "다시 시작";

    Alert.alert(
      `${routeStatus} 산책 ${buttonText}`,
      isOngoing
        ? `Route ID ${routeData.routeId}번 산책을 이어서 재개하시겠습니까?`
        : "이 경로를 사용하여 새로운 산책을 시작하시겠습니까?",
      [
        { text: "취소", style: "cancel" },
        {
          text: `${buttonText}하기`,
          onPress: () => {
            const totalDistance =
              (routeData.distance || routeData.expectedDistance) ?? 0;
            const pathResult = { totalDistance, path };

            setCurrentPathResult(pathResult);
            setLoopPathResult(null);

            // 상태 반영 후 라우트 이동 (React 상태 반영 보장)
            setTimeout(() => {
              router.push({
                pathname: "/(guide)/route-guide",
                params: {
                  routeId: isOngoing ? String(routeData.routeId) : undefined,
                  routeType: "shortest",
                },
              });
            }, 50);

            console.log(
              `[경로 시작] ${routeStatus} 경로 ${routeData.routeId}번 ${buttonText}`
            );
          },
        },
      ]
    );
  };

  const isOngoing = routeData?.status === "STARTED";
  const startButtonText = isOngoing ? "산책 재개" : "경로 다시 시작";

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>코스 상세 보기</Text>
        <TouchableOpacity onPress={handleDelete}>
          <Text style={styles.deleteText}>삭제</Text>
        </TouchableOpacity>
      </View>

      {isLoading && (
        <ActivityIndicator
          style={{ marginVertical: 40 }}
          size="large"
          color="#4CAF50"
        />
      )}
      {error && (
        <Text style={{ color: "red", textAlign: "center", marginVertical: 20 }}>
          {error}
        </Text>
      )}

      {!isLoading && !error && (
        <>
          <View style={styles.mapContainer}>
            <RecordMapPreview
              path={pathNodes}
              mapHeight={styles.detailImage.height}
            />
          </View>

          <Text style={styles.title}>{detail.title}</Text>
          <Text
            style={[styles.memoText, { color: isOngoing ? "#FF9800" : "#555" }]}
          >
            상태:{" "}
            {isOngoing
              ? "진행 중"
              : routeData?.status === "COMPLETED"
              ? "완료"
              : "취소됨"}
          </Text>
          {detail.memo && (
            <Text style={styles.memoText}>메모: {detail.memo}</Text>
          )}

          <View style={styles.infoRow}>
            <Text style={styles.infoText}>{detail.distance}</Text>
            <Text style={styles.infoText}>{detail.duration}</Text>
            <Text style={styles.infoText}>
              {detail.isCourse ? "저장된 코스" : "단일 기록"}
            </Text>
          </View>

          <View style={styles.tagRow}>
            {detail.tags.map((tag) => (
              <View key={tag} style={styles.tagPill}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.sectionTitle}>주요 기반 추천 장소</Text>
          {detail.places.map((p) => (
            <Text key={p} style={styles.placeText}>
              {p}
            </Text>
          ))}

          <TouchableOpacity style={styles.startBtn} onPress={handleStartRoute}>
            <Text style={styles.startText}>{startButtonText}</Text>
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
  backText: { fontSize: 24, marginRight: 8, color: "#14194A" },
  headerTitle: { fontSize: 24, fontWeight: "700", color: "#14194A" },
  deleteText: { fontSize: 16, color: "#D32F2F", fontWeight: "600" },
  detailImage: {
    height: 220,
    backgroundColor: "#E4E7ED",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  mapContainer: {
    height: 220,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 24,
  },
  title: { fontSize: 22, fontWeight: "700", color: "#14194A", marginBottom: 8 },
  memoText: {
    fontSize: 16,
    color: "#555",
    marginBottom: 16,
    fontStyle: "italic",
  },
  infoRow: { flexDirection: "row", gap: 20, marginBottom: 16 },
  infoText: { fontSize: 14, color: "#555" },
  tagRow: { flexDirection: "row", flexWrap: "wrap", marginBottom: 24 },
  tagPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#D5DFF2",
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: { color: "#14194A", fontSize: 12 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#14194A",
    marginBottom: 12,
  },
  placeText: { marginBottom: 12, fontSize: 15, color: "#444" },
  startBtn: {
    marginTop: 32,
    marginBottom: 32,
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#14194A",
  },
  startText: { color: "#FFF", fontSize: 16, fontWeight: "700" },
});
