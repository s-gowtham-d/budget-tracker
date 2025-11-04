
// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
// import { AppSidebar } from "@/components/app-sidebar";
// import { Separator } from "@/components/ui/separator";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from "@/components/ui/select";
// import { Switch } from "@/components/ui/switch";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import {
//     User,
//     Mail,
//     Lock,
//     Bell,
//     Globe,
//     Palette,
//     Download,
//     Trash2,
//     Save,
//     CheckCircle2,
// } from "lucide-react";
// import { useAuthStore } from "@/store/authStore";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";

// // Profile Schema
// const profileSchema = z.object({
//     name: z.string().min(2, 'Name must be at least 2 characters'),
//     email: z.string().email('Invalid email address'),
//     avatar: z.string().optional(),
// });

// // Password Schema
// const passwordSchema = z.object({
//     currentPassword: z.string().min(1, 'Current password is required'),
//     newPassword: z.string().min(8, 'Password must be at least 8 characters'),
//     confirmPassword: z.string().min(1, 'Please confirm your password'),
// }).refine((data) => data.newPassword === data.confirmPassword, {
//     message: "Passwords don't match",
//     path: ['confirmPassword'],
// });

// type ProfileFormData = z.infer<typeof profileSchema>;
// type PasswordFormData = z.infer<typeof passwordSchema>;

// export default function Settings() {
//     const navigate = useNavigate();
//     const { user, setUser } = useAuthStore();
//     const [saveSuccess, setSaveSuccess] = useState(false);
//     const [notifications, setNotifications] = useState({
//         email: true,
//         push: false,
//         transactions: true,
//         budgetAlerts: true,
//     });

//     // Profile Form
//     const {
//         register: registerProfile,
//         handleSubmit: handleSubmitProfile,
//         formState: { errors: profileErrors },
//     } = useForm<ProfileFormData>({
//         resolver: zodResolver(profileSchema),
//         defaultValues: {
//             name: user?.name || '',
//             email: user?.email || '',
//         },
//     });

//     // Password Form
//     const {
//         register: registerPassword,
//         handleSubmit: handleSubmitPassword,
//         formState: { errors: passwordErrors },
//         reset: resetPassword,
//     } = useForm<PasswordFormData>({
//         resolver: zodResolver(passwordSchema),
//     });

//     const onProfileSubmit = (data: ProfileFormData) => {
//         // API call to update profile
//         console.log('Update profile:', data);
//         setUser({ ...user!, name: data.name, email: data.email });
//         setSaveSuccess(true);
//         setTimeout(() => setSaveSuccess(false), 3000);
//     };

//     const onPasswordSubmit = (data: PasswordFormData) => {
//         // API call to change password
//         console.log('Change password:', data);
//         resetPassword();
//         setSaveSuccess(true);
//         setTimeout(() => setSaveSuccess(false), 3000);
//     };

//     const handleExportData = () => {
//         // Export user data
//         console.log('Exporting data...');
//     };

//     const handleDeleteAccount = () => {
//         if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
//             console.log('Deleting account...');
//             // API call to delete account
//         }
//     };

//     return (
//         <SidebarProvider>
//             <AppSidebar />
//             <SidebarInset>
//                 {/* Header */}
//                 <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-background">
//                     <SidebarTrigger className="-ml-1" />
//                     <Separator orientation="vertical" className="mr-2 h-4" />
//                     <h1 className="text-xl font-semibold">Settings</h1>
//                 </header>

//                 {/* Main Content */}
//                 <main className="flex-1 overflow-y-auto p-6 bg-slate-50 dark:bg-slate-950">
//                     <div className="max-w-4xl mx-auto space-y-6">

//                         {saveSuccess && (
//                             <Alert className="bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-900">
//                                 <CheckCircle2 className="h-4 w-4 text-emerald-600" />
//                                 <AlertDescription className="text-emerald-900 dark:text-emerald-400">
//                                     Settings saved successfully!
//                                 </AlertDescription>
//                             </Alert>
//                         )}

//                         <Tabs defaultValue="profile" className="space-y-6">
//                             <TabsList className="grid w-full grid-cols-4">
//                                 <TabsTrigger value="profile">Profile</TabsTrigger>
//                                 <TabsTrigger value="security">Security</TabsTrigger>
//                                 <TabsTrigger value="preferences">Preferences</TabsTrigger>
//                                 <TabsTrigger value="account">Account</TabsTrigger>
//                             </TabsList>

//                             {/* Profile Tab */}
//                             <TabsContent value="profile" className="space-y-6">
//                                 <Card>
//                                     <CardHeader>
//                                         <CardTitle className="flex items-center gap-2">
//                                             <User className="h-5 w-5" />
//                                             Profile Information
//                                         </CardTitle>
//                                         <CardDescription>
//                                             Update your personal information and profile picture
//                                         </CardDescription>
//                                     </CardHeader>
//                                     <CardContent className="space-y-6">
//                                         {/* Avatar */}
//                                         <div className="flex items-center gap-4">
//                                             <Avatar className="h-20 w-20">
//                                                 <AvatarImage src={user?.avatar} />
//                                                 <AvatarFallback className="text-lg">
//                                                     {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
//                                                 </AvatarFallback>
//                                             </Avatar>
//                                             <div>
//                                                 <Button variant="outline" size="sm">
//                                                     Change Avatar
//                                                 </Button>
//                                                 <p className="text-xs text-muted-foreground mt-1">
//                                                     JPG, PNG or GIF. Max size 2MB.
//                                                 </p>
//                                             </div>
//                                         </div>

//                                         <form onSubmit={handleSubmitProfile(onProfileSubmit)} className="space-y-4">
//                                             <div className="space-y-2">
//                                                 <Label htmlFor="name">Full Name</Label>
//                                                 <Input
//                                                     id="name"
//                                                     {...registerProfile('name')}
//                                                     className={profileErrors.name ? 'border-red-500' : ''}
//                                                 />
//                                                 {profileErrors.name && (
//                                                     <p className="text-sm text-red-500">{profileErrors.name.message}</p>
//                                                 )}
//                                             </div>

//                                             <div className="space-y-2">
//                                                 <Label htmlFor="email">Email</Label>
//                                                 <Input
//                                                     id="email"
//                                                     type="email"
//                                                     {...registerProfile('email')}
//                                                     className={profileErrors.email ? 'border-red-500' : ''}
//                                                 />
//                                                 {profileErrors.email && (
//                                                     <p className="text-sm text-red-500">{profileErrors.email.message}</p>
//                                                 )}
//                                             </div>

//                                             <Button type="submit">
//                                                 <Save className="h-4 w-4 mr-2" />
//                                                 Save Changes
//                                             </Button>
//                                         </form>
//                                     </CardContent>
//                                 </Card>
//                             </TabsContent>

