
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useCurrency } from "@/lib/currency";

export default function BudgetProgressBar({ budget, spent, month }) {
    const percentage = Math.round((spent / budget) * 100);
    const remaining = budget - spent;
    const isOverBudget = spent > budget;
    const { symbol } = useCurrency();

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base font-medium">
                    Budget Status - {month}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                    <div>
                        <p className="text-muted-foreground">Budget</p>
                        <p className="text-xl font-bold">{symbol}{budget.toLocaleString()}</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground">Spent</p>
                        <p className="text-xl font-bold">{symbol}{spent.toLocaleString()}</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground">Remaining</p>
                        <p className={`text-xl font-bold ${isOverBudget ? 'text-red-500' : 'text-emerald-500'}`}>
                            {symbol}{Math.abs(remaining).toLocaleString()}
                        </p>
                    </div>
                </div>

                <div className="space-y-2">
                    <Progress
                        value={percentage > 100 ? 100 : percentage}
                        className={isOverBudget ? "bg-red-100" : ""}
                    />
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{percentage}% used</span>
                        {isOverBudget && (
                            <span className="text-red-500 font-medium">Over budget by {symbol}{(spent - budget).toLocaleString()}</span>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}