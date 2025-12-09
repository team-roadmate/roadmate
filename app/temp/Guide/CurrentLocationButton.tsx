import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";

type CurrentLocationButtonProps = {
  onPress?: () => void;
};

export default function CurrentLocationButton({
  onPress,
}: CurrentLocationButtonProps) {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      <Text style={styles.text}>현위치</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 120,
    right: 20,
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    elevation: 4,
  },
  text: { fontSize: 14, fontWeight: "600" },
});