//                             {/* Security Tab */}
//                             <TabsContent value="security" className="space-y-6">
//                                 <Card>
//                                     <CardHeader>
//                                         <CardTitle className="flex items-center gap-2">
//                                             <Lock className="h-5 w-5" />
//                                             Change Password
//                                         </CardTitle>
//                                         <CardDescription>
//                                             Update your password to keep your account secure
//                                         </CardDescription>
//                                     </CardHeader>
//                                     <CardContent>
//                                         <form onSubmit={handleSubmitPassword(onPasswordSubmit)} className="space-y-4">
//                                             <div className="space-y-2">
//                                                 <Label htmlFor="currentPassword">Current Password</Label>
//                                                 <Input
//                                                     id="currentPassword"
//                                                     type="password"
//                                                     {...registerPassword('currentPassword')}
//                                                     className={passwordErrors.currentPassword ? 'border-red-500' : ''}
//                                                 />
//                                                 {passwordErrors.currentPassword && (
//                                                     <p className="text-sm text-red-500">
//                                                         {passwordErrors.currentPassword.message}
//                                                     </p>
//                                                 )}
//                                             </div>

//                                             <div className="space-y-2">
//                                                 <Label htmlFor="newPassword">New Password</Label>
//                                                 <Input
//                                                     id="newPassword"
//                                                     type="password"
//                                                     {...registerPassword('newPassword')}
//                                                     className={passwordErrors.newPassword ? 'border-red-500' : ''}
//                                                 />
//                                                 {passwordErrors.newPassword && (
//                                                     <p className="text-sm text-red-500">
//                                                         {passwordErrors.newPassword.message}
//                                                     </p>
//                                                 )}
//                                             </div>

//                                             <div className="space-y-2">
//                                                 <Label htmlFor="confirmPassword">Confirm New Password</Label>
//                                                 <Input
//                                                     id="confirmPassword"
//                                                     type="password"
//                                                     {...registerPassword('confirmPassword')}
//                                                     className={passwordErrors.confirmPassword ? 'border-red-500' : ''}
//                                                 />
//                                                 {passwordErrors.confirmPassword && (
//                                                     <p className="text-sm text-red-500">
//                                                         {passwordErrors.confirmPassword.message}
//                                                     </p>
//                                                 )}
//                                             </div>

//                                             <Button type="submit">
//                                                 <Save className="h-4 w-4 mr-2" />
//                                                 Update Password
//                                             </Button>
//                                         </form>
//                                     </CardContent>
//                                 </Card>

//                                 <Card>
//                                     <CardHeader>
//                                         <CardTitle>Two-Factor Authentication</CardTitle>
//                                         <CardDescription>
//                                             Add an extra layer of security to your account
//                                         </CardDescription>
//                                     </CardHeader>
//                                     <CardContent>
//                                         <Button variant="outline">Enable 2FA</Button>
//                                     </CardContent>
//                                 </Card>
//                             </TabsContent>

//                             {/* Preferences Tab */}
//                             <TabsContent value="preferences" className="space-y-6">
//                                 <Card>
//                                     <CardHeader>
//                                         <CardTitle className="flex items-center gap-2">
//                                             <Bell className="h-5 w-5" />
//                                             Notifications
//                                         </CardTitle>
//                                         <CardDescription>
//                                             Manage how you receive notifications
//                                         </CardDescription>
//                                     </CardHeader>
//                                     <CardContent className="space-y-4">
//                                         <div className="flex items-center justify-between">
//                                             <div>
//                                                 <p className="font-medium">Email Notifications</p>
//                                                 <p className="text-sm text-muted-foreground">
//                                                     Receive notifications via email
//                                                 </p>
//                                             </div>
//                                             <Switch
//                                                 checked={notifications.email}
//                                                 onCheckedChange={(checked) =>
//                                                     setNotifications({ ...notifications, email: checked })
//                                                 }
//                                             />
//                                         </div>

//                                         <Separator />

//                                         <div className="flex items-center justify-between">
//                                             <div>
//                                                 <p className="font-medium">Transaction Alerts</p>
//                                                 <p className="text-sm text-muted-foreground">
//                                                     Get notified about new transactions
//                                                 </p>
//                                             </div>
//                                             <Switch
//                                                 checked={notifications.transactions}
//                                                 onCheckedChange={(checked) =>
//                                                     setNotifications({ ...notifications, transactions: checked })
//                                                 }
//                                             />
//                                         </div>

//                                         <Separator />

//                                         <div className="flex items-center justify-between">
//                                             <div>
//                                                 <p className="font-medium">Budget Alerts</p>
//                                                 <p className="text-sm text-muted-foreground">
//                                                     Alerts when you exceed your budget
//                                                 </p>
//                                             </div>
//                                             <Switch
//                                                 checked={notifications.budgetAlerts}
//                                                 onCheckedChange={(checked) =>
//                                                     setNotifications({ ...notifications, budgetAlerts: checked })
//                                                 }
//                                             />
//                                         </div>
//                                     </CardContent>
//                                 </Card>

//                                 <Card>
//                                     <CardHeader>
//                                         <CardTitle className="flex items-center gap-2">
//                                             <Globe className="h-5 w-5" />
//                                             Language & Region
//                                         </CardTitle>
//                                     </CardHeader>
//                                     <CardContent className="space-y-4">
//                                         <div className="space-y-2">
//                                             <Label>Language</Label>
//                                             <Select defaultValue="en">
//                                                 <SelectTrigger>
//                                                     <SelectValue />
//                                                 </SelectTrigger>
//                                                 <SelectContent>
//                                                     <SelectItem value="en">English</SelectItem>
//                                                     <SelectItem value="es">Spanish</SelectItem>
//                                                     <SelectItem value="fr">French</SelectItem>
//                                                     <SelectItem value="de">German</SelectItem>
//                                                 </SelectContent>
//                                             </Select>
//                                         </div>

//                                         <div className="space-y-2">
//                                             <Label>Currency</Label>
//                                             <Select defaultValue="usd">
//                                                 <SelectTrigger>
//                                                     <SelectValue />
//                                                 </SelectTrigger>
//                                                 <SelectContent>
//                                                     <SelectItem value="usd">USD ($)</SelectItem>
//                                                     <SelectItem value="eur">EUR (€)</SelectItem>
//                                                     <SelectItem value="gbp">GBP (£)</SelectItem>
//                                                     <SelectItem value="inr">INR (₹)</SelectItem>
//                                                 </SelectContent>
//                                             </Select>
//                                         </div>
//                                     </CardContent>
//                                 </Card>

//                                 <Card>
//                                     <CardHeader>
//                                         <CardTitle className="flex items-center gap-2">
//                                             <Palette className="h-5 w-5" />
//                                             Appearance
//                                         </CardTitle>
//                                     </CardHeader>
//                                     <CardContent className="space-y-4">
//                                         <div className="space-y-2">
//                                             <Label>Theme</Label>
//                                             <Select defaultValue="light">
//                                                 <SelectTrigger>
//                                                     <SelectValue />
//                                                 </SelectTrigger>
//                                                 <SelectContent>
//                                                     <SelectItem value="light">Light</SelectItem>
//                                                     <SelectItem value="dark">Dark</SelectItem>
//                                                     <SelectItem value="system">System</SelectItem>
//                                                 </SelectContent>
//                                             </Select>
//                                         </div>
//                                     </CardContent>
//                                 </Card>
//                             </TabsContent>

