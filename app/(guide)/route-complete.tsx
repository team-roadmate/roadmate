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
import { apiClient } from "../../src/services/api";

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
  const [rating, setRating] = useState(5); // 1~5점 고정 예시

  const { distanceKmText, durationHourText, calorieText, timeRangeText } =
    useMemo(() => {
      const km = distanceM / 1000;
      const distanceKmText = `${km.toFixed(1)}km`;

      const hour = durationSec / 3600;
      const durationHourText = `${hour.toFixed(1)}h`;

      const kcal = km * 80; // 단순 계산
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
    // 일단 routeId 없어도 저장 가능하도록 (흐름 우선)
    if (!title.trim() || !review.trim()) {
      Alert.alert("알림", "제목과 코스 리뷰를 입력해 주세요.");
      return;
    }

    try {
      // 🚧 TODO: 실제 API 연동 시 수정 필요
      // routeId가 있을 때만 API 호출
      if (routeId) {
        const body = {
          title: title.trim(),
          memo: review.trim(),
          rating,
        };

        const response = await apiClient.put(
          `/routes/${routeId}/set-course`,
          body
        );

        if (response.data?.success) {
          Alert.alert("완료", "코스가 저장되었습니다.", [
            {
              text: "확인",
              onPress: () => router.replace("/(tabs)/home"),
            },
          ]);
        } else {
          console.warn("코스 저장 실패 응답:", response.data);
          Alert.alert("오류", "코스를 저장하는 중 문제가 발생했습니다.");
        }
      } else {
        // routeId 없으면 로컬 저장 또는 임시 처리
        Alert.alert("완료", "코스가 임시 저장되었습니다.", [
          {
            text: "확인",
            onPress: () => router.replace("/(tabs)/home"),
          },
        ]);
      }
    } catch (err) {
      console.warn("코스 저장 API 오류:", err);
      Alert.alert("오류", "서버 통신 중 오류가 발생했습니다.");
    }
  };

  const handleSkip = () => {
    router.replace("/(tabs)/home");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>코스 완주를 축하합니다!</Text>

      <View style={styles.imageBox}>
        <Text style={styles.imageText}>이미지</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>사진 업로드 (선택)</Text>
        <View style={styles.uploadBox}>
          <Text style={styles.uploadText}>
            사진 업로드 버튼 자리 (추후 구현)
          </Text>
        </View>
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
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
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
  imageText: {
    color: "#999",
  },
  section: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 6,
  },
  uploadBox: {
    height: 40,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#ddd",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  uploadText: {
    fontSize: 12,
    color: "#999",
  },
  timeText: {
    fontSize: 12,
    color: "#666",
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  infoLabel: {
    fontSize: 13,
    color: "#444",
  },
  infoValue: {
    fontSize: 13,
    color: "#12306B",
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 13,
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
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
  primaryButton: {
    backgroundColor: "#12306B",
    marginRight: 8,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: "#12306B",
    marginLeft: 8,
  },
  buttonTextPrimary: {
    color: "#fff",
    fontWeight: "600",
  },
  buttonTextSecondary: {
    color: "#12306B",
    fontWeight: "600",
  },
});
