import { useRouter } from "expo-router";
import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native"; // 💡 Alert 임포트 추가
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "../../src/store/authStore";

// 메뉴 항목 컴포넌트
const MenuItem = ({ title, onPress }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <Text style={styles.menuText}>{title}</Text>
    {/* 회색 화살표 (→) 아이콘 */}
    <Text style={styles.arrow}>→</Text>
  </TouchableOpacity>
);

// 닫기 버튼 컴포넌트
const CloseButton = ({ onPress }) => (
  <TouchableOpacity style={styles.closeButton} onPress={onPress}>
    <Text style={styles.closeIcon}>✖</Text>
  </TouchableOpacity>
);

export default function MenuScreen() {
  const router = useRouter();
  const { logout } = useAuthStore();

  const handleClosePress = () => {
    // 닫기 버튼은 이전 화면으로 돌아갑니다 (스택에서 pop)
    router.back();
  };

  // 💡 로그아웃 로직 (Alert 추가 및 네비게이션 처리)
  const handleLogout = () => {
    Alert.alert(
      "로그아웃",
      "정말로 로그아웃 하시겠습니까?",
      [
        {
          text: "취소",
          style: "cancel",
        },
        {
          text: "로그아웃",
          onPress: async () => {
            try {
              await logout();
              console.log("사용자 로그아웃 완료");
              // 로그아웃 후 로그인 화면으로 이동 (스택 기록 대체)
              router.replace("/login");
            } catch (error) {
              console.error("로그아웃 처리 중 오류 발생:", error);
              Alert.alert("오류", "로그아웃 처리에 실패했습니다.");
            }
          },
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  const handlePress = (menuTitle) => {
    console.log(`${menuTitle} 클릭됨`);

    // 💡 메뉴 항목에 따른 네비게이션 로직 적용 (스택 push)
    switch (menuTitle) {
      case "저장한 코스":
        router.push("/saved"); // 예시 경로: app/courses/saved.js
        break;
      case "배지 및 업적":
        router.push("/achievements"); // 예시 경로: app/achievements/index.js
        break;
      case "설정":
        router.push("/settings"); // 예시 경로: app/settings/index.js
        break;
      case "로그아웃":
        handleLogout(); // 로그아웃 경고창 띄우기
        break;
      default:
        console.warn(`미정의된 메뉴 항목: ${menuTitle}`);
    }
  };

  // 닉네임 예시
  const userNickname = "사용자 닉네임";

  return (
    <SafeAreaView style={styles.container}>
      {/* 닫기 버튼: 우측 상단에 고정 */}
      <CloseButton onPress={handleClosePress} />

      {/* 프로필 영역 스타일 (이미지와 닉네임을 포함) */}
      <TouchableOpacity
        style={styles.profileArea}
        onPress={() => router.push("/profile")} // 클릭 시 프로필 화면 이동
      >
        {/* 프로필 이미지 플레이스홀더 */}
        <View style={styles.profileImagePlaceholder}>
          <Text style={styles.imagePlaceholderText}>이미지</Text>
        </View>

        {/* 닉네임 텍스트 컨테이너 (이미지 옆에 배치) */}
        <View style={styles.profileTextContainer}>
          <Text style={styles.nicknameText}>{userNickname}</Text>
        </View>
      </TouchableOpacity>

      {/* 메뉴 항목 목록 */}
      <View style={styles.menuList}>
        <MenuItem
          title="저장한 코스"
          onPress={() => handlePress("저장한 코스")}
        />
        <MenuItem
          title="배지 및 업적"
          onPress={() => handlePress("배지 및 업적")}
        />
        <MenuItem title="설정" onPress={() => handlePress("설정")} />
        <MenuItem title="로그아웃" onPress={() => handlePress("로그아웃")} />
      </View>

      {/* 앱 버전 정보 */}
      <Text style={styles.appVersionText}>앱 버전 1.0.0</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // 배경색: 흰색
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF", // 흰색 배경
    paddingHorizontal: 20,
    paddingTop: 30,
    justifyContent: "space-between",
  },

  // 닫기 버튼 스타일: 우측 상단에 위치하도록 설정
  closeButton: {
    position: "absolute",
    top: 30, // SafeAreaView의 위쪽 padding/margin 고려
    right: 20, // container의 paddingHorizontal과 일치
    zIndex: 10, // 다른 요소 위에 표시
    padding: 10,
  },
  closeIcon: {
    fontSize: 24,
    color: "#333",
    fontWeight: "600",
  },

  // 프로필 영역 스타일 (이미지와 닉네임을 포함)
  profileArea: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginBottom: 40,
    marginTop: 20,
  },
  profileImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#D9D9D9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  imagePlaceholderText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "bold",
  },
  // 닉네임 텍스트를 감싸는 컨테이너
  profileTextContainer: {
    // 닉네임이 세로 중앙에 올 수 있도록 조정이 필요한 경우 사용
  },
  // 닉네임 텍스트: 검은색, 폰트 크기 증가
  nicknameText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000000",
  },

  // 메뉴 목록 스타일
  menuList: {
    flex: 1,
    paddingTop: 30,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 20,
  },
  // 메뉴 텍스트 색상: #161E6C, 폰트 크기 증가
  menuText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#161E6C",
  },
  // 화살표 색상: 회색
  arrow: {
    fontSize: 28,
    color: "#A9A9A9",
    fontWeight: "bold",
  },

  // 앱 버전 정보 스타일
  appVersionText: {
    fontSize: 16,
    color: "#A9A9A9",
    marginBottom: 20,
    alignSelf: "center",
  },
});
