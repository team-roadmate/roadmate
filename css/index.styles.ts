import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 40,
    paddingTop: 80,
    paddingBottom: 40,
    backgroundColor: "#FFFFFF",
  },

  header: {
    marginBottom: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
  },

  /* ------------------------ */
  /*  아이디 입력 박스 (전체) */
  /* ------------------------ */
  idWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 12,
    backgroundColor: "#FAFAFA",
    height: 45,
    paddingLeft: 16,
    paddingRight: 6,
    marginBottom: 20, // input 아래 여백
  },

  idInput: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 0,
    color: "#333",
  },

  checkButton: {
    backgroundColor: "#16255B",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  checkButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },

  /// 생년월일 라벨
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#222222",
    marginTop: 8,
    marginBottom: 6,
  },

  // 생년월일: 년 / 월 / 일 가로 정렬
  birthRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  birthBox: {
    flex: 1,
    height: 52,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 12,
    backgroundColor: "#FAFAFA",
    justifyContent: "center",
    paddingHorizontal: 12,
    marginRight: 8,
    overflow: "hidden", // ⭐ Picker 기본 border 안 보이도록 잘라냄
  },

  birthPicker: {
    fontSize: 14,
    color: "#555555",

    // 기본 드롭다운 테두리 제거
    borderWidth: 0,
    borderColor: "transparent",
    backgroundColor: "transparent",

    // 웹 환경 기본 select outline 제거
    outlineStyle: "none",
    outlineWidth: 0,
    outlineColor: "transparent",

    // 브라우저 기본 스타일 제거
    appearance: "none",
  },

  /* ------------------------ */
  /* 빨간 에러 메시지        */
  /* ------------------------ */
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 16,
  },

  /* ------------------------ */
  /* 비밀번호 input           */
  /* ------------------------ */
  input: {
    height: 45,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    paddingHorizontal: 16,
    fontSize: 14,
    backgroundColor: "#FAFAFA",
    marginBottom: 20,
  },

  /* ------------------------ */
  /* 가운데 화살표 버튼       */
  /* ------------------------ */
  middleArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  arrowButton: {
    width: 96,
    height: 96,
    borderRadius: 24,
    backgroundColor: "#F4F4F4",
    justifyContent: "center",
    alignItems: "center",
  },
  arrowText: {
    fontSize: 32,
    color: "#777777",
  },

  /* ------------------------ */
  /* 하단 로그인 이동 섹션    */
  /* ------------------------ */
  bottomArea: {
    alignItems: "center",
    marginBottom: 40,
  },
  bottomText: {
    fontSize: 13,
    color: "#555555",
    marginBottom: 8,
  },
  bottomLink: {
    fontSize: 13,
    color: "#000000",
    fontWeight: "600",
  },
});
