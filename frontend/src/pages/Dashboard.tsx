// import { useEffect, useState } from 'react';
// import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
// import { AppSidebar } from "@/components/app-sidebar";
// import { Separator } from "@/components/ui/separator";
// import { Button } from "@/components/ui/button";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import {
//     Bell, Wallet, TrendingUp, TrendingDown, PiggyBank, Download, AlertCircle
// } from "lucide-react";

// import StatCard from "@/components/dashboard/StatCard";
// import BudgetProgressBar from "@/components/dashboard/BudgetProgressBar";
// import IncomeExpenseChart from "@/components/dashboard/IncomeExpenseChart";
// import ExpensePieChart from "@/components/dashboard/ExpensePieChart";
// import RecentTransactions from "@/components/dashboard/RecentTransactions";
// import { StatCardSkeleton } from "@/components/dashboard/StatCardSkeleton";
// import { TableSkeleton } from "@/components/dashboard/TableSkeleton";

// import { useDashboardStore } from "@/store/dashboardStore";
// import { useCurrency } from '@/lib/currency';
// import { useAuthStore } from '@/store/authStore';
// import { toast } from 'sonner';
// // import { PreferenceDialog } from '@/components/dashboard/PreferenceDialog';
// import { userAPI } from '@/lib/api';
// import { WelcomeOnboardingModal } from '@/components/onboarding/WelcomeOnboardingModal';
// import { useTheme } from "@/providers/ThemeProvider";

// export default function Dashboard() {
//     const { summary, isLoading, error, fetchSummary, fetchRecentTransactions, recentTransactions } = useDashboardStore();
//     const { getProfile } = userAPI;
//     const { setUser, user } = useAuthStore();
//     const { symbol } = useCurrency();
//     const [showPreferenceDialog, setShowPreferenceDialog] = useState(false);
//     const [preferences, setPreferences] = useState({
//         theme: "system",
//         currency: user?.currency || "",
//     });
//     const [isUpdating, setIsUpdating] = useState(false);
//     const { setTheme } = useTheme();


//     useEffect(() => {
//         const shouldShow = localStorage.getItem("showPreferences");
//         if (shouldShow === "true" || user && !user.currency) {
//             setShowPreferenceDialog(true);
//             localStorage.removeItem("showPreferences");
//         }
//     }, [user]);

//     const handlePreferencesUpdate = async () => {
//         setIsUpdating(true);
//         try {
//             const response = await userAPI.updateProfile(preferences);
//             setUser(response.data);
//             toast.success("Preferences updated!");
//         } catch (error) {
//             toast.error("Failed to update preferences");
//         } finally {
//             setIsUpdating(false);
//         }
//     };

//     useEffect(() => {
//         fetchSummary();
//         fetchRecentTransactions();
//         const fetchProfile = async () => {
//             const profile = await getProfile();
//             // setUser(profile.data);
//             console.log(profile.data)
//         }

//         fetchProfile();
//     }, [fetchSummary, fetchRecentTransactions, setUser]);

//     const handlePreferencesComplete = async (preferences: any) => {
//         setIsUpdating(true);
//         try {
//             // Apply theme immediately
//             setTheme(preferences.theme);

//             // Update backend
//             const response = await userAPI.updateProfile(preferences);
//             setUser(response.data);

//             toast.success("Preferences saved successfully!");
//             setShowPreferenceDialog(false);
//         } catch (error) {
//             console.error('Failed to update preferences:', error);
//             toast.error("Failed to save preferences");
//         } finally {
//             setIsUpdating(false);
//         }
//     };

//     if (error) {
//         return (
//             <SidebarProvider>
//                 <AppSidebar />
//                 <SidebarInset>
//                     <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
//                         <SidebarTrigger />
//                         <Separator orientation="vertical" className="mr-2 h-4" />
//                         <h1 className="text-xl font-semibold">Dashboard</h1>
//                     </header>
//                     <main className="flex-1 p-6">
//                         <Alert variant="destructive">
//                             <AlertCircle className="h-4 w-4" />
//                             <AlertDescription>
//                                 {error} <Button onClick={fetchSummary} variant="link" className="p-0 h-auto">Try again</Button>
//                             </AlertDescription>
//                         </Alert>
//                     </main>
//                 </SidebarInset>
//             </SidebarProvider>
//         );
//     }

