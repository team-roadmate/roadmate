// app/settings.tsx
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, Switch, Text, TouchableOpacity, View } from "react-native";
import { settingsStyles as s } from "./css/Settings.styles";

export default function SettingsScreen() {
  const router = useRouter();

  // 지도 글자 크기 (가 / 나 / 다)
  const [fontSizeLevel, setFontSizeLevel] = useState<
    "small" | "medium" | "large"
  >("medium");

  // 지도 타입 (일반 / 위성 / 지형)
  const [mapType, setMapType] = useState<"normal" | "satellite" | "terrain">(
    "satellite"
  );

  // 알림 스위치들
  const [weatherAlert, setWeatherAlert] = useState(false);
  const [dustAlert, setDustAlert] = useState(false);
  const [badgeAlert, setBadgeAlert] = useState(false);

  // 언어
  const [language, setLanguage] = useState<"ko" | "en">("ko");

  return (
    <ScrollView
      style={s.container}
      contentContainerStyle={s.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* 상단 헤더 */}
      <View style={s.headerRow}>
        <TouchableOpacity onPress={() => router.push("/home")}>
          <Ionicons name="chevron-back" size={26} color="#001A72" />
        </TouchableOpacity>
        <Text style={s.headerTitle}>환경 설정</Text>
        <View style={{ width: 26 }} />
        {/* 오른쪽 정렬용 더미 */}
      </View>

      {/* 섹션: 지도 */}
      <Text style={s.sectionTitle}>지도</Text>

      {/* 지도 이미지 영역 */}
      <View style={s.mapBox}>
        <Text style={s.mapPlaceholderText}>이미지</Text>
      </View>

      {/* 지도 글자 크기 */}
      <Text style={s.label}>지도 글자 크기</Text>
      <View style={s.fontSizeRow}>
        <TouchableOpacity
          style={[
            s.fontCircle,
            fontSizeLevel === "small" && s.fontCircleActive,
          ]}
          onPress={() => setFontSizeLevel("small")}
        >
          <Text
            style={[
              s.fontCircleText,
              fontSizeLevel === "small" && s.fontCircleTextActive,
            ]}
          >
            가
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            s.fontCircle,
            fontSizeLevel === "medium" && s.fontCircleActive,
          ]}
          onPress={() => setFontSizeLevel("medium")}
        >
          <Text
            style={[
              s.fontCircleText,
              fontSizeLevel === "medium" && s.fontCircleTextActive,
            ]}
          >
            나
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            s.fontCircle,
            fontSizeLevel === "large" && s.fontCircleActive,
          ]}
          onPress={() => setFontSizeLevel("large")}
        >
          <Text
            style={[
              s.fontCircleText,
              fontSizeLevel === "large" && s.fontCircleTextActive,
            ]}
          >
            다
          </Text>
        </TouchableOpacity>
      </View>

      {/* 지도 타입 (일반 / 위성 / 지형) */}
      <View style={s.mapTypeRow}>
        <TouchableOpacity
          style={[s.mapTypeBtn, mapType === "normal" && s.mapTypeBtnActive]}
          onPress={() => setMapType("normal")}
        >
          <Text
            style={[s.mapTypeText, mapType === "normal" && s.mapTypeTextActive]}
          >
            일반
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[s.mapTypeBtn, mapType === "satellite" && s.mapTypeBtnActive]}
          onPress={() => setMapType("satellite")}
        >
          <Text
            style={[
              s.mapTypeText,
              mapType === "satellite" && s.mapTypeTextActive,
            ]}
          >
            위성
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[s.mapTypeBtn, mapType === "terrain" && s.mapTypeBtnActive]}
          onPress={() => setMapType("terrain")}
        >
          <Text
            style={[
              s.mapTypeText,
              mapType === "terrain" && s.mapTypeTextActive,
            ]}
          >
            지형
          </Text>
        </TouchableOpacity>
      </View>

      {/* 섹션: 알림 */}
      <Text style={s.sectionTitle}>알림</Text>

      <View style={s.settingRow}>
        <Text style={s.settingLabel}>날씨 기반 추천 알림</Text>
        <Switch
          value={weatherAlert}
          onValueChange={setWeatherAlert}
          trackColor={{ false: "#DADDE5", true: "#001A72" }}
          thumbColor="#ffffff"
        />
      </View>

      <View style={s.settingRow}>
        <Text style={s.settingLabel}>미세먼지 경고 알림</Text>
        <Switch
          value={dustAlert}
          onValueChange={setDustAlert}
          trackColor={{ false: "#DADDE5", true: "#001A72" }}
          thumbColor="#ffffff"
        />
      </View>

      <View style={s.settingRow}>
        <Text style={s.settingLabel}>배지 획득 알림</Text>
        <Switch
          value={badgeAlert}
          onValueChange={setBadgeAlert}
          trackColor={{ false: "#DADDE5", true: "#001A72" }}
          thumbColor="#ffffff"
        />
      </View>

      {/* 섹션: 언어 */}
      <Text style={s.sectionTitle}>언어</Text>

      <View style={s.languageRow}>
        <TouchableOpacity
          style={[s.langBtn, language === "ko" && s.langBtnActive]}
          onPress={() => setLanguage("ko")}
        >
          <Text style={[s.langText, language === "ko" && s.langTextActive]}>
            한국어
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[s.langBtn, language === "en" && s.langBtnActive]}
          onPress={() => setLanguage("en")}
        >
          <Text style={[s.langText, language === "en" && s.langTextActive]}>
            영어
          </Text>
        </TouchableOpacity>
      </View>

      {/* 버전 + 이어서 텍스트 */}
      <View style={s.versionBlock}>
        <Text style={s.versionText}>앱 버전 1.0.0</Text>
      </View>

      <View style={s.bottomIndicator}>
        <Text style={s.bottomIndicatorText}>▼ 이어서 ▼</Text>
      </View>
    </ScrollView>
  );
}
