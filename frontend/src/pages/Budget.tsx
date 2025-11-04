
// import { useState } from 'react';
// import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
// import { AppSidebar } from "@/components/app-sidebar";
// import { Separator } from "@/components/ui/separator";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Progress } from "@/components/ui/progress";
// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from "@/components/ui/select";
// import {
//     Dialog,
//     DialogContent,
//     DialogDescription,
//     DialogFooter,
//     DialogHeader,
//     DialogTitle,
//     DialogTrigger,
// } from "@/components/ui/dialog";
// import {
//     PiggyBank,
//     TrendingUp,
//     TrendingDown,
//     AlertTriangle,
//     CheckCircle2,
//     Edit,
//     Save,
//     X
// } from "lucide-react";
// import BudgetComparisonChart from "@/components/budget/BudgetComparisonChart";

// // Mock budget data
// const INITIAL_BUDGETS = [
//     {
//         category: 'Food & Dining',
//         budget: 800,
//         spent: 620,
//         icon: '🍽️',
//         transactions: 12
//     },
//     {
//         category: 'Transportation',
//         budget: 300,
//         spent: 245,
//         icon: '🚗',
//         transactions: 8
//     },
//     {
//         category: 'Shopping',
//         budget: 400,
//         spent: 480,
//         icon: '🛍️',
//         transactions: 6
//     },
//     {
//         category: 'Entertainment',
//         budget: 200,
//         spent: 150,
//         icon: '🎬',
//         transactions: 5
//     },
//     {
//         category: 'Bills & Utilities',
//         budget: 600,
//         spent: 550,
//         icon: '💡',
//         transactions: 4
//     },
//     {
//         category: 'Healthcare',
//         budget: 300,
//         spent: 180,
//         icon: '🏥',
//         transactions: 3
//     },
//     {
//         category: 'Education',
//         budget: 500,
//         spent: 450,
//         icon: '📚',
//         transactions: 2
//     },
// ];

// // Category Budget Card Component
// function CategoryBudgetCard({ category, onEdit }) {
//     const percentage = (category.spent / category.budget) * 100;
//     const remaining = category.budget - category.spent;
//     const isOverBudget = category.spent > category.budget;

//     return (
//         <Card>
//             <CardHeader className="flex flex-row items-center justify-between pb-2">
//                 <div className="flex items-center gap-2">
//                     <div className="text-2xl">{category.icon}</div>
//                     <div>
//                         <CardTitle className="text-base">{category.category}</CardTitle>
//                         <CardDescription className="text-xs">
//                             {category.transactions} transactions
//                         </CardDescription>
//                     </div>
//                 </div>
//                 <Button variant="ghost" size="icon" onClick={() => onEdit(category)}>
//                     <Edit className="h-4 w-4" />
//                 </Button>
//             </CardHeader>
//             <CardContent className="space-y-3">
//                 <div className="flex items-center justify-between text-sm">
//                     <span className="text-muted-foreground">Spent</span>
//                     <span className={`font-bold ${isOverBudget ? 'text-red-600' : 'text-foreground'}`}>
//                         ${category.spent.toLocaleString()}
//                     </span>
//                 </div>
//                 <div className="flex items-center justify-between text-sm">
//                     <span className="text-muted-foreground">Budget</span>
//                     <span className="font-medium">${category.budget.toLocaleString()}</span>
//                 </div>

//                 <Progress
//                     value={percentage > 100 ? 100 : percentage}
//                     className={`h-2 ${isOverBudget ? 'bg-red-100' : ''}`}
//                 />

//                 <div className="flex items-center justify-between">
//                     <div className="flex items-center gap-1">
//                         {isOverBudget ? (
//                             <>
//                                 <AlertTriangle className="h-3 w-3 text-red-500" />
//                                 <span className="text-xs text-red-600 font-medium">
//                                     Over by ${Math.abs(remaining).toLocaleString()}
//                                 </span>
//                             </>
//                         ) : (
//                             <>
//                                 <CheckCircle2 className="h-3 w-3 text-emerald-500" />
//                                 <span className="text-xs text-emerald-600 font-medium">
//                                     ${remaining.toLocaleString()} left
//                                 </span>
//                             </>
//                         )}
//                     </div>
//                     <Badge variant={isOverBudget ? "destructive" : "secondary"}>
//                         {percentage.toFixed(0)}%
//                     </Badge>
//                 </div>
//             </CardContent>
//         </Card>
//     );
// }

