import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, X, Filter } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useTransactionStore } from "@/store/transactionStore";

export default function TransactionFilters({ onFilterChange, onReset }) {
    const [filters, setFilters] = useState({
        type: 'all',
        category: 'all',
        minAmount: '',
        maxAmount: '',
        startDate: null,
        endDate: null,
    });

    const { categories } = useTransactionStore();

    const filteredCategories = useMemo(() => {
        if (filters.type === "income") {
        return categories.filter((c) => c.type === "income");
        } else if (filters.type === "expense") {
        return categories.filter((c) => c.type === "expense");
        }
        return categories;
    }, [categories, filters.type]);

    const handleFilterChange = (key: string, value: any) => {
        const newFilters = { ...filters, [key]: value };

        // Reset category when switching type
        if (key === "type") {
        newFilters.category = "all";
        }

        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const handleReset = () => {
        const resetFilters = {
            type: 'all',
            category: 'all',
            minAmount: '',
            maxAmount: '',
            startDate: null,
            endDate: null,
        };
        setFilters(resetFilters);
        onReset();
    };

    // const categories = [
    //     'Food & Dining',
    //     'Transportation',
    //     'Shopping',
    //     'Entertainment',
    //     'Bills & Utilities',
    //     'Healthcare',
    //     'Education',
    //     'Salary',
    //     'Freelance',
    //     'Business',
    // ];

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-base font-medium flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Filters
                </CardTitle>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleReset}
                    className="h-8 px-2"
                >
                    <X className="h-4 w-4 mr-1" />
                    Clear
                </Button>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Transaction Type */}
                <div className="space-y-2">
                    <Label className="text-xs">Transaction Type</Label>
                    <Select
                        value={filters.type}
                        onValueChange={(value) => handleFilterChange('type', value)}
                    >
                        <SelectTrigger className="h-9">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="income">Income</SelectItem>
                            <SelectItem value="expense">Expense</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Category */}
                <div className="space-y-2">
                    <Label className="text-xs">Category</Label>
                    <Select
                        value={filters.category}
                        onValueChange={(value) => handleFilterChange('category', value)}
                    >
                        <SelectTrigger className="h-9">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                           {filteredCategories.map((cat) => (
                                <SelectItem key={cat.id} value={cat.name}>
                                {cat.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Amount Range */}
                <div className="space-y-2">
                    <Label className="text-xs">Amount Range</Label>
                    <div className="flex items-center gap-2">
                        <Input
                            type="number"
                            placeholder="Min"
                            value={filters.minAmount}
                            onChange={(e) => handleFilterChange('minAmount', e.target.value)}
                            className="h-9"
                        />
                        <span className="text-muted-foreground">-</span>
                        <Input
                            type="number"
                            placeholder="Max"
                            value={filters.maxAmount}
                            onChange={(e) => handleFilterChange('maxAmount', e.target.value)}
                            className="h-9"
                        />
                    </div>
                </div>

                {/* Date Range */}
                <div className="space-y-2">
                    <Label className="text-xs">Date Range</Label>
                    <div className="space-y-2">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={cn(
                                        "w-full justify-start text-left font-normal h-9",
                                        !filters.startDate && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {filters.startDate ? format(filters.startDate, "PPP") : "Start date"}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={filters.startDate}
                                    onSelect={(date) => handleFilterChange('startDate', date)}
                                />
                            </PopoverContent>
                        </Popover>

                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={cn(
                                        "w-full justify-start text-left font-normal h-9",
                                        !filters.endDate && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {filters.endDate ? format(filters.endDate, "PPP") : "End date"}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={filters.endDate}
                                    onSelect={(date) => handleFilterChange('endDate', date)}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

