
// export interface User {
//     id: string;
//     name: string;
//     email: string;
//     avatar?: string;
// }

// export interface Transaction {
//     id: string | number;
//     name: string;
//     category: string;
//     amount: number;
//     type: 'income' | 'expense';
//     date: string;
//     icon: string;
//     description?: string;
// }

// export interface Budget {
//     category: string;
//     budget: number;
//     spent: number;
//     icon: string;
//     transactions: number;
// }

// export interface AuthState {
//     user: User | null;
//     token: string | null;
//     isAuthenticated: boolean;
//     isLoading: boolean;
//     login: (email: string, password: string) => Promise<void>;
//     register: (name: string, email: string, password: string) => Promise<void>;
//     logout: () => void;
//     setUser: (user: User) => void;
// }

// export interface TransactionState {
//     // transactions: Transaction[];
//     transactions: any;
//     filteredTransactions: Transaction[];
//     isLoading: boolean;
//     addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
//     updateTransaction: (id: string | number, transaction: Partial<Transaction>) => void;
//     deleteTransaction: (id: string | number) => void;
//     filterTransactions: (filters: FilterParams) => void;
//     fetchTransactions: () => Promise<void>;
// }

// export interface BudgetState {
//     budgets: Budget[];
//     isLoading: boolean;
//     updateBudget: (category: string, amount: number) => void;
//     fetchBudgets: () => Promise<void>;
// }

// export interface FilterParams {
//     type?: 'all' | 'income' | 'expense';
//     category?: string;
//     minAmount?: string;
//     maxAmount?: string;
//     startDate?: Date | null;
//     endDate?: Date | null;
// }

// export interface DashboardState {
//     summary: {
//         totalIncome: number;
//         totalExpense: number;
//         netBalance: number;
//     };
//     recentTransactions: Transaction[];
//     isLoading: boolean;
//     fetchSummary: () => Promise<void>;
//     fetchRecentTransactions: () => Promise<void>;
// }

export interface User {
    id: string;
    email: string;
    username: string;
    first_name: string;
    last_name: string;
    full_name?: string;
    avatar?: string;
    phone?: string;
    currency?: string;
    language?: string;
    theme?: string;
    email_notifications?: boolean;
    transaction_alerts?: boolean;
    budget_alerts?: boolean;
    created_at?: string;
}

export interface Transaction {
    id: string | number;
    name: string;
    category: number;
    category_name?: string;
    category_icon?: string;
    amount: number;
    type: 'income' | 'expense';
    date: string;
    description?: string;
    icon?: string;
    created_at?: string;
    updated_at?: string;
}

export interface Category {
    id: number;
    name: string;
    type: 'income' | 'expense';
    icon: string;
    color: string;
    transaction_count?: number;
    created_at?: string;
}

export interface Budget {
    id: number;
    category: number;
    category_name?: string;
    category_icon?: string;
    amount: number;
    month: string;
    spent?: number;
    remaining?: number;
    percentage_used?: number;
    created_at?: string;
    updated_at?: string;
}

export interface DashboardSummary {
    summary: {
        total_income: number;
        total_expenses: number;
        balance: number;
        transaction_count: number;
    };
    budget: {
        total_budget: number;
        total_spent: number;
        remaining: number;
        percentage_used: number;
    };
    monthly_data: Array<{
        month: string;
        income: number;
        expense: number;
    }>;
    category_breakdown: Array<{
        category: string;
        amount: number;
        icon?: string;
    }>;
}

export interface PaginatedResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}
