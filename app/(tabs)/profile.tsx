// app/profile.tsx
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

import { useRouter } from "expo-router";

import { styles as profileStyles } from "./css/profile.style";

const BASIC_IMAGES = [
  require("./img/cat.jpeg"),
  require("./img/cat.jpeg"),
  require("./img/cat.jpeg"),
  require("./img/cat.jpeg"),
  require("./img/cat.jpeg"),
  require("./img/cat.jpeg"),
  require("./img/cat.jpeg"),
  require("./img/cat.jpeg"),
];

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <View style={profileStyles.container}>
      <View style={profileStyles.header}>
        <Text style={profileStyles.title}>프로필설정</Text>
      </View>

      <View style={profileStyles.content}>
        <View style={profileStyles.profileWrapper}>
          <View style={profileStyles.profileCircle}>
            <Text style={profileStyles.profileText}>이미지</Text>
          </View>

          <TouchableOpacity style={profileStyles.cameraButton}>
            <Text style={profileStyles.cameraIcon}>📷</Text>
          </TouchableOpacity>
        </View>

        <Text style={profileStyles.helperText}>
          프로필 이미지를 설정해주세요
        </Text>

        <Text style={profileStyles.sectionLabel}>기본 이미지</Text>

        <View style={profileStyles.grid}>
          {BASIC_IMAGES.map((img, idx) => (
            <View key={idx} style={profileStyles.smallCircle}>
              <Image source={img} style={profileStyles.smallImage} />
            </View>
          ))}
        </View>
      </View>

      {/* 홈 화면으로 이동 */}
      <View style={profileStyles.bottomArea}>
        <TouchableOpacity
          style={profileStyles.arrowButton}
          onPress={() => router.push("/home")} // ★ 추가됨
        >
          <Text style={profileStyles.arrowText}>→</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
