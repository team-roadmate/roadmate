// app/(tabs)/home.tsx
import { useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import RecentActivityList from "../../src/components/RecentActivityList";
import WeatherSummaryCard from "../../src/components/WeatherSummaryCard";
import { dataService } from "../../src/services/data.service";
import { useAuthStore } from "../../src/store/authStore";
import { useRouteStore } from "../../src/store/routeStore";
import { WeatherData } from "../../src/types/data.types";

export default function HomeScreen() {
  const router = useRouter();
  const { logout } = useAuthStore();
  const navigation = useNavigation();

  const { historyList, isLoadingHistory, fetchRouteHistory } = useRouteStore();

  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isWeatherLoading, setIsWeatherLoading] = useState(true);
  const [locationError, setLocationError] = useState<string | null>(null);

  const recentHistory = historyList.slice(0, 4);

  const loadHomeData = async () => {
    setIsWeatherLoading(true);

    let lat = 37.480871;
    let lon = 126.77032;
    let locationName = "위치 확인 중...";

    // 1. 위치 정보 및 지오코딩 획득
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        lat = location.coords.latitude;
        lon = location.coords.longitude;

        const geocode = await Location.reverseGeocodeAsync({
          latitude: lat,
          longitude: lon,
        });
        locationName = geocode[0]?.district || geocode[0]?.city || "현재 위치";
        setLocationError(null);
      } else {
        setLocationError("위치 권한이 거부되어 기본 위치 날씨를 가져옵니다.");
        locationName = "기본 위치";
      }
    } catch (e) {
      setLocationError("위치 정보 획득 중 오류가 발생했습니다.");
    }

    // 2. 날씨 정보 로드
    try {
      const weatherData = await dataService.fetchCurrentWeather(lat, lon);
      setWeather({ ...weatherData, locationName });
    } catch (e: any) {
      Alert.alert("날씨 로드 실패", "날씨 정보를 가져오지 못했습니다.");
    } finally {
      setIsWeatherLoading(false);
    }

    // 3. 기록 정보 로드 (Zustand 사용)
    try {
      await fetchRouteHistory();
    } catch (e) {
      console.error("기록 로드 실패:", e);
    }
  };

  useEffect(() => {
    loadHomeData();
  }, []);

  const handleMenuPress = () => {
    router.push("/menu");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F9F9F9" }}>
      <View style={styles.container}>
        <View style={styles.searchBox}>
          <TouchableOpacity
            style={[styles.searchButton, styles.searchButtonMargin]}
            onPress={() => router.push("/(search)/search")}
          >
            <Text style={styles.searchButtonText}>🔍 검색어 입력</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuButton} onPress={handleMenuPress}>
            <Text style={styles.menuIcon}>☰</Text>
          </TouchableOpacity>
        </View>

        {locationError && <Text style={styles.errorText}>{locationError}</Text>}

        <View style={styles.dashboardContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>🏃</Text>
            <Text style={styles.statNumber}>1,557</Text>
          </View>

          <WeatherSummaryCard
            temperature={weather?.temperature || "0"}
            summary={weather?.weatherSummary || "맑음"}
            location={weather?.locationName || "위치 로딩 중"}
            isLoading={isWeatherLoading}
          />
        </View>

        {/* <Text style={styles.sectionTitle}>테마별 추천 코스</Text>
        <Text style={styles.placeholderText}>(API 부족으로 구현 생략)</Text> */}

        <RecentActivityList
          history={recentHistory}
          router={router}
          isLoading={isLoadingHistory}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EFEFEF",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginBottom: 12,
  },
  searchButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 16,
    justifyContent: "center",
  },
  searchButtonMargin: {
    marginRight: 12,
  },
  searchButtonText: {
    fontSize: 16,
    color: "#999",
  },
  menuButton: { padding: 6 },
  menuIcon: { fontSize: 22, color: "#333" },
  dashboardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 22,
  },
  statCard: {
    width: "48%",
    backgroundColor: "#3F51B5",
    borderRadius: 14,
    paddingVertical: 18,
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 4,
  },
  statIcon: { fontSize: 42, color: "#fff", marginBottom: 8 },
  statNumber: { fontSize: 34, fontWeight: "bold", color: "#fff" },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginVertical: 12,
    color: "#222",
  },
  placeholderText: {
    color: "#999",
    textAlign: "center",
    marginBottom: 24,
    fontStyle: "italic",
  },
  errorText: {
    color: "#D32F2F",
    textAlign: "center",
    marginBottom: 10,
    fontWeight: "500",
  },
});
