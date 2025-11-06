import { useAuthStore } from "@/store/authStore";
import axios, {
  type AxiosInstance,
  AxiosError,
  type InternalAxiosRequestConfig,
  AxiosHeaders,
} from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://api.budget.gowtham.work";

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// --- Refresh Token Logic State ---
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

// Function to process the queue of failed requests
const processQueue = (
  error: AxiosError | null,
  token: string | null = null
) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};
// --- End Refresh Token Logic State ---

// Request interceptor - Add token to all requests
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Ensure headers object exists
    if (!config.headers) {
      // @ts-nocheck
      config.headers = new AxiosHeaders();
    }

    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<any>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };
    const isAuthEndpoint =
      originalRequest.url.includes("/auth/login/") ||
      originalRequest.url.includes("/auth/register/") ||
      originalRequest.url.includes("/auth/password/");
    // Check if error response exists and it's a 401, AND not the refresh token endpoint itself
    if (
      error.response?.status === 401 &&
      !originalRequest.url?.includes("/auth/token/refresh/") &&
      !isAuthEndpoint
    ) {
      // If the original request has already been marked for retry, don't process it again
      // This is a safety net, but the queue is the primary mechanism
      if (originalRequest._retry) {
        return Promise.reject(error);
      }
      originalRequest._retry = true; // Mark as retried to prevent infinite loops for *this specific request*

      const refreshToken = localStorage.getItem("refresh_token");

      if (!refreshToken) {
        // No refresh token -> logout
        useAuthStore.getState().setIsAuthenticated(false);
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/login";
        return Promise.reject(error);
      }

      // --- Handle Race Conditions ---
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      isRefreshing = true;

      // --- Perform Refresh ---
      try {
        const response = await axios.post(
          `${API_BASE_URL}/auth/token/refresh/`,
          {
            refresh: refreshToken,
          }
        );

        const { access, refresh } = response.data;
        localStorage.setItem("access_token", access);
        if (refresh) {
          localStorage.setItem("refresh_token", refresh);
        }

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${access}`;
        }

        processQueue(null, access);

        return api(originalRequest);
      } catch (refreshError: any) {
        useAuthStore.getState().setIsAuthenticated(false);
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        processQueue(refreshError, null);
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (email: string, password: string) =>
    api.post("/auth/login/", { email, password }),

  register: (data: {
    email: string;
    username: string;
    first_name: string;
    last_name: string;
    password: string;
    password_confirm: string;
  }) => api.post("/auth/register/", data),

  refresh: (refresh: string) => api.post("/auth/token/refresh/", { refresh }),
};

export const userAPI = {
  getProfile: () => api.get("/auth/users/profile/"),

  updateProfile: (data: any) => {
    if (data instanceof FormData) {
      return api.patch("/auth/users/profile/", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    }
    return api.patch("/auth/users/profile/", data);
  },

  changePassword: (data: {
    old_password: string;
    new_password: string;
    new_password_confirm: string;
  }) => api.post("/auth/users/change-password/", data),

  exportData: () => api.get("/auth/users/export-data/"),

  deleteAccount: () => api.delete("/auth/users/profile/"),
};

export const transactionAPI = {
  getAll: (params?: any) => api.get("/transactions/", { params }),
  getById: (id: string | number) => api.get(`/transactions/${id}/`),
  create: (data: any) => api.post("/transactions/", data),
  update: (id: string | number, data: any) =>
    api.put(`/transactions/${id}/`, data),
  delete: (id: string | number) => api.delete(`/transactions/${id}/`),
  stats: () => api.get("/transactions/transactions/stats/"),
};

export const budgetAPI = {
  getAll: (params?: any) => api.get("/budgets/", { params }),
  create: (data: any) => api.post("/budgets/", data),
  update: (id: string | number, data: any) => api.put(`/budgets/${id}/`, data),
  delete: (id: string | number) => api.delete(`/budgets/${id}/`),
  comparison: (month?: string) =>
    api.get("/budgets/comparison/", { params: { month } }),
  status: () => api.get("/budgets/status/"),
  getBudgetMonths: () => api.get("/budgets/available_months/"),
};

export const dashboardAPI = {
  getSummary: () => api.get("/dashboard/summary/"),
  getRecentTransactions: (limit?: number) =>
    api.get("/dashboard/transactions/recent/", { params: { limit } }),
};

export const categoryAPI = {
  getAll: () => api.get("/categories/"),
  create: (data: any) => api.post("/categories/", data),
  update: (id: string | number, data: any) =>
    api.put(`/categories/${id}/`, data),
  delete: (id: string | number) => api.delete(`/categories/${id}/`),
};

export const chatBotAPI = {
  sendMessage: (data: {
    message: string;
    pending_transaction?: any;
    user_context?: {
      currency?: string;
      timezone?: string;
    };
  }) => api.post("/ai/chat/", data),

  getInsights: () => api.get("/ai/insights/"),

  getChatHistory: (params?: { limit?: number }) =>
    api.get("/ai/chat-history/", { params }),

  clearChatHistory: () => api.delete("/ai/chat-history/"),
};
export default api;
