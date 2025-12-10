// components/Guide/DirectionArrow.tsx
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type ArrowDirection = "left" | "right" | "up";

type DirectionArrowProps = {
  direction: ArrowDirection;
};

export default function DirectionArrow({ direction }: DirectionArrowProps) {
  const arrowChar =
    direction === "left" ? "←" : direction === "right" ? "→" : "↑";
  const label =
    direction === "left" ? "좌회전" : direction === "right" ? "우회전" : "직진";

  return (
    <View style={styles.container}>
      <Text style={styles.arrow}>{arrowChar}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  arrow: {
    fontSize: 26,
    fontWeight: "700",
    color: "#111",
    marginBottom: 2,
  },
  label: {
    fontSize: 11,
    color: "#666",
  },
});
