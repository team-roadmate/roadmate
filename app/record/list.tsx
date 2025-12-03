import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useRef } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import MapView, { Polyline } from "react-native-maps";
import { recordStyles as s } from "../css/record.styles";

export default function RecordScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // API 응답 데이터 파싱: { paths: [path1, path2, ...], count: N } 형태를 가정
  const searchResultData = params.searchResult
    ? JSON.parse(params.searchResult as string)
    : null;

  // 실제 경로 목록 (배열) 추출, 키 이름은 API 명세에 맞게 수정해야 함
  const paths = searchResultData?.paths || [];

  const mapRefs = useRef<MapView[]>([]);

  // 경로에 맞게 지도 영역을 설정하는 함수
  const fitMapToPath = (map: MapView | null, pathCoords: any[]) => {
    if (map && pathCoords.length > 0) {
      map.fitToCoordinates(pathCoords, {
        edgePadding: { top: 10, right: 10, bottom: 10, left: 10 },
        animated: false,
      });
    }
  };

  return (
    <ScrollView style={s.container} showsVerticalScrollIndicator={false}>
      {/* 헤더 */}
      <View style={s.headerRow}>
        <TouchableOpacity onPress={() => router.push("/record/Search")}>
          <Text style={s.backText}>‹</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>검색 결과</Text>
      </View>

      <Text style={s.subText}>
        총 {paths.length}개의 코스가 검색되었습니다:
      </Text>

      {/* 정렬 박스 */}
      <View style={s.sortRow}>
        <TouchableOpacity style={s.sortBox}>
          <Text style={s.sortText}>거리순</Text>
          <Text>▼</Text>
        </TouchableOpacity>
      </View>

      {/* 🔹 코스 카드 목록 동적 렌더링 */}
      {paths.map((pathItem: any, index: number) => {
        // 경로 좌표 파싱 (API 응답 구조에 맞게 수정 필요)
        const pathCoords = pathItem.path
          ? pathItem.path.map((p: any) => ({
              latitude: p.latitude,
              longitude: p.longitude,
            }))
          : [];

        // 카드에 표시할 정보 추출 (API 응답 구조에 맞게 수정 필요)
        const title = pathItem.title || `추천 코스 ${index + 1}`;
        const distanceKm = pathItem.distance
          ? (pathItem.distance / 1000).toFixed(1)
          : "0.0"; // 미터->km 변환 가정
        const durationMin = pathItem.duration
          ? Math.round(pathItem.duration / 60)
          : "00"; // 초->분 변환 가정
        const difficulty = pathItem.difficulty || "쉬움";
        const tags = pathItem.tags || ["#태그"];
        const rating = pathItem.rating?.toFixed(1) || "N/A";
        const likes = pathItem.likes || "0";

        return (
          <View key={index} style={s.card}>
            {/* 지도 영역 */}
            {pathCoords.length > 0 && (
              <MapView
                ref={(el) => {
                  mapRefs.current[index] = el as MapView; // ref 배열에 저장
                  if (el) fitMapToPath(el, pathCoords);
                }}
                style={s.cardImage}
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

            <View style={s.cardBody}>
              <Text style={s.courseTitle}>{title}</Text>
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
              <View style={s.scoreRow}>
                <Text style={s.scoreLabel}>
                  별점 <Text style={s.scoreValue}>{rating}</Text>
                </Text>
                <Text style={s.scoreLabel}>
                  하트 <Text style={s.scoreValue}>{likes}</Text>
                </Text>
              </View>
              <View style={s.centerBtnRow}>
                <TouchableOpacity
                  style={s.bigDetailBtn}
                  onPress={() =>
                    router.push({
                      pathname: "/record/detail_record",
                      // 상세 화면으로 선택된 경로 데이터만 전달
                      params: { pathData: JSON.stringify(pathItem) },
                    })
                  }
                >
                  <Text style={s.bigDetailText}>상세 보기</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}
