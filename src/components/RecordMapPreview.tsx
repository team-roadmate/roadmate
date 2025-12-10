// src/components/RecordMapPreview.tsx

import React from "react";
import { StyleSheet, Text, View } from "react-native";
import MapView, { Polyline, PROVIDER_GOOGLE } from "react-native-maps";

// 경로 노드 타입
type PathNode = {
  latitude: number;
  longitude: number;
};

type Props = {
  path: PathNode[];
  mapHeight?: number;
};

export default function RecordMapPreview({ path, mapHeight = 160 }: Props) {
  // 맵 참조 (useRef 대신 로컬 변수 사용)
  let mapRef: MapView | null = null;

  // 경로가 유효한지 확인
  if (!path || path.length === 0) {
    return (
      <View style={[styles.mapPlaceholder, { height: mapHeight }]}>
        <Text style={styles.imageText}>경로 데이터 없음</Text>
      </View>
    );
  }

  // 경로에 맞게 맵 영역을 조정하는 함수
  const fitPathToMap = () => {
    if (mapRef && path.length > 0) {
      mapRef.fitToCoordinates(path, {
        edgePadding: { top: 20, right: 20, bottom: 20, left: 20 },
        animated: false, // 목록에서 깜빡임을 줄이기 위해 애니메이션 비활성화
      });
    }
  };

  // 초기 리전 계산 (경로의 시작 노드)
  const initialRegion = {
    latitude: path[0].latitude,
    longitude: path[0].longitude,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  return (
    <View style={[styles.mapContainer, { height: mapHeight }]}>
      <MapView
        ref={(ref) => (mapRef = ref)} // ref 연결
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={initialRegion}
        onMapReady={fitPathToMap} // 맵이 로드된 후 영역 조정
        // 스크롤뷰 내에서 스크롤 방해 방지
        scrollEnabled={false}
        zoomEnabled={false}
      >
        {/* 경로 선 (눈에 잘 띄는 색상과 두께 적용) */}
        <Polyline
          coordinates={path}
          strokeColor="#007BFF" // 리스트용 밝은 파란색
          strokeWidth={5}
          zIndex={1}
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  mapContainer: {
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#E4E7ED",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  mapPlaceholder: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E4E7ED",
    borderRadius: 8,
  },
  imageText: {
    color: "#666",
    fontSize: 14,
    fontWeight: "600",
  },
});
