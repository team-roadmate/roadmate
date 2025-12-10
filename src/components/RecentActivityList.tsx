import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { WalkRoute } from "../types/data.types";
import { ActivityListItem } from "./ActivityListItem";

interface ListProps {
  history: WalkRoute[];
  router: any;
  isLoading: boolean;
}

// 날짜를 "MM월 DD일 산책"으로 변환
const formatDateTitle = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}월 ${day}일 산책`;
  } catch {
    return "산책 기록";
  }
};

// 스켈레톤 아이템
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
    router.push({
      pathname: "/detail_record",
      params: { routeId: routeId },
    });
  };

  // △ 로딩 중 + 데이터 없음 → 스켈레톤만 표시
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
            // 🔥 제목이 없으면 날짜 기반 자동 생성
            title={item.title || formatDateTitle(item.startTime)}
            // 거리/시간은 기록된 값 or 기대값
            distance={item.distance || item.expectedDistance}
            duration={item.duration || item.expectedDuration}
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

  // Skeleton
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
