// app/record/detail_record.tsx
import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { detailRecordStyles as s } from "../css/detail_record.styles";

export default function DetailRecord() {
  const router = useRouter();

  return (
    <ScrollView style={s.container} showsVerticalScrollIndicator={false}>
      <View style={s.headerRow}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={s.backText}>‹</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>코스 상세 보기</Text>
      </View>

      <View style={s.detailImage}>
        <Text style={s.imageText}>이미지</Text>
      </View>

      <Text style={s.title}>한강 공원 힐링 코스</Text>

      <View style={s.infoRow}>
        <Text style={s.infoText}>0.0km</Text>
        <Text style={s.infoText}>00분</Text>
        <Text style={s.infoText}>쉬움</Text>
      </View>

      <View style={s.tagRow}>
        {["# 풍경이 좋아요", "# 화장실 충분", "# 공원", "# 난이도 적절"].map(
          (tag) => (
            <View key={tag} style={s.tagPill}>
              <Text style={s.tagText}>{tag}</Text>
            </View>
          )
        )}
      </View>

      <Text style={s.sectionTitle}>주요 기반 추천 장소</Text>
      <Text style={s.placeText}>이화여자대학교</Text>
      <Text style={s.placeText}>홍대 거리</Text>
      <Text style={s.placeText}>남산 둘레길</Text>

      <TouchableOpacity style={s.startBtn}>
        <Text style={s.startText}>경로 시작</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}