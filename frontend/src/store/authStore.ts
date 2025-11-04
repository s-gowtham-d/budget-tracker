import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types";
import { authAPI, userAPI } from "@/lib/api";
import { AxiosError } from "axios";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  clearError: () => void;
}

interface RegisterData {
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  password: string;
  password_confirm: string;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authAPI.login(email, password);
          const { access, refresh } = response.data;

          // Store tokens
          localStorage.setItem("access_token", access);
          localStorage.setItem("refresh_token", refresh);

          // Fetch user profile
          const profileResponse = await userAPI.getProfile();
          const user = profileResponse.data;

          set({
            user,
            accessToken: access,
            refreshToken: refresh,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          const axiosError = error as AxiosError<any>;
          const errorMessage =
            axiosError.response?.data?.detail ||
            axiosError.response?.data?.message ||
            axiosError.response?.data?.non_field_errors?.[0] ||
            "Invalid email or password";

          set({
            isLoading: false,
            error: errorMessage,
            isAuthenticated: false,
          });
          throw new Error(errorMessage);
        }
      },

      register: async (data: RegisterData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authAPI.register(data);
          const { access, refresh, user } = response.data;

          // Store tokens
          localStorage.setItem("access_token", access);
          localStorage.setItem("refresh_token", refresh);

          set({
            user,
            accessToken: access,
            refreshToken: refresh,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          const axiosError = error as AxiosError<any>;

          // Handle different error formats
          let errorMessage = "Registration failed";

          if (axiosError.response?.data) {
            const data = axiosError.response.data;

            // Handle field-specific errors
            if (data.email) {
              errorMessage = Array.isArray(data.email)
                ? data.email[0]
                : data.email;
            } else if (data.username) {
              errorMessage = Array.isArray(data.username)
                ? data.username[0]
                : data.username;
            } else if (data.password) {
              errorMessage = Array.isArray(data.password)
                ? data.password[0]
                : data.password;
            } else if (data.non_field_errors) {
              errorMessage = Array.isArray(data.non_field_errors)
                ? data.non_field_errors[0]
                : data.non_field_errors;
            } else if (data.detail) {
              errorMessage = data.detail;
            } else if (data.message) {
              errorMessage = data.message;
            }
          }

          set({
            isLoading: false,
            error: errorMessage,
            isAuthenticated: false,
          });
          throw new Error(errorMessage);
        }
      },

      logout: () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          error: null,
        });
      },

      setUser: (user: User) => {
        set({ user });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