// // Edit Budget Dialog
// function EditBudgetDialog({ open, onOpenChange, category, onSave }) {
//     const [budget, setBudget] = useState(category?.budget || 0);

//     const handleSave = () => {
//         onSave({ ...category, budget: parseFloat(budget) });
//         onOpenChange(false);
//     };

//     return (
//         <Dialog open={open} onOpenChange={onOpenChange}>
//             <DialogContent>
//                 <DialogHeader>
//                     <DialogTitle>Edit Budget - {category?.category}</DialogTitle>
//                     <DialogDescription>
//                         Set a monthly budget limit for this category
//                     </DialogDescription>
//                 </DialogHeader>
//                 <div className="space-y-4 py-4">
//                     <div className="space-y-2">
//                         <Label>Monthly Budget ($)</Label>
//                         <Input
//                             type="number"
//                             value={budget}
//                             onChange={(e) => setBudget(e.target.value)}
//                             placeholder="0.00"
//                             step="0.01"
//                         />
//                     </div>
//                     <div className="rounded-lg bg-muted p-3 text-sm">
//                         <p className="font-medium mb-1">Current Status</p>
//                         <p className="text-muted-foreground text-xs">
//                             Spent: ${category?.spent.toLocaleString()} ({category?.transactions} transactions)
//                         </p>
//                     </div>
//                 </div>
//                 <DialogFooter>
//                     <Button variant="outline" onClick={() => onOpenChange(false)}>
//                         Cancel
//                     </Button>
//                     <Button onClick={handleSave}>
//                         <Save className="h-4 w-4 mr-2" />
//                         Save Budget
//                     </Button>
//                 </DialogFooter>
//             </DialogContent>
//         </Dialog>
//     );
// }

// export default function Budget() {
//     const [budgets, setBudgets] = useState(INITIAL_BUDGETS);
//     const [selectedMonth, setSelectedMonth] = useState(`${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`);
//     const [editingCategory, setEditingCategory] = useState(null);
//     const [dialogOpen, setDialogOpen] = useState(false);

//     // Calculate totals
//     const totalBudget = budgets.reduce((sum, b) => sum + b.budget, 0);
//     const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
//     const totalRemaining = totalBudget - totalSpent;
//     const overallPercentage = (totalSpent / totalBudget) * 100;
//     const categoriesOverBudget = budgets.filter(b => b.spent > b.budget).length;

//     // Handle edit budget
//     const handleEditBudget = (category) => {
//         setEditingCategory(category);
//         setDialogOpen(true);
//     };

//     // Handle save budget
//     const handleSaveBudget = (updatedCategory) => {
//         setBudgets(prev =>
//             prev.map(b => b.category === updatedCategory.category ? updatedCategory : b)
//         );
//     };

//     return (
//         <SidebarProvider>
//             <AppSidebar />
//             <SidebarInset>
//                 {/* Header */}
//                 <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-background">
//                     <SidebarTrigger className="-ml-1" />
//                     <Separator orientation="vertical" className="mr-2 h-4" />
//                     <div className="flex items-center gap-2 flex-1">
//                         <h1 className="text-xl font-semibold">Budget Management</h1>
//                     </div>
//                     <Select value={selectedMonth} onValueChange={setSelectedMonth}>
//                         <SelectTrigger className="w-[180px]">
//                             <SelectValue />
//                         </SelectTrigger>
//                         <SelectContent>
//                             <SelectItem value="2025-11">November 2025</SelectItem>
//                             <SelectItem value="2025-10">October 2025</SelectItem>
//                             <SelectItem value="2025-09">September 2025</SelectItem>
//                             <SelectItem value="2025-08">August 2025</SelectItem>
//                         </SelectContent>
//                     </Select>
//                 </header>

//                 {/* Main Content */}
//                 <main className="flex-1 overflow-y-auto p-6 bg-slate-50 dark:bg-slate-950">
//                     <div className="max-w-7xl mx-auto space-y-6">

