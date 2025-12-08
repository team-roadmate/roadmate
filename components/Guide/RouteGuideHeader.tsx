import React from "react";
import { StyleSheet, Text, View } from "react-native";

type RouteGuideHeaderProps = {
  crumbs: string[];
};

export default function RouteGuideHeader({ crumbs }: RouteGuideHeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{crumbs.join(" > ")}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 48,
    backgroundColor: "#E5E5E5",
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  text: {
    fontSize: 14,
    color: "#333",
  },
});
