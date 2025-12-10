// app/(tabs)/saved.tsx
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
    return "저장된 코스";
  }
};

// WalkRoute를 RecordItem으로 변환하는 함수
const mapCourseToRecordItem = (course: WalkRoute): RecordItem => {
  const distance = course.distance || course.expectedDistance;
  const duration = course.duration || course.expectedDuration; // 제목이 있으면 그대로, 없으면 날짜 기반 제목 생성

  const title = course.title || formatDateTitle(course.startTime); // 🚩 [핵심 수정] pathData를 PathNode[]로 파싱

  let path: PathNode[] = [];
  try {
    if (course.pathData) {
      // pathData가 PathNode[] 형태의 JSON 문자열이라고 가정합니다.
      const parsedData = JSON.parse(course.pathData); // 유효성 검사 추가
      if (
        Array.isArray(parsedData) &&
        parsedData.every((item) => "latitude" in item && "longitude" in item)
      ) {
        path = parsedData as PathNode[];
      } else {
        // console.warn(`코스 ID ${course.routeId}: pathData의 JSON 구조가 예상과 다릅니다.`);
      }
    }
  } catch (e) {
    // console.error(`코스 ID ${course.routeId}: pathData 파싱 오류`, e);
  }

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
    path: path, // 🚩 파싱된 경로 데이터 할당
  };
};

export default function SavedScreen() {
  const { courseList, isLoadingHistory, fetchSavedCourses } = useRouteStore();

  useEffect(() => {
    fetchSavedCourses();
  }, []); // WalkRoute[]를 RecordItem[]로 변환

  const items: RecordItem[] = courseList.map(mapCourseToRecordItem); // showReviewBtn 속성이 RecordList Props에 정의되어 있지 않아 제거했습니다.

  return (
    <RecordList
      screenTitle="저장한 코스"
      backTo="/home"
      sortOption="거리순"
      items={isLoadingHistory ? [] : items}
      isLoading={isLoadingHistory}
    />
  );
}
