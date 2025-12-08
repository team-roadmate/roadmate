import React from "react";
import { StyleSheet, Text, View } from "react-native";

type LocationTooltipProps = {
  name: string;
  sub: string;
};

export default function LocationTooltip({ name, sub }: LocationTooltipProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{name}</Text>
      <Text style={styles.sub}>{sub}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 150,
    left: 60,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    elevation: 4,
  },
  title: {
    fontWeight: "700",
    fontSize: 14,
  },
  sub: {
    fontSize: 12,
    color: "#666",
  },
});
