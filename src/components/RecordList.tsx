// app/record/RecordList.tsx
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { recordStyles as s } from "../styles/record.styles";

export type RecordItem = {
  id: string;
  title: string;
  distance: string;
  duration: string;
  difficulty: string;
  tags: string[];
  rating: number;
  likes: number;
};

type Props = {
  screenTitle: string;
  backTo?: string; // 뒤로가기 경로 (없으면 router.back)
  sortOption?: string; // 정렬 옵션 텍스트
  showReviewBtn?: boolean; // 리뷰 버튼 표시 여부
  items: RecordItem[]; // 카드 데이터
};

export default function RecordList({
  screenTitle,
  backTo,
  sortOption = "거리순",
  showReviewBtn = true,
  items,
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

      {/* 카드 리스트 */}
      {items.map((item) => (
        <View key={item.id} style={s.card}>
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

            <View style={s.scoreRow}>
              <Text style={s.scoreLabel}>
                별점 <Text style={s.scoreValue}>{item.rating}</Text>
              </Text>
              <Text style={s.scoreLabel}>
                하트 <Text style={s.scoreValue}>{item.likes}</Text>
              </Text>
            </View>

            <View style={showReviewBtn ? s.btnRow : s.centerBtnRow}>
              <TouchableOpacity
                style={showReviewBtn ? s.detailBtn : s.bigDetailBtn}
                onPress={() => router.push("/detail_record")}
              >
                <Text style={showReviewBtn ? s.detailText : s.bigDetailText}>
                  상세 보기
                </Text>
              </TouchableOpacity>

              {showReviewBtn && (
                <TouchableOpacity
                  style={s.reviewBtn}
                  onPress={() => router.push("/review")}
                >
                  <Text style={s.reviewText}>리뷰 보기</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}
