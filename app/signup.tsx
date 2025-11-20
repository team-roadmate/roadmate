import React, { useState } from "react";
import { styles } from "./css/index.styles";
import { router } from "expo-router";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Link } from "expo-router";

const years = Array.from({ length: 80 }, (_, i) => String(2024 - i)); // 2024 ~ 1945
const months = Array.from({ length: 12 }, (_, i) => String(i + 1));
const days = Array.from({ length: 31 }, (_, i) => String(i + 1));

export default function SignupScreen() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [duplicateChecked, setDuplicateChecked] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthDay, setBirthDay] = useState("");

  // 중복확인
  const handleCheckDuplicate = () => {
    if (!id) {
      Alert.alert("알림", "아이디를 입력해주세요.");
      return;
    }

    // TODO: 백엔드 중복확인 API 호출
    Alert.alert("확인 완료", "사용 가능한 아이디입니다.");
    setDuplicateChecked(true);
  };

  // 회원가입
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
    if (!birthYear || !birthMonth || !birthDay) {
      Alert.alert("알림", "생년월일을 모두 선택해주세요.");
      return;
    }

    console.log("signup try", {
      id,
      password,
      name,
      phone,
      birth: `${birthYear}-${birthMonth}-${birthDay}`,
    });
        router.push("/profile");
  };

  return (
    <View style={styles.container}>
      {/* 상단 제목 */}
      <View style={styles.header}>
        <Text style={styles.title}>회원가입</Text>
      </View>

      {/* 아이디 + 중복확인 버튼 (한 박스 안) */}
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

      {/*이메일 */}
      <TextInput
        style={styles.input}
        placeholder="이메일 주소"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />

      {/* 생년월일 */}
      <View style={styles.birthRow}>
        {/* 년도 */}
        <View style={styles.birthBox}>
          <Picker
            selectedValue={birthYear}
            onValueChange={(value) => setBirthYear(value)}
            style={styles.birthPicker}
          >
            <Picker.Item label="년도" value="" />
            {years.map((y) => (
              <Picker.Item key={y} label={y} value={y} />
            ))}
          </Picker>
        </View>

        {/* 월 */}
        <View style={styles.birthBox}>
          <Picker
            selectedValue={birthMonth}
            onValueChange={(value) => setBirthMonth(value)}
            style={styles.birthPicker}
          >
            <Picker.Item label="월" value="" />
            {months.map((m) => (
              <Picker.Item key={m} label={m} value={m} />
            ))}
          </Picker>
        </View>

        {/* 일 */}
        <View style={styles.birthBox}>
          <Picker
            selectedValue={birthDay}
            onValueChange={(value) => setBirthDay(value)}
            style={styles.birthPicker}
          >
            <Picker.Item label="일" value="" />
            {days.map((d) => (
              <Picker.Item key={d} label={d} value={d} />
            ))}
          </Picker>
        </View>
      </View>

      {/* 화살표 버튼 */}
      <View style={styles.middleArea}>
        <TouchableOpacity style={styles.arrowButton} onPress={handleSignupPress}>
          <Text style={styles.arrowText}>→</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}