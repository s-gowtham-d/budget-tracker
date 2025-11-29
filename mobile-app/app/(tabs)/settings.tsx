import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../store/authStore';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function Settings() {
    const { user, logout } = useAuthStore();
    const router = useRouter();

    const handleLogout = async () => {
        await logout();
        router.replace('/auth/login');
    };

    return (
        <View className="flex-1 bg-background p-6 pt-16">
            <Text className="text-3xl font-bold mb-6">Settings</Text>

            <Card className="mb-6">
                <CardContent className="flex-row items-center gap-4 p-6">
                    <Avatar alt="User Avatar" className="w-16 h-16">
                        <AvatarFallback>
                            <Text className="text-lg font-bold">
                                {user?.first_name?.[0]}{user?.last_name?.[0]}
                            </Text>
                        </AvatarFallback>
                    </Avatar>
                    <View className="flex-1">
                        <Text className="text-lg font-semibold">{user?.first_name} {user?.last_name}</Text>
                        <Text className="text-sm text-muted-foreground">{user?.email}</Text>
                    </View>
                </CardContent>
            </Card>

            <Button variant="destructive" onPress={handleLogout}>
                <Text>Logout</Text>
            </Button>
        </View>
    );
}