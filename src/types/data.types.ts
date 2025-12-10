// src/types/data.types.ts
import { ApiResponse } from "./auth.types";

// ----------------------------------------------------
// 🏞️ 공통 경로 탐색 타입
// ----------------------------------------------------

// PathNode (경로를 구성하는 개별 노드)
export interface PathNode {
  latitude: number; // double -> number
  longitude: number; // double -> number
}

// PathRequest (최단 경로 요청)
export interface PathRequest {
  startLat: number;
  startLon: number;
  endLat: number;
  endLon: number;
}

// PathResult (최단 경로 응답)
export interface PathResult {
  totalDistance: number; // 총 거리 (미터)
  path: PathNode[]; // PathNode 목록
}

export type ShortestPathResponse = PathResult;

// ----------------------------------------------------
// 🔄 루프 경로 탐색 (LoopPathController) 타입
// ----------------------------------------------------

// 1. LoopEstimateRequest
export interface LoopEstimateRequest {
  startLat: number; // Double -> number
  startLng: number; // Double -> number
  viaLat: number; // Double -> number
  viaLng: number; // Double -> number
}

// 2. LoopEstimateResponse
export interface LoopEstimateResponse {
  minLoopDistance: number; // 최소 루프 거리 (km)
  straightDistance: number; // 직선거리 (km)
  recommendedMin: number; // 권장 최소 (km)
  recommendedMax: number; // 권장 최대 (km)
  feasible: boolean; // 실행 가능 여부 (Boolean -> boolean)
  message: string; // 안내 메시지
}

// 3. LoopPathRequest
export interface LoopPathRequest {
  startLat: number; // 시작 지점 위도
  startLng: number; // 시작 지점 경도
  viaLat: number; // 중간 경유지 위도
  viaLng: number; // 중간 경유지 경도
  targetDistanceKm: number; // 목표 거리 (km)
  tolerancePercent: number; // 오차 허용 (%) (Integer -> number)
}

// 4. LoopPathResponse 내부 SegmentInfo
export interface SegmentInfo {
  from: string; // 시작점
  to: string; // 도착점
  distance: number; // 구간 거리 (km)
  nodeCount: number; // 노드 개수 (Integer -> number)
}

// 4. LoopPathResponse
export interface LoopPathResponse {
  actualDistance: number; // 실제 거리 (km)
  targetDistance: number; // 목표 거리 (km)
  tolerance: number; // 오차 (km)
  withinTolerance: boolean; // 허용 범위 내 여부
  path: PathNode[]; // 경로 좌표 목록 (PathNode 재사용)
  segment1: SegmentInfo; // P1 → A 구간
  segment2: SegmentInfo; // A → P2 구간
  segment3: SegmentInfo; // P2 → B 구간
  segment4: SegmentInfo; // B → P1 구간
  message: string; // 안내 메시지
}

// ----------------------------------------------------
// 📜 산책 경로 (WalkRouteController) 및 기타 타입 (유지)
// ----------------------------------------------------

// WalkRoute 엔티티 타입 정의 (생략)
export interface WalkRoute {
  routeId: number;
  userId: number;
  title: string | null;
  memo: string | null;
  rating: number | null;
  startTime: string;
  endTime: string | null;
  expectedDistance: number;
  expectedDuration: number;
  distance: number | null;
  duration: number | null;
  status: "STARTED" | "COMPLETED" | "CANCELLED";
  isCourse: boolean;
  isDeleted: boolean;
  pathData: string;
}

// WalkRoute 관리 API 요청 DTO 타입 (생략)
export interface WalkRouteStartRequest {
  expectedDistance: number;
  expectedDuration: number;
  pathData: string;
}

export interface WalkRouteCompleteRequest {
  distance: number;
  duration: number;
}

export interface SetCourseRequest {
  title: string;
  memo: string;
  rating: number;
}

// API 응답 타입 (생략)
export type RouteHistoryResponse = ApiResponse<WalkRoute[]>;
export type RouteDetailResponse = ApiResponse<WalkRoute>;
export type RouteStartResponse = ApiResponse<number>;
export type VoidResponse = ApiResponse<void>;
export interface WeatherData {
  latitude: number;
  longitude: number;
  temperature: string;
  skyCondition: string;
  weatherSummary: string;
  weatherIcon: string;
  locationName?: string;
}
export type WeatherResponse = WeatherData;
