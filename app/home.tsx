import DashboardList from "@/components/Dashboard/DashboardList";
import { Feather, Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { useNavigation } from "@react-navigation/native";   // ★ 추가됨

export default function Home() {
  const router = useRouter();
  const navigation = useNavigation();   // ★ Drawer 열기용 navigation

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.contentContainer}
    >
      {/* 🔥 검색창 클릭 → Search.tsx 이동 */}
      <TouchableOpacity
        style={styles.searchBox}
        onPress={() => router.push("./record/Search")}
        activeOpacity={0.8}
      >
        <Ionicons name="search" size={26} color="#001A72" />

        <Text style={styles.searchInput}>검색어를 입력해주세요</Text>

        {/* 🔥 햄버거 메뉴 → Drawer 열기 */}
        <Feather
          name="menu"
          size={30}
          color="#001A72"
          onPress={() => navigation.openDrawer()}   // ★ Drawer 오픈
        />
      </TouchableOpacity>

      <DashboardList />

      <Text style={styles.sectionTitle}>테마별 추천 코스</Text>

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

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.courseScrollContainer}
      >
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

      <View style={styles.recommendHeader}>
        <Text style={styles.sectionTitle}>추천 경로</Text>
        <TouchableOpacity>
          <Text style={styles.moreText}>더보기</Text>
        </TouchableOpacity>
      </View>

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
      <View style={{ height: 50 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  contentContainer: {
    paddingBottom: 20,
  },

  searchBox: {
    width: "100%",
    backgroundColor: "#F2F5FF",
    borderRadius: 12,
    minHeight: 50,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
  searchInput: {
    flex: 1,
    marginHorizontal: 10,
    fontSize: 17,
    color: "#001A72",
    opacity: 0.7,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 25,
    color: "#001A72",
  },

  tabRow: {
    flexDirection: "row",
    marginTop: 10,
    gap: 8,
  },
  tabBtn: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#001A72",
    borderRadius: 10,
  },
  tabText: { color: "#001A72", fontSize: 15 },
  tabActive: { backgroundColor: "#001A72" },
  tabActiveText: { color: "white" },

  courseScrollContainer: {
    paddingVertical: 10,
    gap: 15,
  },
  courseCard: {
    width: 150,
    backgroundColor: "#eee",
    borderRadius: 12,
    flexShrink: 0,
  },
  courseImage: {
    width: "100%",
    height: 90,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  courseTitle: {
    padding: 8,
    fontSize: 15,
    fontWeight: "600",
    color: "#001A72",
  },
  courseMeta: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingBottom: 8,
    gap: 5,
  },
  metaText: { color: "#777", fontSize: 10 },

  recommendHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  moreText: { color: "#97D800", fontSize: 17, fontWeight: "600" },

  routeItem: {
    backgroundColor: "#F0F0F0",
    borderRadius: 12,
    padding: 15,
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  routeTitle: { fontSize: 18, color: "#001A72", fontWeight: "600" },
  routeMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
    gap: 10,
  },
  arrowBtn: {
    backgroundColor: "#AEEA00",
    padding: 8,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
});