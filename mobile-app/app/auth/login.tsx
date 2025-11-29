// app/auth/login.tsx - Commit 7
import { useState } from 'react';
import { View, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, isLoading, error } = useAuthStore();
    const router = useRouter();

    const handleLogin = async () => {
        try {
            await login(email, password);
            router.replace('/(tabs)');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1 bg-background"
        >
            <View className="flex-1 justify-center p-6">
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle>Welcome Back</CardTitle>
                        <CardDescription>Sign in to continue</CardDescription>
                    </CardHeader>
                    <CardContent className="gap-4">
                        {error && (
                            <View className="bg-destructive/10 p-4 rounded-lg">
                                <Text className="text-destructive text-sm">{error}</Text>
                            </View>
                        )}

                        <View className="gap-2">
                            <Text className="text-sm font-medium">Email</Text>
                            <Input
                                placeholder="Email"
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                                keyboardType="email-address"
                            />
                        </View>

                        <View className="gap-2">
                            <Text className="text-sm font-medium">Password</Text>
                            <Input
                                placeholder="Password"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                            />
                        </View>

                        <Button onPress={handleLogin} disabled={isLoading} className="mt-2">
                            <Text>{isLoading ? 'Loading...' : 'Sign In'}</Text>
                        </Button>

                        <Button
                            variant="ghost"
                            onPress={() => router.push('/auth/register')}
                        >
                            <Text>Don't have an account? Sign Up</Text>
                        </Button>
                    </CardContent>
                </Card>
            </View>
        </KeyboardAvoidingView>
    );
}