//     return (
//         <SidebarProvider>
//             <AppSidebar />
//             <WelcomeOnboardingModal
//                 open={showPreferenceDialog}
//                 onClose={() => setShowPreferenceDialog(false)}
//                 onComplete={handlePreferencesComplete}
//                 isUpdating={isUpdating}
//                 userName={user?.first_name}
//             />
//             <SidebarInset>
//                 <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-background">
//                     <SidebarTrigger className="-ml-1" />
//                     <Separator orientation="vertical" className="mr-2 h-4" />
//                     <div className="flex items-center gap-2 flex-1">
//                         <h1 className="text-xl font-semibold">Dashboard</h1>
//                     </div>
//                     <div className="flex items-center gap-2">
//                         {/* <Button variant="outline" size="sm">
//                             <Filter className="h-4 w-4 mr-2" />
//                             Filter
//                         </Button> */}
//                         <Button variant="outline" size="sm">
//                             <Download className="h-4 w-4 mr-2" />
//                             Export
//                         </Button>
//                         <Button variant="ghost" size="icon" className="relative">
//                             <Bell className="h-5 w-5" />
//                             <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center">3</span>
//                         </Button>
//                     </div>
//                 </header>

//                 <main className="flex-1 overflow-y-auto p-6 bg-slate-50 dark:bg-slate-950">
//                     <div className="max-w-7xl mx-auto space-y-6">

//                         {/* Financial Summary Cards */}
//                         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//                             {isLoading ? (
//                                 <>
//                                     <StatCardSkeleton />
//                                     <StatCardSkeleton />
//                                     <StatCardSkeleton />
//                                     <StatCardSkeleton />
//                                 </>
//                             ) : (
//                                 <>
//                                     <StatCard
//                                         title="Total Income"
//                                         amount={`${symbol}${summary?.summary?.total_income?.toLocaleString() || 0}`}
//                                         change="+20.1%"
//                                         changeType="positive"
//                                         icon={TrendingUp}
//                                         iconBgColor="bg-emerald-100 dark:bg-emerald-900/20"
//                                     />
//                                     <StatCard
//                                         title="Total Expenses"
//                                         amount={`${symbol}${summary?.summary?.total_expenses?.toLocaleString() || 0}`}
//                                         change="+8.2%"
//                                         changeType="negative"
//                                         icon={TrendingDown}
//                                         iconBgColor="bg-red-100 dark:bg-red-900/20"
//                                     />
//                                     <StatCard
//                                         title="Balance"
//                                         amount={`${symbol}${summary?.summary?.balance?.toLocaleString() || 0}`}
//                                         change="+12.5%"
//                                         changeType="positive"
//                                         icon={Wallet}
//                                         iconBgColor="bg-blue-100 dark:bg-blue-900/20"
//                                     />
//                                     <StatCard
//                                         title="Budget Used"
//                                         amount={`${summary?.budget?.percentage_used?.toFixed(0) || 0}%`}
//                                         change="This month"
//                                         changeType="neutral"
//                                         icon={PiggyBank}
//                                         iconBgColor="bg-purple-100 dark:bg-purple-900/20"
//                                     />
//                                 </>
//                             )}
//                         </div>

//                         {/* Budget Progress */}
//                         {!isLoading && summary?.budget && (
//                             <BudgetProgressBar
//                                 budget={summary.budget.total_budget}
//                                 spent={summary.budget.total_spent}
//                                 month="November 2025"
//                             />
//                         )}

//                         {/* D3.js Charts */}
//                         <div className="grid gap-6 md:grid-cols-2">
//                             {isLoading ? (
//                                 <>
//                                     <div className="h-[400px] border rounded-lg flex items-center justify-center bg-card">
//                                         <div className="animate-pulse">Loading chart...</div>
//                                     </div>
//                                     <div className="h-[400px] border rounded-lg flex items-center justify-center bg-card">
//                                         <div className="animate-pulse">Loading chart...</div>
//                                     </div>
//                                 </>
//                             ) : (
//                                 <>
//                                     <IncomeExpenseChart data={summary?.monthly_data || []} />
//                                     <ExpensePieChart data={summary?.category_breakdown || []} />
//                                 </>
//                             )}
//                         </div>

