import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { authAPI } from '../lib/api';
import type { User } from '../types';

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (data: any) => Promise<void>;
    logout: () => Promise<void>;
    setUser: (user: User) => void;
    checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,

    login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
            const { data } = await authAPI.login(email, password);
            await SecureStore.setItemAsync('access_token', data.access);
            await SecureStore.setItemAsync('refresh_token', data.refresh);
            set({ user: data.user, isAuthenticated: true, isLoading: false });
        } catch (error: any) {
            set({ error: error.response?.data?.detail || 'Login failed', isLoading: false });
            throw error;
        }
    },

    register: async (data: any) => {
        set({ isLoading: true, error: null });
        try {
            const response = await authAPI.register(data);
            await SecureStore.setItemAsync('access_token', response.data.access);
            await SecureStore.setItemAsync('refresh_token', response.data.refresh);
            set({ user: response.data.user, isAuthenticated: true, isLoading: false });
        } catch (error: any) {
            set({ error: error.response?.data?.email?.[0] || 'Registration failed', isLoading: false });
            throw error;
        }
    },

    logout: async () => {
        await SecureStore.deleteItemAsync('access_token');
        await SecureStore.deleteItemAsync('refresh_token');
        set({ user: null, isAuthenticated: false });
    },

    setUser: (user: User) => set({ user }),

    checkAuth: async () => {
        const token = await SecureStore.getItemAsync('access_token');
        set({ isAuthenticated: !!token });
    },
}));