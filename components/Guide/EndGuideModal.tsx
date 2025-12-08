import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type EndGuideModalProps = {
  onCancel: () => void;
  onEnd: () => void;
};

export default function EndGuideModal({ onCancel, onEnd }: EndGuideModalProps) {
  return (
    <View style={styles.overlay}>
      <View style={styles.modal}>
        <Text style={styles.title}>종료하시겠습니까?</Text>

        <View style={styles.row}>
          <Pressable style={styles.btn} onPress={onCancel}>
            <Text>취소</Text>
          </Pressable>

          <Pressable style={[styles.btn, styles.endBtn]} onPress={onEnd}>
            <Text style={{ color: "#fff" }}>종료</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
  },
  title: {
    fontSize: 16,
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  btn: {
    padding: 10,
    marginLeft: 10,
  },
  endBtn: {
    backgroundColor: "#444",
    borderRadius: 8,
  },
});
