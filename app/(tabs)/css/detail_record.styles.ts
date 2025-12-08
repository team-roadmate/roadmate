// app/css/detail_record.styles.ts
import { StyleSheet } from "react-native";

export const detailRecordStyles = StyleSheet.create({
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

  detailImage: {
    height: 220,
    backgroundColor: "#E4E7ED",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },

  imageText: {
    color: "#666",
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#14194A",
    marginBottom: 8,
  },

  infoRow: {
    flexDirection: "row",
    gap: 20,
    marginBottom: 16,
  },

  infoText: {
    fontSize: 14,
    color: "#555",
  },

  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 24,
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
    color: "#14194A",
    fontSize: 12,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#14194A",
    marginBottom: 12,
  },

  placeText: {
    marginBottom: 12,
    fontSize: 15,
    color: "#444",
  },

  startBtn: {
    marginTop: 32,
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#14194A",
  },

  startText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
  },
});