//                             {/* Account Tab */}
//                             <TabsContent value="account" className="space-y-6">
//                                 <Card>
//                                     <CardHeader>
//                                         <CardTitle className="flex items-center gap-2">
//                                             <Download className="h-5 w-5" />
//                                             Export Data
//                                         </CardTitle>
//                                         <CardDescription>
//                                             Download a copy of your financial data
//                                         </CardDescription>
//                                     </CardHeader>
//                                     <CardContent>
//                                         <Button variant="outline" onClick={handleExportData}>
//                                             <Download className="h-4 w-4 mr-2" />
//                                             Export All Data
//                                         </Button>
//                                     </CardContent>
//                                 </Card>

//                                 <Card className="border-red-200 dark:border-red-900">
//                                     <CardHeader>
//                                         <CardTitle className="flex items-center gap-2 text-red-600">
//                                             <Trash2 className="h-5 w-5" />
//                                             Danger Zone
//                                         </CardTitle>
//                                         <CardDescription>
//                                             Permanently delete your account and all data
//                                         </CardDescription>
//                                     </CardHeader>
//                                     <CardContent>
//                                         <Button
//                                             variant="destructive"
//                                             onClick={handleDeleteAccount}
//                                         >
//                                             <Trash2 className="h-4 w-4 mr-2" />
//                                             Delete Account
//                                         </Button>
//                                     </CardContent>
//                                 </Card>
//                             </TabsContent>
//                         </Tabs>
//                     </div>
//                 </main>
//             </SidebarInset>
//         </SidebarProvider>
//     );
// }


// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
// import { AppSidebar } from "@/components/app-sidebar";
// import { Separator } from "@/components/ui/separator";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from "@/components/ui/select";
// import { Switch } from "@/components/ui/switch";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import {
//     User,
//     Lock,
//     Bell,
//     Globe,
//     Palette,
//     Download,
//     Trash2,
//     Save,
//     CheckCircle2,
//     AlertCircle,
//     Loader2,
//     Phone,
// } from "lucide-react";
// import { useAuthStore } from "@/store/authStore";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";
// import { userAPI } from "@/lib/api";

// // Profile Schema - matches backend UserSerializer
// const profileSchema = z.object({
//     first_name: z.string().min(2, 'First name must be at least 2 characters'),
//     last_name: z.string().min(2, 'Last name must be at least 2 characters'),
//     username: z.string().min(3, 'Username must be at least 3 characters'),
//     phone: z.string().optional(),
// });

// // Password Schema - matches backend ChangePasswordSerializer
// const passwordSchema = z.object({
//     old_password: z.string().min(1, 'Current password is required'),
//     new_password: z.string().min(8, 'Password must be at least 8 characters'),
//     new_password_confirm: z.string().min(1, 'Please confirm your password'),
// }).refine((data) => data.new_password === data.new_password_confirm, {
//     message: "Passwords don't match",
//     path: ['new_password_confirm'],
// });

// // Preferences Schema
// const preferencesSchema = z.object({
//     currency: z.string(),
//     language: z.string(),
//     theme: z.enum(['light', 'dark', 'system']),
//     email_notifications: z.boolean(),
//     transaction_alerts: z.boolean(),
//     budget_alerts: z.boolean(),
// });

// type ProfileFormData = z.infer<typeof profileSchema>;
// type PasswordFormData = z.infer<typeof passwordSchema>;
// type PreferencesFormData = z.infer<typeof preferencesSchema>;

// export default function Settings() {
//     const navigate = useNavigate();
//     const { user, setUser, logout } = useAuthStore();
//     const [saveSuccess, setSaveSuccess] = useState(false);
//     const [errorMessage, setErrorMessage] = useState('');
//     const [isUpdating, setIsUpdating] = useState(false);
//     const [avatarFile, setAvatarFile] = useState<File | null>(null);
//     const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

//     // Profile Form
//     const {
//         register: registerProfile,
//         handleSubmit: handleSubmitProfile,
//         formState: { errors: profileErrors },
//         reset: resetProfile,
//     } = useForm<ProfileFormData>({
//         resolver: zodResolver(profileSchema),
//         defaultValues: {
//             first_name: user?.first_name || '',
//             last_name: user?.last_name || '',
//             username: user?.username || '',
//             phone: user?.phone || '',
//         },
//     });

//     // Password Form
//     const {
//         register: registerPassword,
//         handleSubmit: handleSubmitPassword,
//         formState: { errors: passwordErrors },
//         reset: resetPassword,
//     } = useForm<PasswordFormData>({
//         resolver: zodResolver(passwordSchema),
//     });

//     // Preferences state
//     const [preferences, setPreferences] = useState<PreferencesFormData>({
//         currency: user?.currency || 'usd',
//         language: user?.language || 'en',
//         theme: user?.theme || 'light',
//         email_notifications: user?.email_notifications ?? true,
//         transaction_alerts: user?.transaction_alerts ?? true,
//         budget_alerts: user?.budget_alerts ?? true,
//     });

//     // Update form when user data changes
//     useEffect(() => {
//         if (user) {
//             resetProfile({
//                 first_name: user.first_name || '',
//                 last_name: user.last_name || '',
//                 username: user.username || '',
//                 phone: user.phone || '',
//             });
//             setPreferences({
//                 currency: user.currency || 'usd',
//                 language: user.language || 'en',
//                 theme: user.theme || 'light',
//                 email_notifications: user.email_notifications ?? true,
//                 transaction_alerts: user.transaction_alerts ?? true,
//                 budget_alerts: user.budget_alerts ?? true,
//             });
//         }
//     }, [user, resetProfile]);

//     const showSuccess = () => {
//         setSaveSuccess(true);
//         setErrorMessage('');
//         setTimeout(() => setSaveSuccess(false), 3000);
//     };

//     const showError = (message: string) => {
//         setErrorMessage(message);
//         setSaveSuccess(false);
//         setTimeout(() => setErrorMessage(''), 5000);
//     };

//     // Handle Profile Update
//     const onProfileSubmit = async (data: ProfileFormData) => {
//         setIsUpdating(true);
//         try {
//             const response = await userAPI.updateProfile(data);
//             setUser(response.data);
//             showSuccess();
//         } catch (error: any) {
//             const errorMsg = error.response?.data?.message ||
//                 error.response?.data?.detail ||
//                 'Failed to update profile';
//             showError(errorMsg);
//         } finally {
//             setIsUpdating(false);
//         }
//     };

