// app/(guide)/route-complete.tsx
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { dataService } from "../../src/services/data.service";

type RouteCompleteParams = {
  routeId?: string;
  distance?: string;
  duration?: string;
  startedAt?: string;
  endedAt?: string;
};

export default function RouteCompletePage() {
  const router = useRouter();
  const params = useLocalSearchParams<RouteCompleteParams>();

  const routeId = params.routeId ? Number(params.routeId) : null;
  const distanceM = params.distance ? Number(params.distance) : 0;
  const durationSec = params.duration ? Number(params.duration) : 0;
  const startedAt = params.startedAt ? Number(params.startedAt) : null;
  const endedAt = params.endedAt ? Number(params.endedAt) : null;

  const [title, setTitle] = useState("");
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(5);

  const { distanceKmText, durationHourText, calorieText, timeRangeText } =
    useMemo(() => {
      const km = distanceM / 1000;
      const distanceKmText = `${km.toFixed(1)}km`;
      const hour = durationSec / 3600;
      const durationHourText = `${hour.toFixed(1)}h`;
      const kcal = km * 80;
      const calorieText = `${Math.round(kcal)}kcal`;

      let timeRangeText = "-";
      if (startedAt && endedAt) {
        const startDate = new Date(startedAt);
        const endDate = new Date(endedAt);
        const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
        const datePart = `${startDate.getFullYear()}.${pad(
          startDate.getMonth() + 1
        )}.${pad(startDate.getDate())}`;
        const startTime = `${pad(startDate.getHours())}:${pad(
          startDate.getMinutes()
        )}`;
        const endTime = `${pad(endDate.getHours())}:${pad(
          endDate.getMinutes()
        )}`;
        timeRangeText = `${datePart} ${startTime} ~ ${endTime}`;
      }

      return { distanceKmText, durationHourText, calorieText, timeRangeText };
    }, [distanceM, durationSec, startedAt, endedAt]);

  const handleSave = async () => {
    if (!title.trim() || !review.trim()) {
      Alert.alert("알림", "제목과 코스 리뷰를 입력해 주세요.");
      return;
    }

    if (!routeId) {
      Alert.alert("오류", "Route ID가 존재하지 않습니다.");
      return;
    }

    try {
      await dataService.setRouteAsCourse(routeId, {
        title: title.trim(),
        memo: review.trim(),
        rating,
      });
      Alert.alert("완료", "코스가 저장되었습니다.", [
        { text: "확인", onPress: () => router.replace("/(tabs)/home") },
      ]);
    } catch (err) {
      console.error("코스 저장 API 오류:", err);
      Alert.alert("오류", "코스를 저장하는 중 문제가 발생했습니다.");
    }
  };

  const handleSkip = () => router.replace("/(tabs)/home");

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={styles.container}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>코스 완주를 축하합니다!</Text>
        <View style={styles.imageBox}>
          <Text style={styles.imageText}>이미지</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.timeText}>{timeRangeText}</Text>
          <View style={styles.row}>
            <Text style={styles.infoLabel}>총 거리</Text>
            <Text style={styles.infoValue}>{distanceKmText}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.infoLabel}>소요 시간</Text>
            <Text style={styles.infoValue}>{durationHourText}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.infoLabel}>칼로리 소모량</Text>
            <Text style={styles.infoValue}>{calorieText}</Text>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>코스 기록 제목</Text>
          <TextInput
            style={styles.input}
            placeholder="텍스트를 입력해 주세요."
            value={title}
            onChangeText={setTitle}
          />
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>코스 리뷰</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="텍스트를 입력해 주세요."
            value={review}
            onChangeText={setReview}
            multiline
          />
        </View>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={handleSave}
          >
            <Text style={styles.buttonTextPrimary}>저장하기</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={handleSkip}
          >
            <Text style={styles.buttonTextSecondary}>저장 안 함</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#ffffff" },
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 36,
    paddingBottom: 24,
    justifyContent: "space-between",
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#12306B",
    marginBottom: 16,
  },
  imageBox: {
    width: "100%",
    height: 180,
    borderWidth: 1,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  imageText: { color: "#999" },
  section: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: "600", marginBottom: 6 },
  timeText: { fontSize: 12, color: "#666", marginBottom: 8 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  infoLabel: { fontSize: 13, color: "#444" },
  infoValue: { fontSize: 13, color: "#12306B", fontWeight: "600" },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 13,
  },
  textArea: { height: 140, textAlignVertical: "top" },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  button: {
    flex: 1,
    height: 44,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  primaryButton: { backgroundColor: "#12306B", marginRight: 8 },
  secondaryButton: { borderWidth: 1, borderColor: "#12306B", marginLeft: 8 },
  buttonTextPrimary: { color: "#fff", fontWeight: "600" },
  buttonTextSecondary: { color: "#12306B", fontWeight: "600" },
});
