// app/auth/register.tsx - Commit 8
import { useState } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Register() {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        username: '',
        email: '',
        password: '',
        password_confirm: '',
    });
    const { register, isLoading, error } = useAuthStore();
    const router = useRouter();

    const handleRegister = async () => {
        if (formData.password !== formData.password_confirm) {
            alert("Passwords don't match");
            return;
        }
        try {
            await register(formData);
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
            <ScrollView contentContainerClassName="p-6 pt-16">
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle>Create Account</CardTitle>
                        <CardDescription>Sign up to get started</CardDescription>
                    </CardHeader>
                    <CardContent className="gap-4">
                        {error && (
                            <View className="bg-destructive/10 p-4 rounded-lg">
                                <Text className="text-destructive text-sm">{error}</Text>
                            </View>
                        )}

                        <View className="flex-row gap-2">
                            <View className="flex-1 gap-2">
                                <Text className="text-sm font-medium">First Name</Text>
                                <Input
                                    placeholder="First Name"
                                    value={formData.first_name}
                                    onChangeText={(v) => setFormData({ ...formData, first_name: v })}
                                />
                            </View>
                            <View className="flex-1 gap-2">
                                <Text className="text-sm font-medium">Last Name</Text>
                                <Input
                                    placeholder="Last Name"
                                    value={formData.last_name}
                                    onChangeText={(v) => setFormData({ ...formData, last_name: v })}
                                />
                            </View>
                        </View>

                        <View className="gap-2">
                            <Text className="text-sm font-medium">Username</Text>
                            <Input
                                placeholder="Username"
                                value={formData.username}
                                onChangeText={(v) => setFormData({ ...formData, username: v })}
                                autoCapitalize="none"
                            />
                        </View>

                        <View className="gap-2">
                            <Text className="text-sm font-medium">Email</Text>
                            <Input
                                placeholder="Email"
                                value={formData.email}
                                onChangeText={(v) => setFormData({ ...formData, email: v })}
                                autoCapitalize="none"
                                keyboardType="email-address"
                            />
                        </View>

                        <View className="gap-2">
                            <Text className="text-sm font-medium">Password</Text>
                            <Input
                                placeholder="Password"
                                value={formData.password}
                                onChangeText={(v) => setFormData({ ...formData, password: v })}
                                secureTextEntry
                            />
                        </View>

                        <View className="gap-2">
                            <Text className="text-sm font-medium">Confirm Password</Text>
                            <Input
                                placeholder="Confirm Password"
                                value={formData.password_confirm}
                                onChangeText={(v) => setFormData({ ...formData, password_confirm: v })}
                                secureTextEntry
                            />
                        </View>

                        <Button onPress={handleRegister} disabled={isLoading} className="mt-2">
                            <Text>{isLoading ? 'Creating Account...' : 'Create Account'}</Text>
                        </Button>

                        <Button variant="ghost" onPress={() => router.back()}>
                            <Text>Already have an account? Sign In</Text>
                        </Button>
                    </CardContent>
                </Card>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}