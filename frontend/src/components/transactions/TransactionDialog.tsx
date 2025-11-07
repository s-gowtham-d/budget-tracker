
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
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
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useMemo } from 'react';
import { useCurrency } from '@/lib/currency';

// @ts-nocheck
const transactionSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    amount: z.string().min(1, 'Amount is required'),
    // @ts-nocheck
    type: z.enum(['income', 'expense']).refine(val => !!val, {
    message: 'Type is required',
    }),
    category: z.string().min(1, 'Category is required'),
    // @ts-nocheck
    date: z.date({
        message: 'Date is required',
    }),
    description: z.string().optional(),
});

// const INCOME_CATEGORIES = [
//     'Salary',
//     'Freelance',
//     'Business',
//     'Investment',
//     'Gift',
//     'Other Income'
// ];

// const EXPENSE_CATEGORIES = [
//     'Food & Dining',
//     'Transportation',
//     'Shopping',
//     'Entertainment',
//     'Bills & Utilities',
//     'Healthcare',
//     'Education',
//     'Travel',
//     'Personal Care',
//     'Other Expense'
// ];

export default function TransactionDialog({
    open,
    onOpenChange,
    transaction,
    onSave,
    categories

}) {
    const [isLoading, setIsLoading] = useState(false);
    const [date, setDate] = useState(transaction?.date ? new Date(transaction.date) : new Date());
    const [transactionType, setTransactionType] = useState(transaction?.type || 'expense');
    const { symbol } = useCurrency();

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        reset,
        watch
    } = useForm({
        resolver: zodResolver(transactionSchema),
        defaultValues: transaction ? {
            name: transaction.name,
            amount: Math.abs(transaction.amount).toString(),
            type: transaction.type,
            category: transaction.category,
            date: new Date(transaction.date),
            description: transaction.description || '',
        } : {
            type: 'expense',
            date: new Date(),
        }
    });

    const incomeCategories = useMemo(
        () => categories?.filter(cat => cat.type === 'income') || [],
        [categories]
    );

    const expenseCategories = useMemo(
        () => categories?.filter(cat => cat.type === 'expense') || [],
        [categories]
    );
    const filteredCategories = transactionType === 'income' ? incomeCategories : expenseCategories;


    // const categories = transactionType === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            const transactionData = {
                ...data,
                category: parseInt(data.category, 10),
                amount: data.type === 'expense' ? -Math.abs(parseFloat(data.amount)) : Math.abs(parseFloat(data.amount)),
                date: format(data.date, 'yyyy-MM-dd'),
                id: transaction?.id || Date.now(),
                icon: data.type === 'income' ? '💰' : getCategoryIcon(data.category),
            };

            // await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

            onSave(transactionData);
            reset({
                name: '',
                amount: '',
                type: 'expense',
                category: '',
                date: new Date(),
                description: '',
            });
            setDate(new Date());
            setTransactionType('expense');
            onOpenChange(false);
        } catch (error) {
            console.error('Error saving transaction:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const getCategoryIcon = (category) => {
        const icons = {
            'Food & Dining': '🍽️',
            'Transportation': '🚗',
            'Shopping': '🛍️',
            'Entertainment': '🎬',
            'Bills & Utilities': '💡',
            'Healthcare': '🏥',
            'Education': '📚',
            'Travel': '✈️',
            'Personal Care': '💅',
            'Salary': '💰',
            'Freelance': '💼',
            'Business': '🏢',
            'Investment': '📈',
        };
        return icons[category] || '📝';
    };

    useEffect(() => {
        if (transaction) {
            setValue('name', transaction.name);
            setValue('amount', Math.abs(transaction.amount).toString());
            setValue('type', transaction.type);
            setValue('category', transaction.category.toString());
            setValue('date', new Date(transaction.date));
            setValue('description', transaction.description || '');
            setTransactionType(transaction.type);
            setDate(new Date(transaction.date));
        }
    }, [transaction, setValue]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>
                        {transaction ? 'Edit Transaction' : 'Add New Transaction'}
                    </DialogTitle>
                    <DialogDescription>
                        {transaction ? 'Update transaction details' : 'Fill in the details to add a new transaction'}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* Transaction Type */}
                    <div className="space-y-2">
                        <Label>Transaction Type</Label>
                        <Select
                            value={transactionType}
                            onValueChange={(value) => {
                                setTransactionType(value);
                                setValue('type', value as 'income' | 'expense');
                                setValue('category', ''); // Reset category when type changes
                            }}
                        >
                            <SelectTrigger className={cn(errors.type && 'border-red-500')}>
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="income">Income</SelectItem>
                                <SelectItem value="expense">Expense</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.type && (
                            <p className="text-sm text-red-500">{errors.type.message}</p>
                        )}
                    </div>

                    {/* Name */}
                    <div className="space-y-2">
                        <Label htmlFor="name">Transaction Name</Label>
                        <Input
                            id="name"
                            placeholder="e.g., Grocery Shopping"
                            className={cn(errors.name && 'border-red-500')}
                            {...register('name')}
                        />
                        {errors.name && (
                            <p className="text-sm text-red-500">{errors.name.message}</p>
                        )}
                    </div>

                    {/* Amount */}
                    <div className="space-y-2">
                        <Label htmlFor="amount">Amount ({symbol})</Label>
                        <Input
                            id="amount"
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            className={cn(errors.amount && 'border-red-500')}
                            {...register('amount')}
                        />
                        {errors.amount && (
                            <p className="text-sm text-red-500">{errors.amount.message}</p>
                        )}
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                    <Label>Category</Label>
                    <Select
                        value={watch("category") || ""} 
                        onValueChange={(value) => setValue("category", value)}
                    >
                        <SelectTrigger className={cn(errors.category && "border-red-500")}>
                        <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                        {filteredCategories.map((category) => (
                            <SelectItem key={category.id} value={category.id.toString()}>
                            <span className="flex items-center gap-2">
                                <span>{category.icon}</span>
                                <span>{category.name}</span>
                            </span>
                            </SelectItem>
                        ))}
                        </SelectContent>
                    </Select>

                    {errors.category && (
                        <p className="text-sm text-red-500">{errors.category.message}</p>
                    )}
                    </div>


                    {/* Date */}
                    <div className="space-y-2">
                        <Label>Date</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !date && "text-muted-foreground",
                                        errors.date && "border-red-500"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={(newDate) => {
                                        setDate(newDate);
                                        setValue('date', newDate);
                                    }}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                        {errors.date && (
                            <p className="text-sm text-red-500">{errors.date.message}</p>
                        )}
                    </div>

                    {/* Description (Optional) */}
                    <div className="space-y-2">
                        <Label htmlFor="description">Description (Optional)</Label>
                        <Input
                            id="description"
                            placeholder="Add notes..."
                            {...register('description')}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit(onSubmit)} disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>{transaction ? 'Update' : 'Add'} Transaction</>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

