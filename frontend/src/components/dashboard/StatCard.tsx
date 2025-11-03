
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, type LucideIcon } from "lucide-react";

interface StatCardProps {
    title: string;
    amount: string;
    change: string;
    changeType: 'positive' | 'negative' | 'neutral';
    icon: LucideIcon;
    iconBgColor: string;
}

export default function StatCard({
    title,
    amount,
    change,
    changeType,
    icon: Icon,
    iconBgColor
}: StatCardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    {title}
                </CardTitle>
                <div className={`h-8 w-8 rounded-lg ${iconBgColor} flex items-center justify-center`}>
                    <Icon className="h-4 w-4 text-foreground" />
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold">{amount}</div>
                <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                    {changeType === 'positive' && (
                        <>
                            <TrendingUp className="h-3 w-3 text-emerald-500" />
                            <span className="text-emerald-500">{change}</span>
                        </>
                    )}
                    {changeType === 'negative' && (
                        <>
                            <TrendingDown className="h-3 w-3 text-red-500" />
                            <span className="text-red-500">{change}</span>
                        </>
                    )}
                    {changeType === 'neutral' && (
                        <span>{change}</span>
                    )}
                    {changeType !== 'neutral' && (
                        <span className="ml-1">from last month</span>
                    )}
                </p>
            </CardContent>
        </Card>
    );
}
