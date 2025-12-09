// components/Guide/BottomDistanceBar.tsx
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type BottomDistanceBarProps = {
  distance: number;  // m 단위 거리
  direction: string; // "직진", "좌회전", "우회전" 같은 텍스트
};

export default function BottomDistanceBar({
  distance,
  direction,
}: BottomDistanceBarProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.distance}>{`${distance}m`}</Text>
      <Text style={styles.desc}>{direction}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    height: 60,
    width: "100%",
    backgroundColor: "#E5E5E5",
    justifyContent: "center",
    alignItems: "center",
  },
  distance: {
    fontSize: 20,
    fontWeight: "700",
  },
  desc: {
    fontSize: 14,
  },
});
