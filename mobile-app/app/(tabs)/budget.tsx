import { View } from 'react-native';
import { Text } from '@/components/ui/text';

export default function Budget() {
    return (
        <View className="flex-1 bg-background p-6 pt-16">
            <Text className="text-3xl font-bold mb-6">Budget</Text>
            <View className="flex-1 items-center justify-center">
                <Text className="text-muted-foreground">No budgets set</Text>
            </View>
        </View>
    );
}