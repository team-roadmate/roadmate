import React from "react";
import { StyleSheet, View } from "react-native";

type BoxProps = {
  children?: React.ReactNode;
};

export default function Box({ children }: BoxProps) {
  return <View style={styles.box}>{children}</View>;
}

const styles = StyleSheet.create({
  box: {
    width: 300,
    height: 50,
    backgroundColor: "#F0F0F0",
    borderRadius: 10,
    justifyContent: "center", // children 세로 중앙
    alignItems: "center", // children 가로 중앙
    marginVertical: 10, // 여러 개 쌓을 때 간격
  },
});
