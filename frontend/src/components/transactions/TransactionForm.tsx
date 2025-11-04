"use client"

import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { useCurrency } from "@/lib/currency"

const txSchema = z.object({
    name: z.string().min(2),
    category: z.string().min(1),
    type: z.enum(["income", "expense"]),
    amount: z.number().min(1),
    date: z.string(),
})

export function TransactionForm({ onAddTransaction }) {
    const form = useForm({ resolver: zodResolver(txSchema), defaultValues: { name: "", category: "", type: "expense", amount: 0, date: "" } })
    const onSubmit = (values) => { onAddTransaction(values); form.reset() }
    const { symbol } = useCurrency();

    return (
        <Card>
            <CardHeader><CardTitle>Add Transaction</CardTitle></CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="grid md:grid-cols-2 gap-4">
                        <FormField name="name" control={form.control} render={({ field }) => (
                            <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField name="category" control={form.control} render={({ field }) => (
                            <FormItem><FormLabel>Category</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField name="type" control={form.control} render={({ field }) => (
                            <FormItem><FormLabel>Type</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="income">Income</SelectItem>
                                        <SelectItem value="expense">Expense</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField name="amount" control={form.control} render={({ field }) => (
                            <FormItem><FormLabel>Amount ({symbol})</FormLabel><FormControl><Input type="number" onChange={(e) => field.onChange(Number(e.target.value))} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField name="date" control={form.control} render={({ field }) => (
                            <FormItem><FormLabel>Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <div className="md:col-span-2"><Button type="submit" className="w-full">Add Transaction</Button></div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
