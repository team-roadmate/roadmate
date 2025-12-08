import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { RouteHistoryItem } from "../types/data.types";
import { ActivityListItem } from "./ActivityListItem";

interface ListProps {
  history: RouteHistoryItem[];
  router: any;
  isLoading: boolean; // 로딩 상태
}

// 🔹 스켈레톤 카드형 아이템
const SkeletonActivityItem = () => (
  <View style={listStyles.skeletonCard}>
    <View style={listStyles.skeletonLeft}>
      <View style={listStyles.skeletonTitle} />
      <View style={listStyles.skeletonDetailRow}>
        <View style={listStyles.skeletonDetail} />
        <View style={listStyles.skeletonDetail} />
      </View>
    </View>

    <View style={listStyles.skeletonButton}>
      <Text style={listStyles.skeletonButtonText}>→</Text>
    </View>
  </View>
);

export default function RecentActivityList({
  history,
  router,
  isLoading,
}: ListProps) {
  const handleItemPress = (routeId: number) => {
    router.push("/detail_record");
  };

  // 로딩 중, 데이터가 없을 때 스켈레톤 표시
  if (isLoading && history.length === 0) {
    return (
      <View style={listStyles.container}>
        <View style={listStyles.header}>
          <Text style={listStyles.title}>최근 기록</Text>
          <Text style={listStyles.seeMore}>로딩 중...</Text>
        </View>
        <SkeletonActivityItem />
        <SkeletonActivityItem />
      </View>
    );
  }

  // 실제 데이터 뷰
  return (
    <View style={listStyles.container}>
      <View style={listStyles.header}>
        <Text style={listStyles.title}>최근 기록</Text>
        <TouchableOpacity onPress={() => router.push("/record")}>
          <Text style={listStyles.seeMore}>더 보기</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={history}
        keyExtractor={(item) => item.routeId.toString()}
        renderItem={({ item }) => (
          <ActivityListItem
            title={item.title || "산책 코스"}
            distance={item.distance}
            duration={item.duration}
            onPress={() => handleItemPress(item.routeId)}
          />
        )}
        scrollEnabled={false}
        ListEmptyComponent={
          <Text style={{ padding: 10, color: "#999" }}>
            최근 기록이 없습니다.
          </Text>
        }
      />
    </View>
  );
}

const listStyles = StyleSheet.create({
  container: { marginTop: 20 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: { fontSize: 18, fontWeight: "bold" },
  seeMore: { color: "#8BC34A", fontSize: 14 },

  // 🔹 스켈레톤 카드
  skeletonCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    backgroundColor: "#F0F0F0",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },

  skeletonLeft: { flex: 1, paddingRight: 15 },

  skeletonTitle: {
    width: "70%",
    height: 16,
    backgroundColor: "#E0E0E0",
    borderRadius: 4,
    marginBottom: 6,
  },

  skeletonDetailRow: {
    flexDirection: "row",
    gap: 15,
  },

  skeletonDetail: {
    width: "25%",
    height: 14,
    backgroundColor: "#E0E0E0",
    borderRadius: 4,
  },

  skeletonButton: {
    width: 36,
    height: 36,
    borderRadius: 7,
    backgroundColor: "#AEEA00",

    justifyContent: "center",
    alignItems: "center",
  },

  skeletonButtonText: {
    fontSize: 18,
    color: "#161E6C",
    fontWeight: "bold",
  },
});
