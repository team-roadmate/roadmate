// app/profile.tsx
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";

// 프로필 전용 스타일
import { styles as profileStyles } from "./css/profile.style";
import { styles as commonStyles } from "./css/index.styles"; // 로그인/회원가입 공통 화살표 스타일 재사용

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
  return (
    <View style={profileStyles.container}>
      {/* 상단 제목 */}
      <View style={profileStyles.header}>
        <Text style={profileStyles.title}>프로필설정</Text>
      </View>

      {/* 메인 콘텐츠 */}
      <View style={profileStyles.content}>
        {/* 큰 프로필 이미지 영역 */}
        <View style={profileStyles.profileWrapper}>
          <View style={profileStyles.profileCircle}>
            <Text style={profileStyles.profileText}>이미지</Text>
          </View>

          {/* 카메라 버튼 */}
          <TouchableOpacity style={profileStyles.cameraButton}>
            <Text style={profileStyles.cameraIcon}>📷</Text>
          </TouchableOpacity>
        </View>

        <Text style={profileStyles.helperText}>
          프로필 이미지를 설정해주세요
        </Text>

        {/* 기본 이미지 타이틀 */}
        <Text style={profileStyles.sectionLabel}>기본 이미지</Text>

        {/* 기본 이미지 그리드 */}
        <View style={profileStyles.grid}>
          {BASIC_IMAGES.map((img, idx) => (
            <View key={idx} style={profileStyles.smallCircle}>
              <Image source={img} style={profileStyles.smallImage} />
            </View>
          ))}
        </View>
      </View>

      {/* 아래 화살표 버튼 */}
      <View style={profileStyles.bottomArea}>
        <TouchableOpacity style={commonStyles.arrowButton}>
          <Text style={commonStyles.arrowText}>→</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

