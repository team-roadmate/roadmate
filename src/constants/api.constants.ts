// src/constants/api.constants.ts

// TODO: 실제 API URL로 변경하세요
export const API_BASE_URL = "http://rmate.kro.kr:4080";

export const API_ENDPOINTS = {
  LOGIN: "/api/auth/login",
  SIGNUP: "/api/auth/signup",
  REFRESH: "/api/auth/refresh",
} as const;
