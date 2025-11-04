import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Budget } from "@/types";
import { budgetAPI } from "@/lib/api";
import { AxiosError } from "axios";

interface BudgetState {
  budgets: Budget[];
  comparison: any[];
  isLoading: boolean;
  error: string | null;

  fetchBudgets: (month?: string) => Promise<void>;
  fetchComparison: (month?: string) => Promise<void>;
  updateBudget: (id: number, data: any) => Promise<void>;
  createBudget: (data: any) => Promise<void>;
  clearError: () => void;
  clearAll: () => void;
}

export const useBudgetStore = create<BudgetState>()(
  persist(
    (set, get) => ({
      budgets: [],
      comparison: [],
      isLoading: false,
      error: null,

      fetchBudgets: async (month?: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await budgetAPI.getAll({ month });
          set({ budgets: response.data, isLoading: false });
        } catch (error) {
          const axiosError = error as AxiosError;
          set({
            error: axiosError.message || "Failed to fetch budgets",
            isLoading: false,
          });
        }
      },

      fetchComparison: async (month?: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await budgetAPI.comparison(month);
          set({ comparison: response.data, isLoading: false });
        } catch (error) {
          const axiosError = error as AxiosError;
          set({
            error: axiosError.message || "Failed to fetch comparison",
            isLoading: false,
          });
        }
      },

      updateBudget: async (id: number, data: any) => {
        set({ isLoading: true, error: null });
        try {
          await budgetAPI.update(id, data);
          await get().fetchBudgets();
        } catch (error) {
          const axiosError = error as AxiosError<any>;
          set({
            error:
              axiosError.response?.data?.message || "Failed to update budget",
            isLoading: false,
          });
          throw error;
        }
      },

      createBudget: async (data: any) => {
        set({ isLoading: true, error: null });
        try {
          await budgetAPI.create(data);
          await get().fetchBudgets();
        } catch (error) {
          const axiosError = error as AxiosError<any>;
          set({
            error:
              axiosError.response?.data?.message || "Failed to create budget",
            isLoading: false,
          });
          throw error;
        }
      },

      clearError: () => set({ error: null }),
      clearAll: () => set({ budgets: [], comparison: [], error: null }),
    }),
    {
      name: "budget-store",
      partialize: (state) => ({
        budgets: state.budgets,
        comparison: state.comparison,
      }),
      onRehydrateStorage: () => (state) => {
        console.log("✅ Budget store rehydrated", state);
      },
    }
  )
);
