import axios, {
  type AxiosInstance,
  AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - Add token to all requests
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("access_token");
    if (token && config.headers) {
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

    // Handle 401 errors (token expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refresh_token");
        if (refreshToken) {
          // Try to refresh token
          const response = await axios.post(
            `${API_BASE_URL}/auth/token/refresh/`,
            {
              refresh: refreshToken,
            }
          );

          const { access, refresh } = response.data;
          localStorage.setItem("access_token", access);
          localStorage.setItem("refresh_token", refresh);

          // Retry original request with new token
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${access}`;
          }
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, logout user
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/login";
        return Promise.reject(refreshError);
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

export default api;
