
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
    Bell,
    Wallet,
    TrendingUp,
    TrendingDown,
    PiggyBank,
    Download,
    Filter
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import StatCard from "@/components/dashboard/StatCard";
import BudgetProgressBar from "@/components/dashboard/BudgetProgressBar";
import IncomeExpenseChart from "@/components/dashboard/IncomeExpenseChart";
import ExpensePieChart from "@/components/dashboard/ExpensePieChart";
import RecentTransactions from "@/components/dashboard/RecentTransactions";

// Mock Data
const incomeExpenseData = [
    { month: 'Jun', income: 15000, expense: 4500 },
    { month: 'Jul', income: 16500, expense: 5200 },
    { month: 'Aug', income: 17200, expense: 4800 },
    { month: 'Sep', income: 16800, expense: 5500 },
    { month: 'Oct', income: 18000, expense: 5300 },
    { month: 'Nov', income: 18250, expense: 5800 },
];

const expenseCategoryData = [
    { category: 'Food & Dining', amount: 1200 },
    { category: 'Transportation', amount: 800 },
    { category: 'Shopping', amount: 650 },
    { category: 'Utilities', amount: 450 },
    { category: 'Entertainment', amount: 320 },
    { category: 'Others', amount: 380 },
];

const recentTransactionsData = [
    {
        id: 1,
        name: 'Salary Payment',
        category: 'Income',
        amount: 5000,
        type: 'income',
        date: '2025-11-02',
        icon: '💰'
    },
    {
        id: 2,
        name: 'Grocery Store',
        category: 'Food & Dining',
        amount: -120,
        type: 'expense',
        date: '2025-11-01',
        icon: '🛒'
    },
    {
        id: 3,
        name: 'Electric Bill',
        category: 'Utilities',
        amount: -85,
        type: 'expense',
        date: '2025-10-31',
        icon: '⚡'
    },
    {
        id: 4,
        name: 'Freelance Project',
        category: 'Income',
        amount: 1500,
        type: 'income',
        date: '2025-10-30',
        icon: '💼'
    },
    {
        id: 5,
        name: 'Restaurant',
        category: 'Food & Dining',
        amount: -45,
        type: 'expense',
        date: '2025-10-29',
        icon: '🍽️'
    },
];

export default function Dashboard() {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                {/* Header */}
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-background">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <div className="flex items-center gap-2 flex-1">
                        <h1 className="text-xl font-semibold">Dashboard</h1>
                    </div>

                    {/* Header Actions */}
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                            <Filter className="h-4 w-4 mr-2" />
                            Filter
                        </Button>
                        <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Export
                        </Button>

                        {/* Notifications */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="relative">
                                    <Bell className="h-5 w-5" />
                                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center">
                                        3
                                    </span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-80">
                                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <div className="flex flex-col gap-1">
                                        <p className="text-sm font-medium">Budget Alert</p>
                                        <p className="text-xs text-muted-foreground">
                                            You've used 78% of your monthly budget
                                        </p>
                                    </div>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <div className="flex flex-col gap-1">
                                        <p className="text-sm font-medium">New Transaction</p>
                                        <p className="text-xs text-muted-foreground">
                                            Salary payment received: $5,000
                                        </p>
                                    </div>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto p-6 bg-slate-50 dark:bg-slate-950">
                    <div className="max-w-7xl mx-auto space-y-6">

                        {/* Financial Summary Cards */}
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <StatCard
                                title="Total Income"
                                amount="$18,250.00"
                                change="+20.1%"
                                changeType="positive"
                                icon={TrendingUp}
                                iconBgColor="bg-emerald-100 dark:bg-emerald-900/20"
                            />
                            <StatCard
                                title="Total Expenses"
                                amount="$5,800.00"
                                change="+8.2%"
                                changeType="negative"
                                icon={TrendingDown}
                                iconBgColor="bg-red-100 dark:bg-red-900/20"
                            />
                            <StatCard
                                title="Total Balance"
                                amount="$12,450.00"
                                change="+12.5%"
                                changeType="positive"
                                icon={Wallet}
                                iconBgColor="bg-blue-100 dark:bg-blue-900/20"
                            />
                            <StatCard
                                title="Budget Status"
                                amount="78%"
                                change="Used"
                                changeType="neutral"
                                icon={PiggyBank}
                                iconBgColor="bg-purple-100 dark:bg-purple-900/20"
                            />
                        </div>

                        {/* Budget Progress Bar */}
                        <BudgetProgressBar
                            budget={7500}
                            spent={5850}
                            month="November 2025"
                        />

                        {/* D3.js Charts Row - REQUIRED BY ASSESSMENT */}
                        <div className="grid gap-6 md:grid-cols-2">
                            <IncomeExpenseChart data={incomeExpenseData} />
                            <ExpensePieChart data={expenseCategoryData} />
                        </div>

                        {/* Recent Transactions */}
                        <RecentTransactions
                            transactions={recentTransactionsData}
                            limit={5}
                        />

                    </div>
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}