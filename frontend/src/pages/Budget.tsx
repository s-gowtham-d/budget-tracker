
import { useState } from 'react';
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    PiggyBank,
    TrendingUp,
    TrendingDown,
    AlertTriangle,
    CheckCircle2,
    Edit,
    Save,
    X
} from "lucide-react";
import BudgetComparisonChart from "@/components/budget/BudgetComparisonChart";

// Mock budget data
const INITIAL_BUDGETS = [
    {
        category: 'Food & Dining',
        budget: 800,
        spent: 620,
        icon: '🍽️',
        transactions: 12
    },
    {
        category: 'Transportation',
        budget: 300,
        spent: 245,
        icon: '🚗',
        transactions: 8
    },
    {
        category: 'Shopping',
        budget: 400,
        spent: 480,
        icon: '🛍️',
        transactions: 6
    },
    {
        category: 'Entertainment',
        budget: 200,
        spent: 150,
        icon: '🎬',
        transactions: 5
    },
    {
        category: 'Bills & Utilities',
        budget: 600,
        spent: 550,
        icon: '💡',
        transactions: 4
    },
    {
        category: 'Healthcare',
        budget: 300,
        spent: 180,
        icon: '🏥',
        transactions: 3
    },
    {
        category: 'Education',
        budget: 500,
        spent: 450,
        icon: '📚',
        transactions: 2
    },
];

