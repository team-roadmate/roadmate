import { useAuth } from "@/contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import axios from "axios";
// import * as Location from "expo-location"; // Location 사용 안 함
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

import { searchStyles as styles } from "../css/Search.styles";

const THEMES = ["카페", "공원", "전시회"];

// 하드코딩된 시작 위치
const HARDCODED_START_LAT = 37.498808;
const HARDCODED_START_LNG = 126.859732;

export default function SearchScreen() {
  const router = useRouter();
  const { userToken } = useAuth();

  const [start, setStart] = useState("출발지 (서울 시청 근처 고정)");
  const [end, setEnd] = useState("");

  const [activeTheme, setActiveTheme] = useState<string>("카페");
  const [distance, setDistance] = useState<number>(5);
  const [time, setTime] = useState<number>(0.5);

  const handleSearch = async () => {
    try {
      if (!userToken) {
        Alert.alert("알림", "로그인이 필요합니다.");
        return;
      }

      // 1. 출발지/도착지 좌표 하드코딩
      const startLat = HARDCODED_START_LAT;
      const startLng = HARDCODED_START_LNG;
      const endLat = 37.498256;
      const endLng = 126.867019;

      // 2. API 요청
      const preferPark = activeTheme === "공원";
      const preferIndoor = activeTheme === "카페";

      const avoidOverpass = false;
      const avoidTunnel = false;

      const res = await axios.post(
        "http://rmate.kro.kr:4080/api/paths/search",
        {
          startLat,
          startLng,
          endLat,
          endLng,
          preferPark,
          avoidOverpass,
          avoidTunnel,
          preferIndoor,
        },
        { headers: { Authorization: `Bearer ${userToken}` } }
      );

      // 3. 🚨 응답 데이터 구조 변경 및 전달
      const singlePathData = res.data; // 서버에서 받은 단일 경로 객체

      if (!singlePathData || !singlePathData.path) {
        Alert.alert("알림", "경로 탐색에 실패했거나 결과가 없습니다.");
        return;
      }

      // RecordScreen이 { paths: [...] } 형태를 기대하므로,
      // 단일 경로 객체를 paths 배열 안에 넣어 새로운 객체를 만듭니다.
      const dataToPass = {
        paths: [singlePathData],
        count: 1, // 경로가 1개임을 명시
      };

      console.log(
        "RecordScreen에 전달할 최종 데이터:",
        JSON.stringify(dataToPass, null, 2)
      );

      router.push({
        pathname: "/record/list",
        params: { searchResult: JSON.stringify(dataToPass) },
      });
    } catch (e) {
      console.error("검색 실패", e);
      Alert.alert("오류", "경로 검색 중 오류가 발생했습니다.");
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* 상단 헤더 */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.push("/home")}>
          <Ionicons name="chevron-back" size={28} color="#001A72" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>코스 상세 검색</Text>
      </View>

      {/* 출발지 / 도착지 */}
      <View style={styles.inputGroup}>
        <TextInput
          style={styles.textInput}
          placeholder="출발지(현재 위치)"
          placeholderTextColor="#B0B0B0"
          value={start}
          editable={false}
        />
        <TextInput
          style={styles.textInput}
          placeholder="도착지 (좌표 하드코딩됨)"
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
          <Text style={styles.sliderSideText}>0h</Text>
          <Text style={styles.sliderCenterText}>{time.toFixed(1)}h</Text>
          <Text style={styles.sliderSideText}>1h</Text>
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
