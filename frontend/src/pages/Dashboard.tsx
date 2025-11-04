
// import { useEffect } from 'react';
// import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
// import { AppSidebar } from "@/components/app-sidebar";
// import { Separator } from "@/components/ui/separator";
// import { Button } from "@/components/ui/button";
// import {
//     DropdownMenu,
//     DropdownMenuContent,
//     DropdownMenuItem,
//     DropdownMenuLabel,
//     DropdownMenuSeparator,
//     DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import {
//     Bell,
//     Wallet,
//     TrendingUp,
//     TrendingDown,
//     PiggyBank,
//     Download,
//     Filter
// } from "lucide-react";

// import StatCard from "@/components/dashboard/StatCard";
// import BudgetProgressBar from "@/components/dashboard/BudgetProgressBar";
// import IncomeExpenseChart from "@/components/dashboard/IncomeExpenseChart";
// import ExpensePieChart from "@/components/dashboard/ExpensePieChart";
// import RecentTransactions from "@/components/dashboard/RecentTransactions";

// import { useTransactionStore } from "@/store/transactionStore";
// import { useBudgetStore } from "@/store/budgetStore";

// // Mock Data (will be fetched from API)
// const incomeExpenseData = [
//     { month: 'Jun', income: 15000, expense: 4500 },
//     { month: 'Jul', income: 16500, expense: 5200 },
//     { month: 'Aug', income: 17200, expense: 4800 },
//     { month: 'Sep', income: 16800, expense: 5500 },
//     { month: 'Oct', income: 18000, expense: 5300 },
//     { month: 'Nov', income: 18250, expense: 5800 },
// ];

// const expenseCategoryData = [
//     { category: 'Food & Dining', amount: 1200 },
//     { category: 'Transportation', amount: 800 },
//     { category: 'Shopping', amount: 650 },
//     { category: 'Utilities', amount: 450 },
//     { category: 'Entertainment', amount: 320 },
//     { category: 'Others', amount: 380 },
// ];

// export default function Dashboard() {
//     const { transactions, fetchTransactions } = useTransactionStore();
//     const { fetchBudgets } = useBudgetStore();

//     useEffect(() => {
//         // Fetch data on mount
//         fetchTransactions();
//         fetchBudgets();
//     }, []);

//     // Calculate totals from transactions
//     const totalIncome = transactions?.results
//         ?.filter(t => t.type === 'income')
//         .reduce((sum, t) => sum + t.amount, 0);

//     const totalExpenses = Math.abs(
//         transactions.results
//             ?.filter(t => t.type === 'expense')
//             .reduce((sum, t) => sum + t.amount, 0)
//     );

//     const totalBalance = totalIncome - totalExpenses;

//     // Mock data for demo
//     const stats = {
//         income: { value: 18250, change: '+20.1%', isPositive: true },
//         expenses: { value: 5800, change: '+8.2%', isPositive: false },
//         balance: { value: 12450, change: '+12.5%', isPositive: true },
//         budgetUsed: { value: 78, change: 'Used', isPositive: false },
//     };

//     const recentTransactionsData = transactions?.results?.slice(0, 5);

//     return (
//         <SidebarProvider>
//             <AppSidebar />
//             <SidebarInset>
//                 {/* Header */}
//                 <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-background">
//                     <SidebarTrigger className="-ml-1" />
//                     <Separator orientation="vertical" className="mr-2 h-4" />
//                     <div className="flex items-center gap-2 flex-1">
//                         <h1 className="text-xl font-semibold">Dashboard</h1>
//                     </div>

//                     {/* Header Actions */}
//                     <div className="flex items-center gap-2">
//                         <Button variant="outline" size="sm">
//                             <Filter className="h-4 w-4 mr-2" />
//                             Filter
//                         </Button>
//                         <Button variant="outline" size="sm">
//                             <Download className="h-4 w-4 mr-2" />
//                             Export
//                         </Button>

//                         {/* Notifications */}
//                         <DropdownMenu>
//                             <DropdownMenuTrigger asChild>
//                                 <Button variant="ghost" size="icon" className="relative">
//                                     <Bell className="h-5 w-5" />
//                                     <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center">
//                                         3
//                                     </span>
//                                 </Button>
//                             </DropdownMenuTrigger>
//                             <DropdownMenuContent align="end" className="w-80">
//                                 <DropdownMenuLabel>Notifications</DropdownMenuLabel>
//                                 <DropdownMenuSeparator />
//                                 <DropdownMenuItem>
//                                     <div className="flex flex-col gap-1">
//                                         <p className="text-sm font-medium">Budget Alert</p>
//                                         <p className="text-xs text-muted-foreground">
//                                             You've used 78% of your monthly budget
//                                         </p>
//                                     </div>
//                                 </DropdownMenuItem>
//                                 <DropdownMenuItem>
//                                     <div className="flex flex-col gap-1">
//                                         <p className="text-sm font-medium">New Transaction</p>
//                                         <p className="text-xs text-muted-foreground">
//                                             Salary payment received: $5,000
//                                         </p>
//                                     </div>
//                                 </DropdownMenuItem>
//                             </DropdownMenuContent>
//                         </DropdownMenu>
//                     </div>
//                 </header>

