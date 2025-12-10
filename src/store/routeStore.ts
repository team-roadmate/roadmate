// src/store/routeStore.ts
import { create } from "zustand";
import { dataService } from "../services/data.service";
import { LoopPathService } from "../services/loopPath.service"; // LoopPathService 임포트
import { PathfindingService } from "../services/pathfinding.service";
import {
  LoopEstimateRequest, // 루프 경로 타입 임포트
  LoopEstimateResponse,
  LoopPathRequest,
  LoopPathResponse,
  PathRequest,
  PathResult,
  SetCourseRequest,
  WalkRoute,
  WalkRouteCompleteRequest,
  WalkRouteStartRequest,
} from "../types/data.types";

interface RouteState {
  // 🏞️ 경로 탐색 관련 상태
  currentPathResult: PathResult | null;
  isLoadingPath: boolean;

  // 🔄 루프 경로 관련 상태 (신규)
  loopEstimateResult: LoopEstimateResponse | null;
  loopPathResult: LoopPathResponse | null;
  isLoadingLoop: boolean;

  // 🚶 주행/기록 관련 상태
  activeRouteId: number | null;
  isWalking: boolean;

  // 📜 기록 관련 상태
  historyList: WalkRoute[];
  courseList: WalkRoute[];
  isLoadingHistory: boolean;
  error: string | null;

  // 🏞️ 경로 탐색 액션
  searchShortestPath: (request: PathRequest) => Promise<void>;

  // 🔄 루프 경로 액션 (신규)
  estimateLoop: (request: LoopEstimateRequest) => Promise<void>;
  generateLoop: (request: LoopPathRequest) => Promise<void>;

  // 🚶 주행/기록 관련 액션 (이전과 동일)
  startWalk: (request: WalkRouteStartRequest) => Promise<number>;
  completeWalk: (
    routeId: number,
    request: WalkRouteCompleteRequest
  ) => Promise<void>;
  setCourse: (routeId: number, request: SetCourseRequest) => Promise<void>;
  unSetCourse: (routeId: number) => Promise<void>;
  fetchRouteHistory: () => Promise<void>;
  fetchSavedCourses: () => Promise<void>;
  deleteRoute: (routeId: number) => Promise<void>;
  resetWalk: () => void;
}

