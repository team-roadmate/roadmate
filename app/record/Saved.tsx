// app/record/Saved.tsx
import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { recordStyles as s } from "../css/Saved.styles";

export default function SavedScreen() {
  const router = useRouter();

  return (
    <ScrollView style={s.container} showsVerticalScrollIndicator={false}>
      {/* 헤더 */}
      <View style={s.headerRow}>
        <TouchableOpacity onPress={() => router.push("/home")}>
          <Text style={s.backText}>‹</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>저장한 코스</Text>
      </View>

      <Text style={s.subText}>저장한 코스 목록입니다:</Text>

      {/* 정렬 박스 */}
      <View style={s.sortRow}>
        <TouchableOpacity style={s.sortBox}>
          <Text style={s.sortText}>거리순</Text>
          <Text>▼</Text>
        </TouchableOpacity>
      </View>

      {/* 🔹 카드 1 */}
      <View style={s.card}>
        <View style={s.cardImage}>
          <Text style={s.imageText}>이미지</Text>
        </View>

        <View style={s.cardBody}>
          <Text style={s.courseTitle}>한강공원 힐링 코스</Text>

          <View style={s.infoRow}>
            <Text style={s.infoText}>3.8km</Text>
            <Text style={s.infoText}>45분</Text>
            <Text style={s.infoText}>쉬움</Text>
          </View>

          <View style={s.tagRow}>
            {["# 카페", "# 공원", "# 버스킹"].map((tag) => (
              <View key={tag} style={s.tagPill}>
                <Text style={s.tagText}>{tag}</Text>
              </View>
            ))}
          </View>

          <View style={s.scoreRow}>
            <Text style={s.scoreLabel}>
              별점 <Text style={s.scoreValue}>4.5</Text>
            </Text>
            <Text style={s.scoreLabel}>
              하트 <Text style={s.scoreValue}>130</Text>
            </Text>
          </View>

          <View style={s.btnRow}>
            <TouchableOpacity
              style={s.detailBtn}
              onPress={() => router.push("/record/defail_record")}
            >
              <Text style={s.detailText}>상세 보기</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={s.reviewBtn}
                onPress={() => router.push("/record/review")}
            >
              <Text style={s.reviewText}>리뷰 보기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* 🔹 카드 2 */}
      <View style={s.card}>
        <View style={s.cardImage}>
          <Text style={s.imageText}>이미지</Text>
        </View>

        <View style={s.cardBody}>
          <Text style={s.courseTitle}>이화여대 감성 산책 코스</Text>

          <View style={s.infoRow}>
            <Text style={s.infoText}>2.1km</Text>
            <Text style={s.infoText}>30분</Text>
            <Text style={s.infoText}>보통</Text>
          </View>

          <View style={s.tagRow}>
            {["# 캠퍼스", "# 사진 스팟", "# 카페"].map((tag) => (
              <View key={tag} style={s.tagPill}>
                <Text style={s.tagText}>{tag}</Text>
              </View>
            ))}
          </View>

          <View style={s.scoreRow}>
            <Text style={s.scoreLabel}>
              별점 <Text style={s.scoreValue}>4.8</Text>
            </Text>
            <Text style={s.scoreLabel}>
              하트 <Text style={s.scoreValue}>98</Text>
            </Text>
          </View>

          <View style={s.btnRow}>
            <TouchableOpacity
              style={s.detailBtn}
              onPress={() => router.push("/record/defail_record")}
            >
              <Text style={s.detailText}>상세 보기</Text>
            </TouchableOpacity>

            <TouchableOpacity style={s.reviewBtn}>
              <Text style={s.reviewText}>리뷰 보기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}