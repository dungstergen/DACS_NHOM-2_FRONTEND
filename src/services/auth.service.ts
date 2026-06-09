import { post, get } from "../app/config/axios-configs";
import type { LoginCredentials, RegisterCredentials, UserResponse } from "../interface/auth.interface";

export const AuthService = {
  login: async (credentials: LoginCredentials): Promise<UserResponse> => {
    return post<UserResponse>({
      url: "/api/auth/login",
      data: credentials,
    });
  },

  register: async (credentials: RegisterCredentials): Promise<UserResponse> => {
    return post<UserResponse>({
      url: "/api/auth/register",
      data: credentials,
    });
  },

  logout: async (): Promise<{ message: string }> => {
    return post<{ message: string }>({
      url: "/api/auth/logout",
    });
  },

  getMe: async (): Promise<UserResponse> => {
    return get<UserResponse>({
      url: "/api/me",
    });
  },
};
