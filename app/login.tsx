import React, { useState } from "react";
import { styles } from "./css/index.styles";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Link } from "expo-router";

export default function LoginScreen() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");

  const handleLoginPress = () => {
    // TODO: 나중에 여기서 Spring Boot 로그인 API 호출
    console.log("login try", { id, password });
  };

  return (
    <View style={styles.container}>
      {/* 상단 제목 */}
      <View style={styles.header}>
        <Text style={styles.title}>로그인</Text>
      </View>

      {/* 입력 영역 */}
      <View style={styles.formArea}>
        <TextInput
          style={styles.input}
          placeholder="아이디"
          value={id}
          onChangeText={setId}
        />
        <TextInput
          style={styles.input}
          placeholder="비밀 번호"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      {/* 가운데 화살표 버튼 */}
      <View style={styles.middleArea}>
        <TouchableOpacity style={styles.arrowButton} onPress={handleLoginPress}>
          <Text style={styles.arrowText}>→</Text>
        </TouchableOpacity>
      </View>

      {/* 하단 문구 */}
      <View style={styles.bottomArea}>
        <Text style={styles.bottomText}>로그인이 안되시나요?</Text>

        {/* 나중에 /signup 화면 만들면 여기서 그쪽으로 이동 */}
        <Link href="/signup" asChild>
          <TouchableOpacity>
            <Text style={styles.bottomLink}>회원 가입</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}