//                         {/* Overall Budget Summary */}
//                         <Card>
//                             <CardHeader>
//                                 <CardTitle className="flex items-center gap-2">
//                                     <PiggyBank className="h-5 w-5" />
//                                     Overall Budget Status
//                                 </CardTitle>
//                                 <CardDescription>Your total budget for {selectedMonth}</CardDescription>
//                             </CardHeader>
//                             <CardContent>
//                                 <div className="grid gap-6 md:grid-cols-3 mb-6">
//                                     <div>
//                                         <p className="text-sm text-muted-foreground mb-1">Total Budget</p>
//                                         <p className="text-3xl font-bold">${totalBudget.toLocaleString()}</p>
//                                     </div>
//                                     <div>
//                                         <p className="text-sm text-muted-foreground mb-1">Total Spent</p>
//                                         <p className="text-3xl font-bold text-blue-600">
//                                             ${totalSpent.toLocaleString()}
//                                         </p>
//                                     </div>
//                                     <div>
//                                         <p className="text-sm text-muted-foreground mb-1">Remaining</p>
//                                         <p className={`text-3xl font-bold ${totalRemaining < 0 ? 'text-red-600' : 'text-emerald-600'
//                                             }`}>
//                                             ${Math.abs(totalRemaining).toLocaleString()}
//                                         </p>
//                                     </div>
//                                 </div>

//                                 <div className="space-y-2">
//                                     <div className="flex items-center justify-between text-sm">
//                                         <span className="text-muted-foreground">Progress</span>
//                                         <span className="font-medium">{overallPercentage.toFixed(1)}% used</span>
//                                     </div>
//                                     <Progress
//                                         value={overallPercentage > 100 ? 100 : overallPercentage}
//                                         className="h-3"
//                                     />
//                                 </div>

//                                 {categoriesOverBudget > 0 && (
//                                     <div className="mt-4 flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/50 rounded-lg">
//                                         <AlertTriangle className="h-5 w-5 text-red-600" />
//                                         <p className="text-sm text-red-900 dark:text-red-400">
//                                             <strong>{categoriesOverBudget} categories</strong> are over budget
//                                         </p>
//                                     </div>
//                                 )}
//                             </CardContent>
//                         </Card>

//                         {/* Budget vs Actual Chart - D3.js (REQUIRED) */}
//                         <BudgetComparisonChart
//                             data={budgets.map(b => ({
//                                 category: b.category,
//                                 budget: b.budget,
//                                 spent: b.spent
//                             }))}
//                         />

//                         {/* Category Budgets Grid */}
//                         <div>
//                             <div className="flex items-center justify-between mb-4">
//                                 <h2 className="text-xl font-semibold">Category Budgets</h2>
//                                 <Button variant="outline" size="sm">
//                                     <Edit className="h-4 w-4 mr-2" />
//                                     Edit All
//                                 </Button>
//                             </div>

//                             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//                                 {budgets.map((budget) => (
//                                     <CategoryBudgetCard
//                                         key={budget.category}
//                                         category={budget}
//                                         onEdit={handleEditBudget}
//                                     />
//                                 ))}
//                             </div>
//                         </div>

//                         {/* Budget Tips Card */}
//                         <Card>
//                             <CardHeader>
//                                 <CardTitle className="text-base">Budget Tips</CardTitle>
//                             </CardHeader>
//                             <CardContent className="space-y-3">
//                                 <div className="flex items-start gap-3">
//                                     <TrendingUp className="h-5 w-5 text-emerald-500 mt-0.5" />
//                                     <div>
//                                         <p className="font-medium text-sm">Great job on saving!</p>
//                                         <p className="text-xs text-muted-foreground">
//                                             You're under budget in 6 out of 7 categories
//                                         </p>
//                                     </div>
//                                 </div>
//                                 <div className="flex items-start gap-3">
//                                     <TrendingDown className="h-5 w-5 text-amber-500 mt-0.5" />
//                                     <div>
//                                         <p className="font-medium text-sm">Watch your shopping</p>
//                                         <p className="text-xs text-muted-foreground">
//                                             Shopping category is 20% over budget this month
//                                         </p>
//                                     </div>
//                                 </div>
//                                 <div className="flex items-start gap-3">
//                                     <CheckCircle2 className="h-5 w-5 text-blue-500 mt-0.5" />
//                                     <div>
//                                         <p className="font-medium text-sm">On track for the month</p>
//                                         <p className="text-xs text-muted-foreground">
//                                             You have ${totalRemaining.toLocaleString()} remaining across all categories
//                                         </p>
//                                     </div>
//                                 </div>
//                             </CardContent>
//                         </Card>

