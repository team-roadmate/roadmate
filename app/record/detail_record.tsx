import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import MapView, { Polyline } from "react-native-maps";
import { detailRecordStyles as s } from "../css/detail_record.styles";

export default function DetailRecord() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // 개별 경로 데이터 파싱 (RecordScreen에서 'pathData'로 전달받았다고 가정)
  const pathData = params.pathData
    ? JSON.parse(params.pathData as string)
    : null;

  // 1. 데이터 추출 및 기본값 설정 (API 응답 구조에 맞게 조정 필요)
  const pathCoords = pathData?.path
    ? pathData.path.map((p: any) => ({
        latitude: p.latitude,
        longitude: p.longitude,
      }))
    : [];
  const title = pathData?.title || "코스 상세 정보";
  const distanceKm = pathData?.distance
    ? (pathData.distance / 1000).toFixed(1)
    : "0.0"; // 미터->km 변환 가정
  const durationMin = pathData?.duration
    ? Math.round(pathData.duration / 60)
    : "00"; // 초->분 변환 가정
  const difficulty = pathData?.difficulty || "정보 없음";
  const tags = pathData?.tags || []; // 태그 배열
  const recommendedPlaces = pathData?.places || ["주요 기반 추천 장소 없음"]; // 추천 장소 배열

  const mapRef = useRef<MapView>(null);

  // 2. 경로에 맞게 지도 영역 자동 조정
  useEffect(() => {
    if (mapRef.current && pathCoords.length > 0) {
      mapRef.current.fitToCoordinates(pathCoords, {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: false,
      });
    }
  }, [pathData]);

  return (
    <ScrollView style={s.container} showsVerticalScrollIndicator={false}>
      <View style={s.headerRow}>
        <TouchableOpacity onPress={() => router.push("/record/list")}>
          <Text style={s.backText}>‹</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>코스 상세 보기</Text>
      </View>

      {/* 지도 + 경로 라인 */}
      {pathCoords.length > 0 && (
        <MapView
          ref={mapRef}
          style={{ width: "100%", height: 300, marginVertical: 10 }}
          scrollEnabled={false}
          zoomEnabled={false}
        >
          <Polyline
            coordinates={pathCoords}
            strokeColor="#ffffff"
            strokeWidth={4}
          />
        </MapView>
      )}

      {/* 코스 정보 동적 표시 */}
      <Text style={s.title}>{title}</Text>

      <View style={s.infoRow}>
        <Text style={s.infoText}>{distanceKm}km</Text>
        <Text style={s.infoText}>{durationMin}분</Text>
        <Text style={s.infoText}>{difficulty}</Text>
      </View>

      <View style={s.tagRow}>
        {tags.map((tag: string) => (
          <View key={tag} style={s.tagPill}>
            <Text style={s.tagText}>{tag}</Text>
          </View>
        ))}
      </View>

      <Text style={s.sectionTitle}>주요 기반 추천 장소</Text>
      {recommendedPlaces.map((place: string, index: number) => (
        <Text key={index} style={s.placeText}>
          {place}
        </Text>
      ))}

      <TouchableOpacity style={s.startBtn}>
        <Text style={s.startText}>경로 시작</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
