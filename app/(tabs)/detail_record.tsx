// app/(tabs)/detail_record.tsx
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { api } from "../../src/services/api";
import { detailRecordStyles as s } from "./css/detail_record.styles";

type DetailData = {
  id: string;
  title: string;
  distance: string;
  duration: string;
  difficulty: string;
  tags: string[];
  places: string[];
};

const mockDetail: DetailData = {
  id: "1",
  title: "한강 공원 힐링 코스",
  distance: "3.8km",
  duration: "45분",
  difficulty: "쉬움",
  tags: ["# 풍경이 좋아요", "# 화장실 충분", "# 공원", "# 난이도 적절"],
  places: ["이화여자대학교", "홍대 거리", "남산 둘레길"],
};

export default function DetailRecord() {
  const router = useRouter();
  const { routeId } = useLocalSearchParams<{ routeId?: string }>();

  const [detail, setDetail] = useState<DetailData>(mockDetail);

  useEffect(() => {
    const loadDetail = async () => {
      if (!routeId) return;

      try {
        const res = await api.get("/api/routes/history");
        console.log("상세용 history 응답:", res.data);

        const list = Array.isArray(res.data) ? res.data : res.data?.data;
        if (Array.isArray(list) && list.length > 0) {
          const found = list.find(
            (item: any) => String(item.id ?? item.routeId) === String(routeId)
          );

          if (found) {
            const mapped: DetailData = {
              id: String(found.id ?? found.routeId),
              title: found.title ?? found.name ?? mockDetail.title,
              distance: (found.totalDistanceKm ?? found.distance ?? 0) + "km",
              duration: (found.durationMinutes ?? found.time ?? 0) + "분",
              difficulty: found.difficulty ?? mockDetail.difficulty,
              tags: found.tags ?? mockDetail.tags,
              places:
                found.places ?? found.recommendedPlaces ?? mockDetail.places,
            };
            setDetail(mapped);
            return;
          }
        }

        console.log(
          "routeId로 매칭되는 상세 코스를 찾지 못함. 목업 사용 (routeId:",
          routeId,
          ")"
        );
        // API 호출 성공했으나 데이터가 없거나 매칭되지 않은 경우, 초기값 (mockDetail) 유지
      } catch (err) {
        console.error("상세 조회 실패. 목업 사용", err);
        // API 호출 실패 시, 초기값 (mockDetail) 유지
      }
    };

    loadDetail();
  }, [routeId]);

  return (
    <ScrollView style={s.container} showsVerticalScrollIndicator={false}>
      {/* 헤더 */}
      <View style={s.headerRow}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={s.backText}>‹</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>코스 상세 보기</Text>
      </View>

      {/* 지도/경로 이미지 자리 */}
      <View style={s.detailImage}>
        <Text style={s.imageText}>경로 지도(목업)</Text>
      </View>

      {/* 제목 + 기본 정보 */}
      <Text style={s.title}>{detail.title}</Text>

      <View style={s.infoRow}>
        <Text style={s.infoText}>{detail.distance}</Text>
        <Text style={s.infoText}>{detail.duration}</Text>
        <Text style={s.infoText}>{detail.difficulty}</Text>
      </View>

      {/* 태그 */}
      <View style={s.tagRow}>
        {detail.tags.map((tag) => (
          <View key={tag} style={s.tagPill}>
            <Text style={s.tagText}>{tag}</Text>
          </View>
        ))}
      </View>

      {/* 주요 추천 장소 */}
      <Text style={s.sectionTitle}>주요 기반 추천 장소</Text>
      {detail.places.map((p) => (
        <Text key={p} style={s.placeText}>
          {p}
        </Text>
      ))}

      {/* 경로 시작 버튼 */}
      <TouchableOpacity
        style={s.startBtn}
        onPress={() => {
          console.log("경로 시작 버튼 클릭 (routeId:", detail.id, ")");
          // TODO: 나중에 temp 폴더의 실제 경로 시작 화면으로 연결
        }}
      >
        <Text style={s.startText}>경로 시작</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