// Category Budget Card Component
function CategoryBudgetCard({ category, onEdit }) {
    const percentage = (category.spent / category.budget) * 100;
    const remaining = category.budget - category.spent;
    const isOverBudget = category.spent > category.budget;

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="flex items-center gap-2">
                    <div className="text-2xl">{category.icon}</div>
                    <div>
                        <CardTitle className="text-base">{category.category}</CardTitle>
                        <CardDescription className="text-xs">
                            {category.transactions} transactions
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
                    <span className={`font-bold ${isOverBudget ? 'text-red-600' : 'text-foreground'}`}>
                        ${category.spent.toLocaleString()}
                    </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Budget</span>
                    <span className="font-medium">${category.budget.toLocaleString()}</span>
                </div>

                <Progress
                    value={percentage > 100 ? 100 : percentage}
                    className={`h-2 ${isOverBudget ? 'bg-red-100' : ''}`}
                />

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                        {isOverBudget ? (
                            <>
                                <AlertTriangle className="h-3 w-3 text-red-500" />
                                <span className="text-xs text-red-600 font-medium">
                                    Over by ${Math.abs(remaining).toLocaleString()}
                                </span>
                            </>
                        ) : (
                            <>
                                <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                                <span className="text-xs text-emerald-600 font-medium">
                                    ${remaining.toLocaleString()} left
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

// Edit Budget Dialog
function EditBudgetDialog({ open, onOpenChange, category, onSave }) {
    const [budget, setBudget] = useState(category?.budget || 0);

    const handleSave = () => {
        onSave({ ...category, budget: parseFloat(budget) });
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Budget - {category?.category}</DialogTitle>
                    <DialogDescription>
                        Set a monthly budget limit for this category
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>Monthly Budget ($)</Label>
                        <Input
                            type="number"
                            value={budget}
                            onChange={(e) => setBudget(e.target.value)}
                            placeholder="0.00"
                            step="0.01"
                        />
                    </div>
                    <div className="rounded-lg bg-muted p-3 text-sm">
                        <p className="font-medium mb-1">Current Status</p>
                        <p className="text-muted-foreground text-xs">
                            Spent: ${category?.spent.toLocaleString()} ({category?.transactions} transactions)
                        </p>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave}>
                        <Save className="h-4 w-4 mr-2" />
                        Save Budget
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default function Budget() {
    const [budgets, setBudgets] = useState(INITIAL_BUDGETS);
    const [selectedMonth, setSelectedMonth] = useState('2025-11');
    const [editingCategory, setEditingCategory] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    // Calculate totals
    const totalBudget = budgets.reduce((sum, b) => sum + b.budget, 0);
    const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
    const totalRemaining = totalBudget - totalSpent;
    const overallPercentage = (totalSpent / totalBudget) * 100;
    const categoriesOverBudget = budgets.filter(b => b.spent > b.budget).length;

    // Handle edit budget
    const handleEditBudget = (category) => {
        setEditingCategory(category);
        setDialogOpen(true);
    };

    // Handle save budget
    const handleSaveBudget = (updatedCategory) => {
        setBudgets(prev =>
            prev.map(b => b.category === updatedCategory.category ? updatedCategory : b)
        );
    };

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                {/* Header */}
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-background">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <div className="flex items-center gap-2 flex-1">
                        <h1 className="text-xl font-semibold">Budget Management</h1>
                    </div>
                    <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="2025-11">November 2025</SelectItem>
                            <SelectItem value="2025-10">October 2025</SelectItem>
                            <SelectItem value="2025-09">September 2025</SelectItem>
                            <SelectItem value="2025-08">August 2025</SelectItem>
                        </SelectContent>
                    </Select>
                </header>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto p-6 bg-slate-50 dark:bg-slate-950">
                    <div className="max-w-7xl mx-auto space-y-6">

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
                                <div className="grid gap-6 md:grid-cols-3 mb-6">
                                    <div>
                                        <p className="text-sm text-muted-foreground mb-1">Total Budget</p>
                                        <p className="text-3xl font-bold">${totalBudget.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground mb-1">Total Spent</p>
                                        <p className="text-3xl font-bold text-blue-600">
                                            ${totalSpent.toLocaleString()}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground mb-1">Remaining</p>
                                        <p className={`text-3xl font-bold ${totalRemaining < 0 ? 'text-red-600' : 'text-emerald-600'
                                            }`}>
                                            ${Math.abs(totalRemaining).toLocaleString()}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Progress</span>
                                        <span className="font-medium">{overallPercentage.toFixed(1)}% used</span>
                                    </div>
                                    <Progress
                                        value={overallPercentage > 100 ? 100 : overallPercentage}
                                        className="h-3"
                                    />
                                </div>

                                {categoriesOverBudget > 0 && (
                                    <div className="mt-4 flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/50 rounded-lg">
                                        <AlertTriangle className="h-5 w-5 text-red-600" />
                                        <p className="text-sm text-red-900 dark:text-red-400">
                                            <strong>{categoriesOverBudget} categories</strong> are over budget
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Budget vs Actual Chart - D3.js (REQUIRED) */}
                        <BudgetComparisonChart
                            data={budgets.map(b => ({
                                category: b.category,
                                budget: b.budget,
                                spent: b.spent
                            }))}
                        />

                        {/* Category Budgets Grid */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold">Category Budgets</h2>
                                <Button variant="outline" size="sm">
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit All
                                </Button>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {budgets.map((budget) => (
                                    <CategoryBudgetCard
                                        key={budget.category}
                                        category={budget}
                                        onEdit={handleEditBudget}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Budget Tips Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Budget Tips</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <TrendingUp className="h-5 w-5 text-emerald-500 mt-0.5" />
                                    <div>
                                        <p className="font-medium text-sm">Great job on saving!</p>
                                        <p className="text-xs text-muted-foreground">
                                            You're under budget in 6 out of 7 categories
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <TrendingDown className="h-5 w-5 text-amber-500 mt-0.5" />
                                    <div>
                                        <p className="font-medium text-sm">Watch your shopping</p>
                                        <p className="text-xs text-muted-foreground">
                                            Shopping category is 20% over budget this month
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <CheckCircle2 className="h-5 w-5 text-blue-500 mt-0.5" />
                                    <div>
                                        <p className="font-medium text-sm">On track for the month</p>
                                        <p className="text-xs text-muted-foreground">
                                            You have ${totalRemaining.toLocaleString()} remaining across all categories
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                    </div>
                </main>
            </SidebarInset>

            {/* Edit Budget Dialog */}
            <EditBudgetDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                category={editingCategory}
                onSave={handleSaveBudget}
            />
        </SidebarProvider>
    );
}