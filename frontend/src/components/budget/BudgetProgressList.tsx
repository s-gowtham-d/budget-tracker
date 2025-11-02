import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function BudgetProgressList({ budgets }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Category Budget Usage</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {budgets.map((item, i) => {
                    const percent = Math.min((item.spent / item.limit) * 100, 100)
                    return (
                        <div key={i} className="space-y-1">
                            <div className="flex justify-between text-sm font-medium">
                                <span>{item.category}</span>
                                <span>
                                    ${item.spent} / ${item.limit}
                                </span>
                            </div>
                            <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                                <div
                                    className={`h-2 rounded-full transition-all duration-500 ${percent > 90 ? "bg-red-500" : percent > 70 ? "bg-amber-500" : "bg-emerald-500"
                                        }`}
                                    style={{ width: `${percent}%` }}
                                ></div>
                            </div>
                        </div>
                    )
                })}
            </CardContent>
        </Card>
    )
}
