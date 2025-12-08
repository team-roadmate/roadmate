// src/services/api.ts
import axios from "axios";
import { API_BASE_URL, API_ENDPOINTS } from "../constants/api.constants";
import { storage } from "../utils/storage";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터: 모든 요청에 액세스 토큰 추가
api.interceptors.request.use(
  async (config) => {
    const token = await storage.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터: 토큰 만료 시 자동 갱신
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 401 에러이고 재시도하지 않은 경우
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await storage.getRefreshToken();
        if (!refreshToken) {
          throw new Error("리프레시 토큰이 없습니다");
        }

        // 토큰 갱신 요청
        const response = await axios.post(
          `${API_BASE_URL}${API_ENDPOINTS.REFRESH}`,
          { refreshToken }
        );

        if (response.data.success) {
          const { accessToken, refreshToken: newRefreshToken } =
            response.data.data;

          // 새 토큰 저장
          await storage.setTokens(accessToken, newRefreshToken);

          // 원래 요청에 새 토큰 적용
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;

          return api(originalRequest);
        }
      } catch (refreshError) {
        // 토큰 갱신 실패 시 로그아웃 처리
        await storage.clearTokens();
        // 여기서 로그인 화면으로 리다이렉트할 수 있습니다
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
