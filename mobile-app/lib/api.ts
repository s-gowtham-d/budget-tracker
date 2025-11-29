import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_URL = 'http://172.26.80.1:8000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(async (config) => {
    const token = await SecureStore.getItemAsync('access_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = await SecureStore.getItemAsync('refresh_token');
                const { data } = await axios.post(`${API_URL}/auth/token/refresh/`, { refresh: refreshToken });
                await SecureStore.setItemAsync('access_token', data.access);
                originalRequest.headers.Authorization = `Bearer ${data.access}`;
                return api(originalRequest);
            } catch {
                await SecureStore.deleteItemAsync('access_token');
                await SecureStore.deleteItemAsync('refresh_token');
            }
        }
        return Promise.reject(error);
    }
);

export const authAPI = {
    login: (email: string, password: string) => api.post('/auth/login/', { email, password }),
    register: (data: any) => api.post('/auth/register/', data),
};

export const userAPI = {
    getProfile: () => api.get('/auth/users/profile/'),
    updateProfile: (data: any) => api.patch('/auth/users/profile/', data),
};

export const dashboardAPI = {
    getSummary: () => api.get('/dashboard/summary/'),
    getRecentTransactions: () => api.get('/dashboard/transactions/recent/'),
};

export const transactionAPI = {
    getAll: (params?: any) => api.get('/transactions/', { params }),
    create: (data: any) => api.post('/transactions/', data),
    update: (id: string, data: any) => api.put(`/transactions/${id}/`, data),
    delete: (id: string) => api.delete(`/transactions/${id}/`),
};

export const budgetAPI = {
    getAll: () => api.get('/budgets/'),
    create: (data: any) => api.post('/budgets/', data),
};

export default api;