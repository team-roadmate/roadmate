// src/services/auth.service.ts
import { API_ENDPOINTS } from "../constants/api.constants";
import {
  ApiResponse,
  AuthTokens,
  LoginRequest,
  SignupRequest,
} from "../types/auth.types";
import { api } from "./api";

export const authService = {
  async login(credentials: LoginRequest): Promise<ApiResponse<AuthTokens>> {
    const response = await api.post(API_ENDPOINTS.LOGIN, credentials);
    return response.data;
  },

  async signup(data: SignupRequest): Promise<ApiResponse<AuthTokens>> {
    const response = await api.post(API_ENDPOINTS.SIGNUP, data);
    return response.data;
  },

  async refresh(refreshToken: string): Promise<ApiResponse<AuthTokens>> {
    const response = await api.post(API_ENDPOINTS.REFRESH, { refreshToken });
    return response.data;
  },
};
