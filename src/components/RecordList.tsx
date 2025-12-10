// src/components/RecordList.tsx
import { useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { recordStyles as s } from "../styles/record.styles";

export type RecordItem = {
  id: string;
  title: string;
  distance: string;
  duration: string;
  difficulty: string;
  tags: string[];
  rating: number;
  // ❌ likes 제거됨
};

type Props = {
  screenTitle: string;
  backTo?: string;
  sortOption?: string;
  items: RecordItem[];
  isLoading?: boolean;
};

export default function RecordList({
  screenTitle,
  backTo,
  sortOption = "거리순",
  items,
  isLoading = false,
}: Props) {
  const router = useRouter();

  return (
    <ScrollView style={s.container} showsVerticalScrollIndicator={false}>
      {/* 헤더 */}
      <View style={s.headerRow}>
        <TouchableOpacity
          onPress={() => (backTo ? router.push(backTo) : router.back())}
        >
          <Text style={s.backText}>‹</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>{screenTitle}</Text>
      </View>

      <Text style={s.subText}>
        {screenTitle === "저장한 코스"
          ? "저장한 코스 목록입니다:"
          : `총 ${items.length}개의 코스가 검색되었습니다:`}
      </Text>

      {/* 정렬 박스 */}
      <View style={s.sortRow}>
        <TouchableOpacity style={s.sortBox}>
          <Text style={s.sortText}>{sortOption}</Text>
          <Text>▼</Text>
        </TouchableOpacity>
      </View>

      {/* 로딩 상태 */}
      {isLoading && (
        <View style={{ paddingVertical: 40, alignItems: "center" }}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={{ marginTop: 16, color: "#666" }}>로딩 중...</Text>
        </View>
      )}

      {/* 빈 상태 */}
      {!isLoading && items.length === 0 && (
        <View style={{ paddingVertical: 40, alignItems: "center" }}>
          <Text style={{ fontSize: 16, color: "#999" }}>
            {screenTitle === "저장한 코스"
              ? "저장된 코스가 없습니다."
              : "기록이 없습니다."}
          </Text>
        </View>
      )}

      {/* 카드 리스트 */}
      {!isLoading &&
        items.map((item) => (
          <View key={item.id} style={s.card}>
            {/* 이미지 영역 */}
            <View style={s.cardImage}>
              <Text style={s.imageText}>이미지</Text>
            </View>

            <View style={s.cardBody}>
              <Text style={s.courseTitle}>{item.title}</Text>

              <View style={s.infoRow}>
                <Text style={s.infoText}>{item.distance}</Text>
                <Text style={s.infoText}>{item.duration}</Text>
                <Text style={s.infoText}>{item.difficulty}</Text>
              </View>

              <View style={s.tagRow}>
                {item.tags.map((tag) => (
                  <View key={tag} style={s.tagPill}>
                    <Text style={s.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>

              {/* ⭐ 별점만 남김 */}
              <View style={[s.scoreRow, { justifyContent: "flex-start" }]}>
                <Text style={s.scoreLabel}>
                  별점 <Text style={s.scoreValue}>{item.rating}</Text>
                </Text>
              </View>

              {/* 버튼: 리뷰 버튼 제거 → 상세보기 하나만 */}
              <View style={s.centerBtnRow}>
                <TouchableOpacity
                  style={s.bigDetailBtn}
                  onPress={() =>
                    router.push({
                      pathname: "/detail_record",
                      params: { routeId: item.id },
                    })
                  }
                >
                  <Text style={s.bigDetailText}>상세 보기</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
    </ScrollView>
  );
}
