// app/(tabs)/Saved.tsx
import RecordList, { RecordItem } from "@/src/components/RecordList";
import React, { useEffect, useState } from "react";
import { api } from "../../src/services/api";

const mockSavedItems: RecordItem[] = [
  {
    id: "1",
    title: "한강공원 힐링 코스",
    distance: "3.8km",
    duration: "45분",
    difficulty: "쉬움",
    tags: ["#카페", "#공원", "#버스킹"],
    rating: 4.5,
    likes: 130,
  },
  {
    id: "2",
    title: "이화여대 감성 산책 코스",
    distance: "2.1km",
    duration: "30분",
    difficulty: "보통",
    tags: ["#캠퍼스", "#사진스팟", "#카페"],
    rating: 4.8,
    likes: 98,
  },
];

const mapCourseToRecordItem = (course: any): RecordItem => {
  return {
    id: String(course.id ?? course.routeId ?? Math.random()),
    title: course.title ?? course.name ?? "제목 없음",
    distance: (course.totalDistanceKm ?? course.distance ?? 0) + "km",
    duration: (course.durationMinutes ?? course.time ?? 0) + "분",
    difficulty: course.difficulty ?? "보통",
    tags: course.tags ?? ["#저장코스"],
    rating: course.rating ?? 4.5,
    likes: course.likes ?? 0,
  };
};

export default function SavedScreen() {
  const [items, setItems] = useState<RecordItem[]>([]); // 초기 상태를 빈 배열로 설정

  useEffect(() => {
    const loadSavedCourses = async () => {
      try {
        const res = await api.get("/api/routes/courses");
        console.log("저장 코스 응답:", res.data);

        const list = Array.isArray(res.data) ? res.data : res.data?.data;
        if (Array.isArray(list) && list.length > 0) {
          const mapped: RecordItem[] = list.map(mapCourseToRecordItem);
          setItems(mapped);
        } else {
          console.log("저장 코스 응답이 비어 있음. 목업 사용");
          setItems(mockSavedItems); // 응답이 비었을 때 목업 사용
        }
      } catch (err) {
        console.error("저장 코스 로드 실패. 목업 사용", err); // console.error 사용
        setItems(mockSavedItems); // 실패 시 목업 사용
      }
    };

    loadSavedCourses();
  }, []);

  return (
    <RecordList
      screenTitle="저장한 코스"
      backTo="/home"
      sortOption="거리순"
      showReviewBtn={true}
      items={items}
    />
  );
}
