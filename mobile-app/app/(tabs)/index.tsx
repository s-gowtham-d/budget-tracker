import { View, ScrollView } from 'react-native';
import { Text } from '@/components/ui/text';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Dashboard() {
    return (
        <ScrollView className="flex-1 bg-background">
            <View className="p-6 pt-16">
                <Text className="text-3xl font-bold mb-6">Dashboard</Text>

                <View className="gap-4">
                    <Card className="bg-emerald-50">
                        <CardHeader>
                            <CardTitle>Total Income</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Text className="text-2xl font-bold">$5,420</Text>
                            <Text className="text-sm text-muted-foreground">+12% from last month</Text>
                        </CardContent>
                    </Card>

                    <Card className="bg-red-50">
                        <CardHeader>
                            <CardTitle>Total Expenses</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Text className="text-2xl font-bold">$3,280</Text>
                            <Text className="text-sm text-muted-foreground">+8% from last month</Text>
                        </CardContent>
                    </Card>
                </View>
            </View>
        </ScrollView>
    );
}
