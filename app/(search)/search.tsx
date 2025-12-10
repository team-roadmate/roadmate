// app/(search)/search.tsx

import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
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

import { api } from "../../src/services/api";
import { searchStyles as styles } from "./Search.styles";

const THEMES = ["카페", "공원", "전시회"];

// API가 요구하는 형식에 맞추기 위한 목업 데이터 및 변환 함수
const MOCK_COORDS = {
  "출발지(기본은 현재위치)": { lat: 37.498498, lon: 126.860412 },
  도착지: { lat: 37.499795, lon: 126.86773 },
  강남역: { lat: 37.4979, lon: 127.0276 },
  홍대입구역: { lat: 37.557, lon: 126.924 },
};

/**
 * 입력된 장소 이름을 기반으로 위도/경도를 반환하는 목업 함수.
 * 실제 구현 시에는 지오코딩(Geocoding) API를 사용해야 합니다.
 */
const getMockCoordinates = (locationName: string) => {
  const normalizedName = locationName.trim();

  if (normalizedName === "") {
    return MOCK_COORDS["출발지(기본은 현재위치)"];
  }

  // 매칭되는 이름이 있으면 해당 좌표를 반환
  if (MOCK_COORDS[normalizedName as keyof typeof MOCK_COORDS]) {
    return MOCK_COORDS[normalizedName as keyof typeof MOCK_COORDS];
  }

  // 매칭되는 이름이 없으면 기본 좌표를 반환
  return MOCK_COORDS["출발지(기본은 현재위치)"];
};
// ----------------------------------------------------

export default function SearchScreen() {
  const router = useRouter();

  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [activeTheme, setActiveTheme] = useState<string>("카페");
  const [distance, setDistance] = useState<number>(5); // 0~10 km
  const [time, setTime] = useState<number>(0.5); // 0~1 h

  const handleSearch = async () => {
    // 유효성 검사 (도착지 필수)
    if (!end.trim()) {
      Alert.alert("알림", "도착지를 입력해 주세요.");
      return;
    }

    // 입력된 장소 이름을 API 형식에 맞는 좌표로 변환
    const startCoords = getMockCoordinates(start);
    const endCoords = getMockCoordinates(end);

    console.log("검색 조건", {
      start: startCoords,
      end: endCoords,
      theme: activeTheme,
      distance,
      time,
    });

    try {
      // API 형식에 맞게 파라미터 이름 수정
      // API URL 형식: /api/path/shortest?startLat={startLat}&startLon={startLon}&endLat={endLat}&endLon={endLon}
      const res = await api.get("/api/path/shortest", {
        params: {
          startLat: startCoords.lat,
          startLon: startCoords.lon,
          endLat: endCoords.lat,
          endLon: endCoords.lon,
          theme: activeTheme,
          maxDistance: distance.toFixed(1),
          maxTime: time.toFixed(1),
        },
      });
      console.log("최단 경로 응답", res.data);
    } catch (err) {
      console.error("검색 실패. 목업 데이터로 진행합니다.", err);

      // API 실패 시 콘솔에 목업 응답 데이터 출력
      const mockResponse = {
        status: 200,
        data: {
          pathId: "mock_path_123",
          distance: `${distance.toFixed(1)}km`,
          time: `${Math.round(time * 60)}분`,
          theme: activeTheme,
          points: [
            { lat: startCoords.lat, lon: startCoords.lon, name: "출발지" },
            { lat: 37.5, lon: 126.865, name: "경유지" },
            { lat: endCoords.lat, lon: endCoords.lon, name: "도착지" },
          ],
        },
      };
      console.log(">> 목업 API 응답 데이터:", mockResponse.data);
    }

    // 검색 버튼 누르면 결과 리스트 화면으로 이동
    router.push({
      pathname: "/list",
      params: {
        theme: activeTheme,
        distance: distance.toFixed(1),
        time: Math.round(time * 60).toString(), // 분 단위로 변환하여 전달
      },
    });
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
                  style={[styles.chipText, isActive && styles.chipTextActive]}
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
          <Text style={styles.sliderCenterText}>{distance.toFixed(1)}km</Text>
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
          <Text style={styles.sliderSideText}>0h (0분)</Text>
          <Text style={styles.sliderCenterText}>
            {Math.round(time * 60)}분 ({time.toFixed(1)}h)
          </Text>
          <Text style={styles.sliderSideText}>1h (60분)</Text>
        </View>
      </View>

      {/* 검색 버튼 */}
      <View style={styles.buttonWrapper}>
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>검색</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
