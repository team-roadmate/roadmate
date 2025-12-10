// src/utils/routeMapper.ts (새 파일로 가정)
import { RecordItem } from "../components/RecordList"; // RecordItem 타입 임포트
import { PathNode, WalkRoute } from "../types/data.types";

// WalkRoute를 RecordItem으로 변환하는 함수
export const mapWalkRouteToRecordItem = (route: WalkRoute): RecordItem => {
  let pathNodes: PathNode[] = [];

  // pathData (string)을 파싱하여 PathNode[]로 변환
  try {
    if (route.pathData) {
      // pathData가 PathNode[] 형태의 JSON 문자열이라고 가정합니다.
      const parsedData = JSON.parse(route.pathData);

      // 파싱된 데이터가 PathNode[] 구조와 일치하는지 간단히 확인
      if (
        Array.isArray(parsedData) &&
        parsedData.every((item) => "latitude" in item && "longitude" in item)
      ) {
        pathNodes = parsedData;
      } else {
        console.warn(
          `경로 ID ${route.routeId}: pathData의 JSON 구조가 예상과 다릅니다.`,
          parsedData
        );
      }
    }
  } catch (e) {
    console.error(`경로 ID ${route.routeId}: pathData 파싱 오류`, e);
  }

  // RecordItem 형태로 변환하여 반환
  return {
    id: route.routeId.toString(), // routeId를 string으로 변환
    title: route.title || "제목 없음",
    // 거리, 시간, 난이도 등은 임시 값으로 대체 (백엔드에서 태그나 난이도 정보가 직접 오지 않는 경우)
    distance:
      route.distance !== null ? `${route.distance.toFixed(2)} km` : "N/A",
    duration: route.duration !== null ? formatDuration(route.duration) : "N/A", // duration 형식이 초(seconds)라고 가정하고 포맷 함수 필요
    difficulty: "쉬움", // WalkRoute에 난이도 필드가 없으므로 임시 값
    tags: route.isCourse ? ["저장된 코스"] : ["기록"], // 태그 필드가 없으므로 임시 생성
    rating: route.rating || 0,
    path: pathNodes, // 파싱된 경로 좌표 배열
  };
};

// duration(초)을 "0시간 0분" 형식으로 포맷하는 임시 함수
const formatDuration = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) {
    return `${hours}시간 ${minutes}분`;
  }
  return `${minutes}분`;
};

// WalkRoute[] 리스트를 RecordItem[] 리스트로 변환하는 함수
export const mapWalkRoutesToRecordItems = (
  routes: WalkRoute[]
): RecordItem[] => {
  return routes.map(mapWalkRouteToRecordItem);
};
