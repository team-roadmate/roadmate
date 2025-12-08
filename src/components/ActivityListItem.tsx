import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ItemProps {
  title: string | null;
  distance: number;
  duration: number;
  onPress: () => void;
}

// 거리(M -> KM) 및 시간(초 -> 분) 포맷팅 유틸리티
const formatDistance = (meters: number) => (meters / 1000).toFixed(1);
const formatDuration = (seconds: number) => Math.round(seconds / 60);

export function ActivityListItem({
  title,
  distance,
  duration,
  onPress,
}: ItemProps) {
  const formattedDistance = formatDistance(distance);
  const formattedDuration = formatDuration(duration);

  return (
    <TouchableOpacity style={itemStyles.card} onPress={onPress}>
      <View style={itemStyles.textContainer}>
        <Text style={itemStyles.title}>{title || "제목 없음"}</Text>
        <View style={itemStyles.details}>
          <Text style={itemStyles.detail}>📏 {formattedDistance}km</Text>
          <Text style={itemStyles.detail}>⏱ {formattedDuration}분</Text>
        </View>
      </View>

      {/* 오른쪽 네모 버튼 안 화살표 */}
      <View style={itemStyles.actionButton}>
        <Text style={itemStyles.actionArrow}>→</Text>
      </View>
    </TouchableOpacity>
  );
}

const itemStyles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    backgroundColor: "#F0F0F0",
    padding: 10,
    marginBottom: 10,

    borderRadius: 10,
  },

  textContainer: {
    flex: 1,
    paddingRight: 15,
  },

  title: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 6,
    color: "#161E6C",
  },

  details: {
    flexDirection: "row",
    gap: 15,
  },

  detail: {
    fontSize: 14,
    color: "#666",
  },

  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 7,
    backgroundColor: "#AEEA00",

    justifyContent: "center",
    alignItems: "center",
  },

  actionArrow: {
    fontSize: 18,
    color: "#161E6C",
    fontWeight: "bold",
  },
});
