import { useEffect, useState } from 'react';
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    Bell, Wallet, TrendingUp, TrendingDown, PiggyBank, Download, AlertCircle
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
import { toast } from 'sonner';
import { PreferenceDialog } from '@/components/dashboard/PreferenceDailog';
import { userAPI } from '@/lib/api';

export default function Dashboard() {
    const { summary, isLoading, error, fetchSummary, fetchRecentTransactions, recentTransactions } = useDashboardStore();
    // const { getProfile } = userAPI;
    const { setUser, user } = useAuthStore();
    const { symbol } = useCurrency();
    const [showPreferenceDialog, setShowPreferenceDialog] = useState(false);
    const [preferences, setPreferences] = useState({
        theme: "system",
        currency: user?.currency || "",
    });
    const [isUpdating, setIsUpdating] = useState(false);

     useEffect(() => {
        if (user && !user.currency) {
        setShowPreferenceDialog(true);
        }
    }, [user]);

     const handlePreferencesUpdate = async () => {
        setIsUpdating(true);
        try {
        const response = await userAPI.updateProfile(preferences);
        setUser(response.data);
        toast.success("Preferences updated!");
        } catch (error) {
        toast.error("Failed to update preferences");
        } finally {
        setIsUpdating(false);
        }
    };

    useEffect(() => {
        fetchSummary();
        fetchRecentTransactions();
        // const fetchProfile = async () =>{
        //     const profile = await getProfile();
        //     setUser(profile.data);
        // }

        // fetchProfile();
    }, [fetchSummary, fetchRecentTransactions, setUser]);

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
              <PreferenceDialog
                    open={showPreferenceDialog}
                    onClose={() => setShowPreferenceDialog(false)}
                    preferences={preferences}
                    setPreferences={setPreferences}
                    handleSave={handlePreferencesUpdate}
                    isUpdating={isUpdating}
                />
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