// app/(search)/search.tsx
import Slider from "@react-native-community/slider";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouteStore } from "../../src/store/routeStore";
import { LoopEstimateResponse, PathRequest } from "../../src/types/data.types";

const NAVY = "#001A72";

const InputRow = ({ label, value, onChange, placeholder }: any) => (
  <View style={{ marginBottom: 12 }}>
    <Text>{label}</Text>
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      keyboardType="numeric"
      value={value?.toString() || ""}
      onChangeText={(v) => onChange(Number(v))}
    />
  </View>
);

const ActionButton = ({ text, onPress, style, textStyle }: any) => (
  <TouchableOpacity style={[styles.buttonBase, style]} onPress={onPress}>
    <Text style={[styles.buttonTextBase, textStyle]}>{text}</Text>
  </TouchableOpacity>
);

export default function SearchScreen() {
  const router = useRouter();
  const { searchShortestPath, estimateLoop, generateLoop } = useRouteStore();

  const [coords, setCoords] = useState<{
    startLat: number | null;
    startLon: number | null;
    endLat: number | null;
    endLon: number | null;
  }>({
    startLat: 37.499529,
    startLon: 126.867127,
    endLat: 37.544632,
    endLon: 126.88844,
  });
  const [loopEstimate, setLoopEstimate] = useState<LoopEstimateResponse | null>(
    null
  );
  const [targetDistance, setTargetDistance] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState(0);

  const fetchCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted")
        return Alert.alert("권한 필요", "현재 위치 권한이 필요합니다.");
      const loc = await Location.getCurrentPositionAsync({});
      setCoords((prev) => ({
        ...prev,
        startLat: loc.coords.latitude,
        startLon: loc.coords.longitude,
      }));
    } catch {
      Alert.alert("오류", "현재 위치를 가져오지 못했습니다.");
    }
  };

  const handleShortestSearch = async () => {
    const { startLat, startLon, endLat, endLon } = coords;
    if (!startLat || !startLon || !endLat || !endLon)
      return Alert.alert("입력 필요", "좌표를 모두 입력해주세요.");

    try {
      await searchShortestPath({
        startLat,
        startLon,
        endLat,
        endLon,
      } as PathRequest);

      const result = useRouteStore.getState().currentPathResult;
      if (result?.path?.length) {
        router.push("/(search)/path_detail");
      } else {
        Alert.alert("경로 없음", "최단 경로를 찾지 못했습니다.");
      }
    } catch (err: any) {
      Alert.alert("오류", err.message || "최단 경로 검색에 실패했습니다.");
    }
  };

  const handleLoopEstimate = async () => {
    const { startLat, startLon, endLat, endLon } = coords;
    if (!startLat || !startLon || !endLat || !endLon)
      return Alert.alert("입력 필요", "좌표를 모두 입력해주세요.");

    try {
      await estimateLoop({
        startLat,
        startLng: startLon,
        viaLat: endLat,
        viaLng: endLon,
      });
      const estimate = useRouteStore.getState().loopEstimateResult;
      if (estimate?.feasible) {
        setLoopEstimate(estimate);
        setTargetDistance(estimate.recommendedMin);
        setEstimatedTime((estimate.recommendedMin / 5) * 60);
        Alert.alert(
          "루프 준비 완료",
          estimate.message || "루프 경로 준비 완료"
        );
      } else {
        setLoopEstimate(null);
        Alert.alert(
          "루프 준비 실패",
          estimate?.message || "생성 가능성이 낮습니다."
        );
      }
    } catch (err: any) {
      Alert.alert("오류", err.message || "루프 준비 중 오류 발생");
    }
  };

  const handleLoopGenerate = async () => {
    const { startLat, startLon, endLat, endLon } = coords;
    if (!loopEstimate || targetDistance === 0)
      return Alert.alert(
        "루프 준비 필요",
        "루프 준비 후 목표 거리를 설정해주세요."
      );
    if (!startLat || !startLon || !endLat || !endLon)
      return Alert.alert("좌표 누락", "좌표를 확인해주세요.");

    try {
      await generateLoop({
        startLat,
        startLng: startLon,
        viaLat: endLat,
        viaLng: endLon,
        targetDistanceKm: targetDistance,
        tolerancePercent: 10,
      });
      const response = useRouteStore.getState().loopPathResult;
      if (response?.path?.length) {
        router.push("/(search)/loop_detail");
      } else {
        Alert.alert(
          "생성 실패",
          response?.message || "경로를 찾지 못했습니다."
        );
      }
    } catch (err: any) {
      Alert.alert("오류", err.message || "루프 경로 생성 중 오류 발생");
    }
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#FFF" }}
      contentContainerStyle={{ padding: 24 }}
    >
      <Text
        style={{
          fontSize: 26,
          fontWeight: "800",
          color: NAVY,
          marginBottom: 20,
        }}
      >
        경로 검색
      </Text>

      <InputRow
        label="출발지 위도"
        value={coords.startLat}
        onChange={(v: number) => setCoords((p) => ({ ...p, startLat: v }))}
        placeholder="위도 입력"
      />
      <InputRow
        label="출발지 경도"
        value={coords.startLon}
        onChange={(v: number) => setCoords((p) => ({ ...p, startLon: v }))}
        placeholder="경도 입력"
      />
      <ActionButton
        text="현재 위치 사용"
        onPress={fetchCurrentLocation}
        style={{ backgroundColor: "#EEE", marginTop: 10 }}
      />

      <InputRow
        label="경유지 위도"
        value={coords.endLat}
        onChange={(v: number) => setCoords((p) => ({ ...p, endLat: v }))}
        placeholder="위도 입력"
      />
      <InputRow
        label="경유지 경도"
        value={coords.endLon}
        onChange={(v: number) => setCoords((p) => ({ ...p, endLon: v }))}
        placeholder="경도 입력"
      />

      <ActionButton
        text="최단 경로 검색"
        onPress={handleShortestSearch}
        style={{ backgroundColor: NAVY, marginTop: 20 }}
        textStyle={{ color: "#FFF", fontWeight: "700" }}
      />
      <ActionButton
        text="루프 경로 준비"
        onPress={handleLoopEstimate}
        style={{ backgroundColor: "#EEE", marginTop: 10 }}
      />

      {loopEstimate && (
        <View style={{ marginTop: 20 }}>
          <Text>
            목표 거리: {targetDistance.toFixed(1)} km (
            {loopEstimate.recommendedMin.toFixed(1)} ~{" "}
            {loopEstimate.recommendedMax.toFixed(1)} km)
          </Text>
          <Slider
            minimumValue={loopEstimate.recommendedMin}
            maximumValue={loopEstimate.recommendedMax}
            step={0.1}
            value={targetDistance}
            onValueChange={(v) => {
              setTargetDistance(v);
              setEstimatedTime((v / 5) * 60);
            }}
          />
          <Text>예상 소요시간: {Math.round(estimatedTime)} 분</Text>
          <ActionButton
            text="루프 경로 탐색"
            onPress={handleLoopGenerate}
            style={{ backgroundColor: NAVY, marginTop: 10 }}
            textStyle={{ color: "#FFF", fontWeight: "700" }}
          />
        </View>
      )}
    </ScrollView>
  );
}

const styles = {
  input: {
    borderWidth: 1,
    borderColor: "#E1E4EC",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    backgroundColor: "#F9FAFC",
  },
  buttonBase: { borderRadius: 10, paddingVertical: 16, alignItems: "center" },
  buttonTextBase: { fontSize: 16, color: "#333", fontWeight: "600" },
};
