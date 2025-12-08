// components/Guide/DirectionArrow.tsx
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type DirectionArrowProps = {
  direction: "up" | "down" | "left" | "right" | "end";
  onPress?: () => void;
};

export default function DirectionArrow({
  direction,
  onPress,
}: DirectionArrowProps) {
  const arrow =
    direction === "up"
      ? "↑"
      : direction === "down"
        ? "↓"
        : direction === "left"
          ? "←"
          : direction === "right"
            ? "→"
            : "종료";

  return (
    <Pressable onPress={onPress}>
      <View style={styles.container}>
        <Text style={styles.text}>{arrow}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 80,
    left: 20,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: "#EEE",
    borderRadius: 8,
  },
  text: { fontSize: 18, fontWeight: "600" },
});