//                         {/* Recent Transactions */}
//                         {isLoading ? (
//                             <TableSkeleton />
//                         ) : (
//                             <RecentTransactions
//                                 transactions={recentTransactions} // Fetch from dashboard API
//                                 limit={5}
//                             />
//                         )}

//                     </div>
//                 </main>
//             </SidebarInset>
//         </SidebarProvider>
//     );
// }

import { useEffect, useState } from "react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Download, Bell, AlertCircle, Wallet, PiggyBank, TrendingDown, TrendingUp, PlusCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

import { useDashboardStore } from "@/store/dashboardStore";
import { useAuthStore } from "@/store/authStore";
import { userAPI } from "@/lib/api";
import { useCurrency } from "@/lib/currency";
import { useTheme } from "@/providers/ThemeProvider";

import StatCard from "@/components/dashboard/StatCard";
import { StatCardSkeleton } from "@/components/dashboard/StatCardSkeleton";
import BudgetProgressBar from "@/components/dashboard/BudgetProgressBar";
import IncomeExpenseChart from "@/components/dashboard/IncomeExpenseChart";
import ExpensePieChart from "@/components/dashboard/ExpensePieChart";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import { TableSkeleton } from "@/components/dashboard/TableSkeleton";
import { WelcomeOnboardingModal } from "@/components/onboarding/WelcomeOnboardingModal";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
    const { summary, isLoading, error, fetchSummary, fetchRecentTransactions, recentTransactions } =
        useDashboardStore();

    const { getProfile, updateProfile } = userAPI;
    const { setUser, user } = useAuthStore();
    const { symbol } = useCurrency();
    const { setTheme } = useTheme();

    const navigate = useNavigate();

    const [isUpdating, setIsUpdating] = useState(false);
    const [showOnboarding, setShowOnboarding] = useState(false);

    useEffect(() => {
        const initDashboard = async () => {
            await Promise.all([fetchSummary(), fetchRecentTransactions()]);

            const profile = await getProfile();
            setUser(profile.data);

            const shouldShow =
                localStorage.getItem("showOnboarding") === "true" || !profile.data.currency;

            if (shouldShow) {
                setShowOnboarding(true);
                localStorage.removeItem("showOnboarding");
            }
        };

        initDashboard().catch(() => {
            toast.error("Failed to load dashboard");
        });
    }, [fetchSummary, fetchRecentTransactions, getProfile, setUser]);

    const handleOnboardingComplete = async (preferences: any) => {
        setIsUpdating(true);
        try {
            setTheme(preferences.theme);
            const response = await updateProfile(preferences);
            setUser(response.data);
            toast.success("Preferences saved successfully!");
            setShowOnboarding(false);
        } catch (error) {
            toast.error("Failed to save preferences");
        } finally {
            setIsUpdating(false);
        }
    };

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
                                {error}{" "}
                                <Button onClick={fetchSummary} variant="link" className="p-0 h-auto">
                                    Try again
                                </Button>
                            </AlertDescription>
                        </Alert>
                    </main>
                </SidebarInset>
            </SidebarProvider>
        );
    }

    const hasBudget = summary?.budget.total_budget > 0;
    const hasTransactions = recentTransactions?.length > 0;
    const hasChartData =
        summary?.monthly_data?.length > 0 || summary?.category_breakdown?.length > 0;

    return (
        <SidebarProvider>
            <AppSidebar />

            <WelcomeOnboardingModal
                open={showOnboarding}
                onClose={() => setShowOnboarding(false)}
                onComplete={handleOnboardingComplete}
                isUpdating={isUpdating}
                userName={user?.first_name}
            />

            <SidebarInset>
                {/* Header */}
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-background">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <div className="flex items-center gap-2 flex-1">
                        <h1 className="text-xl font-semibold">Dashboard</h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Export
                        </Button>
                        <Button variant="ghost" size="icon" className="relative">
                            <Bell className="h-5 w-5" />
                            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center">
                                3
                            </span>
                        </Button>
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 overflow-y-auto p-6 bg-slate-50 dark:bg-slate-950">
                    <div className="max-w-7xl mx-auto space-y-6">
                        {/* Financial Summary */}
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
                                        change={`${summary?.summary?.income_change > 0 ? "+" : ""}${summary?.summary?.income_change || 0}%`}
                                        changeType={summary?.summary?.income_change >= 0 ? "positive" : "negative"}
                                        icon={TrendingUp}
                                        iconBgColor="bg-emerald-100 dark:bg-emerald-900/20"
                                    />

                                    <StatCard
                                        title="Total Expenses"
                                        amount={`${symbol}${summary?.summary?.total_expenses?.toLocaleString() || 0}`}
                                        change={`${summary?.summary?.expense_change > 0 ? "+" : ""}${summary?.summary?.expense_change || 0}%`}
                                        changeType={summary?.summary?.expense_change >= 0 ? "negative" : "positive"}  // reversed logic for expenses
                                        icon={TrendingDown}
                                        iconBgColor="bg-red-100 dark:bg-red-900/20"
                                    />

                                    <StatCard
                                        title="Balance"
                                        amount={`${symbol}${summary?.summary?.balance?.toLocaleString() || 0}`}
                                        change={`${summary?.summary?.balance_change > 0 ? "+" : ""}${summary?.summary?.balance_change || 0}%`}
                                        changeType={summary?.summary?.balance_change >= 0 ? "positive" : "negative"}
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
                        {!isLoading && (
                            hasBudget ? (
                                <BudgetProgressBar
                                    budget={summary?.budget?.total_budget}
                                    spent={summary?.budget?.total_spent}
                                    month={new Date().toLocaleString("default", { month: "long", year: "numeric" })}
                                />
                            ) : (
                                <div className="text-center py-10 bg-white dark:bg-slate-900 rounded-lg border">
                                    <PiggyBank className="mx-auto h-10 w-10 text-slate-400 mb-3" />
                                    <h3 className="text-lg font-semibold">No Budget Found</h3>
                                    <p className="text-slate-500 text-sm mb-4">
                                        Create your first budget to start tracking your expenses and progress.
                                    </p>
                                    <Button variant="outline" onClick={() => navigate('/budget')}>
                                        <PlusCircle className="h-4 w-4 mr-2" /> Create Budget
                                    </Button>
                                </div>
                            )
                        )}

                        {/* Charts */}
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
                            ) : hasChartData ? (
                                <>
                                    <IncomeExpenseChart data={summary?.monthly_data || []} />
                                    <ExpensePieChart data={summary?.category_breakdown || []} />
                                </>
                            ) : (
                                <>
                                    <div className="h-[400px] border rounded-lg flex flex-col items-center justify-center bg-white dark:bg-slate-900 text-center">
                                        <TrendingUp className="h-10 w-10 text-slate-400 mb-3" />
                                        <p className="text-slate-500">No data available to display charts yet.</p>
                                        <p className="text-sm text-slate-400 mt-1">
                                            Add transactions to visualize your income and expenses.
                                        </p>
                                    </div>
                                    <div className="h-[400px] border rounded-lg flex flex-col items-center justify-center bg-white dark:bg-slate-900 text-center">
                                        <Wallet className="h-10 w-10 text-slate-400 mb-3" />
                                        <p className="text-slate-500">No expense breakdown available.</p>
                                        <p className="text-sm text-slate-400 mt-1">
                                            Start adding categories and expenses to see this graph.
                                        </p>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Recent Transactions */}
                        {isLoading ? (
                            <TableSkeleton />
                        ) : hasTransactions ? (
                            <RecentTransactions transactions={recentTransactions} limit={5} />
                        ) : (
                            <div className="text-center py-10 bg-white dark:bg-slate-900 rounded-lg border">
                                <Wallet className="mx-auto h-10 w-10 text-slate-400 mb-3" />
                                <h3 className="text-lg font-semibold">No Transactions Yet</h3>
                                <p className="text-slate-500 text-sm mb-4">
                                    Start by adding your first transaction to track income and expenses.
                                </p>
                                <Button onClick={() => navigate('/transactions')}>
                                    <PlusCircle className="h-4 w-4 mr-2" /> Add Transaction
                                </Button>
                            </div>
                        )}
                    </div>
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}
