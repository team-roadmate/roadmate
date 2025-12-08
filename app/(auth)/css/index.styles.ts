// app/(auth)/css/index.styles.ts
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  header: {
    marginTop: 80,
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#000",
  },
  formArea: {
    // register.tsx에서 ScrollView를 사용하고 formArea가 컨테이너 역할을 하므로 marginBottom 제거
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20, // 레이블-인풋-다음 레이블 간격 확보
    fontSize: 16,
    backgroundColor: "#fff",
  },
  // 레이블 컨테이너 (레이블 텍스트와 에러 텍스트를 인라인으로 배치)
  labelContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 8,
  },
  // 레이블 텍스트 스타일
  labelText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  // 에러 텍스트 스타일 (인라인 표시용으로 수정)
  errorText: {
    color: "red",
    fontSize: 12,
    fontWeight: "500",
  },
  middleArea: {
    alignItems: "center",
    marginTop: 30,
    marginBottom: 40,
  },
  arrowButton: {
    width: 100,
    height: 100,
    borderRadius: 22.5,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
  },
  arrowText: {
    color: "#8A8A8A",
    fontSize: 28,
    fontWeight: "bold",
  },
  bottomArea: {
    alignItems: "center",
  },
  bottomText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  bottomLink: {
    fontSize: 14,
    color: "#4254C6",
    fontWeight: "600",
  },
});