//     // Handle Password Change
//     const onPasswordSubmit = async (data: PasswordFormData) => {
//         setIsUpdating(true);
//         try {
//             await userAPI.changePassword(data);
//             resetPassword();
//             showSuccess();
//         } catch (error: any) {
//             const errorMsg = error.response?.data?.old_password?.[0] ||
//                 error.response?.data?.new_password?.[0] ||
//                 error.response?.data?.message ||
//                 'Failed to change password';
//             showError(errorMsg);
//         } finally {
//             setIsUpdating(false);
//         }
//     };

//     // Handle Preferences Update
//     const handlePreferencesUpdate = async () => {
//         setIsUpdating(true);
//         try {
//             const response = await userAPI.updateProfile(preferences);
//             setUser(response.data);
//             showSuccess();
//         } catch (error: any) {
//             showError('Failed to update preferences');
//         } finally {
//             setIsUpdating(false);
//         }
//     };

//     // Handle Avatar Upload
//     const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const file = e.target.files?.[0];
//         if (file) {
//             if (file.size > 2 * 1024 * 1024) {
//                 showError('File size must be less than 2MB');
//                 return;
//             }
//             setAvatarFile(file);
//             const reader = new FileReader();
//             reader.onloadend = () => {
//                 setAvatarPreview(reader.result as string);
//             };
//             reader.readAsDataURL(file);
//         }
//     };

//     const handleAvatarUpload = async () => {
//         if (!avatarFile) return;

//         setIsUpdating(true);
//         try {
//             const formData = new FormData();
//             formData.append('avatar', avatarFile);
//             const response = await userAPI.updateProfile(formData);
//             setUser(response.data);
//             setAvatarFile(null);
//             setAvatarPreview(null);
//             showSuccess();
//         } catch (error: any) {
//             showError('Failed to upload avatar');
//         } finally {
//             setIsUpdating(false);
//         }
//     };

//     // Handle Data Export
//     const handleExportData = async () => {
//         try {
//             const response = await userAPI.exportData();
//             const blob = new Blob([JSON.stringify(response.data, null, 2)], {
//                 type: 'application/json',
//             });
//             const url = window.URL.createObjectURL(blob);
//             const a = document.createElement('a');
//             a.href = url;
//             a.download = `finance-data-${new Date().toISOString().split('T')[0]}.json`;
//             document.body.appendChild(a);
//             a.click();
//             document.body.removeChild(a);
//             window.URL.revokeObjectURL(url);
//             showSuccess();
//         } catch (error) {
//             showError('Failed to export data');
//         }
//     };

//     // Handle Account Deletion
//     const handleDeleteAccount = async () => {
//         const confirmed = window.confirm(
//             'Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted.'
//         );

//         if (confirmed) {
//             const doubleConfirm = window.confirm(
//                 'This is your last chance. Are you absolutely sure you want to delete your account?'
//             );

//             if (doubleConfirm) {
//                 try {
//                     await userAPI.deleteAccount();
//                     logout();
//                     navigate('/login');
//                 } catch (error) {
//                     showError('Failed to delete account');
//                 }
//             }
//         }
//     };

//     return (
//         <SidebarProvider>
//             <AppSidebar />
//             <SidebarInset>
//                 {/* Header */}
//                 <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-background">
//                     <SidebarTrigger className="-ml-1" />
//                     <Separator orientation="vertical" className="mr-2 h-4" />
//                     <h1 className="text-xl font-semibold">Settings</h1>
//                 </header>

//                 {/* Main Content */}
//                 <main className="flex-1 overflow-y-auto p-6 bg-slate-50 dark:bg-slate-950">
//                     <div className="max-w-4xl mx-auto space-y-6">

//                         {/* Success Alert */}
//                         {saveSuccess && (
//                             <Alert className="bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-900">
//                                 <CheckCircle2 className="h-4 w-4 text-emerald-600" />
//                                 <AlertDescription className="text-emerald-900 dark:text-emerald-400">
//                                     Settings saved successfully!
//                                 </AlertDescription>
//                             </Alert>
//                         )}

//                         {/* Error Alert */}
//                         {errorMessage && (
//                             <Alert className="bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-900">
//                                 <AlertCircle className="h-4 w-4 text-red-600" />
//                                 <AlertDescription className="text-red-900 dark:text-red-400">
//                                     {errorMessage}
//                                 </AlertDescription>
//                             </Alert>
//                         )}

//                         <Tabs defaultValue="profile" className="space-y-6">
//                             <TabsList className="grid w-full grid-cols-4">
//                                 <TabsTrigger value="profile">Profile</TabsTrigger>
//                                 <TabsTrigger value="security">Security</TabsTrigger>
//                                 <TabsTrigger value="preferences">Preferences</TabsTrigger>
//                                 <TabsTrigger value="account">Account</TabsTrigger>
//                             </TabsList>

//                             {/* Profile Tab */}
//                             <TabsContent value="profile" className="space-y-6">
//                                 <Card>
//                                     <CardHeader>
//                                         <CardTitle className="flex items-center gap-2">
//                                             <User className="h-5 w-5" />
//                                             Profile Information
//                                         </CardTitle>
//                                         <CardDescription>
//                                             Update your personal information and profile picture
//                                         </CardDescription>
//                                     </CardHeader>
//                                     <CardContent className="space-y-6">
//                                         {/* Avatar */}
//                                         <div className="flex items-center gap-4">
//                                             <Avatar className="h-20 w-20">
//                                                 <AvatarImage src={avatarPreview || user?.avatar} />
//                                                 <AvatarFallback className="text-lg">
//                                                     {user?.first_name?.[0]}{user?.last_name?.[0]}
//                                                 </AvatarFallback>
//                                             </Avatar>
//                                             <div className="space-y-2">
//                                                 <div className="flex gap-2">
//                                                     <Button
//                                                         variant="outline"
//                                                         size="sm"
//                                                         onClick={() => document.getElementById('avatar-upload')?.click()}
//                                                     >
//                                                         Change Avatar
//                                                     </Button>
//                                                     {avatarFile && (
//                                                         <Button
//                                                             size="sm"
//                                                             onClick={handleAvatarUpload}
//                                                             disabled={isUpdating}
//                                                         >
//                                                             {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Upload'}
//                                                         </Button>
//                                                     )}
//                                                 </div>
//                                                 <input
//                                                     id="avatar-upload"
//                                                     type="file"
//                                                     accept="image/jpeg,image/png,image/gif"
//                                                     onChange={handleAvatarChange}
//                                                     className="hidden"
//                                                 />
//                                                 <p className="text-xs text-muted-foreground">
//                                                     JPG, PNG or GIF. Max size 2MB.
//                                                 </p>
//                                             </div>
//                                         </div>

//                                         <form onSubmit={handleSubmitProfile(onProfileSubmit)} className="space-y-4">
//                                             <div className="grid grid-cols-2 gap-4">
//                                                 <div className="space-y-2">
//                                                     <Label htmlFor="first_name">First Name</Label>
//                                                     <Input
//                                                         id="first_name"
//                                                         {...registerProfile('first_name')}
//                                                         className={profileErrors.first_name ? 'border-red-500' : ''}
//                                                     />
//                                                     {profileErrors.first_name && (
//                                                         <p className="text-sm text-red-500">{profileErrors.first_name.message}</p>
//                                                     )}
//                                                 </div>

