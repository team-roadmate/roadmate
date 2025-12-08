// app/css/Settings.styles.ts
import { StyleSheet } from "react-native";

export const settingsStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
  },

  // 헤더
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#001A72",
  },

  // 섹션 제목
  sectionTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#001A72",
    marginTop: 24,
    marginBottom: 12,
  },

  // 지도 박스
  mapBox: {
    width: "100%",
    height: 180,
    borderWidth: 1,
    borderColor: "#D0D4E0",
    backgroundColor: "#F3F4F8",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  mapPlaceholderText: {
    color: "#777",
    fontSize: 16,
  },

  label: {
    marginTop: 4,
    marginBottom: 8,
    fontSize: 16,
    fontWeight: "600",
    color: "#001A72",
  },

  // 글자 크기 버튼
  fontSizeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  fontCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#001A72",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  fontCircleActive: {
    backgroundColor: "#001A72",
  },
  fontCircleText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#001A72",
  },
  fontCircleTextActive: {
    color: "#FFFFFF",
  },

  // 지도 타입 토글
  mapTypeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    marginBottom: 24,
  },
  mapTypeBtn: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "#001A72",
    borderRadius: 6,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  mapTypeBtnActive: {
    backgroundColor: "#001A72",
  },
  mapTypeText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#001A72",
  },
  mapTypeTextActive: {
    color: "#FFFFFF",
  },

  // 알림 설정
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  settingLabel: {
    fontSize: 15,
    color: "#001A72",
    fontWeight: "500",
  },

  // 언어
  languageRow: {
    flexDirection: "row",
    marginTop: 8,
    marginBottom: 24,
    gap: 10,
  },
  langBtn: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#001A72",
    backgroundColor: "#FFFFFF",
  },
  langBtnActive: {
    backgroundColor: "#001A72",
  },
  langText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#001A72",
  },
  langTextActive: {
    color: "#FFFFFF",
  },

  // 버전 & 하단 텍스트
  versionBlock: {
    marginTop: 8,
  },
  versionText: {
    fontSize: 14,
    color: "#999999",
  },

  bottomIndicator: {
    marginTop: 16,
    alignItems: "center",
  },
  bottomIndicatorText: {
    fontSize: 14,
    color: "#333333",
  },
});