export const useRouteStore = create<RouteState>((set, get) => ({
  // 🏞️ 경로 탐색 상태 초기화
  currentPathResult: null,
  isLoadingPath: false,

  // 🔄 루프 경로 상태 초기화 (신규)
  loopEstimateResult: null,
  loopPathResult: null,
  isLoadingLoop: false,

  // 🚶 주행/기록 상태 초기화
  activeRouteId: null,
  isWalking: false,
  historyList: [],
  courseList: [],
  isLoadingHistory: false,
  error: null,

  // 🏞️ 경로 탐색 로직 (유지)
  searchShortestPath: async (request) => {
    set({ isLoadingPath: true, error: null, currentPathResult: null });
    try {
      const response = await PathfindingService.searchShortestPath(request);

      if (response && response.totalDistance > 0) {
        set({ currentPathResult: response, isLoadingPath: false });
      } else {
        set({
          currentPathResult: null,
          isLoadingPath: false,
          error: "최단 경로를 찾지 못했습니다.",
        });
      }
    } catch (error: any) {
      set({
        error: error.message || "경로 검색 중 오류 발생",
        isLoadingPath: false,
      });
    }
  },

  // 🔄 루프 경로 액션 (신규 추가)

  // 1차 계산: 루프 경로 예상 계산
  estimateLoop: async (request) => {
    set({ isLoadingLoop: true, error: null, loopEstimateResult: null });
    try {
      const response = await LoopPathService.estimateLoop(request);

      set({
        loopEstimateResult: response,
        isLoadingLoop: false,
        error: response.message || null, // 메시지가 있으면 에러 대신 안내 메시지로 처리 가능
      });
    } catch (error: any) {
      set({
        error: error.message || "루프 경로 예상 계산 중 오류 발생",
        isLoadingLoop: false,
      });
    }
  },

  // 2차 생성: 루프 산책 경로 생성
  generateLoop: async (request) => {
    set({ isLoadingLoop: true, error: null, loopPathResult: null });
    try {
      const response = await LoopPathService.generateLoop(request);

      // 컨트롤러에서 목표 거리가 0이하일 때 badRequest를 반환하므로 try-catch로 잡히지 않을 수 있음.
      // 200 OK 응답 본문에 메시지가 포함된 경우를 처리
      if (response.path && response.path.length > 0) {
        set({
          loopPathResult: response,
          isLoadingLoop: false,
          error: null,
        });
      } else {
        // 경로가 생성되지 않았거나 오류 메시지를 받은 경우
        set({
          loopPathResult: response, // 실패 메시지를 포함할 수 있음
          isLoadingLoop: false,
          error: response.message || "루프 경로 생성에 실패했습니다.",
        });
      }
    } catch (error: any) {
      set({
        error: error.message || "루프 경로 생성 중 오류 발생",
        isLoadingLoop: false,
      });
    }
  },

  // 🚶 주행/기록 관련 액션 (이전과 동일)

  startWalk: async (request) => {
    set({ isWalking: true, error: null, activeRouteId: null });
    try {
      const response = await dataService.startWalk(request);
      if (response.success) {
        const routeId = response.data;
        set({ activeRouteId: routeId });
        return routeId;
      } else {
        throw new Error(response.message || "산책 시작에 실패했습니다.");
      }
    } catch (error: any) {
      set({
        error: error.message || "산책 시작 중 오류 발생",
        isWalking: false,
      });
      throw error;
    }
  },

  completeWalk: async (routeId, request) => {
    set({ error: null });
    try {
      await dataService.completeWalk(routeId, request);
      set({ activeRouteId: null, isWalking: false });
    } catch (error: any) {
      set({ error: error.message || "산책 완료 처리에 실패했습니다." });
      throw error;
    }
  },

  setCourse: async (routeId, request) => {
    set({ error: null });
    try {
      await dataService.setRouteAsCourse(routeId, request);
      get().fetchRouteHistory();
      get().fetchSavedCourses();
    } catch (error: any) {
      set({ error: error.message || "코스 지정에 실패했습니다." });
      throw error;
    }
  },

  unSetCourse: async (routeId) => {
    set({ error: null });
    try {
      await dataService.unsetRouteAsCourse(routeId);
      get().fetchRouteHistory();
      get().fetchSavedCourses();
    } catch (error: any) {
      set({ error: error.message || "코스 지정 해제에 실패했습니다." });
      throw error;
    }
  },

  fetchRouteHistory: async () => {
    set({ isLoadingHistory: true, error: null });
    try {
      const response = await dataService.fetchRouteHistory();
      if (response.success) {
        set({ historyList: response.data, isLoadingHistory: false });
      } else {
        throw new Error(response.message || "경로 기록 조회에 실패했습니다.");
      }
    } catch (error: any) {
      set({
        error: error.message || "경로 기록을 불러오는 중 오류 발생",
        isLoadingHistory: false,
      });
    }
  },

  fetchSavedCourses: async () => {
    set({ isLoadingHistory: true, error: null });
    try {
      const response = await dataService.fetchSavedCourses();
      if (response.success) {
        set({ courseList: response.data, isLoadingHistory: false });
      } else {
        throw new Error(
          response.message || "저장된 코스 목록 조회에 실패했습니다."
        );
      }
    } catch (error: any) {
      set({
        error: error.message || "코스 목록을 불러오는 중 오류 발생",
        isLoadingHistory: false,
      });
    }
  },

  deleteRoute: async (routeId) => {
    set({ error: null });
    try {
      await dataService.deleteRoute(routeId);
      set((state) => ({
        historyList: state.historyList.filter((r) => r.routeId !== routeId),
        courseList: state.courseList.filter((r) => r.routeId !== routeId),
      }));
    } catch (error: any) {
      set({ error: error.message || "기록 삭제에 실패했습니다." });
      throw error;
    }
  },

  resetWalk: () => {
    set({ activeRouteId: null, isWalking: false });
  },
}));
