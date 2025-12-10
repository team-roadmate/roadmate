// components/Guide/CurrentLocationButton.tsx
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

type CurrentLocationButtonProps = {
  onPress?: () => void;
};

export default function CurrentLocationButton({
  onPress,
}: CurrentLocationButtonProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <Text style={styles.text}>현위치</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    minWidth: 72,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  text: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
  },
});
