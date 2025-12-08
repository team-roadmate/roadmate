// app/record/review.tsx
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { reviewStyles as s } from "./css/review.styles";

export default function ReviewScreen() {
  const router = useRouter();
  const [pickedImage, setPickedImage] = useState<string | null>(null);
  const [reviewText, setReviewText] = useState("");

  const handleImagePick = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!res.canceled) {
      setPickedImage(res.assets[0].uri);
    }
  };

  return (
    <ScrollView style={s.container} showsVerticalScrollIndicator={false}>
      {/* 헤더 */}
      <View style={s.headerRow}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={s.backText}>‹</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>리뷰 보기</Text>
      </View>

      {/* 이미지 영역 */}
      <View style={s.imageWrapper}>
        {pickedImage ? (
          <Image source={{ uri: pickedImage }} style={s.mainImage} />
        ) : (
          <View style={s.placeholderBox}>
            <Text style={s.placeholderText}>이미지</Text>
          </View>
        )}
      </View>

      {/* 업로드 버튼 */}
      <TouchableOpacity style={s.uploadBox} onPress={handleImagePick}>
        <Text style={s.uploadText}>사진 업로드 (선택)</Text>
      </TouchableOpacity>

      {/* 제목 */}
      <Text style={s.reviewTitle}>사용자가 저장한 제목</Text>

      {/* 날짜 */}
      <Text style={s.dateText}>2025.10.10. 15:00 ~ 16:00</Text>

      {/* 정보 3줄 */}
      <View style={s.infoRow}>
        <Text style={s.infoLabel}>총 거리</Text>
        <Text style={s.infoValue}>0.0km</Text>
      </View>

      <View style={s.infoRow}>
        <Text style={s.infoLabel}>소요 시간</Text>
        <Text style={s.infoValue}>0.4h</Text>
      </View>

      <View style={s.infoRow}>
        <Text style={s.infoLabel}>칼로리 소모량</Text>
        <Text style={s.infoValue}>400kcal</Text>
      </View>

      {/* 리뷰 입력창 */}
      <TextInput
        style={s.reviewInput}
        placeholder="코스 리뷰 내용"
        placeholderTextColor="#999"
        multiline
        value={reviewText}
        onChangeText={setReviewText}
      />

      {/* 저장 버튼 */}
      <TouchableOpacity style={s.submitBtn}>
        <Text style={s.submitText}>저장하기</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
