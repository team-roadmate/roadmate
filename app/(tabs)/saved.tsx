// app/(tabs)/saved.tsx
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
    return "저장된 코스";
  }
};

// WalkRoute를 RecordItem으로 변환하는 함수
const mapCourseToRecordItem = (course: WalkRoute): RecordItem => {
  const distance = course.distance || course.expectedDistance;
  const duration = course.duration || course.expectedDuration;

  // 제목이 있으면 그대로, 없으면 날짜 기반 제목 생성
  const title = course.title || formatDateTitle(course.startTime);

  return {
    id: String(course.routeId),
    title,
    distance: (distance / 1000).toFixed(1) + "km",
    duration: Math.round(duration / 60) + "분",
    difficulty: "저장코스",
    tags: [
      "#저장코스",
      ...(course.rating ? [`#평점${course.rating}`] : []),
      ...(course.memo ? ["#메모있음"] : []),
    ],
    rating: course.rating || 0,
    likes: 0, // API에 likes 필드가 없으므로 기본값
  };
};

export default function SavedScreen() {
  const { courseList, isLoadingHistory, fetchSavedCourses } = useRouteStore();

  useEffect(() => {
    fetchSavedCourses();
  }, []);

  // WalkRoute[]를 RecordItem[]로 변환
  const items: RecordItem[] = courseList.map(mapCourseToRecordItem);

  // 로딩 중일 때 빈 배열 전달 (RecordList에서 스켈레톤 처리)
  return (
    <RecordList
      screenTitle="저장한 코스"
      backTo="/home"
      sortOption="거리순"
      showReviewBtn={true}
      items={isLoadingHistory ? [] : items}
      isLoading={isLoadingHistory}
    />
  );
}
