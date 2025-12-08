import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../contexts/AuthContext";
import { styles } from "./css/index.styles";

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLoginPress = async () => {
    if (!email || !password) {
      Alert.alert("경고", "이메일과 비밀번호를 모두 입력해주세요.");
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      router.replace("/home");
    } catch (e: any) {
      Alert.alert("로그인 실패", e.message || "서버 오류");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>로그인</Text>
      </View>

      <View style={styles.formArea}>
        <TextInput
          style={styles.input}
          placeholder="이메일"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="비밀번호"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <View style={styles.middleArea}>
        <TouchableOpacity
          style={styles.arrowButton}
          onPress={handleLoginPress}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.arrowText}>→</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.bottomArea}>
        <Text style={styles.bottomText}>로그인이 안되시나요?</Text>
        <Link href="/signup" asChild>
          <TouchableOpacity>
            <Text style={styles.bottomLink}>회원 가입</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}
