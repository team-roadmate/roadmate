import React, { useState } from "react";
import { styles } from "./css/index.styles";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";

export default function SignupScreen() {
  const router = useRouter();

  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [duplicateChecked, setDuplicateChecked] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  // [제거됨] 생년월일 관련 상태 변수 삭제

  // 중복확인
  const handleCheckDuplicate = () => {
    if (!id) {
      Alert.alert("알림", "아이디를 입력해주세요.");
      return;
    }

    // TODO: 백엔드 중복확인 API 연결 예정
    Alert.alert("확인 완료", "사용 가능한 아이디입니다.");
    setDuplicateChecked(true);
  };

  // 회원가입 버튼 클릭 시
  const handleSignupPress = () => {
    if (!id || !password || !passwordCheck || !name || !phone) {
      Alert.alert("알림", "모든 항목을 입력해주세요.");
      return;
    }

    if (password !== passwordCheck) {
      Alert.alert("알림", "비밀번호가 일치하지 않습니다.");
      return;
    }

    if (!duplicateChecked) {
      Alert.alert("알림", "아이디 중복확인을 먼저 해주세요.");
      return;
    }

    // [제거됨] 생년월일 유효성 검사 로직 삭제

    console.log("signup try", {
      id,
      password,
      name,
      phone,
      // [제거됨] birth 데이터 전송 로직 삭제
    });

    router.push("/profile");
  };

  return (
    <View style={styles.container}>
      {/* 상단 제목 */}
      <View style={styles.header}>
        <Text style={styles.title}>회원가입</Text>
      </View>

      {/* 아이디 + 중복확인 버튼 */}
      <View style={styles.idWrapper}>
        <TextInput
          style={styles.idInput}
          placeholder="아이디 입력(6~20자)"
          value={id}
          onChangeText={(text) => {
            setId(text);
            setDuplicateChecked(false);
          }}
        />
        <TouchableOpacity style={styles.checkButton} onPress={handleCheckDuplicate}>
          <Text style={styles.checkButtonText}>중복 확인</Text>
        </TouchableOpacity>
      </View>

      {/* 비밀번호 */}
      <TextInput
        style={styles.input}
        placeholder="비밀번호 입력(문자, 숫자, 특수문자 포함 8~20자)"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {/* 비밀번호 확인 */}
      <TextInput
        style={styles.input}
        placeholder="비밀번호 재입력"
        secureTextEntry
        value={passwordCheck}
        onChangeText={setPasswordCheck}
      />

      {/* 이름 */}
      <TextInput
        style={styles.input}
        placeholder="이름을 입력해주세요."
        value={name}
        onChangeText={setName}
      />

      {/* 이메일 주소 */}
      <TextInput
        style={styles.input}
        placeholder="이메일 주소"
        keyboardType="email-address"
        value={phone}
        onChangeText={setPhone}
      />

      {/* [제거됨] 생년월일 입력 영역 전체 삭제 */}

      {/* 화살표 버튼 */}
      <View style={styles.middleArea}>
        <TouchableOpacity style={styles.arrowButton} onPress={handleSignupPress}>
          <Text style={styles.arrowText}>→</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}