//                 {/* Main Content */}
//                 <main className="flex-1 overflow-y-auto p-6 bg-slate-50 dark:bg-slate-950">
//                     <div className="max-w-7xl mx-auto space-y-6">

//                         {/* Financial Summary Cards */}
//                         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//                             <StatCard
//                                 title="Total Income"
//                                 amount={`$${stats.income.value.toLocaleString()}.00`}
//                                 change={stats.income.change}
//                                 changeType="positive"
//                                 icon={TrendingUp}
//                                 iconBgColor="bg-emerald-100 dark:bg-emerald-900/20"
//                             />
//                             <StatCard
//                                 title="Total Expenses"
//                                 amount={`$${stats.expenses.value.toLocaleString()}.00`}
//                                 change={stats.expenses.change}
//                                 changeType="negative"
//                                 icon={TrendingDown}
//                                 iconBgColor="bg-red-100 dark:bg-red-900/20"
//                             />
//                             <StatCard
//                                 title="Total Balance"
//                                 amount={`$${stats.balance.value.toLocaleString()}.00`}
//                                 change={stats.balance.change}
//                                 changeType="positive"
//                                 icon={Wallet}
//                                 iconBgColor="bg-blue-100 dark:bg-blue-900/20"
//                             />
//                             <StatCard
//                                 title="Budget Status"
//                                 amount={`${stats.budgetUsed.value}%`}
//                                 change={stats.budgetUsed.change}
//                                 changeType="neutral"
//                                 icon={PiggyBank}
//                                 iconBgColor="bg-purple-100 dark:bg-purple-900/20"
//                             />
//                         </div>

//                         {/* Budget Progress Bar */}
//                         <BudgetProgressBar
//                             budget={7500}
//                             spent={5850}
//                             month="November 2025"
//                         />

//                         {/* D3.js Charts Row - REQUIRED BY ASSESSMENT */}
//                         <div className="grid gap-6 md:grid-cols-2">
//                             <IncomeExpenseChart data={incomeExpenseData} />
//                             <ExpensePieChart data={expenseCategoryData} />
//                         </div>

//                         {/* Recent Transactions */}
//                         <RecentTransactions
//                             transactions={recentTransactionsData?.length > 0 ? recentTransactionsData : [
//                                 {
//                                     id: 1,
//                                     name: 'Salary Payment',
//                                     category: 'Income',
//                                     amount: 5000,
//                                     type: 'income',
//                                     date: '2025-11-02',
//                                     icon: '💰'
//                                 },
//                                 {
//                                     id: 2,
//                                     name: 'Grocery Store',
//                                     category: 'Food & Dining',
//                                     amount: -120,
//                                     type: 'expense',
//                                     date: '2025-11-01',
//                                     icon: '🛒'
//                                 },
//                                 {
//                                     id: 3,
//                                     name: 'Electric Bill',
//                                     category: 'Utilities',
//                                     amount: -85,
//                                     type: 'expense',
//                                     date: '2025-10-31',
//                                     icon: '⚡'
//                                 },
//                                 {
//                                     id: 4,
//                                     name: 'Freelance Project',
//                                     category: 'Income',
//                                     amount: 1500,
//                                     type: 'income',
//                                     date: '2025-10-30',
//                                     icon: '💼'
//                                 },
//                                 {
//                                     id: 5,
//                                     name: 'Restaurant',
//                                     category: 'Food & Dining',
//                                     amount: -45,
//                                     type: 'expense',
//                                     date: '2025-10-29',
//                                     icon: '🍽️'
//                                 },
//                             ]}
//                             limit={5}
//                         />

//                     </div>
//                 </main>
//             </SidebarInset>
//         </SidebarProvider>
//     );
// }

import { useEffect } from 'react';
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    Bell, Wallet, TrendingUp, TrendingDown, PiggyBank, Download, Filter, AlertCircle
} from "lucide-react";

import StatCard from "@/components/dashboard/StatCard";
import BudgetProgressBar from "@/components/dashboard/BudgetProgressBar";
import IncomeExpenseChart from "@/components/dashboard/IncomeExpenseChart";
import ExpensePieChart from "@/components/dashboard/ExpensePieChart";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import { StatCardSkeleton } from "@/components/dashboard/StatCardSkeleton";
import { TableSkeleton } from "@/components/dashboard/TableSkeleton";

