
import { create } from 'zustand';
import type { BudgetState, Budget } from '@/types';
import { budgetAPI } from '@/lib/api';

export const useBudgetStore = create<BudgetState>((set) => ({
    budgets: [],
    isLoading: false,

    fetchBudgets: async () => {
        set({ isLoading: true });
        try {
            const response = await budgetAPI.getAll();
            set({
                budgets: response.data,
                isLoading: false,
            });
        } catch (error) {
            console.error('Error fetching budgets:', error);
            set({ isLoading: false });
        }
    },

    updateBudget: (category: string, amount: number) => {
        set((state) => ({
            budgets: state.budgets.map((b) =>
                b.category === category ? { ...b, budget: amount } : b
            ),
        }));

        // API call
        budgetAPI.update(category, amount).catch(console.error);
    },
}));

