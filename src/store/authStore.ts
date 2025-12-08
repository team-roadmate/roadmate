// src/store/authStore.ts
import { create } from "zustand";
import { authService } from "../services/auth.service";
import { LoginRequest, SignupRequest } from "../types/auth.types";
import { storage } from "../utils/storage";

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  login: (credentials: LoginRequest) => Promise<void>;
  signup: (data: SignupRequest) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.login(credentials);

      if (response.success) {
        const { accessToken, refreshToken } = response.data;
        await storage.setTokens(accessToken, refreshToken);
        set({ isAuthenticated: true, isLoading: false });
      } else {
        throw new Error(response.message);
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "로그인에 실패했습니다";
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  signup: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.signup(data);

      if (response.success) {
        const { accessToken, refreshToken } = response.data;
        await storage.setTokens(accessToken, refreshToken);
        set({ isAuthenticated: true, isLoading: false });
      } else {
        throw new Error(response.message);
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "회원가입에 실패했습니다";
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    try {
      await storage.clearTokens();
      set({ isAuthenticated: false, error: null });
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  },

  checkAuth: async () => {
    const token = await storage.getAccessToken();
    set({ isAuthenticated: !!token });
  },
}));
