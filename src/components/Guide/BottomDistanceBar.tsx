// components/Guide/BottomDistanceBar.tsx
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type BottomDistanceBarProps = {
  distance: number; // m
  direction: string;
};

export default function BottomDistanceBar({
  distance,
  direction,
}: BottomDistanceBarProps) {
  const km = distance / 1000;
  const distanceText = distance >= 1000 ? `${km.toFixed(1)}km` : `${distance}m`;

  return (
    <View style={styles.container}>
      <Text style={styles.distance}>{distanceText}</Text>
      <Text style={styles.direction}>{direction}</Text>
      <View style={styles.progressOuter}>
        <View style={styles.progressInner} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 80,
    backgroundColor: "#F3F4F7",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#E0E2E8",
  },
  distance: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111",
  },
  direction: {
    marginTop: 2,
    fontSize: 13,
    color: "#666",
  },
  progressOuter: {
    marginTop: 8,
    width: "70%",
    height: 4,
    borderRadius: 2,
    backgroundColor: "#D1D4DD",
    overflow: "hidden",
  },
  progressInner: {
    width: "40%",
    height: "100%",
    backgroundColor: "#111",
  },
});
