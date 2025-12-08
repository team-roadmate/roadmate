import { useRouter } from "expo-router"; // expo-router에서 제공하는 useRouter 훅
import React, { useState } from "react";
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

const RouteCompletePage = () => {
  // expo-router에서 제공하는 router 객체 사용
  const router = useRouter();

  // 경로 안내에서 받은 데이터 (예시값 사용)
  const totalDistance = 5; // 예시 거리 값
  const totalTime = 1; // 예시 시간 값
  const calories = 300; // 예시 칼로리 값
  const courseName = "OO카페 코스"; // 예시 코스 이름

  // 코스 제목, 리뷰 상태
  const [courseTitle, setCourseTitle] = useState("");
  const [courseReview, setCourseReview] = useState("");

  // 모달 상태
  const [showSaveModal, setShowSaveModal] = useState(false);

  // "저장하기" 버튼 클릭 시 모달 띄우기
  const handleSaveClick = () => {
    setShowSaveModal(true);
  };

  // "저장 안 함" 버튼 클릭 시 홈 화면으로 이동
  const handleCancelClick = () => {
    router.push("/"); // 홈 화면으로 이동
  };

  // "확인" 클릭 시 저장 처리
  const handleConfirmSave = () => {
    // 실제 저장 로직 처리 (예: 서버로 데이터 전송)
    console.log("저장된 데이터:", { courseTitle, courseReview });

    setShowSaveModal(false);
    router.push("/"); // 홈 화면으로 돌아가기
  };

  // "취소" 클릭 시 모달 닫기
  const handleCancelSave = () => {
    setShowSaveModal(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>코스 완료를 축하합니다!</Text>

      {/* 이미지 업로드 */}
      <View style={styles.imageContainer}>
        <Text>사진 업로드 (선택)</Text>
      </View>

      {/* 경로 정보 */}
      <Text style={styles.infoText}>2025.10.10. 15:00 ~ 16:00</Text>
      <Text style={styles.infoText}>총 거리: {totalDistance} km</Text>
      <Text style={styles.infoText}>소요 시간: {totalTime} 시간</Text>
      <Text style={styles.infoText}>칼로리 소모량: {calories} kcal</Text>

      {/* 코스 기록 제목 */}
      <TextInput
        style={styles.input}
        placeholder="코스 기록 제목을 입력해 주세요"
        value={courseTitle}
        onChangeText={setCourseTitle}
      />

      {/* 코스 리뷰 */}
      <TextInput
        style={styles.input}
        placeholder="코스 리뷰를 입력해 주세요"
        value={courseReview}
        onChangeText={setCourseReview}
        multiline
      />

      {/* 버튼들 */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleSaveClick}>
          <Text style={styles.buttonText}>저장하기</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonCancel} onPress={handleCancelClick}>
          <Text style={styles.buttonText}>저장 안 함</Text>
        </TouchableOpacity>
      </View>

      {/* 저장 확인 모달 */}
      <Modal transparent visible={showSaveModal} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text>저장하시겠습니까?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton} onPress={handleCancelSave}>
                <Text>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={handleConfirmSave}>
                <Text>확인</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  imageContainer: {
    height: 150,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderRadius: 10,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    height: 40,
    paddingLeft: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    backgroundColor: "#1A237E",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
    alignItems: "center",
  },
  buttonCancel: {
    backgroundColor: "#7AA800",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  modalButton: {
    backgroundColor: "#1A237E",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
  },
});

export default RouteCompletePage;
