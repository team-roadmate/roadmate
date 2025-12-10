// src/constants/api.constants.ts

export const API_BASE_URL = "http://rmate.kro.kr:4080";

export const API_ENDPOINTS = {
  // 인증
  LOGIN: "/api/auth/login",
  SIGNUP: "/api/auth/signup",
  REFRESH: "/api/auth/refresh",

  // 날씨
  WEATHER_CURRENT: "/api/weather/current",

  // --- 경로 탐색 ---
  SHORTEST_PATH: "/api/path/shortest",

  // --- 루프 경로 탐색 (LoopPathController 기반 신규 추가) ---
  LOOP_ESTIMATE: "/api/walk/estimate", // 1차 계산: 루프 경로 예상
  LOOP_GENERATE: "/api/walk/loop", // 2차 생성: 루프 경로 생성

  // --- 경로 관리 (WalkRouteController 기반) ---
  ROUTES_BASE: "/api/routes",
  ROUTE_START: "/api/routes/start",
  ROUTE_COMPLETE: (routeId: number) => `/api/routes/${routeId}/complete`,
  ROUTE_SET_COURSE: (routeId: number) => `/api/routes/${routeId}/set-course`,
  ROUTE_UNSET_COURSE: (routeId: number) =>
    `/api/routes/${routeId}/unset-course`,
  ROUTES_HISTORY: "/api/routes/history",
  ROUTES_COURSES: "/api/routes/courses",
  ROUTE_DETAIL_OR_DELETE: (routeId: number) => `/api/routes/${routeId}`,
};
