// app/record/record.tsx
import RecordList, { RecordItem } from "@/src/components/RecordList";

const records: RecordItem[] = [
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

export default function RecentRecordScreen() {
  return (
    <RecordList
      screenTitle="최근 기록"
      sortOption="날짜순"
      showReviewBtn={true}
      items={records}
    />
  );
}
