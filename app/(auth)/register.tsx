// app/(auth)/register.tsx
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuthStore } from "../../src/store/authStore";
import { styles } from "./css/index.styles";

export default function RegisterScreen() {
  const router = useRouter();
  const { signup, isLoading, error } = useAuthStore();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // 에러 상태 추가
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const handleSignupPress = async () => {
    let hasError = false;

    // 에러 메시지 초기화
    setNameError("");
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");

    if (!name) {
      setNameError("이름을 입력해주세요.");
      hasError = true;
    }
    if (!email) {
      setEmailError("이메일 주소를 입력해주세요.");
      hasError = true;
    }
    if (!password) {
      setPasswordError("비밀번호를 입력해주세요.");
      hasError = true;
    }
    if (!confirmPassword) {
      setConfirmPasswordError("비밀번호를 다시 입력해주세요.");
      hasError = true;
    } else if (password !== confirmPassword) {
      setPasswordError("비밀번호가 일치하지 않습니다.");
      setConfirmPasswordError("비밀번호가 일치하지 않습니다.");
      hasError = true;
    }

    if (hasError) {
      return; // 에러가 있으면 회원가입 시도 중단
    }

    try {
      await signup({ name, email, password });
      Alert.alert("성공", "회원가입이 완료되었습니다!", [
        {
          text: "확인",
          onPress: () => router.replace("/(tabs)/home"),
        },
      ]);
    } catch (err) {
      Alert.alert("회원가입 실패", error || "회원가입에 실패했습니다.");
    }
  };

  const renderLabelWithOptionalError = (
    label: string,
    errorMessage: string
  ) => (
    <View style={styles.labelContainer}>
      <Text style={styles.labelText}>{label}</Text>
      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>회원가입</Text>
      </View>

      <View style={styles.formArea}>
        {/* 이름 입력 */}
        {renderLabelWithOptionalError("이름", nameError)}
        <TextInput
          style={styles.input}
          placeholder="이름을 입력해주세요."
          value={name}
          onChangeText={(text) => {
            setName(text);
            setNameError(""); // 입력 시 에러 메시지 초기화
          }}
          editable={!isLoading}
        />

        {/* 이메일 입력 */}
        {renderLabelWithOptionalError("이메일 주소", emailError)}
        <TextInput
          style={styles.input}
          placeholder="이메일 주소"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setEmailError(""); // 입력 시 에러 메시지 초기화
          }}
          autoCapitalize="none"
          keyboardType="email-address"
          editable={!isLoading}
        />

        {/* 비밀번호 입력 */}
        {renderLabelWithOptionalError("비밀번호", passwordError)}
        <TextInput
          style={styles.input}
          placeholder="문자, 숫자, 특수문자 포함 8~20자"
          secureTextEntry
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setPasswordError(""); // 입력 시 에러 메시지 초기화
          }}
          editable={!isLoading}
        />

        {/* 비밀번호 재입력 */}
        {renderLabelWithOptionalError("비밀번호 재입력", confirmPasswordError)}
        <TextInput
          style={styles.input}
          placeholder="비밀번호 재입력"
          secureTextEntry
          value={confirmPassword}
          onChangeText={(text) => {
            setConfirmPassword(text);
            setConfirmPasswordError(""); // 입력 시 에러 메시지 초기화
          }}
          editable={!isLoading}
        />
      </View>

      <View style={styles.middleArea}>
        <TouchableOpacity
          style={styles.arrowButton}
          onPress={handleSignupPress}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.arrowText}>→</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.bottomArea}>
        <Text style={styles.bottomText}>이미 계정이 있으신가요?</Text>
        <TouchableOpacity onPress={() => router.back()} disabled={isLoading}>
          <Text style={styles.bottomLink}>로그인</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
