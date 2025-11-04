import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { useCurrency } from "@/lib/currency"

const formSchema = z.object({
    category: z.string().min(2, "Category is required"),
    limit: z.number().min(1, "Budget limit must be positive"),
    spent: z.number().min(0, "Spent amount must be non-negative"),
})

export function BudgetForm({ onAddBudget }) {
    const { symbol } = useCurrency();
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: { category: "", limit: 0, spent: 0 },
    })

    function onSubmit(values) {
        onAddBudget(values)
        form.reset()
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Add New Budget</CardTitle>
                <CardDescription>Set spending limit for a category</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. Food & Dining" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="limit"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Budget Limit ({symbol})</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="spent"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Amount Spent ({symbol})</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full">
                            Add Budget
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
