// src/services/loopPath.service.ts
import { API_ENDPOINTS } from "../constants/api.constants";
import {
  LoopEstimateRequest,
  LoopEstimateResponse,
  LoopPathRequest,
  LoopPathResponse,
} from "../types/data.types";
import { api } from "./api";

export const LoopPathService = {
  /**
   * 1차 계산: 루프 경로 가능 여부 및 권장 거리 확인 (POST /api/walk/estimate)
   */
  async estimateLoop(
    request: LoopEstimateRequest
  ): Promise<LoopEstimateResponse> {
    const res = await api.post<LoopEstimateResponse>(
      API_ENDPOINTS.LOOP_ESTIMATE,
      request
    );
    // LoopPathController는 DTO를 직접 반환하는 것으로 보이므로 res.data 사용
    return res.data;
  },

  /**
   * 2차 생성: 실제 루프 산책 경로 생성 (POST /api/walk/loop)
   */
  async generateLoop(request: LoopPathRequest): Promise<LoopPathResponse> {
    const res = await api.post<LoopPathResponse>(
      API_ENDPOINTS.LOOP_GENERATE,
      request
    );
    return res.data;
  },
};
