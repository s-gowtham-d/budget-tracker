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
  setIsAuthenticated: (isAuthenticated: boolean) => void;
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
          console.log(data);
          const response = await authAPI.register(data);
          console.log(response.data);
          const { access, refresh } = response.data;

          // Store tokens
          localStorage.setItem("access_token", access);
          localStorage.setItem("refresh_token", refresh);

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
          let errorMessage = "Registration failed";

          if (axiosError.response?.data) {
            const data = axiosError.response.data;

            if (data.details && typeof data.details === "object") {
              // Flatten all detail messages into one readable string
              const messages = Object.entries(data.details)
                .map(
                  ([field, messages]) =>
                    `${field}: ${(messages as string[]).join(", ")}`
                )
                .join(" | ");

              errorMessage = messages;
            } else if (data.message && typeof data.message === "string") {
              // Fallback to generic message if details not available
              errorMessage = data.message;
            } else if (typeof data === "string") {
              // Some APIs return plain string
              errorMessage = data;
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
      setIsAuthenticated: (isAuthenticated: boolean) => {
        set({ isAuthenticated });
      }
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
