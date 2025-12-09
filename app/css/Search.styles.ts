// app/css/Search.styles.ts
import { StyleSheet } from "react-native";

const NAVY = "#001A72";

export const searchStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 40,
  },

  // 헤더
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: NAVY,
    marginLeft: 8,
  },

  // 입력 영역
  inputGroup: {
    marginBottom: 32,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#E1E4EC",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    marginBottom: 12,
    backgroundColor: "#F9FAFC",
  },

  // 섹션 공통
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: NAVY,
  },
  sectionBlock: {
    marginTop: 8,
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    color: "#222222",
    marginBottom: 12,
  },

  // 테마 선택
  themeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  chip: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: NAVY,
    backgroundColor: "#FFFFFF",
  },
  chipActive: {
    backgroundColor: NAVY,
  },
  chipText: {
    fontSize: 14,
    color: NAVY,
    fontWeight: "600",
  },
  chipTextActive: {
    color: "#FFFFFF",
  },
  moreChip: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#DDDDDD",
    alignItems: "center",
    justifyContent: "center",
  },
  moreChipText: {
    fontSize: 18,
    color: "#888888",
  },

  // 슬라이더
  slider: {
    width: "100%",
    marginTop: 16,
  },
  sliderLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  sliderSideText: {
    fontSize: 14,
    color: "#9A9A9A",
  },
  sliderCenterText: {
    fontSize: 14,
    color: NAVY,
    fontWeight: "700",
  },

  // 버튼
  buttonWrapper: {
    marginTop: 40,
    alignItems: "center",
  },
  searchButton: {
    width: "100%",
    backgroundColor: NAVY,
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  searchButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
});