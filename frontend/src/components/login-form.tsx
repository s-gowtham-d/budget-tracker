// import React, { useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import * as z from 'zod';
// import { cn } from '@/lib/utils';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Alert, AlertDescription } from '@/components/ui/alert';
// import { AlertCircle, Loader2 } from 'lucide-react';
// import { useAuthStore } from '@/store/authStore';
// import { useNavigate } from 'react-router-dom';

// // Login Schema
// const loginSchema = z.object({
//   email: z.string().email('Please enter a valid email address'),
//   password: z.string().min(1, 'Password is required'),
// });

// // Login Form Component
// export function LoginForm({ className = "", onSuccess, ...props }) {
//   const { login, isLoading } = useAuthStore();
//   const [apiError, setApiError] = useState('');
//   const navigate = useNavigate();

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm({
//     resolver: zodResolver(loginSchema),
//   });

//   const onSubmit = async (data: { email: string, password: string }) => {
//     setApiError('');

//     try {
//       // Simulate API call - Replace with your Django backend call
//       // await new Promise((resolve) => setTimeout(resolve, 2000));

//       console.log('Login data:', data);

//       // Example API call (uncomment when ready):
//       // const response = await axios.post('/api/auth/login/', data);
//       // if (response.data.token) {
//       //   localStorage.setItem('token', response.data.token);
//       //   onSuccess?.();
//       // }

//       await login(data.email, data.password);

//       navigate('/dashboard');


//       // Demo credentials check
//       if (data.email === 'demo@budgettracker.com' && data.password === 'demo123') {
//         alert('Login successful! (Demo)');
//         onSuccess?.();
//       } else {
//         setApiError('Invalid credentials. Try demo@budgettracker.com / demo123');
//       }
//     } catch (error: any) {
//       setApiError(error.response?.data?.message || 'Login failed. Please try again.');
//     } finally {
//       // setIsLoading(false);
//     }
//   };

//   return (
//     <div className={cn('flex flex-col gap-6', className)} {...props}>
//       <div className="flex flex-col gap-6">
//         <div className="flex flex-col items-center gap-1 text-center">
//           <h1 className="text-2xl font-bold">Login to your account</h1>
//           <p className="text-muted-foreground text-sm text-balance">
//             Enter your email below to login to your account
//           </p>
//         </div>

//         {apiError && (
//           <Alert variant="destructive">
//             <AlertCircle className="h-4 w-4" />
//             <AlertDescription>{apiError}</AlertDescription>
//           </Alert>
//         )}

//         <div className="flex flex-col gap-4">
//           {/* Email Field */}
//           <div className="space-y-2">
//             <Label htmlFor="email">Email</Label>
//             <Input
//               id="email"
//               type="email"
//               placeholder="m@example.com"
//               className={cn(errors.email && 'border-red-500 focus-visible:ring-red-500')}
//               {...register('email')}
//               disabled={isLoading}
//             />
//             {errors.email && (
//               <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
//             )}
//           </div>

//           {/* Password Field */}
//           <div className="space-y-2">
//             <div className="flex items-center justify-between">
//               <Label htmlFor="password">Password</Label>
//               <a
//                 href="#"
//                 className="text-sm underline-offset-4 hover:underline text-muted-foreground"
//                 onClick={(e) => e.preventDefault()}
//               >
//                 Forgot password?
//               </a>
//             </div>
//             <Input
//               id="password"
//               type="password"
//               className={cn(errors.password && 'border-red-500 focus-visible:ring-red-500')}
//               {...register('password')}
//               disabled={isLoading}
//             />
//             {errors.password && (
//               <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
//             )}
//           </div>

//           {/* Submit Button */}
//           <Button onClick={handleSubmit(onSubmit)} disabled={isLoading} className="w-full">
//             {isLoading ? (
//               <>
//                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                 Logging in...
//               </>
//             ) : (
//               'Login'
//             )}
//           </Button>
//         </div>

//         {/* Separator */}
//         {/* <div className="relative">
//           <div className="absolute inset-0 flex items-center">
//             <span className="w-full border-t" />
//           </div>
//           <div className="relative flex justify-center text-xs uppercase">
//             <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
//           </div>
//         </div> */}

//         {/* OAuth Buttons - Commented out */}
//         {/* <Button variant="outline" type="button" disabled>
//           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="mr-2 h-4 w-4">
//             <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" fill="currentColor" />
//           </svg>
//           Login with GitHub
//         </Button> */}

//         {/* Demo Credentials Box */}
//         <div className="p-4 bg-muted rounded-lg border">
//           <p className="text-xs font-medium mb-2">Demo Credentials</p>
//           <div className="space-y-1 text-xs text-muted-foreground">
//             <p><span className="font-medium">Email:</span> demo@budgettracker.com</p>
//             <p><span className="font-medium">Password:</span> demo123</p>
//           </div>
//         </div>

//         <p className="text-center text-sm text-muted-foreground">
//           Don&apos;t have an account?{' '}
//           <a href="#" className="underline underline-offset-4 hover:text-foreground">
//             Sign up
//           </a>
//         </p>
//       </div>
//     </div>
//   );
// }


import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useNavigate } from 'react-router-dom';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  className?: string;
  onSuccess?: () => void;
}

export function LoginForm({ className = "", onSuccess }: LoginFormProps) {
  const { login, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // Clear error when component unmounts
  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password);

      // Success - navigate to dashboard
      // if (onSuccess) {
      //   onSuccess();
      // } else {
        navigate('/dashboard');
      // }
    } catch (err) {
      // Error is already set in the store
      console.error('Login error:', err);
    }
  };

  return (
    <div className={cn('flex flex-col gap-6', className)}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your email below to login to your account
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              className={cn(errors.email && 'border-red-500 focus-visible:ring-red-500')}
              {...register('email')}
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <a
                href="#"
                className="text-sm underline-offset-4 hover:underline text-muted-foreground"
                onClick={(e) => e.preventDefault()}
              >
                Forgot password?
              </a>
            </div>
            <Input
              id="password"
              type="password"
              className={cn(errors.password && 'border-red-500 focus-visible:ring-red-500')}
              {...register('password')}
              disabled={isLoading}
            />
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </Button>
        </form>

        {/* Demo Credentials Box */}
        <div className="p-4 bg-muted rounded-lg border">
          <p className="text-xs font-medium mb-2">Demo Credentials</p>
          <div className="space-y-1 text-xs text-muted-foreground">
            <p><span className="font-medium">Email:</span> demo@budgettracker.com</p>
            <p><span className="font-medium">Password:</span> demo123</p>
          </div>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <a href="#" className="underline underline-offset-4 hover:text-foreground">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
