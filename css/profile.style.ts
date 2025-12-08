// app/css/profile.styles.ts
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 40,
    paddingTop: 80,
    paddingBottom: 40,
    backgroundColor: "#FFFFFF",
  },

  // 상단 제목 영역
  header: {
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
  },

  // 콘텐츠 전체 (큰 이미지 + 기본 이미지 그리드)
  content: {
    flex: 1,
    alignItems: "center",
  },

  // 큰 프로필 이미지
  profileWrapper: {
    marginTop: 16,
    marginBottom: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  profileCircle: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "#E5E5E5",
    justifyContent: "center",
    alignItems: "center",
  },
  profileText: {
    fontSize: 16,
    color: "#555555",
  },

  // 카메라 버튼
  cameraButton: {
    position: "absolute",
    right: 10,
    bottom: 10,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#444444",
    justifyContent: "center",
    alignItems: "center",
  },
  cameraIcon: {
    fontSize: 22,
    color: "#FFFFFF",
  },

  // 설명 텍스트
  helperText: {
    marginTop: 8,
    marginBottom: 20,
    fontSize: 13,
    color: "#555555",
  },

  // 기본 이미지 타이틀
  sectionLabel: {
    width: "100%",
    fontSize: 13,
    fontWeight: "600",
    color: "#444444",
    marginBottom: 10,
  },

  // 기본 이미지 그리드
  grid: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  smallCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: "#E5E5E5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },
  smallText: {
    fontSize: 12,
    color: "#555555",
  },
  smallImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },

  // 아래 화살표 영역
  bottomArea: {
    marginTop: 12,
    alignItems: "center",
    paddingBottom: 20,
  },
});
