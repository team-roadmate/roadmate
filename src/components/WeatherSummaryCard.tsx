// src/components/WeatherSummaryCard.tsx
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface Props {
  temperature: string;
  summary: string;
  location: string;
  isLoading: boolean;
}

export default function WeatherSummaryCard({
  temperature,
  summary,
  location,
  isLoading,
}: Props) {
  // 🦴 스켈레톤 로딩 뷰
  if (isLoading) {
    return (
      <View style={[styles.card, styles.skeletonCard]}>
        <View style={styles.skeletonTop}>
          <View style={styles.skeletonCircle} />
          <View style={styles.skeletonTextLine} />
          <View
            style={[styles.skeletonTextLine, { width: "50%", height: 28 }]}
          />
        </View>
      </View>
    );
  }

  const roundedTemp = Math.round(parseFloat(temperature));

  return (
    <View style={styles.card}>
      <View style={styles.topInfo}>
        <Text style={styles.locationIcon}>☀️</Text>
        <Text style={styles.locationText}>{location}</Text>
        <Text style={styles.temperature}>{roundedTemp}°C</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "48%",
    backgroundColor: "#AEEA00",
    borderRadius: 10,
    padding: 15,
    justifyContent: "space-between",
  },
  topInfo: { marginBottom: 10 },
  locationIcon: { fontSize: 20 },
  locationText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 5,
  },
  temperature: { fontSize: 28, fontWeight: "bold", color: "#fff" },

  // --- 스켈레톤 ---
  skeletonCard: { backgroundColor: "#F0F0F0" },
  skeletonTop: { marginBottom: 10 },
  skeletonCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#E0E0E0",
    marginBottom: 5,
  },
  skeletonTextLine: {
    width: "80%",
    height: 16,
    backgroundColor: "#E0E0E0",
    borderRadius: 4,
    marginBottom: 5,
  },
});
