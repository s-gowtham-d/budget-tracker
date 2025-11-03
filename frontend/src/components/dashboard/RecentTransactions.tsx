
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, TrendingDown } from "lucide-react";
import { format } from "date-fns";

export default function RecentTransactions({ transactions, limit = 5 }) {
    const displayTransactions = transactions.slice(0, limit);

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Recent Transactions</CardTitle>
                    <CardDescription>Your latest financial activities</CardDescription>
                </div>
                <Button variant="ghost" size="sm" asChild>
                    <a href="/transactions" className="flex items-center gap-1">
                        View All
                        <ArrowRight className="h-4 w-4" />
                    </a>
                </Button>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {displayTransactions.map((transaction) => (
                        <div
                            key={transaction.id}
                            className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors cursor-pointer"
                        >
                            <div className="flex items-center gap-3">
                                <div className={`h-10 w-10 rounded-lg flex items-center justify-center text-xl ${transaction.type === 'income'
                                    ? 'bg-emerald-100 dark:bg-emerald-900/20'
                                    : 'bg-red-100 dark:bg-red-900/20'
                                    }`}>
                                    {transaction.icon}
                                </div>
                                <div>
                                    <p className="font-medium">{transaction.name}</p>
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm text-muted-foreground">{transaction.category_name}</p>
                                        <span className="text-xs text-muted-foreground">
                                            • {format(new Date(transaction.date), 'MMM dd, yyyy')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right flex items-center gap-2">
                                <div>
                                    <p className={`font-semibold ${transaction.type === 'income' ? 'text-emerald-600' : 'text-red-600'
                                        }`}>
                                        {transaction.type === 'income' ? '+' : '-'}${Math.abs(transaction.amount).toLocaleString()}
                                    </p>
                                </div>
                                {transaction.type === 'income' ? (
                                    <TrendingUp className="h-4 w-4 text-emerald-600" />
                                ) : (
                                    <TrendingDown className="h-4 w-4 text-red-600" />
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
