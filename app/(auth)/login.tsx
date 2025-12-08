// app/(auth)/login.tsx
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuthStore } from "../../src/store/authStore";
import { styles } from "./css/index.styles";

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoading, error } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleLoginPress = async () => {
    let hasError = false;

    // 에러 메시지 초기화
    setEmailError("");
    setPasswordError("");

    if (!email) {
      setEmailError("이메일을 입력해주세요.");
      hasError = true;
    }
    if (!password) {
      setPasswordError("비밀번호를 입력해주세요.");
      hasError = true;
    }

    if (hasError) {
      return; // 에러가 있으면 로그인 시도 중단
    }

    try {
      await login({ email, password });
      router.replace("/(tabs)/home");
    } catch (err) {
      // API 오류 메시지(error)가 있다면 그것을 사용하고, 없으면 기본 메시지 사용
      Alert.alert("로그인 실패", error || "로그인에 실패했습니다.");
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
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>로그인</Text>
      </View>

      <View style={styles.formArea}>
        {/* 이메일 입력 */}
        {renderLabelWithOptionalError("이메일 주소", emailError)}
        <TextInput
          style={styles.input}
          placeholder="이메일"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setEmailError(""); // 입력 시 에러 메시지 초기화
          }}
          autoCapitalize="none"
          keyboardType="email-address"
          editable={!isLoading}
          // 💡 자동 완성 활성화 (Android/iOS 모두 권장)
          autoComplete="email"
          // iOS를 위한 추가 옵션 (optional, 있지만 유지하면 좋음)
          textContentType="emailAddress"
        />

        {/* 비밀번호 입력 */}
        {renderLabelWithOptionalError("비밀번호", passwordError)}
        <TextInput
          style={styles.input}
          placeholder="비밀번호"
          secureTextEntry
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setPasswordError(""); // 입력 시 에러 메시지 초기화
          }}
          editable={!isLoading}
          // 💡 자동 완성 활성화 (Android/iOS 모두 권장)
          autoComplete="password"
          // iOS를 위한 추가 옵션 (optional)
          textContentType="password"
        />
      </View>

      <View style={styles.middleArea}>
        <TouchableOpacity
          style={styles.arrowButton}
          onPress={handleLoginPress}
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
        <Text style={styles.bottomText}>로그인이 안되시나요?</Text>
        <TouchableOpacity
          onPress={() => router.push("/(auth)/register")}
          disabled={isLoading}
        >
          <Text style={styles.bottomLink}>회원 가입</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
