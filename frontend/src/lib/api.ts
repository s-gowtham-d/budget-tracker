
// import type { Transaction } from '@/types';
// import axios, { type AxiosInstance, AxiosError, type InternalAxiosRequestConfig } from 'axios';

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// // Create axios instance
// const api: AxiosInstance = axios.create({
//     baseURL: API_BASE_URL,
//     timeout: 10000,
//     headers: {
//         'Content-Type': 'application/json',
//     },
// });

// // Request interceptor - Add token to all requests
// api.interceptors.request.use(
//     (config: InternalAxiosRequestConfig) => {
//         const token = localStorage.getItem('token');
//         if (token && config.headers) {
//             config.headers.Authorization = `Bearer ${token}`;
//         }
//         return config;
//     },
//     (error: AxiosError) => {
//         return Promise.reject(error);
//     }
// );

// // Response interceptor - Handle errors globally
// api.interceptors.response.use(
//     (response) => response,
//     (error: AxiosError) => {
//         if (error.response?.status === 401) {
//             // Token expired or invalid
//             localStorage.removeItem('token');
//             window.location.href = '/auth';
//         }
//         return Promise.reject(error);
//     }
// );

// // API endpoints
// export const authAPI = {
//     login: (email: string, password: string) =>
//         api.post('/auth/login/', { email, password }),
//     register: (name: string, email: string, password: string) =>
//         api.post('/auth/register/', { name, email, password }),
//     logout: () => api.post('/auth/logout/'),
//     getProfile: () => api.get('/auth/profile/'),
// };

// export const transactionAPI = {
//     getAll: () => api.get('/transactions/'),
//     getById: (id: string | number) => api.get(`/transactions/${id}/`),
//     create: (data: Partial<Transaction>) => api.post('/transactions/', data),
//     update: (id: string | number, data: Partial<Transaction>) =>
//         api.put(`/transactions/${id}/`, data),
//     delete: (id: string | number) => api.delete(`/transactions/${id}/`),
// };

// export const budgetAPI = {
//     getAll: () => api.get('/budgets/'),
//     update: (category: string, amount: number) =>
//         api.put(`/budgets/${category}/`, { amount }),
//     getComparison: () => api.get('/budgets/comparison/'),
// };

// export const dashboardAPI = {
//     getSummary: () => api.get('/dashboard/summary/'),
//     getRecentTransactions: () => api.get('/dashboard/transactions/recent/'),
// };

// export default api;

import axios, { type AxiosInstance, AxiosError, type InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// Create axios instance
const api: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - Add token to all requests
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('access_token');
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
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        // Handle 401 errors (token expired)
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refresh_token');
                if (refreshToken) {
                    // Try to refresh token
                    const response = await axios.post(`${API_BASE_URL}/auth/refresh/`, {
                        refresh: refreshToken,
                    });

                    const { access } = response.data;
                    localStorage.setItem('access_token', access);

                    // Retry original request with new token
                    if (originalRequest.headers) {
                        originalRequest.headers.Authorization = `Bearer ${access}`;
                    }
                    return api(originalRequest);
                }
            } catch (refreshError) {
                // Refresh failed, logout user
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                window.location.href = '/auth';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

// API endpoints
export const authAPI = {
    // Login - Returns access and refresh tokens
    login: (email: string, password: string) =>
        api.post('/auth/login/', { email, password }),

    // Register - Creates new user and returns tokens
    register: (data: {
        email: string;
        username: string;
        first_name: string;
        last_name: string;
        password: string;
        password_confirm: string;
    }) => api.post('/auth/register/', data),

    // Refresh access token
    refresh: (refresh: string) =>
        api.post('/auth/refresh/', { refresh }),

    // Get user profile
    getProfile: () => api.get('/auth/profile/'),

    // Update profile
    updateProfile: (data: any) => api.put('/auth/profile/', data),

    // Change password
    changePassword: (data: {
        old_password: string;
        new_password: string;
        new_password_confirm: string;
    }) => api.post('/auth/password/change/', data),
};

export const transactionAPI = {
    getAll: (params?: any) => api.get('/transactions/', { params }),
    getById: (id: string | number) => api.get(`/transactions/${id}/`),
    create: (data: any) => api.post('/transactions/', data),
    update: (id: string | number, data: any) => api.put(`/transactions/${id}/`, data),
    delete: (id: string | number) => api.delete(`/transactions/${id}/`),
    stats: () => api.get('/transactions/transactions/stats/'),
};

export const budgetAPI = {
    getAll: (params?: any) => api.get('/budgets/', { params }),
    create: (data: any) => api.post('/budgets/', data),
    update: (id: string | number, data: any) => api.put(`/budgets/${id}/`, data),
    delete: (id: string | number) => api.delete(`/budgets/${id}/`),
    comparison: (month?: string) =>
        api.get('/budgets/comparison/', { params: { month } }),
    status: () => api.get('/budgets/status/'),
};

export const dashboardAPI = {
    getSummary: () => api.get('/dashboard/summary/'),
    getRecentTransactions: (limit?: number) =>
        api.get('/dashboard/transactions/recent/', { params: { limit } }),
};

export const categoryAPI = {
    getAll: () => api.get('/categories/'),
    create: (data: any) => api.post('/categories/', data),
    update: (id: string | number, data: any) => api.put(`/categories/${id}/`, data),
    delete: (id: string | number) => api.delete(`/categories/${id}/`),
};

export default api;
