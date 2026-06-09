import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AuthService } from "../services/auth.service";
import type { LoginCredentials, RegisterCredentials, UserResponse } from "../interface/auth.interface";

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => AuthService.login(credentials),
    onSuccess: (response: UserResponse) => {
      // Save user profile and a flag for session state in localStorage
      localStorage.setItem("user", JSON.stringify(response.data));
      localStorage.setItem("access_token", "session_active"); // indicator for stateful session

      // Invalidate current user query
      queryClient.setQueryData(["currentUser"], response.data);
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: RegisterCredentials) => AuthService.register(credentials),
    onSuccess: (response: UserResponse) => {
      localStorage.setItem("user", JSON.stringify(response.data));
      localStorage.setItem("access_token", "session_active");
      queryClient.setQueryData(["currentUser"], response.data);
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => AuthService.logout(),
    onSuccess: () => {
      localStorage.removeItem("user");
      localStorage.removeItem("access_token");
      queryClient.setQueryData(["currentUser"], null);
      window.location.href = "/auth";
    },
  });
};

export const useMe = () => {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      try {
        const response = await AuthService.getMe();
        localStorage.setItem("user", JSON.stringify(response.data));
        return response.data;
      } catch (error) {
        localStorage.removeItem("user");
        localStorage.removeItem("access_token");
        throw error;
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
