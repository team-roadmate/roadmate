// HomeScreen.js
import { Feather, Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Home() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Search Bar */}
      <View style={styles.searchBox}>
        <Ionicons name="search" size={26} color="#001A72" />
        <TextInput
          placeholder="검색어를 입력해주세요"
          style={styles.searchInput}
          placeholderTextColor="#001A72"
        />
        <Feather name="menu" size={30} color="#001A72" />
      </View>

      {/* Top Cards */}
      <View style={styles.cardRow}>
        <View style={[styles.card, { backgroundColor: "#4253E8" }]}>
          <Ionicons name="walk" size={38} color="white" />
          <Text style={styles.cardNumber}>6,320</Text>
        </View>

        <View style={[styles.card, { backgroundColor: "#C6F500" }]}>
          <View style={styles.weatherRow}>
            <Ionicons name="sunny" size={32} color="white" />
            <Text style={styles.weatherLocation}>구로구</Text>
          </View>
          <Text style={styles.weatherTemp}>
            14°C <Text style={styles.tempSub}>(18°C)</Text>
          </Text>
          <Text style={styles.weatherLabel}>
            미세먼지 <Text style={styles.tag}>보통</Text>
          </Text>
          <Text style={styles.weatherLabel}>
            불쾌지수 <Text style={styles.tag}>낮음</Text>
          </Text>
        </View>
      </View>

      {/* Theme Title */}
      <Text style={styles.sectionTitle}>테마별 추천 코스</Text>

      {/* Tabs */}
      <View style={styles.tabRow}>
        <TouchableOpacity style={styles.tabBtn}>
          <Text style={styles.tabText}>공원</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tabBtn, styles.tabActive]}>
          <Text style={[styles.tabText, styles.tabActiveText]}>카페</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabBtn}>
          <Text style={styles.tabText}>백화점</Text>
        </TouchableOpacity>
      </View>

      {/* Course Cards - Horizontal */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {[1, 2, 3].map((v) => (
          <View key={v} style={styles.courseCard}>
            <Image
              source={{ uri: "https://picsum.photos/300/200" }}
              style={styles.courseImage}
            />
            <Text style={styles.courseTitle}>OO카페 코스</Text>
            <View style={styles.courseMeta}>
              <Feather name="trending-up" size={18} color="#777" />
              <Text style={styles.metaText}>3.8km</Text>
              <Ionicons name="time-outline" size={18} color="#777" />
              <Text style={styles.metaText}>45분</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Recommend Routes */}
      <View style={styles.recommendHeader}>
        <Text style={styles.sectionTitle}>추천 경로</Text>
        <TouchableOpacity>
          <Text style={styles.moreText}>더보기</Text>
        </TouchableOpacity>
      </View>

      {/* Route List */}
      {[1, 2, 3].map((v) => (
        <View key={v} style={styles.routeItem}>
          <View>
            <Text style={styles.routeTitle}>한강공원 러닝 코스</Text>
            <View style={styles.routeMeta}>
              <Feather name="trending-up" size={18} color="#777" />
              <Text style={styles.metaText}>3.8km</Text>
              <Ionicons name="time-outline" size={18} color="#777" />
              <Text style={styles.metaText}>45분</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.arrowBtn}>
            <Feather name="arrow-right" size={28} color="#001A72" />
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffffff",
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  /** Search Bar */
  searchBox: {
    width: "100%",
    backgroundColor: "#F2F5FF",
    borderRadius: 12,
    height: 60,
    paddingHorizontal: 15,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    marginRight: 10,
    fontSize: 17,
    color: "#001A72",
  },

  /** Cards */
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 25,
  },
  card: {
    width: "48%",
    borderRadius: 16,
    padding: 20,
  },
  cardNumber: {
    fontSize: 42,
    marginTop: 15,
    color: "white",
    fontWeight: "bold",
  },

  weatherRow: { flexDirection: "row", alignItems: "center" },
  weatherLocation: {
    color: "white",
    fontSize: 26,
    marginLeft: 10,
    fontWeight: "bold",
  },
  weatherTemp: {
    marginTop: 8,
    color: "white",
    fontSize: 30,
    fontWeight: "bold",
  },
  tempSub: { fontSize: 20 },
  weatherLabel: { color: "white", fontSize: 16, marginTop: 5 },
  tag: {
    backgroundColor: "rgba(255,255,255,0.3)",
    paddingHorizontal: 8,
    borderRadius: 10,
    fontSize: 14,
  },

  /** Section Titles */
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 35,
    color: "#001A72",
  },

  /** Tabs */
  tabRow: {
    flexDirection: "row",
    marginTop: 15,
  },
  tabBtn: {
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "#001A72",
    borderRadius: 10,
    marginRight: 10,
  },
  tabText: { color: "#001A72", fontSize: 15 },
  tabActive: { backgroundColor: "#001A72" },
  tabActiveText: { color: "white" },

  /** Course Cards */
  courseCard: {
    width: 200,
    backgroundColor: "#eee",
    borderRadius: 12,
    marginRight: 15,
    marginTop: 15,
  },
  courseImage: {
    width: "100%",
    height: 150,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  courseTitle: {
    paddingHorizontal: 12,
    paddingTop: 12,
    fontSize: 17,
    fontWeight: "600",
    color: "#001A72",
  },
  courseMeta: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  metaText: { marginLeft: 6, marginRight: 12, color: "#777" },

  /** Recommend List */
  recommendHeader: {
    marginTop: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  moreText: { color: "#97D800", fontSize: 17, fontWeight: "600" },

  routeItem: {
    backgroundColor: "#F0F0F0",
    borderRadius: 12,
    padding: 20,
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  routeTitle: { fontSize: 18, color: "#001A72", fontWeight: "600" },
  routeMeta: { flexDirection: "row", alignItems: "center", marginTop: 5 },
  arrowBtn: {
    backgroundColor: "#AEEA00",
    height: 45,
    width: 45,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
});
