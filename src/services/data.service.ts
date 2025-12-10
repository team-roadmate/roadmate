// src/services/data.service.ts
import { API_ENDPOINTS } from "../constants/api.constants";
import {
  RouteDetailResponse,
  RouteHistoryResponse,
  RouteStartResponse,
  SetCourseRequest,
  VoidResponse,
  WalkRouteCompleteRequest,
  WalkRouteStartRequest,
  WeatherResponse,
} from "../types/data.types";
import { api } from "./api";

export const dataService = {
  /**
   * 현재 위치의 날씨 정보를 가져옵니다.
   */
  async fetchCurrentWeather(
    lat: number,
    lon: number
  ): Promise<WeatherResponse> {
    const response = await api.get<WeatherResponse>(
      `${API_ENDPOINTS.WEATHER_CURRENT}?lat=${lat}&lon=${lon}`
    );
    return response.data;
  },

  // ----------------------------------------------------
  // 🚶 산책 경로 관련 API (WalkRouteController)
  // ----------------------------------------------------

  // 1. 산책 시작: POST /api/routes/start
  async startWalk(request: WalkRouteStartRequest): Promise<RouteStartResponse> {
    const response = await api.post<RouteStartResponse>(
      API_ENDPOINTS.ROUTE_START,
      request
    );
    return response.data;
  },

  // 2. 단일 산책 기록 조회: GET /api/routes/{routeId}
  async getRouteById(routeId: number): Promise<RouteDetailResponse> {
    const response = await api.get<RouteDetailResponse>(
      API_ENDPOINTS.ROUTE_DETAIL_OR_DELETE(routeId)
    );
    return response.data;
  },

  // 3. 산책 완료: PUT /api/routes/{routeId}/complete
  async completeWalk(
    routeId: number,
    request: WalkRouteCompleteRequest // 정확한 DTO 타입 사용
  ): Promise<VoidResponse> {
    const response = await api.put<VoidResponse>(
      API_ENDPOINTS.ROUTE_COMPLETE(routeId),
      request
    );
    return response.data;
  },

  // 4. 코스 지정: PUT /api/routes/{routeId}/set-course
  async setRouteAsCourse(
    routeId: number,
    request: SetCourseRequest // 정확한 DTO 타입 사용
  ): Promise<VoidResponse> {
    const response = await api.put<VoidResponse>(
      API_ENDPOINTS.ROUTE_SET_COURSE(routeId),
      request
    );
    return response.data;
  },

  // 5. 코스 지정 해제: PUT /api/routes/{routeId}/unset-course
  async unsetRouteAsCourse(routeId: number): Promise<VoidResponse> {
    const response = await api.put<VoidResponse>(
      API_ENDPOINTS.ROUTE_UNSET_COURSE(routeId)
    );
    return response.data;
  },

  // 6. 전체 기록 조회: GET /api/routes/history
  async fetchRouteHistory(): Promise<RouteHistoryResponse> {
    const response = await api.get<RouteHistoryResponse>(
      API_ENDPOINTS.ROUTES_HISTORY
    );
    return response.data;
  },

  // 7. 저장된 코스 목록 조회: GET /api/routes/courses
  async fetchSavedCourses(): Promise<RouteHistoryResponse> {
    const response = await api.get<RouteHistoryResponse>(
      API_ENDPOINTS.ROUTES_COURSES
    );
    return response.data;
  },

  // 8. 산책 기록 삭제 (Soft Delete): DELETE /api/routes/{routeId}
  async deleteRoute(routeId: number): Promise<VoidResponse> {
    const response = await api.delete<VoidResponse>(
      API_ENDPOINTS.ROUTE_DETAIL_OR_DELETE(routeId)
    );
    return response.data;
  },
};