//                                                 <div className="space-y-2">
//                                                     <Label htmlFor="last_name">Last Name</Label>
//                                                     <Input
//                                                         id="last_name"
//                                                         {...registerProfile('last_name')}
//                                                         className={profileErrors.last_name ? 'border-red-500' : ''}
//                                                     />
//                                                     {profileErrors.last_name && (
//                                                         <p className="text-sm text-red-500">{profileErrors.last_name.message}</p>
//                                                     )}
//                                                 </div>
//                                             </div>

//                                             <div className="space-y-2">
//                                                 <Label htmlFor="username">Username</Label>
//                                                 <Input
//                                                     id="username"
//                                                     {...registerProfile('username')}
//                                                     className={profileErrors.username ? 'border-red-500' : ''}
//                                                 />
//                                                 {profileErrors.username && (
//                                                     <p className="text-sm text-red-500">{profileErrors.username.message}</p>
//                                                 )}
//                                             </div>

//                                             <div className="space-y-2">
//                                                 <Label htmlFor="email">Email (Read-only)</Label>
//                                                 <Input
//                                                     id="email"
//                                                     type="email"
//                                                     value={user?.email || ''}
//                                                     disabled
//                                                     className="bg-muted"
//                                                 />
//                                                 <p className="text-xs text-muted-foreground">
//                                                     Email cannot be changed
//                                                 </p>
//                                             </div>

//                                             <div className="space-y-2">
//                                                 <Label htmlFor="phone">Phone Number (Optional)</Label>
//                                                 <Input
//                                                     id="phone"
//                                                     type="tel"
//                                                     placeholder="+1 (555) 000-0000"
//                                                     {...registerProfile('phone')}
//                                                 />
//                                             </div>

//                                             <Button type="submit" disabled={isUpdating}>
//                                                 {isUpdating ? (
//                                                     <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                                                 ) : (
//                                                     <Save className="h-4 w-4 mr-2" />
//                                                 )}
//                                                 Save Changes
//                                             </Button>
//                                         </form>
//                                     </CardContent>
//                                 </Card>
//                             </TabsContent>

//                             {/* Security Tab */}
//                             <TabsContent value="security" className="space-y-6">
//                                 <Card>
//                                     <CardHeader>
//                                         <CardTitle className="flex items-center gap-2">
//                                             <Lock className="h-5 w-5" />
//                                             Change Password
//                                         </CardTitle>
//                                         <CardDescription>
//                                             Update your password to keep your account secure
//                                         </CardDescription>
//                                     </CardHeader>
//                                     <CardContent>
//                                         <form onSubmit={handleSubmitPassword(onPasswordSubmit)} className="space-y-4">
//                                             <div className="space-y-2">
//                                                 <Label htmlFor="old_password">Current Password</Label>
//                                                 <Input
//                                                     id="old_password"
//                                                     type="password"
//                                                     {...registerPassword('old_password')}
//                                                     className={passwordErrors.old_password ? 'border-red-500' : ''}
//                                                 />
//                                                 {passwordErrors.old_password && (
//                                                     <p className="text-sm text-red-500">
//                                                         {passwordErrors.old_password.message}
//                                                     </p>
//                                                 )}
//                                             </div>

//                                             <div className="space-y-2">
//                                                 <Label htmlFor="new_password">New Password</Label>
//                                                 <Input
//                                                     id="new_password"
//                                                     type="password"
//                                                     {...registerPassword('new_password')}
//                                                     className={passwordErrors.new_password ? 'border-red-500' : ''}
//                                                 />
//                                                 {passwordErrors.new_password && (
//                                                     <p className="text-sm text-red-500">
//                                                         {passwordErrors.new_password.message}
//                                                     </p>
//                                                 )}
//                                             </div>

//                                             <div className="space-y-2">
//                                                 <Label htmlFor="new_password_confirm">Confirm New Password</Label>
//                                                 <Input
//                                                     id="new_password_confirm"
//                                                     type="password"
//                                                     {...registerPassword('new_password_confirm')}
//                                                     className={passwordErrors.new_password_confirm ? 'border-red-500' : ''}
//                                                 />
//                                                 {passwordErrors.new_password_confirm && (
//                                                     <p className="text-sm text-red-500">
//                                                         {passwordErrors.new_password_confirm.message}
//                                                     </p>
//                                                 )}
//                                             </div>

//                                             <Button type="submit" disabled={isUpdating}>
//                                                 {isUpdating ? (
//                                                     <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                                                 ) : (
//                                                     <Save className="h-4 w-4 mr-2" />
//                                                 )}
//                                                 Update Password
//                                             </Button>
//                                         </form>
//                                     </CardContent>
//                                 </Card>

//                                 <Card>
//                                     <CardHeader>
//                                         <CardTitle>Two-Factor Authentication</CardTitle>
//                                         <CardDescription>
//                                             Add an extra layer of security to your account
//                                         </CardDescription>
//                                     </CardHeader>
//                                     <CardContent>
//                                         <Button variant="outline">Enable 2FA (Coming Soon)</Button>
//                                     </CardContent>
//                                 </Card>
//                             </TabsContent>

//                             {/* Preferences Tab */}
//                             <TabsContent value="preferences" className="space-y-6">
//                                 <Card>
//                                     <CardHeader>
//                                         <CardTitle className="flex items-center gap-2">
//                                             <Bell className="h-5 w-5" />
//                                             Notifications
//                                         </CardTitle>
//                                         <CardDescription>
//                                             Manage how you receive notifications
//                                         </CardDescription>
//                                     </CardHeader>
//                                     <CardContent className="space-y-4">
//                                         <div className="flex items-center justify-between">
//                                             <div>
//                                                 <p className="font-medium">Email Notifications</p>
//                                                 <p className="text-sm text-muted-foreground">
//                                                     Receive notifications via email
//                                                 </p>
//                                             </div>
//                                             <Switch
//                                                 checked={preferences.email_notifications}
//                                                 onCheckedChange={(checked) =>
//                                                     setPreferences({ ...preferences, email_notifications: checked })
//                                                 }
//                                             />
//                                         </div>

//                                         <Separator />

//                                         <div className="flex items-center justify-between">
//                                             <div>
//                                                 <p className="font-medium">Transaction Alerts</p>
//                                                 <p className="text-sm text-muted-foreground">
//                                                     Get notified about new transactions
//                                                 </p>
//                                             </div>
//                                             <Switch
//                                                 checked={preferences.transaction_alerts}
//                                                 onCheckedChange={(checked) =>
//                                                     setPreferences({ ...preferences, transaction_alerts: checked })
//                                                 }
//                                             />
//                                         </div>

//                                         <Separator />

