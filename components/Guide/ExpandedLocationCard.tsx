import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

type ExpandedLocationCardProps = {
  title: string;
  sub: string;
  image: string; // URL
};

export default function ExpandedLocationCard({
  title,
  sub,
  image,
}: ExpandedLocationCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.sub}>{sub}</Text>
      <Image style={styles.image} source={{ uri: image }} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    position: "absolute",
    top: 120,
    left: 40,
    right: 40,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    elevation: 6,
  },
  title: {
    fontWeight: "700",
    fontSize: 16,
  },
  sub: {
    color: "#777",
    marginBottom: 8,
  },
  image: {
    width: "100%",
    height: 140,
    borderRadius: 12,
  },
});
