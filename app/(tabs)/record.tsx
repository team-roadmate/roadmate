// app/(tabs)/record.tsx
import RecordList, { RecordItem } from "@/src/components/RecordList";
import React, { useEffect } from "react";
import { useRouteStore } from "../../src/store/routeStore";
import { PathNode, WalkRoute } from "../../src/types/data.types"; // PathNode 임포트

// 날짜를 "MM월 DD일 산책" 형식으로 변환
const formatDateTitle = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}월 ${day}일 산책`;
  } catch {
    return "산책 기록";
  }
};

// WalkRoute를 RecordItem으로 변환하는 함수
const mapRouteToRecordItem = (route: WalkRoute): RecordItem => {
  const distance = route.distance || route.expectedDistance;
  const duration = route.duration || route.expectedDuration; // 제목이 있으면 그대로, 없으면 날짜 기반 제목 생성

  const title = route.title || formatDateTitle(route.startTime); // 🚩 [핵심 수정] pathData를 PathNode[]로 파싱

  let path: PathNode[] = [];
  try {
    if (route.pathData) {
      // pathData가 PathNode[] 형태의 JSON 문자열이라고 가정합니다.
      const parsedData = JSON.parse(route.pathData); // 유효성 검사 추가
      if (
        Array.isArray(parsedData) &&
        parsedData.every((item) => "latitude" in item && "longitude" in item)
      ) {
        path = parsedData as PathNode[];
      } else {
        // console.warn(`경로 ID ${route.routeId}: pathData의 JSON 구조가 예상과 다릅니다.`);
      }
    }
  } catch (e) {
    // console.error(`경로 ID ${route.routeId}: pathData 파싱 오류`, e);
  }

  return {
    id: String(route.routeId),
    title,
    distance: (distance / 1000).toFixed(1) + "km",
    duration: Math.round(duration / 60) + "분",
    difficulty: route.status === "COMPLETED" ? "완료" : "진행중",
    tags: [
      route.isCourse ? "#저장코스" : "#기록",
      ...(route.rating ? [`#평점${route.rating}`] : []),
    ],
    rating: route.rating || 0,
    path: path, // 🚩 파싱된 경로 데이터 할당
  };
};

export default function RecentRecordScreen() {
  const { historyList, isLoadingHistory, fetchRouteHistory } = useRouteStore();

  useEffect(() => {
    fetchRouteHistory();
  }, []); // WalkRoute[]를 RecordItem[]로 변환

  const items: RecordItem[] = historyList.map(mapRouteToRecordItem); // showReviewBtn 속성이 RecordList Props에 정의되어 있지 않아 제거했습니다.

  return (
    <RecordList
      screenTitle="최근 기록"
      sortOption="날짜순"
      items={isLoadingHistory ? [] : items}
      isLoading={isLoadingHistory}
    />
  );
}