//                                         <div className="flex items-center justify-between">
//                                             <div>
//                                                 <p className="font-medium">Budget Alerts</p>
//                                                 <p className="text-sm text-muted-foreground">
//                                                     Alerts when you exceed your budget
//                                                 </p>
//                                             </div>
//                                             <Switch
//                                                 checked={preferences.budget_alerts}
//                                                 onCheckedChange={(checked) =>
//                                                     setPreferences({ ...preferences, budget_alerts: checked })
//                                                 }
//                                             />
//                                         </div>

//                                         <div className="pt-4">
//                                             <Button onClick={handlePreferencesUpdate} disabled={isUpdating}>
//                                                 {isUpdating ? (
//                                                     <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                                                 ) : (
//                                                     <Save className="h-4 w-4 mr-2" />
//                                                 )}
//                                                 Save Notification Settings
//                                             </Button>
//                                         </div>
//                                     </CardContent>
//                                 </Card>

//                                 <Card>
//                                     <CardHeader>
//                                         <CardTitle className="flex items-center gap-2">
//                                             <Globe className="h-5 w-5" />
//                                             Language & Region
//                                         </CardTitle>
//                                     </CardHeader>
//                                     <CardContent className="space-y-4">
//                                         <div className="space-y-2">
//                                             <Label>Language</Label>
//                                             <Select
//                                                 value={preferences.language}
//                                                 onValueChange={(value) =>
//                                                     setPreferences({ ...preferences, language: value })
//                                                 }
//                                             >
//                                                 <SelectTrigger>
//                                                     <SelectValue />
//                                                 </SelectTrigger>
//                                                 <SelectContent>
//                                                     <SelectItem value="en">English</SelectItem>
//                                                     <SelectItem value="es">Spanish</SelectItem>
//                                                     <SelectItem value="fr">French</SelectItem>
//                                                     <SelectItem value="de">German</SelectItem>
//                                                     <SelectItem value="hi">Hindi</SelectItem>
//                                                 </SelectContent>
//                                             </Select>
//                                         </div>

//                                         <div className="space-y-2">
//                                             <Label>Currency</Label>
//                                             <Select
//                                                 value={preferences.currency}
//                                                 onValueChange={(value) =>
//                                                     setPreferences({ ...preferences, currency: value })
//                                                 }
//                                             >
//                                                 <SelectTrigger>
//                                                     <SelectValue />
//                                                 </SelectTrigger>
//                                                 <SelectContent>
//                                                     <SelectItem value="usd">USD ($)</SelectItem>
//                                                     <SelectItem value="eur">EUR (€)</SelectItem>
//                                                     <SelectItem value="gbp">GBP (£)</SelectItem>
//                                                     <SelectItem value="inr">INR (₹)</SelectItem>
//                                                     <SelectItem value="jpy">JPY (¥)</SelectItem>
//                                                     <SelectItem value="cad">CAD (C$)</SelectItem>
//                                                     <SelectItem value="aud">AUD (A$)</SelectItem>
//                                                 </SelectContent>
//                                             </Select>
//                                         </div>

//                                         <Button onClick={handlePreferencesUpdate} disabled={isUpdating}>
//                                             {isUpdating ? (
//                                                 <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                                             ) : (
//                                                 <Save className="h-4 w-4 mr-2" />
//                                             )}
//                                             Save Language & Currency
//                                         </Button>
//                                     </CardContent>
//                                 </Card>

//                                 <Card>
//                                     <CardHeader>
//                                         <CardTitle className="flex items-center gap-2">
//                                             <Palette className="h-5 w-5" />
//                                             Appearance
//                                         </CardTitle>
//                                     </CardHeader>
//                                     <CardContent className="space-y-4">
//                                         <div className="space-y-2">
//                                             <Label>Theme</Label>
//                                             <Select
//                                                 value={preferences.theme}
//                                                 onValueChange={(value: 'light' | 'dark' | 'system') =>
//                                                     setPreferences({ ...preferences, theme: value })
//                                                 }
//                                             >
//                                                 <SelectTrigger>
//                                                     <SelectValue />
//                                                 </SelectTrigger>
//                                                 <SelectContent>
//                                                     <SelectItem value="light">Light</SelectItem>
//                                                     <SelectItem value="dark">Dark</SelectItem>
//                                                     <SelectItem value="system">System</SelectItem>
//                                                 </SelectContent>
//                                             </Select>
//                                         </div>

//                                         <Button onClick={handlePreferencesUpdate} disabled={isUpdating}>
//                                             {isUpdating ? (
//                                                 <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                                             ) : (
//                                                 <Save className="h-4 w-4 mr-2" />
//                                             )}
//                                             Save Theme
//                                         </Button>
//                                     </CardContent>
//                                 </Card>
//                             </TabsContent>

//                             {/* Account Tab */}
//                             <TabsContent value="account" className="space-y-6">
//                                 <Card>
//                                     <CardHeader>
//                                         <CardTitle className="flex items-center gap-2">
//                                             <Download className="h-5 w-5" />
//                                             Export Data
//                                         </CardTitle>
//                                         <CardDescription>
//                                             Download a copy of your financial data in JSON format
//                                         </CardDescription>
//                                     </CardHeader>
//                                     <CardContent>
//                                         <Button variant="outline" onClick={handleExportData}>
//                                             <Download className="h-4 w-4 mr-2" />
//                                             Export All Data
//                                         </Button>
//                                     </CardContent>
//                                 </Card>

//                                 <Card className="border-red-200 dark:border-red-900">
//                                     <CardHeader>
//                                         <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
//                                             <Trash2 className="h-5 w-5" />
//                                             Danger Zone
//                                         </CardTitle>
//                                         <CardDescription>
//                                             Permanently delete your account and all data. This action cannot be undone.
//                                         </CardDescription>
//                                     </CardHeader>
//                                     <CardContent>
//                                         <Button
//                                             variant="destructive"
//                                             onClick={handleDeleteAccount}
//                                         >
//                                             <Trash2 className="h-4 w-4 mr-2" />
//                                             Delete Account
//                                         </Button>
//                                     </CardContent>
//                                 </Card>
//                             </TabsContent>
//                         </Tabs>
//                     </div>
//                 </main>
//             </SidebarInset>
//         </SidebarProvider>
//     );
// }


// pages/Settings.tsx - Updated with Theme Integration
import { useState, useEffect } from 'react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    User, Lock, Bell, Globe, Palette, Download, Trash2, Save,
    CheckCircle2, AlertCircle, Loader2,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useTheme } from "@/providers/ThemeProvider";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { userAPI } from "@/lib/api";

// Schemas remain the same
const profileSchema = z.object({
    first_name: z.string().min(2, 'First name must be at least 2 characters'),
    last_name: z.string().min(2, 'Last name must be at least 2 characters'),
    username: z.string().min(3, 'Username must be at least 3 characters'),
    phone: z.string().optional(),
});

