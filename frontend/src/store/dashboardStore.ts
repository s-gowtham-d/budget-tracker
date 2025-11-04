// import { create } from 'zustand';
// import type { DashboardSummary } from '@/types';
// import { dashboardAPI } from '@/lib/api';

// interface DashboardState {
//     summary: DashboardSummary | null;
//     isLoading: boolean;
//     error: string | null;
//     fetchSummary: () => Promise<void>;
// }

// export const useDashboardStore = create<DashboardState>((set) => ({
//     summary: null,
//     isLoading: false,
//     error: null,

//     fetchSummary: async () => {
//         set({ isLoading: true, error: null });
//         try {
//             const response = await dashboardAPI.getSummary();
//             set({ summary: response.data, isLoading: false });
//         } catch (error: any) {
//             set({
//                 error: error.message || 'Failed to fetch dashboard summary',
//                 isLoading: false
//             });
//         }
//     },
// }));

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { dashboardAPI } from "@/lib/api";

interface Transaction {
  id: number;
  name: string;
  amount: number;
  type: string;
  category: { name: string; icon: string };
  date: string;
}

interface DashboardSummary {
  summary: {
    total_income: number;
    total_expenses: number;
    balance: number;
  };
  budget: {
    total_budget: number;
    total_spent: number;
    percentage_used: number;
  };
  monthly_data: any[];
  category_breakdown: any[];
}

interface DashboardState {
  summary: DashboardSummary | null;
  recentTransactions: Transaction[];
  isLoading: boolean;
  error: string | null;

  fetchSummary: () => Promise<void>;
  fetchRecentTransactions: (limit?: number) => Promise<void>;
  clearError: () => void;
  clearDashboard: () => void;
}

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set, get) => ({
      summary: null,
      recentTransactions: [],
      isLoading: false,
      error: null,

      fetchSummary: async () => {
        set({ isLoading: true, error: null });
        try {
          const res = await dashboardAPI.getSummary();
          set({ summary: res.data, isLoading: false });
        } catch (error: any) {
          set({
            error: error.message || "Failed to load dashboard summary",
            isLoading: false,
          });
        }
      },

      fetchRecentTransactions: async (limit = 5) => {
        set({ isLoading: true, error: null });
        try {
          const res = await dashboardAPI.getRecentTransactions(limit);
          set({ recentTransactions: res.data, isLoading: false });
        } catch (error: any) {
          set({
            error: error.message || "Failed to load recent transactions",
            isLoading: false,
          });
        }
      },

      clearError: () => set({ error: null }),

      clearDashboard: () =>
        set({
          summary: null,
          recentTransactions: [],
          error: null,
        }),
    }),
    {
      name: "dashboard-store", // key name in localStorage
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        summary: state.summary,
        recentTransactions: state.recentTransactions,
      }),
      onRehydrateStorage: () => (state) => {
        console.log("✅ Dashboard store rehydrated:", state);
      },
    }
  )
);
