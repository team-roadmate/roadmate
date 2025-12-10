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

/**
 * 공통 Request Wrapper (에러 처리 + response.data 반환)
 */
async function requestWrapper<T>(promise: Promise<{ data: T }>): Promise<T> {
  try {
    const response = await promise;
    return response.data;
  } catch (err: any) {
    console.error("[API ERROR]", err?.response || err);
    throw err?.response?.data || err;
  }
}

export const dataService = {
  // ----------------------------------------------------
  // ☁️ 현재 날씨 조회
  // ----------------------------------------------------
  fetchCurrentWeather(lat: number, lon: number): Promise<WeatherResponse> {
    return requestWrapper(
      api.get<WeatherResponse>(
        `${API_ENDPOINTS.WEATHER_CURRENT}?lat=${lat}&lon=${lon}`
      )
    );
  }, // ---------------------------------------------------- // 🚶 산책 경로 관련 API (WalkRouteController) // ---------------------------------------------------- // 1. 산책 시작

  startWalk(request: WalkRouteStartRequest): Promise<RouteStartResponse> {
    return requestWrapper(
      api.post<RouteStartResponse>(API_ENDPOINTS.ROUTE_START, request)
    );
  }, // 2. 단일 기록 상세

  getRouteById(routeId: number): Promise<RouteDetailResponse> {
    return requestWrapper(
      api.get<RouteDetailResponse>(
        API_ENDPOINTS.ROUTE_DETAIL_OR_DELETE(routeId)
      )
    );
  }, // 3. 산책 완료

  completeWalk(
    routeId: number,
    request: WalkRouteCompleteRequest
  ): Promise<VoidResponse> {
    return requestWrapper(
      api.put<VoidResponse>(API_ENDPOINTS.ROUTE_COMPLETE(routeId), request)
    );
  }, // 4. 코스 저장

  setRouteAsCourse(
    routeId: number,
    request: SetCourseRequest
  ): Promise<VoidResponse> {
    return requestWrapper(
      api.put<VoidResponse>(API_ENDPOINTS.ROUTE_SET_COURSE(routeId), request)
    );
  }, // 5. 코스 해제

  unsetRouteAsCourse(routeId: number): Promise<VoidResponse> {
    return requestWrapper(
      api.put<VoidResponse>(API_ENDPOINTS.ROUTE_UNSET_COURSE(routeId))
    );
  }, // 6. 전체 기록 조회

  fetchRouteHistory(): Promise<RouteHistoryResponse> {
    return requestWrapper(
      api.get<RouteHistoryResponse>(API_ENDPOINTS.ROUTES_HISTORY)
    );
  }, // 7. 저장된 코스 목록 조회

  fetchSavedCourses(): Promise<RouteHistoryResponse> {
    return requestWrapper(
      api.get<RouteHistoryResponse>(API_ENDPOINTS.ROUTES_COURSES)
    );
  }, // 8. 삭제

  deleteRoute(routeId: number): Promise<VoidResponse> {
    return requestWrapper(
      api.delete<VoidResponse>(API_ENDPOINTS.ROUTE_DETAIL_OR_DELETE(routeId))
    );
  },
};
