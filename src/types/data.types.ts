// src/types/data.types.ts
import { ApiResponse } from "./auth.types"; // 기존 ApiResponse 타입 재사용

// 1. 날씨 정보 타입 정의
export interface WeatherData {
  latitude: number;
  longitude: number;
  // ... (다른 날씨 필드 생략, 필요한 핵심 필드만 정의)
  temperature: string;
  skyCondition: string;
  weatherSummary: string;
  weatherIcon: string;
  locationName?: string;
}
// 미세먼지/블랙 지수 정보가 API 응답에 없으므로, 프론트엔드에서 처리하거나 API 수정이 필요합니다.

// 2. 경로 기록 아이템 타입 정의
export interface RouteHistoryItem {
  routeId: number;
  userId: number;
  title: string | null;
  memo: string | null;
  startTime: string; // ISO 8601 형식
  endTime: string;
  distance: number; // 미터 단위 예상, km로 변환 필요
  duration: number; // 초 단위 예상, 분/시간으로 변환 필요
  isCourse: boolean;
  // ... (다른 필드 생략)
}

// 3. API 응답 타입
export type RouteHistoryResponse = ApiResponse<RouteHistoryItem[]>;
export type WeatherResponse = WeatherData; // 날씨 API는 ApiResponse 형식이 아님 (직접 WeatherData를 반환)
