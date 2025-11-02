
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    User,
    Mail,
    Lock,
    Bell,
    Globe,
    Palette,
    Download,
    Trash2,
    Save,
    CheckCircle2,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Profile Schema
const profileSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    avatar: z.string().optional(),
});

// Password Schema
const passwordSchema = z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

export default function Settings() {
    const navigate = useNavigate();
    const { user, setUser } = useAuthStore();
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [notifications, setNotifications] = useState({
        email: true,
        push: false,
        transactions: true,
        budgetAlerts: true,
    });

    // Profile Form
    const {
        register: registerProfile,
        handleSubmit: handleSubmitProfile,
        formState: { errors: profileErrors },
    } = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: user?.name || '',
            email: user?.email || '',
        },
    });

    // Password Form
    const {
        register: registerPassword,
        handleSubmit: handleSubmitPassword,
        formState: { errors: passwordErrors },
        reset: resetPassword,
    } = useForm<PasswordFormData>({
        resolver: zodResolver(passwordSchema),
    });

    const onProfileSubmit = (data: ProfileFormData) => {
        // API call to update profile
        console.log('Update profile:', data);
        setUser({ ...user!, name: data.name, email: data.email });
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
    };

    const onPasswordSubmit = (data: PasswordFormData) => {
        // API call to change password
        console.log('Change password:', data);
        resetPassword();
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
    };

    const handleExportData = () => {
        // Export user data
        console.log('Exporting data...');
    };

    const handleDeleteAccount = () => {
        if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            console.log('Deleting account...');
            // API call to delete account
        }
    };

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                {/* Header */}
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-background">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <h1 className="text-xl font-semibold">Settings</h1>
                </header>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto p-6 bg-slate-50 dark:bg-slate-950">
                    <div className="max-w-4xl mx-auto space-y-6">

                        {saveSuccess && (
                            <Alert className="bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-900">
                                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                <AlertDescription className="text-emerald-900 dark:text-emerald-400">
                                    Settings saved successfully!
                                </AlertDescription>
                            </Alert>
                        )}

                        <Tabs defaultValue="profile" className="space-y-6">
                            <TabsList className="grid w-full grid-cols-4">
                                <TabsTrigger value="profile">Profile</TabsTrigger>
                                <TabsTrigger value="security">Security</TabsTrigger>
                                <TabsTrigger value="preferences">Preferences</TabsTrigger>
                                <TabsTrigger value="account">Account</TabsTrigger>
                            </TabsList>

                            {/* Profile Tab */}
                            <TabsContent value="profile" className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <User className="h-5 w-5" />
                                            Profile Information
                                        </CardTitle>
                                        <CardDescription>
                                            Update your personal information and profile picture
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        {/* Avatar */}
                                        <div className="flex items-center gap-4">
                                            <Avatar className="h-20 w-20">
                                                <AvatarImage src={user?.avatar} />
                                                <AvatarFallback className="text-lg">
                                                    {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <Button variant="outline" size="sm">
                                                    Change Avatar
                                                </Button>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    JPG, PNG or GIF. Max size 2MB.
                                                </p>
                                            </div>
                                        </div>

                                        <form onSubmit={handleSubmitProfile(onProfileSubmit)} className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="name">Full Name</Label>
                                                <Input
                                                    id="name"
                                                    {...registerProfile('name')}
                                                    className={profileErrors.name ? 'border-red-500' : ''}
                                                />
                                                {profileErrors.name && (
                                                    <p className="text-sm text-red-500">{profileErrors.name.message}</p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="email">Email</Label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    {...registerProfile('email')}
                                                    className={profileErrors.email ? 'border-red-500' : ''}
                                                />
                                                {profileErrors.email && (
                                                    <p className="text-sm text-red-500">{profileErrors.email.message}</p>
                                                )}
                                            </div>

                                            <Button type="submit">
                                                <Save className="h-4 w-4 mr-2" />
                                                Save Changes
                                            </Button>
                                        </form>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Security Tab */}
                            <TabsContent value="security" className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Lock className="h-5 w-5" />
                                            Change Password
                                        </CardTitle>
                                        <CardDescription>
                                            Update your password to keep your account secure
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <form onSubmit={handleSubmitPassword(onPasswordSubmit)} className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="currentPassword">Current Password</Label>
                                                <Input
                                                    id="currentPassword"
                                                    type="password"
                                                    {...registerPassword('currentPassword')}
                                                    className={passwordErrors.currentPassword ? 'border-red-500' : ''}
                                                />
                                                {passwordErrors.currentPassword && (
                                                    <p className="text-sm text-red-500">
                                                        {passwordErrors.currentPassword.message}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="newPassword">New Password</Label>
                                                <Input
                                                    id="newPassword"
                                                    type="password"
                                                    {...registerPassword('newPassword')}
                                                    className={passwordErrors.newPassword ? 'border-red-500' : ''}
                                                />
                                                {passwordErrors.newPassword && (
                                                    <p className="text-sm text-red-500">
                                                        {passwordErrors.newPassword.message}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                                <Input
                                                    id="confirmPassword"
                                                    type="password"
                                                    {...registerPassword('confirmPassword')}
                                                    className={passwordErrors.confirmPassword ? 'border-red-500' : ''}
                                                />
                                                {passwordErrors.confirmPassword && (
                                                    <p className="text-sm text-red-500">
                                                        {passwordErrors.confirmPassword.message}
                                                    </p>
                                                )}
                                            </div>

                                            <Button type="submit">
                                                <Save className="h-4 w-4 mr-2" />
                                                Update Password
                                            </Button>
                                        </form>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Two-Factor Authentication</CardTitle>
                                        <CardDescription>
                                            Add an extra layer of security to your account
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <Button variant="outline">Enable 2FA</Button>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Preferences Tab */}
                            <TabsContent value="preferences" className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Bell className="h-5 w-5" />
                                            Notifications
                                        </CardTitle>
                                        <CardDescription>
                                            Manage how you receive notifications
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium">Email Notifications</p>
                                                <p className="text-sm text-muted-foreground">
                                                    Receive notifications via email
                                                </p>
                                            </div>
                                            <Switch
                                                checked={notifications.email}
                                                onCheckedChange={(checked) =>
                                                    setNotifications({ ...notifications, email: checked })
                                                }
                                            />
                                        </div>

                                        <Separator />

                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium">Transaction Alerts</p>
                                                <p className="text-sm text-muted-foreground">
                                                    Get notified about new transactions
                                                </p>
                                            </div>
                                            <Switch
                                                checked={notifications.transactions}
                                                onCheckedChange={(checked) =>
                                                    setNotifications({ ...notifications, transactions: checked })
                                                }
                                            />
                                        </div>

                                        <Separator />

                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium">Budget Alerts</p>
                                                <p className="text-sm text-muted-foreground">
                                                    Alerts when you exceed your budget
                                                </p>
                                            </div>
                                            <Switch
                                                checked={notifications.budgetAlerts}
                                                onCheckedChange={(checked) =>
                                                    setNotifications({ ...notifications, budgetAlerts: checked })
                                                }
                                            />
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Globe className="h-5 w-5" />
                                            Language & Region
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <Label>Language</Label>
                                            <Select defaultValue="en">
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="en">English</SelectItem>
                                                    <SelectItem value="es">Spanish</SelectItem>
                                                    <SelectItem value="fr">French</SelectItem>
                                                    <SelectItem value="de">German</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Currency</Label>
                                            <Select defaultValue="usd">
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="usd">USD ($)</SelectItem>
                                                    <SelectItem value="eur">EUR (€)</SelectItem>
                                                    <SelectItem value="gbp">GBP (£)</SelectItem>
                                                    <SelectItem value="inr">INR (₹)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Palette className="h-5 w-5" />
                                            Appearance
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <Label>Theme</Label>
                                            <Select defaultValue="light">
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="light">Light</SelectItem>
                                                    <SelectItem value="dark">Dark</SelectItem>
                                                    <SelectItem value="system">System</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Account Tab */}
                            <TabsContent value="account" className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Download className="h-5 w-5" />
                                            Export Data
                                        </CardTitle>
                                        <CardDescription>
                                            Download a copy of your financial data
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <Button variant="outline" onClick={handleExportData}>
                                            <Download className="h-4 w-4 mr-2" />
                                            Export All Data
                                        </Button>
                                    </CardContent>
                                </Card>

                                <Card className="border-red-200 dark:border-red-900">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-red-600">
                                            <Trash2 className="h-5 w-5" />
                                            Danger Zone
                                        </CardTitle>
                                        <CardDescription>
                                            Permanently delete your account and all data
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <Button
                                            variant="destructive"
                                            onClick={handleDeleteAccount}
                                        >
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Delete Account
                                        </Button>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}
