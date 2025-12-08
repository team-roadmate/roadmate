// app/CustomDrawer.tsx
import { Ionicons } from "@expo/vector-icons";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { useRouter } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function CustomDrawer(props: any) {
  const router = useRouter();

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={styles.container}
    >
      {/* 프로필 영역 */}
      <View style={styles.profileSection}>
        <Image
          source={require("../img/cat.jpeg")} // 임시 프로필 이미지
          style={styles.profileImage}
        />
        <Text style={styles.username}>사용자 닉네임</Text>
      </View>

      {/* 메뉴 리스트 */}
      <View style={styles.menuSection}>
        {/* 🔹 저장한 코스 */}
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => router.push("/record/Saved")}
        >
          <Text style={styles.menuText}>저장한 코스</Text>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>

        {/* 🔹 설정 (나중에 settings 화면 만들면 경로만 맞춰주면 됨) */}
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => router.push("/settings")}
        >
          <Text style={styles.menuText}>설정</Text>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>

        {/* 🔹 로그아웃 → 로그인 화면으로 이동 */}
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => router.push("/login")}
        >
          <Text style={styles.menuText}>로그아웃</Text>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>
      </View>

      {/* APP 버전 */}
      <View style={styles.footer}>
        <Text style={styles.version}>앱 버전 1.0.0</Text>
      </View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },

  profileSection: {
    marginTop: 40,
    marginBottom: 30,
    alignItems: "flex-start",
  },

  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 60,
    marginBottom: 10,
  },

  username: {
    fontSize: 22,
    fontWeight: "700",
    color: "#001A72",
  },

  menuSection: {
    marginTop: 20,
  },

  menuButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },

  menuText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#001A72",
  },

  footer: {
    marginTop: 40,
  },

  version: {
    color: "#999",
    fontSize: 14,
  },
});
