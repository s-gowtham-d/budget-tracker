
import type { Transaction } from '@/types';
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
        const token = localStorage.getItem('token');
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
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('token');
            window.location.href = '/auth';
        }
        return Promise.reject(error);
    }
);

// API endpoints
export const authAPI = {
    login: (email: string, password: string) =>
        api.post('/auth/login/', { email, password }),
    register: (name: string, email: string, password: string) =>
        api.post('/auth/register/', { name, email, password }),
    logout: () => api.post('/auth/logout/'),
    getProfile: () => api.get('/auth/profile/'),
};

export const transactionAPI = {
    getAll: () => api.get('/transactions/'),
    getById: (id: string | number) => api.get(`/transactions/${id}/`),
    create: (data: Partial<Transaction>) => api.post('/transactions/', data),
    update: (id: string | number, data: Partial<Transaction>) =>
        api.put(`/transactions/${id}/`, data),
    delete: (id: string | number) => api.delete(`/transactions/${id}/`),
};

export const budgetAPI = {
    getAll: () => api.get('/budgets/'),
    update: (category: string, amount: number) =>
        api.put(`/budgets/${category}/`, { amount }),
    getComparison: () => api.get('/budgets/comparison/'),
};

export const dashboardAPI = {
    getSummary: () => api.get('/dashboard/summary/'),
    getRecentTransactions: () => api.get('/dashboard/transactions/recent/'),
};

export default api;
