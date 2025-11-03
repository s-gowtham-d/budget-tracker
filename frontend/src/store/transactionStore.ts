
// import { create } from 'zustand';
// import type { TransactionState, Transaction, FilterParams } from '@/types';
// import { transactionAPI } from '@/lib/api';

// export const useTransactionStore = create<TransactionState>((set, get) => ({
//     transactions: [],
//     filteredTransactions: [],
//     isLoading: false,

//     fetchTransactions: async () => {
//         set({ isLoading: true });
//         try {
//             const response = await transactionAPI.getAll();
//             set({
//                 transactions: response.data,
//                 filteredTransactions: response.data,
//                 isLoading: false,
//             });
//         } catch (error) {
//             console.error('Error fetching transactions:', error);
//             set({ isLoading: false });
//         }
//     },

//     addTransaction: (transaction: Omit<Transaction, 'id'>) => {
//         const newTransaction: Transaction = {
//             ...transaction,
//             id: Date.now(),
//         };
//         set((state) => ({
//             transactions: [newTransaction, ...state.transactions],
//             filteredTransactions: [newTransaction, ...state.filteredTransactions],
//         }));

//         // API call
//         transactionAPI.create(newTransaction).catch(console.error);
//     },

//     updateTransaction: (id: string | number, updates: Partial<Transaction>) => {
//         set((state) => ({
//             transactions: state.transactions.map((t) =>
//                 t.id === id ? { ...t, ...updates } : t
//             ),
//             filteredTransactions: state.filteredTransactions.map((t) =>
//                 t.id === id ? { ...t, ...updates } : t
//             ),
//         }));

//         // API call
//         transactionAPI.update(id, updates).catch(console.error);
//     },

//     deleteTransaction: (id: string | number) => {
//         set((state) => ({
//             transactions: state.transactions.filter((t) => t.id !== id),
//             filteredTransactions: state.filteredTransactions.filter((t) => t.id !== id),
//         }));

//         // API call
//         transactionAPI.delete(id).catch(console.error);
//     },

//     filterTransactions: (filters: FilterParams) => {
//         const { transactions } = get();
//         let filtered = [...transactions];

//         if (filters.type && filters.type !== 'all') {
//             filtered = filtered.filter((t) => t.type === filters.type);
//         }

//         if (filters.category && filters.category !== 'all') {
//             filtered = filtered.filter((t) => t.category === filters.category);
//         }

//         if (filters.minAmount) {
//             filtered = filtered.filter(
//                 (t) => Math.abs(t.amount) >= parseFloat(filters.minAmount!)
//             );
//         }

//         if (filters.maxAmount) {
//             filtered = filtered.filter(
//                 (t) => Math.abs(t.amount) <= parseFloat(filters.maxAmount!)
//             );
//         }

//         if (filters.startDate) {
//             filtered = filtered.filter((t) => new Date(t.date) >= filters.startDate!);
//         }

//         if (filters.endDate) {
//             filtered = filtered.filter((t) => new Date(t.date) <= filters.endDate!);
//         }

//         set({ filteredTransactions: filtered });
//     },
// }));


import { create } from 'zustand';
import type { Transaction, Category, PaginatedResponse } from '@/types';
import { transactionAPI, categoryAPI } from '@/lib/api';
import { AxiosError } from 'axios';

interface TransactionState {
    transactions: PaginatedResponse<Transaction> | null;
    categories: Category[];
    isLoading: boolean;
    error: string | null;
    currentPage: number;

    fetchTransactions: (params?: any) => Promise<void>;
    fetchCategories: () => Promise<void>;
    addTransaction: (transaction: any) => Promise<void>;
    updateTransaction: (id: string | number, transaction: any) => Promise<void>;
    deleteTransaction: (id: string | number) => Promise<void>;
    setPage: (page: number) => void;
}

export const useTransactionStore = create<TransactionState>((set, get) => ({
    transactions: null,
    categories: [],
    isLoading: false,
    error: null,
    currentPage: 1,

    fetchTransactions: async (params = {}) => {
        set({ isLoading: true, error: null });
        try {
            const response = await transactionAPI.getAll({
                page: get().currentPage,
                ...params,
            });
            set({
                transactions: response.data,
                isLoading: false
            });
        } catch (error) {
            const axiosError = error as AxiosError;
            set({
                error: axiosError.message || 'Failed to fetch transactions',
                isLoading: false
            });
        }
    },

    fetchCategories: async () => {
        try {
            const response = await categoryAPI.getAll();
            set({ categories: response.data?.results || [] });
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        }
    },

    addTransaction: async (transaction: any) => {
        set({ isLoading: true, error: null });
        try {
            await transactionAPI.create(transaction);
            // Refetch to get updated list
            await get().fetchTransactions();
        } catch (error) {
            const axiosError = error as AxiosError<any>;
            set({
                error: axiosError.response?.data?.message || 'Failed to add transaction',
                isLoading: false
            });
            throw error;
        }
    },

    updateTransaction: async (id: string | number, transaction: any) => {
        set({ isLoading: true, error: null });
        try {
            await transactionAPI.update(id, transaction);
            await get().fetchTransactions();
        } catch (error) {
            const axiosError = error as AxiosError<any>;
            set({
                error: axiosError.response?.data?.message || 'Failed to update transaction',
                isLoading: false
            });
            throw error;
        }
    },

    deleteTransaction: async (id: string | number) => {
        set({ isLoading: true, error: null });
        try {
            await transactionAPI.delete(id);
            await get().fetchTransactions();
        } catch (error) {
            const axiosError = error as AxiosError<any>;
            set({
                error: axiosError.response?.data?.message || 'Failed to delete transaction',
                isLoading: false
            });
            throw error;
        }
    },

    setPage: (page: number) => {
        set({ currentPage: page });
        get().fetchTransactions();
    },
}));