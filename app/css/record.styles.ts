// app/css/record.styles.ts
import { StyleSheet } from "react-native";

export const recordStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 24,
    paddingTop: 56,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },

  backText: {
    fontSize: 24,
    marginRight: 8,
    color: "#14194A",
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#14194A",
  },

  subText: {
    fontSize: 14,
    color: "#B0B0B0",
    marginBottom: 16,
  },

  sortRow: {
    alignSelf: "flex-end",
    marginBottom: 16,
  },
  sortBox: {
    borderWidth: 1,
    borderColor: "#D5DFF2",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  sortText: {
    fontSize: 14,
    color: "#14194A",
  },

  card: {
    borderWidth: 1,
    borderColor: "#D5DFF2",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 24,
  },

  cardImage: {
    height: 180,
    backgroundColor: "#E4E7ED",
    justifyContent: "center",
    alignItems: "center",
  },

  imageText: {
    color: "#666666",
    fontSize: 14,
  },

  cardBody: {
    padding: 16,
  },

  courseTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#14194A",
    marginBottom: 8,
  },

  infoRow: {
    flexDirection: "row",
    marginBottom: 12,
  },

  infoText: {
    fontSize: 14,
    color: "#555555",
    marginRight: 16,
  },

  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 12,
  },

  tagPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#D5DFF2",
    marginRight: 8,
    marginBottom: 8,
  },

  tagText: {
    fontSize: 12,
    color: "#161E6C",
  },

  scoreRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  scoreLabel: {
    fontSize: 14,
    color: "#555555",
  },

  scoreValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#14194A",
  },

  /* 🔥 여기부터 변경된 디자인 */

  centerBtnRow: {
    width: "100%",
    alignItems: "center",
  },

  bigDetailBtn: {
    width: "88%",        // 가운데 크게
    height: 50,
    borderRadius: 10,
    backgroundColor: "#14194A",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 4,
    marginBottom: 8,
  },

  bigDetailText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },
});