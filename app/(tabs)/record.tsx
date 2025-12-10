// app/(tabs)/record.tsx
import React, { useEffect, useState } from "react";
import RecordList, { RecordItem } from "@/src/components/RecordList";
import { api } from "../../src/services/api";

// ✅ API 실패 시 사용할 목업 데이터
/*
const mockRecords: RecordItem[] = [
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
*/
// ✅ 백엔드 응답 → RecordItem 으로 변환
const mapRouteToRecordItem = (route: any): RecordItem => {
  return {
    id: String(route.id ?? route.routeId ?? Math.random()),
    title: route.title ?? route.name ?? "제목 없음",
    distance: (route.totalDistanceKm ?? route.distance ?? 0) + "km",
    duration: (route.durationMinutes ?? route.time ?? 0) + "분",
    difficulty: route.difficulty ?? "보통",
    tags: route.tags ?? ["#코스"],
    rating: route.rating ?? 4.5,
    likes: route.likes ?? 0,
  };
};

export default function RecentRecordScreen() {
  const [items, setItems] = useState<RecordItem[]>(mockRecords);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        // 🔹 전체 산책 기록 조회
        const res = await api.get("/api/routes/history");
        console.log("최근 기록 응답:", res.data);

        const list = Array.isArray(res.data) ? res.data : res.data?.data;
        if (Array.isArray(list) && list.length > 0) {
          const mapped: RecordItem[] = list.map(mapRouteToRecordItem);
          setItems(mapped);
        } else {
          console.log("최근 기록 응답이 비어 있어 목업 사용");
        }
      } catch (err) {
        console.log("최근 기록 로드 실패(예상: 403). 목업 사용", err);
        // 실패 시 mockRecords 그대로 사용
      }
    };

    loadHistory();
  }, []);

  return (
    <RecordList
      screenTitle="최근 기록"
      sortOption="날짜순"
      showReviewBtn={true}
      items={items}
    />
  );
}