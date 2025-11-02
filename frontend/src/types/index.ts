
export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
}

export interface Transaction {
    id: string | number;
    name: string;
    category: string;
    amount: number;
    type: 'income' | 'expense';
    date: string;
    icon: string;
    description?: string;
}

export interface Budget {
    category: string;
    budget: number;
    spent: number;
    icon: string;
    transactions: number;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    setUser: (user: User) => void;
}

export interface TransactionState {
    transactions: Transaction[];
    filteredTransactions: Transaction[];
    isLoading: boolean;
    addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
    updateTransaction: (id: string | number, transaction: Partial<Transaction>) => void;
    deleteTransaction: (id: string | number) => void;
    filterTransactions: (filters: FilterParams) => void;
    fetchTransactions: () => Promise<void>;
}

export interface BudgetState {
    budgets: Budget[];
    isLoading: boolean;
    updateBudget: (category: string, amount: number) => void;
    fetchBudgets: () => Promise<void>;
}

export interface FilterParams {
    type?: 'all' | 'income' | 'expense';
    category?: string;
    minAmount?: string;
    maxAmount?: string;
    startDate?: Date | null;
    endDate?: Date | null;
}
