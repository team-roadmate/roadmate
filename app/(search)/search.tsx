// app/(search)/search.tsx  또는 app/record/Search.tsx

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";

// ✅ api.ts 위치에 맞게 경로 조정 (프로젝트 루트에 src/services/api.ts 라고 가정)
import { api } from "../../src/services/api";

// ✅ Search.styles.ts 가 이 파일과 같은 폴더에 있다고 가정
import { searchStyles as styles } from "./Search.styles";

const THEMES = ["카페", "공원", "전시회"];

export default function SearchScreen() {
  const router = useRouter();

  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [activeTheme, setActiveTheme] = useState<string>("카페");
  const [distance, setDistance] = useState<number>(5); // 0~10 km
  const [time, setTime] = useState<number>(0.5); // 0~1 h

  // 🔍 검색 버튼 눌렀을 때
  const handleSearch = async () => {
    console.log("검색 조건", {
      start,
      end,
      theme: activeTheme,
      distance,
      time,
    });

    try {
      // 실제 API 호출 (권한/토큰 문제로 실패해도 일단 시도만 함)
      const res = await api.get("/api/path/shortest", {
        params: {
          start,
          end,
          // 필요하면 distance, time 도 함께 넘길 수 있음
        },
      });
      console.log("최단 경로 응답", res.data);
    } catch (err) {
      console.log("검색 실패(403 예상). 일단 목업으로 진행", err);
      // 실패해도 지금은 그냥 리스트 화면으로 넘어가게만 사용
    }

    // ✅ 어쨌든 검색 버튼 누르면 결과 리스트 화면으로 이동
    router.push("/list");
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* 상단 헤더 */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="#001A72" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>코스 상세 검색</Text>
      </View>

      {/* 출발지 / 도착지 */}
      <View style={styles.inputGroup}>
        <TextInput
          style={styles.textInput}
          placeholder="출발지(기본은 현재위치)"
          placeholderTextColor="#B0B0B0"
          value={start}
          onChangeText={setStart}
        />
        <TextInput
          style={styles.textInput}
          placeholder="도착지"
          placeholderTextColor="#B0B0B0"
          value={end}
          onChangeText={setEnd}
        />
      </View>

      {/* 코스 조건 제목 */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>코스 조건</Text>
      </View>

      {/* 테마 선택 */}
      <View style={styles.sectionBlock}>
        <Text style={styles.label}>테마 선택</Text>
        <View style={styles.themeRow}>
          {THEMES.map((theme) => {
            const isActive = activeTheme === theme;
            return (
              <TouchableOpacity
                key={theme}
                style={[styles.chip, isActive && styles.chipActive]}
                onPress={() => setActiveTheme(theme)}
              >
                <Text
                  style={[
                    styles.chipText,
                    isActive && styles.chipTextActive,
                  ]}
                >
                  #{theme}
                </Text>
              </TouchableOpacity>
            );
          })}

          {/* ... 버튼 */}
          <TouchableOpacity style={styles.moreChip}>
            <Text style={styles.moreChipText}>...</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 거리 슬라이더 */}
      <View style={styles.sectionBlock}>
        <Text style={styles.sectionTitle}>거리</Text>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={10}
          step={0.5}
          minimumTrackTintColor="#001A72"
          maximumTrackTintColor="#E1E4EC"
          thumbTintColor="#001A72"
          value={distance}
          onValueChange={setDistance}
        />
        <View style={styles.sliderLabelRow}>
          <Text style={styles.sliderSideText}>0km</Text>
          <Text style={styles.sliderCenterText}>
            {distance.toFixed(1)}km
          </Text>
          <Text style={styles.sliderSideText}>10km</Text>
        </View>
      </View>

      {/* 예상 소요 시간 슬라이더 */}
      <View style={styles.sectionBlock}>
        <Text style={styles.sectionTitle}>예상 소요 시간</Text>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={1}
          step={0.1}
          minimumTrackTintColor="#001A72"
          maximumTrackTintColor="#E1E4EC"
          thumbTintColor="#001A72"
          value={time}
          onValueChange={setTime}
        />
        <View style={styles.sliderLabelRow}>
          <Text style={styles.sliderSideText}>0h</Text>
          <Text style={styles.sliderCenterText}>
            {time.toFixed(1)}h
          </Text>
          <Text style={styles.sliderSideText}>1h</Text>
        </View>
      </View>

      {/* 검색 버튼 */}
      <View style={styles.buttonWrapper}>
        <TouchableOpacity
          style={styles.searchButton}
          onPress={handleSearch}
        >
          <Text style={styles.searchButtonText}>검색</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}