// src/services/pathfinding.service.ts
import { api } from "./api";
import { API_ENDPOINTS } from "../constants/api.constants";

export type ShortestPathRequest = {
  // ⚠️ 여기 키 이름은 Swagger에서 "요청 예제"에 나와 있는 이름으로 맞춰야 함
  // 예시로 startLat/startLng/endLat/endLng 라고 적어둘게
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
};

export const PathfindingService = {
  async searchShortest(payload: ShortestPathRequest) {
    // 실제로는 api.post 한 번만 하면 끝
    const res = await api.post(API_ENDPOINTS.SHORTEST_PATH, payload);
    return res.data; // 화면 쪽에서는 result = await PathfindingService.searchShortest(...)
  },
};