import { useDashboardStore } from "@/store/dashboardStore";
import { useCurrency } from '@/lib/currency';
import { useAuthStore } from '@/store/authStore';
import { userAPI } from '@/lib/api';

export default function Dashboard() {
    const { summary, isLoading, error, fetchSummary, fetchRecentTransactions, recentTransactions } = useDashboardStore();
    const { getProfile } = userAPI;
    const { setUser } = useAuthStore();
    const { symbol } = useCurrency();

    useEffect(() => {
        fetchSummary();
        fetchRecentTransactions();
        const fetchProfile = async () =>{
            const profile = await getProfile();
            setUser(profile.data);
        }

        fetchProfile();
    }, [fetchSummary, fetchRecentTransactions]);

    if (error) {
        return (
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                        <SidebarTrigger />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                        <h1 className="text-xl font-semibold">Dashboard</h1>
                    </header>
                    <main className="flex-1 p-6">
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                                {error} <Button onClick={fetchSummary} variant="link" className="p-0 h-auto">Try again</Button>
                            </AlertDescription>
                        </Alert>
                    </main>
                </SidebarInset>
            </SidebarProvider>
        );
    }

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-background">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <div className="flex items-center gap-2 flex-1">
                        <h1 className="text-xl font-semibold">Dashboard</h1>
                    </div>
                    <div className="flex items-center gap-2">
                        {/* <Button variant="outline" size="sm">
                            <Filter className="h-4 w-4 mr-2" />
                            Filter
                        </Button> */}
                        <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Export
                        </Button>
                        <Button variant="ghost" size="icon" className="relative">
                            <Bell className="h-5 w-5" />
                            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center">3</span>
                        </Button>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-6 bg-slate-50 dark:bg-slate-950">
                    <div className="max-w-7xl mx-auto space-y-6">

                        {/* Financial Summary Cards */}
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            {isLoading ? (
                                <>
                                    <StatCardSkeleton />
                                    <StatCardSkeleton />
                                    <StatCardSkeleton />
                                    <StatCardSkeleton />
                                </>
                            ) : (
                                <>
                                    <StatCard
                                        title="Total Income"
                                        amount={`${symbol}${summary?.summary?.total_income?.toLocaleString() || 0}`}
                                        change="+20.1%"
                                        changeType="positive"
                                        icon={TrendingUp}
                                        iconBgColor="bg-emerald-100 dark:bg-emerald-900/20"
                                    />
                                    <StatCard
                                        title="Total Expenses"
                                        amount={`${symbol}${summary?.summary?.total_expenses?.toLocaleString() || 0}`}
                                        change="+8.2%"
                                        changeType="negative"
                                        icon={TrendingDown}
                                        iconBgColor="bg-red-100 dark:bg-red-900/20"
                                    />
                                    <StatCard
                                        title="Balance"
                                        amount={`${symbol}${summary?.summary?.balance?.toLocaleString() || 0}`}
                                        change="+12.5%"
                                        changeType="positive"
                                        icon={Wallet}
                                        iconBgColor="bg-blue-100 dark:bg-blue-900/20"
                                    />
                                    <StatCard
                                        title="Budget Used"
                                        amount={`${summary?.budget?.percentage_used?.toFixed(0) || 0}%`}
                                        change="This month"
                                        changeType="neutral"
                                        icon={PiggyBank}
                                        iconBgColor="bg-purple-100 dark:bg-purple-900/20"
                                    />
                                </>
                            )}
                        </div>

                        {/* Budget Progress */}
                        {!isLoading && summary?.budget && (
                            <BudgetProgressBar
                                budget={summary.budget.total_budget}
                                spent={summary.budget.total_spent}
                                month="November 2025"
                            />
                        )}

                        {/* D3.js Charts */}
                        <div className="grid gap-6 md:grid-cols-2">
                            {isLoading ? (
                                <>
                                    <div className="h-[400px] border rounded-lg flex items-center justify-center bg-card">
                                        <div className="animate-pulse">Loading chart...</div>
                                    </div>
                                    <div className="h-[400px] border rounded-lg flex items-center justify-center bg-card">
                                        <div className="animate-pulse">Loading chart...</div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <IncomeExpenseChart data={summary?.monthly_data || []} />
                                    <ExpensePieChart data={summary?.category_breakdown || []} />
                                </>
                            )}
                        </div>

                        {/* Recent Transactions */}
                        {isLoading ? (
                            <TableSkeleton />
                        ) : (
                            <RecentTransactions
                                transactions={recentTransactions} // Fetch from dashboard API
                                limit={5}
                            />
                        )}

                    </div>
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}