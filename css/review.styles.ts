// app/css/review.styles.ts
import { StyleSheet } from "react-native";

export const reviewStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 20,
  },

  /* Header */
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  backText: {
    fontSize: 30,
    color: "#001A72",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 24,
    fontWeight: "900",
    color: "#001A72",
    marginRight: 30,
  },

  /* Image */
  imageWrapper: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#eee",
  },
  placeholderBox: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: "#777",
    fontSize: 16,
  },
  mainImage: {
    width: "100%",
    height: "100%",
  },

  /* Upload */
  uploadBox: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    marginTop: 15,
  },
  uploadText: {
    color: "#777",
    fontSize: 16,
  },

  /* Title & Date */
  reviewTitle: {
    fontSize: 22,
    fontWeight: "900",
    marginTop: 25,
    color: "#001A72",
  },
  dateText: {
    marginTop: 5,
    color: "#666",
  },

  /* Info block */
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  infoLabel: {
    fontSize: 16,
    color: "#555",
  },
  infoValue: {
    fontSize: 16,
    color: "#001A72",
    fontWeight: "700",
  },

  /* Input */
  reviewInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    minHeight: 120,
    padding: 15,
    marginTop: 25,
    fontSize: 16,
    textAlignVertical: "top",
  },

  /* Button */
  submitBtn: {
    backgroundColor: "#001A72",
    paddingVertical: 18,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 25,
  },
  submitText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },
});
