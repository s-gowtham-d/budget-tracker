// types/index.ts - Commit 4
export interface User {
    id: string;
    email: string;
    username: string;
    first_name: string;
    last_name: string;
    avatar?: string;
    phone?: string;
    currency: string;
    language: string;
    theme: 'light' | 'dark' | 'system';
    email_notifications: boolean;
    transaction_alerts: boolean;
    budget_alerts: boolean;
}

export interface Transaction {
    id: string;
    amount: number;
    type: 'income' | 'expense';
    category: string;
    description: string;
    date: string;
    payment_method?: string;
}

export interface Budget {
    id: string;
    category: string;
    amount: number;
    spent: number;
    period: 'monthly' | 'weekly';
}

export interface DashboardSummary {
    total_income: number;
    total_expenses: number;
    balance: number;
    budget: {
        total_budget: number;
        total_spent: number;
        percentage_used: number;
    };
}