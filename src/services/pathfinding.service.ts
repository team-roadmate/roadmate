// src/services/pathfinding.service.ts
import { API_ENDPOINTS } from "../constants/api.constants";
import {
  PathRequest,
  PathResult,
  ShortestPathResponse,
} from "../types/data.types";
import { api } from "./api";

export const PathfindingService = {
  /**
   * 최단 경로를 조회합니다. (POST 요청 - JSON Body 기반)
   */
  async searchShortestPost(
    payload: PathRequest
  ): Promise<ShortestPathResponse> {
    const res = await api.post<PathResult>(
      API_ENDPOINTS.SHORTEST_PATH,
      payload
    );
    // PathfindingController는 PathResult를 직접 반환하므로 res.data를 바로 사용합니다.
    return res.data;
  },

  /**
   * 최단 경로를 조회합니다. (GET 요청 - Query Parameter 기반)
   */
  async searchShortestGet(payload: PathRequest): Promise<ShortestPathResponse> {
    const { startLat, startLon, endLat, endLon } = payload;

    // 쿼리 파라미터를 사용하여 URL 생성
    const queryString = `?startLat=${startLat}&startLon=${startLon}&endLat=${endLat}&endLon=${endLon}`;

    const res = await api.get<PathResult>(
      `${API_ENDPOINTS.SHORTEST_PATH}${queryString}`
    );

    return res.data;
  },

  searchShortestPath: async (payload: PathRequest) => {
    // 내부적으로 POST 방식을 사용하도록 결정
    return PathfindingService.searchShortestPost(payload);
  },
};