const passwordSchema = z.object({
    old_password: z.string().min(1, 'Current password is required'),
    new_password: z.string().min(8, 'Password must be at least 8 characters'),
    new_password_confirm: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.new_password === data.new_password_confirm, {
    message: "Passwords don't match",
    path: ['new_password_confirm'],
});

const preferencesSchema = z.object({
    currency: z.string(),
    language: z.string(),
    theme: z.enum(['light', 'dark', 'system']),
    email_notifications: z.boolean(),
    transaction_alerts: z.boolean(),
    budget_alerts: z.boolean(),
});

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;
type PreferencesFormData = z.infer<typeof preferencesSchema>;

export default function Settings() {
    const navigate = useNavigate();
    const { user, setUser, logout } = useAuthStore();
    const { theme, setTheme } = useTheme();
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

    // Profile Form
    const {
        register: registerProfile,
        handleSubmit: handleSubmitProfile,
        formState: { errors: profileErrors },
        reset: resetProfile,
    } = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            first_name: user?.first_name || '',
            last_name: user?.last_name || '',
            username: user?.username || '',
            phone: user?.phone || '',
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

    // Preferences state
    const [preferences, setPreferences] = useState<PreferencesFormData>({
        currency: user?.currency || 'usd',
        language: user?.language || 'en',
        theme: (user?.theme as 'light' | 'dark' | 'system') || 'light',
        email_notifications: user?.email_notifications ?? true,
        transaction_alerts: user?.transaction_alerts ?? true,
        budget_alerts: user?.budget_alerts ?? true,
    });

    // Update form when user data changes
    useEffect(() => {
        if (user) {
            resetProfile({
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                username: user.username || '',
                phone: user.phone || '',
            });
            setPreferences({
                currency: user.currency || 'usd',
                language: user.language || 'en',
                theme: (user.theme as 'light' | 'dark' | 'system') || 'light',
                email_notifications: user.email_notifications ?? true,
                transaction_alerts: user.transaction_alerts ?? true,
                budget_alerts: user.budget_alerts ?? true,
            });
        }
    }, [user, resetProfile]);

    const showSuccess = () => {
        setSaveSuccess(true);
        setErrorMessage('');
        setTimeout(() => setSaveSuccess(false), 3000);
    };

    const showError = (message: string) => {
        setErrorMessage(message);
        setSaveSuccess(false);
        setTimeout(() => setErrorMessage(''), 5000);
    };

    // Handle Profile Update
    const onProfileSubmit = async (data: ProfileFormData) => {
        setIsUpdating(true);
        try {
            const response = await userAPI.updateProfile(data);
            setUser(response.data);
            showSuccess();
        } catch (error: any) {
            const errorMsg = error.response?.data?.message ||
                error.response?.data?.detail ||
                'Failed to update profile';
            showError(errorMsg);
        } finally {
            setIsUpdating(false);
        }
    };

    // Handle Password Change
    const onPasswordSubmit = async (data: PasswordFormData) => {
        setIsUpdating(true);
        try {
            await userAPI.changePassword(data);
            resetPassword();
            showSuccess();
        } catch (error: any) {
            const errorMsg = error.response?.data?.old_password?.[0] ||
                error.response?.data?.new_password?.[0] ||
                error.response?.data?.message ||
                'Failed to change password';
            showError(errorMsg);
        } finally {
            setIsUpdating(false);
        }
    };

    // Handle Preferences Update
    const handlePreferencesUpdate = async () => {
        setIsUpdating(true);
        try {
            const response = await userAPI.updateProfile(preferences);
            setUser(response.data);

            // Update theme immediately
            setTheme(preferences.theme);

            showSuccess();
        } catch (error: any) {
            showError('Failed to update preferences');
        } finally {
            setIsUpdating(false);
        }
    };

    // Handle Theme Change (immediate update)
    const handleThemeChange = async (newTheme: 'light' | 'dark' | 'system') => {
        setPreferences({ ...preferences, theme: newTheme });
        setTheme(newTheme);

        // Update in backend
        try {
            const response = await userAPI.updateProfile({ theme: newTheme });
            setUser(response.data);
        } catch (error) {
            console.error('Failed to save theme preference:', error);
        }
    };

    // Handle Avatar Upload
    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                showError('File size must be less than 2MB');
                return;
            }
            setAvatarFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAvatarUpload = async () => {
        if (!avatarFile) return;

        setIsUpdating(true);
        try {
            const formData = new FormData();
            formData.append('avatar', avatarFile);
            const response = await userAPI.updateProfile(formData);
            setUser(response.data);
            setAvatarFile(null);
            setAvatarPreview(null);
            showSuccess();
        } catch (error: any) {
            showError('Failed to upload avatar');
        } finally {
            setIsUpdating(false);
        }
    };

    // Handle Data Export
    const handleExportData = async () => {
        try {
            const response = await userAPI.exportData();
            const blob = new Blob([JSON.stringify(response.data, null, 2)], {
                type: 'application/json',
            });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `finance-data-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            showSuccess();
        } catch (error) {
            showError('Failed to export data');
        }
    };

    // Handle Account Deletion
    const handleDeleteAccount = async () => {
        const confirmed = window.confirm(
            'Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted.'
        );

        if (confirmed) {
            const doubleConfirm = window.confirm(
                'This is your last chance. Are you absolutely sure you want to delete your account?'
            );

            if (doubleConfirm) {
                try {
                    await userAPI.deleteAccount();
                    logout();
                    navigate('/login');
                } catch (error) {
                    showError('Failed to delete account');
                }
            }
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

                        {/* Success Alert */}
                        {saveSuccess && (
                            <Alert className="bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-900">
                                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                <AlertDescription className="text-emerald-900 dark:text-emerald-400">
                                    Settings saved successfully!
                                </AlertDescription>
                            </Alert>
                        )}

                        {/* Error Alert */}
                        {errorMessage && (
                            <Alert className="bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-900">
                                <AlertCircle className="h-4 w-4 text-red-600" />
                                <AlertDescription className="text-red-900 dark:text-red-400">
                                    {errorMessage}
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

                            {/* Profile Tab - Same as before */}
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
                                                <AvatarImage src={avatarPreview || user?.avatar} />
                                                <AvatarFallback className="text-lg">
                                                    {user?.first_name?.[0]}{user?.last_name?.[0]}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="space-y-2">
                                                <div className="flex gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => document.getElementById('avatar-upload')?.click()}
                                                    >
                                                        Change Avatar
                                                    </Button>
                                                    {avatarFile && (
                                                        <Button
                                                            size="sm"
                                                            onClick={handleAvatarUpload}
                                                            disabled={isUpdating}
                                                        >
                                                            {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Upload'}
                                                        </Button>
                                                    )}
                                                </div>
                                                <input
                                                    id="avatar-upload"
                                                    type="file"
                                                    accept="image/jpeg,image/png,image/gif"
                                                    onChange={handleAvatarChange}
                                                    className="hidden"
                                                />
                                                <p className="text-xs text-muted-foreground">
                                                    JPG, PNG or GIF. Max size 2MB.
                                                </p>
                                            </div>
                                        </div>

                                        <form onSubmit={handleSubmitProfile(onProfileSubmit)} className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="first_name">First Name</Label>
                                                    <Input
                                                        id="first_name"
                                                        {...registerProfile('first_name')}
                                                        className={profileErrors.first_name ? 'border-red-500' : ''}
                                                    />
                                                    {profileErrors.first_name && (
                                                        <p className="text-sm text-red-500">{profileErrors.first_name.message}</p>
                                                    )}
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="last_name">Last Name</Label>
                                                    <Input
                                                        id="last_name"
                                                        {...registerProfile('last_name')}
                                                        className={profileErrors.last_name ? 'border-red-500' : ''}
                                                    />
                                                    {profileErrors.last_name && (
                                                        <p className="text-sm text-red-500">{profileErrors.last_name.message}</p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="username">Username</Label>
                                                <Input
                                                    id="username"
                                                    {...registerProfile('username')}
                                                    className={profileErrors.username ? 'border-red-500' : ''}
                                                />
                                                {profileErrors.username && (
                                                    <p className="text-sm text-red-500">{profileErrors.username.message}</p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="email">Email (Read-only)</Label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    value={user?.email || ''}
                                                    disabled
                                                    className="bg-muted"
                                                />
                                                <p className="text-xs text-muted-foreground">
                                                    Email cannot be changed
                                                </p>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="phone">Phone Number (Optional)</Label>
                                                <Input
                                                    id="phone"
                                                    type="tel"
                                                    placeholder="+1 (555) 000-0000"
                                                    {...registerProfile('phone')}
                                                />
                                            </div>

                                            <Button type="submit" disabled={isUpdating}>
                                                {isUpdating ? (
                                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                ) : (
                                                    <Save className="h-4 w-4 mr-2" />
                                                )}
                                                Save Changes
                                            </Button>
                                        </form>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Security Tab - Same as before */}
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
                                                <Label htmlFor="old_password">Current Password</Label>
                                                <Input
                                                    id="old_password"
                                                    type="password"
                                                    {...registerPassword('old_password')}
                                                    className={passwordErrors.old_password ? 'border-red-500' : ''}
                                                />
                                                {passwordErrors.old_password && (
                                                    <p className="text-sm text-red-500">
                                                        {passwordErrors.old_password.message}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="new_password">New Password</Label>
                                                <Input
                                                    id="new_password"
                                                    type="password"
                                                    {...registerPassword('new_password')}
                                                    className={passwordErrors.new_password ? 'border-red-500' : ''}
                                                />
                                                {passwordErrors.new_password && (
                                                    <p className="text-sm text-red-500">
                                                        {passwordErrors.new_password.message}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="new_password_confirm">Confirm New Password</Label>
                                                <Input
                                                    id="new_password_confirm"
                                                    type="password"
                                                    {...registerPassword('new_password_confirm')}
                                                    className={passwordErrors.new_password_confirm ? 'border-red-500' : ''}
                                                />
                                                {passwordErrors.new_password_confirm && (
                                                    <p className="text-sm text-red-500">
                                                        {passwordErrors.new_password_confirm.message}
                                                    </p>
                                                )}
                                            </div>

                                            <Button type="submit" disabled={isUpdating}>
                                                {isUpdating ? (
                                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                ) : (
                                                    <Save className="h-4 w-4 mr-2" />
                                                )}
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
                                        <Button variant="outline">Enable 2FA (Coming Soon)</Button>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Preferences Tab - Updated with Theme Integration */}
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
                                                checked={preferences.email_notifications}
                                                onCheckedChange={(checked) =>
                                                    setPreferences({ ...preferences, email_notifications: checked })
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
                                                checked={preferences.transaction_alerts}
                                                onCheckedChange={(checked) =>
                                                    setPreferences({ ...preferences, transaction_alerts: checked })
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
                                                checked={preferences.budget_alerts}
                                                onCheckedChange={(checked) =>
                                                    setPreferences({ ...preferences, budget_alerts: checked })
                                                }
                                            />
                                        </div>

                                        <div className="pt-4">
                                            <Button onClick={handlePreferencesUpdate} disabled={isUpdating}>
                                                {isUpdating ? (
                                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                ) : (
                                                    <Save className="h-4 w-4 mr-2" />
                                                )}
                                                Save Notification Settings
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Globe className="h-5 w-5" />
                                            Language & Region
                                        </CardTitle>
                                        <CardDescription>
                                            Currency changes will be reflected across all pages
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <Label>Language</Label>
                                            <Select
                                                value={preferences.language}
                                                onValueChange={(value) =>
                                                    setPreferences({ ...preferences, language: value })
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="en">English</SelectItem>
                                                    <SelectItem value="es">Spanish</SelectItem>
                                                    <SelectItem value="fr">French</SelectItem>
                                                    <SelectItem value="de">German</SelectItem>
                                                    <SelectItem value="hi">Hindi</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Currency</Label>
                                            <Select
                                                value={preferences.currency}
                                                onValueChange={(value) =>
                                                    setPreferences({ ...preferences, currency: value })
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="usd">USD ($)</SelectItem>
                                                    <SelectItem value="eur">EUR (€)</SelectItem>
                                                    <SelectItem value="gbp">GBP (£)</SelectItem>
                                                    <SelectItem value="inr">INR (₹)</SelectItem>
                                                    <SelectItem value="jpy">JPY (¥)</SelectItem>
                                                    <SelectItem value="cad">CAD (C$)</SelectItem>
                                                    <SelectItem value="aud">AUD (A$)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <Button onClick={handlePreferencesUpdate} disabled={isUpdating}>
                                            {isUpdating ? (
                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            ) : (
                                                <Save className="h-4 w-4 mr-2" />
                                            )}
                                            Save Language & Currency
                                        </Button>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Palette className="h-5 w-5" />
                                            Appearance
                                        </CardTitle>
                                        <CardDescription>
                                            Theme changes apply immediately across all pages
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <Label>Theme</Label>
                                            <Select
                                                value={preferences.theme}
                                                onValueChange={(value: 'light' | 'dark' | 'system') =>
                                                    handleThemeChange(value)
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="light">Light</SelectItem>
                                                    <SelectItem value="dark">Dark</SelectItem>
                                                    <SelectItem value="system">System</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <p className="text-xs text-muted-foreground">
                                                Current theme: <span className="font-medium">{theme}</span>
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Account Tab - Same as before */}
                            <TabsContent value="account" className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Download className="h-5 w-5" />
                                            Export Data
                                        </CardTitle>
                                        <CardDescription>
                                            Download a copy of your financial data in JSON format
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
                                        <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
                                            <Trash2 className="h-5 w-5" />
                                            Danger Zone
                                        </CardTitle>
                                        <CardDescription>
                                            Permanently delete your account and all data. This action cannot be undone.
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