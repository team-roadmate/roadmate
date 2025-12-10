// src/constants/api.constants.ts

export const API_BASE_URL = "http://rmate.kro.kr:4080";

export const API_ENDPOINTS = {
  // 인증 관련
  LOGIN: "/api/auth/login",
  SIGNUP: "/api/auth/signup",
  REFRESH: "/api/auth/refresh",
  SHORTEST_PATH: "/api/path/shortest",

  // 홈 화면 데이터 관련 (추가)
  WEATHER_CURRENT: "/api/weather/current", // GET: 현재 날씨 (쿼리 파라미터 필요)
  ROUTES_HISTORY: "/api/routes/history", // GET: 최근 기록 목록
} as const;
