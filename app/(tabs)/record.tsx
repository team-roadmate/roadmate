// app/(tabs)/record.tsx
import RecordList, { RecordItem } from "@/src/components/RecordList";
import React, { useEffect } from "react";
import { useRouteStore } from "../../src/store/routeStore";
import { WalkRoute } from "../../src/types/data.types";

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
  const duration = route.duration || route.expectedDuration;

  // 제목이 있으면 그대로, 없으면 날짜 기반 제목 생성
  const title = route.title || formatDateTitle(route.startTime);

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
    likes: 0, // API에 likes 필드가 없으므로 기본값
  };
};

export default function RecentRecordScreen() {
  const { historyList, isLoadingHistory, fetchRouteHistory } = useRouteStore();

  useEffect(() => {
    fetchRouteHistory();
  }, []);

  // WalkRoute[]를 RecordItem[]로 변환
  const items: RecordItem[] = historyList.map(mapRouteToRecordItem);

  // 로딩 중일 때 빈 배열 전달 (RecordList에서 스켈레톤 처리)
  return (
    <RecordList
      screenTitle="최근 기록"
      sortOption="날짜순"
      showReviewBtn={true}
      items={isLoadingHistory ? [] : items}
      isLoading={isLoadingHistory}
    />
  );
}