//                     </div>
//                 </main>
//             </SidebarInset>

//             {/* Edit Budget Dialog */}
//             <EditBudgetDialog
//                 open={dialogOpen}
//                 onOpenChange={setDialogOpen}
//                 category={editingCategory}
//                 onSave={handleSaveBudget}
//             />
//         </SidebarProvider>
//     );
// }

import { useEffect, useState } from 'react';
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    PiggyBank, TrendingUp, TrendingDown, AlertTriangle, CheckCircle2,
    Edit, Save, Loader2, AlertCircle
} from "lucide-react";
import BudgetComparisonChart from "@/components/budget/BudgetComparisonChart";
import { Skeleton } from "@/components/ui/skeleton";
import { useBudgetStore } from "@/store/budgetStore";
import { toast } from "sonner"
import { useTransactionStore } from '@/store/transactionStore';
import { useCurrency } from '@/lib/currency';

function CategoryBudgetCard({ category, onEdit, isLoading }: any) {
    const { symbol } = useCurrency();

    if (isLoading) {
        return (
            <Card>
                <CardHeader className="pb-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-3 w-24 mt-2" />
                </CardHeader>
                <CardContent className="space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-2 w-full" />
                    <Skeleton className="h-4 w-24" />
                </CardContent>
            </Card>
        );
    }

    const percentage = (category.spent / category.amount) * 100;
    const remaining = category.amount - category.spent;
    const isOverBudget = category.spent > category.amount;

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="flex items-center gap-2">
                    <div className="text-2xl">{category.category_icon}</div>
                    <div>
                        <CardTitle className="text-base">{category.category_name}</CardTitle>
                        <CardDescription className="text-xs">
                            Monthly budget
                        </CardDescription>
                    </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => onEdit(category)}>
                    <Edit className="h-4 w-4" />
                </Button>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Spent</span>
                    <span className={`font-bold ${isOverBudget ? 'text-red-600' : ''}`}>
                        {symbol}{category.spent?.toLocaleString() || 0}
                    </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Budget</span>
                    <span className="font-medium">{symbol}{category.amount.toLocaleString()}</span>
                </div>
                <Progress value={percentage > 100 ? 100 : percentage} className="h-2" />
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                        {isOverBudget ? (
                            <>
                                <AlertTriangle className="h-3 w-3 text-red-500" />
                                <span className="text-xs text-red-600 font-medium">
                                    Over by {symbol}{Math.abs(remaining).toLocaleString()}
                                </span>
                            </>
                        ) : (
                            <>
                                <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                                <span className="text-xs text-emerald-600 font-medium">
                                    {symbol}{remaining.toLocaleString()} left
                                </span>
                            </>
                        )}
                    </div>
                    <Badge variant={isOverBudget ? "destructive" : "secondary"}>
                        {percentage.toFixed(0)}%
                    </Badge>
                </div>
            </CardContent>
        </Card>
    );
}

