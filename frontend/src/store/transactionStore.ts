
import { create } from 'zustand';
import type { TransactionState, Transaction, FilterParams } from '@/types';
import { transactionAPI } from '@/lib/api';

export const useTransactionStore = create<TransactionState>((set, get) => ({
    transactions: [],
    filteredTransactions: [],
    isLoading: false,

    fetchTransactions: async () => {
        set({ isLoading: true });
        try {
            const response = await transactionAPI.getAll();
            set({
                transactions: response.data,
                filteredTransactions: response.data,
                isLoading: false,
            });
        } catch (error) {
            console.error('Error fetching transactions:', error);
            set({ isLoading: false });
        }
    },

    addTransaction: (transaction: Omit<Transaction, 'id'>) => {
        const newTransaction: Transaction = {
            ...transaction,
            id: Date.now(),
        };
        set((state) => ({
            transactions: [newTransaction, ...state.transactions],
            filteredTransactions: [newTransaction, ...state.filteredTransactions],
        }));

        // API call
        transactionAPI.create(newTransaction).catch(console.error);
    },

    updateTransaction: (id: string | number, updates: Partial<Transaction>) => {
        set((state) => ({
            transactions: state.transactions.map((t) =>
                t.id === id ? { ...t, ...updates } : t
            ),
            filteredTransactions: state.filteredTransactions.map((t) =>
                t.id === id ? { ...t, ...updates } : t
            ),
        }));

        // API call
        transactionAPI.update(id, updates).catch(console.error);
    },

    deleteTransaction: (id: string | number) => {
        set((state) => ({
            transactions: state.transactions.filter((t) => t.id !== id),
            filteredTransactions: state.filteredTransactions.filter((t) => t.id !== id),
        }));

        // API call
        transactionAPI.delete(id).catch(console.error);
    },

    filterTransactions: (filters: FilterParams) => {
        const { transactions } = get();
        let filtered = [...transactions];

        if (filters.type && filters.type !== 'all') {
            filtered = filtered.filter((t) => t.type === filters.type);
        }

        if (filters.category && filters.category !== 'all') {
            filtered = filtered.filter((t) => t.category === filters.category);
        }

        if (filters.minAmount) {
            filtered = filtered.filter(
                (t) => Math.abs(t.amount) >= parseFloat(filters.minAmount!)
            );
        }

        if (filters.maxAmount) {
            filtered = filtered.filter(
                (t) => Math.abs(t.amount) <= parseFloat(filters.maxAmount!)
            );
        }

        if (filters.startDate) {
            filtered = filtered.filter((t) => new Date(t.date) >= filters.startDate!);
        }

        if (filters.endDate) {
            filtered = filtered.filter((t) => new Date(t.date) <= filters.endDate!);
        }

        set({ filteredTransactions: filtered });
    },
}));

