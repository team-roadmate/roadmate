// src/services/data.service.ts (새로 생성)
import { API_ENDPOINTS } from "../constants/api.constants";
import { RouteHistoryResponse, WeatherResponse } from "../types/data.types";
import { api } from "./api"; // JWT 인터셉터가 적용된 api 인스턴스 사용

export const dataService = {
  /**
   * 현재 위치의 날씨 정보를 가져옵니다.
   * 참고: 위도/경도는 장치에서 GPS를 통해 얻어야 합니다.
   */
  async fetchCurrentWeather(
    lat: number,
    lon: number
  ): Promise<WeatherResponse> {
    const response = await api.get<WeatherResponse>(
      `${API_ENDPOINTS.WEATHER_CURRENT}?lat=${lat}&lon=${lon}`
    );
    // 날씨 API는 ApiResponse 래퍼가 없으므로 data를 직접 반환
    return response.data;
  },

  /**
   * 사용자의 최근 경로 기록 목록을 가져옵니다.
   * 인증이 필요한 요청이므로, 'api' 인스턴스를 사용합니다.
   */
  async fetchRouteHistory(): Promise<RouteHistoryResponse> {
    const response = await api.get<RouteHistoryResponse>(
      API_ENDPOINTS.ROUTES_HISTORY
    );
    return response.data;
  },
};