function EditBudgetDialog({ open, onOpenChange, category, onSave, isLoading }: any) {
    const [amount, setAmount] = useState(category?.amount || 0);
    const { symbol } = useCurrency();

    useEffect(() => {
        if (category) {
            setAmount(category.amount);
        }
    }, [category]);

    const handleSave = () => {
        onSave({ ...category, amount: parseFloat(amount) });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Budget - {category?.category_name}</DialogTitle>
                    <DialogDescription>
                        Set a monthly budget limit for this category
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>Monthly Budget ({symbol})</Label>
                        <Input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.00"
                            step="0.01"
                            disabled={isLoading}
                        />
                    </div>
                    <div className="rounded-lg bg-muted p-3 text-sm">
                        <p className="font-medium mb-1">Current Status</p>
                        <p className="text-muted-foreground text-xs">
                            Spent: {symbol}{category?.spent?.toLocaleString() || 0}
                        </p>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="h-4 w-4 mr-2" />
                                Save Budget
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function CreateBudgetDialog({ open, onOpenChange, onSave, isLoading, categories, existingCategories }: any) {
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [month, setMonth] = useState(`${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`);
    const { symbol } = useCurrency();

    const handleSave = () => {
        if (!amount || !category) return;
        onSave({
            amount: parseFloat(amount),
            category: parseInt(category),
            month: `${month}-01`
        });
        setAmount('');
        setCategory('');
        setMonth(`${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Budget</DialogTitle>
                    <DialogDescription>
                        Create a new monthly budget for a category.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* Category Selector */}
                    <div className="space-y-2">
                        <Label>Category</Label>
                        <Select value={category} onValueChange={setCategory}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories?.filter((c: any) => c.type === 'expense' && !existingCategories?.includes(c.id)).map((c: any) => (
                                    <SelectItem key={c.id} value={String(c.id)}>
                                        {c.icon} {c.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Month Selector */}
                    <div className="space-y-2">
                        <Label>Month</Label>
                        <Select value={month} onValueChange={setMonth}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="2025-11">November 2025</SelectItem>
                                <SelectItem value="2025-10">October 2025</SelectItem>
                                <SelectItem value="2025-09">September 2025</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Amount Input */}
                    <div className="space-y-2">
                        <Label>Budget Amount ({symbol})</Label>
                        <Input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.00"
                            step="0.01"
                            disabled={isLoading}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={isLoading || !category || !amount}>
                        {isLoading ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="h-4 w-4 mr-2" />
                                Save Budget
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}


export default function Budget() {
    const {
        budgets,
        comparison,
        isLoading,
        error,
        fetchBudgets,
        fetchComparison,
        updateBudget,
        createBudget,
        budgetMonths,
        fetchBudgetMonths
    } = useBudgetStore();

    const { categories, fetchCategories } = useTransactionStore();

    const [selectedMonth, setSelectedMonth] = useState(`${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`);
    const [editingCategory, setEditingCategory] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);


    const { symbol } = useCurrency();

    useEffect(() => {
        fetchBudgets(selectedMonth);
        fetchComparison(selectedMonth);
        fetchCategories();
        fetchBudgetMonths();
    }, [selectedMonth]);

    const handleEditBudget = (category: any) => {
        setEditingCategory(category);
        setDialogOpen(true);
    };

    const handleSaveBudget = async (updatedCategory: any) => {
        try {
            await updateBudget(updatedCategory.id, { ...updatedCategory });
            toast.success("Budget updated successfully");
            //   toast({
            //     title: "Success",
            //     description: "Budget updated successfully",
            //   });
            setDialogOpen(false);
        } catch (error) {
            toast.error("Failed to update budget");
            //   toast({
            //     title: "Error",
            //     description: "Failed to update budget",
            //     variant: "destructive",
            //   });
        }
    };

    const handleCreateBudget = async (data: any) => {
        try {
            await createBudget(data);
            toast.success("Budget created successfully");
            setCreateDialogOpen(false);
            fetchBudgets(selectedMonth);
            fetchComparison(selectedMonth);
        } catch (err) {
            toast.error("Failed to create budget");
        }
    };


    const totalBudget = budgets?.results?.reduce((sum, b) => sum + parseFloat(b.amount), 0);
    const totalSpent = budgets?.results?.reduce((sum, b) => sum + (b.spent || 0), 0);
    const totalRemaining = totalBudget - totalSpent;
    const overallPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
    const categoriesOverBudget = budgets?.results?.filter(b => (b.spent || 0) > b.amount).length;

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-background">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <div className="flex items-center gap-2 flex-1">
                        <h1 className="text-xl font-semibold">Budget Management</h1>
                        {isLoading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                    </div>
                    {/* <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="2025-11">November 2025</SelectItem>
                            <SelectItem value="2025-10">October 2025</SelectItem>
                            <SelectItem value="2025-09">September 2025</SelectItem>
                        </SelectContent>
                    </Select> */}
                    <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select Month" />
                        </SelectTrigger>
                        <SelectContent>
                            {budgetMonths.map((m) => (
                                <SelectItem key={m.value} value={m.value}>
                                    {m.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Button onClick={() => setCreateDialogOpen(true)} className="ml-4">
                        + New Budget
                    </Button>

                </header>

                <main className="flex-1 overflow-y-auto p-6 bg-slate-50 dark:bg-slate-950">
                    <div className="max-w-7xl mx-auto space-y-6">
                        {error && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>
                                    {error} <Button onClick={() => fetchBudgets(selectedMonth)} variant="link" className="p-0 h-auto">Try again</Button>
                                </AlertDescription>
                            </Alert>
                        )}

                        {/* Overall Budget Summary */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <PiggyBank className="h-5 w-5" />
                                    Overall Budget Status
                                </CardTitle>
                                <CardDescription>Your total budget for {selectedMonth}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {isLoading ? (
                                    <div className="space-y-4">
                                        <div className="grid gap-6 md:grid-cols-3">
                                            <Skeleton className="h-16 w-full" />
                                            <Skeleton className="h-16 w-full" />
                                            <Skeleton className="h-16 w-full" />
                                        </div>
                                        <Skeleton className="h-3 w-full" />
                                    </div>
                                ) : (
                                    <>
                                        <div className="grid gap-6 md:grid-cols-3 mb-6">
                                            <div>
                                                <p className="text-sm text-muted-foreground mb-1">Total Budget</p>
                                                <p className="text-3xl font-bold">{symbol}{totalBudget?.toLocaleString()}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground mb-1">Total Spent</p>
                                                <p className="text-3xl font-bold text-blue-600">{symbol}{totalSpent?.toLocaleString()}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground mb-1">Remaining</p>
                                                <p className={`text-3xl font-bold ${totalRemaining < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                                                    {symbol}{Math.abs(totalRemaining)?.toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                        <Progress value={overallPercentage > 100 ? 100 : overallPercentage} className="h-3" />
                                        {categoriesOverBudget > 0 && (
                                            <div className="mt-4 flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/50 rounded-lg">
                                                <AlertTriangle className="h-5 w-5 text-red-600" />
                                                <p className="text-sm text-red-900 dark:text-red-400">
                                                    <strong>{categoriesOverBudget} categories</strong> are over budget
                                                </p>
                                            </div>
                                        )}
                                    </>
                                )}
                            </CardContent>
                        </Card>

                        {/* Budget Comparison Chart */}
                        {isLoading ? (
                            <div className="h-[500px] border rounded-lg flex items-center justify-center bg-card">
                                <Loader2 className="h-8 w-8 animate-spin" />
                            </div>
                        ) : comparison && comparison.length > 0 ? (
                            <BudgetComparisonChart data={comparison} />
                        ) : (
                            <div className="h-[400px] flex flex-col items-center justify-center border rounded-lg bg-card text-center text-muted-foreground">
                                <PiggyBank className="h-10 w-10 mb-3 text-muted-foreground" />
                                <p className="text-sm">No budget data available for this month.</p>
                                <p className="text-xs">Create a new budget to see category-wise comparison.</p>
                            </div>
                        )}


                        {/* Category Budgets */}
                        <div>
                            <h2 className="text-xl font-semibold mb-4">Category Budgets</h2>
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {isLoading ? (
                                    Array.from({ length: 6 }).map((_, i) => (
                                        <CategoryBudgetCard key={i} isLoading={true} />
                                    ))
                                ) : budgets?.results?.length > 0 ? (
                                    budgets?.results.map((budget) => (
                                        <CategoryBudgetCard
                                            key={budget.id}
                                            category={budget}
                                            onEdit={handleEditBudget}
                                        />
                                    ))
                                ) : (
                                    <div className="col-span-full flex flex-col items-center justify-center p-10 border rounded-lg bg-card text-muted-foreground">
                                        <PiggyBank className="h-10 w-10 mb-3 text-muted-foreground" />
                                        <p className="text-sm font-medium">No budgets found for this month</p>
                                        <p className="text-xs mt-1 mb-3">Start by creating your first budget below</p>
                                        <Button onClick={() => setCreateDialogOpen(true)} variant="default">
                                            + Create Budget
                                        </Button>
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>
                </main>
            </SidebarInset>

            <EditBudgetDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                category={editingCategory}
                onSave={handleSaveBudget}
                isLoading={isLoading}
            />

            <CreateBudgetDialog
                existingCategories={budgets?.results?.map((b: any) => b.category)}
                open={createDialogOpen}
                onOpenChange={setCreateDialogOpen}
                onSave={handleCreateBudget}
                isLoading={isLoading}
                categories={categories}
            />


        </SidebarProvider>
    );
}