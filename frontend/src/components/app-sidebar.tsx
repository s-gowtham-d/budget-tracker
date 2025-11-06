// "use client"

// import * as React from "react"
// import {
//   LayoutDashboard,
//   ArrowLeftRight,
//   PiggyBank,
//   Settings,
//   Wallet,
// } from "lucide-react"

// import { NavMain } from "@/components/nav-main"
// import { NavUser } from "@/components/nav-user"
// import {
//   Sidebar,
//   SidebarContent,
//   SidebarFooter,
//   SidebarHeader,
//   SidebarRail,
//   SidebarMenu,
//   SidebarMenuItem,
//   SidebarMenuButton,
// } from "@/components/ui/sidebar"

// const data = {
//   user: {
//     name: "John Doe",
//     email: "demo@budgettracker.com",
//     avatar: "/avatars/user.jpg",
//   },
//   navMain: [
//     {
//       title: "Dashboard",
//       url: "/dashboard",
//       icon: LayoutDashboard,
//       isActive: true,
//     },
//     {
//       title: "Transactions",
//       url: "/transactions",
//       icon: ArrowLeftRight,
//       isActive: false,
//     },
//     {
//       title: "Budget",
//       url: "/budget",
//       icon: PiggyBank,
//       isActive: false,
//     },
//     {
//       title: "Settings",
//       url: "/settings",
//       icon: Settings,
//       isActive: false,
//     },
//   ],
// }

// export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
//   return (
//     <Sidebar collapsible="icon" {...props}>
//       <SidebarHeader>
//         {/* App Logo/Branding */}
//         <SidebarMenu>
//           <SidebarMenuItem>
//             <SidebarMenuButton size="lg" asChild>
//               <a href="/">
//                 <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
//                   <Wallet className="size-4" />
//                 </div>
//                 <div className="grid flex-1 text-left text-sm leading-tight">
//                   <span className="truncate font-semibold">Budget Tracker</span>
//                   <span className="truncate text-xs text-muted-foreground">
//                     Personal Finance
//                   </span>
//                 </div>
//               </a>
//             </SidebarMenuButton>
//           </SidebarMenuItem>
//         </SidebarMenu>
//       </SidebarHeader>

//       <SidebarContent>
//         {/* Main Navigation */}
//         <NavMain items={data.navMain} />

//         {/* Quick Stats Card */}
//         {/* <div className="px-3 py-2">
//           <div className="rounded-lg border bg-card p-3 text-card-foreground shadow-sm">
//             <div className="flex items-center justify-between mb-2">
//               <span className="text-xs font-medium text-muted-foreground">
//                 Total Balance
//               </span>
//               <Wallet className="size-3 text-muted-foreground" />
//             </div>
//             <div className="text-2xl font-bold">$12,450.00</div>
//             <p className="text-xs text-muted-foreground mt-1">
//               <span className="text-emerald-500">+12.5%</span> from last month
//             </p>
//           </div>
//         </div> */}
//       </SidebarContent>

//       <SidebarFooter>
//         <NavUser user={data.user} />
//       </SidebarFooter>
//       <SidebarRail />
//     </Sidebar>
//   )
// }


// import * as React from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import {
//   LayoutDashboard,
//   ArrowLeftRight,
//   PiggyBank,
//   Settings,
//   Wallet,
//   LogOut,
//   User,
//   Bell,
//   CreditCard,
//   Sun,
//   Moon,
//   ChevronRight,
// } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { useAuthStore } from "@/store/authStore";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuGroup,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import {
//   Sidebar,
//   SidebarContent,
//   SidebarFooter,
//   SidebarHeader,
//   SidebarMenu,
//   SidebarMenuItem,
//   SidebarMenuButton,
//   SidebarRail,
//   SidebarGroup,
//   SidebarGroupLabel,
//   useSidebar,
// } from "@/components/ui/sidebar";
// import { Button } from "@/components/ui/button";

// interface NavItem {
//   title: string;
//   url: string;
//   icon: React.ComponentType<{ className?: string }>;
// }

// const navItems: NavItem[] = [
//   {
//     title: "Dashboard",
//     url: "/dashboard",
//     icon: LayoutDashboard,
//   },
//   {
//     title: "Transactions",
//     url: "/transactions",
//     icon: ArrowLeftRight,
//   },
//   {
//     title: "Budget",
//     url: "/budget",
//     icon: PiggyBank,
//   },
//   {
//     title: "Settings",
//     url: "/settings",
//     icon: Settings,
//   },
// ];

// export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { user, logout } = useAuthStore();
//   const { open } = useSidebar();
//   const [theme, setTheme] = React.useState<'light' | 'dark'>('light');

//   const isActive = (path: string) => location.pathname === path;

//   const handleLogout = () => {
//     logout();
//     navigate('/login');
//   };

//   const toggleTheme = () => {
//     const newTheme = theme === 'light' ? 'dark' : 'light';
//     setTheme(newTheme);
//     document.documentElement.classList.toggle('dark');
//   };

//   return (
//     <Sidebar collapsible="icon" {...props}>
//       {/* Header */}
//       <SidebarHeader>
//         <SidebarMenu>
//           <SidebarMenuItem>
//             <SidebarMenuButton size="lg" asChild className="hover:bg-accent">
//               <button onClick={() => navigate('/dashboard')}>
//                 <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600">
//                   <Wallet className="size-4 text-white" />
//                 </div>
//                 <div className="grid flex-1 text-left text-sm leading-tight">
//                   <span className="truncate font-semibold">Budget Tracker</span>
//                   <span className="truncate text-xs text-muted-foreground">
//                     Personal Finance
//                   </span>
//                 </div>
//               </button>
//             </SidebarMenuButton>
//           </SidebarMenuItem>
//         </SidebarMenu>
//       </SidebarHeader>

//       {/* Navigation */}
//       <SidebarContent>
//         <SidebarGroup>
//           <SidebarGroupLabel>Navigation</SidebarGroupLabel>
//           <SidebarMenu>
//             {navItems.map((item) => (
//               <SidebarMenuItem key={item.title}>
//                 <SidebarMenuButton
//                   asChild
//                   isActive={isActive(item.url)}
//                   tooltip={item.title}
//                   className={cn(
//                     "transition-all duration-200",
//                     isActive(item.url) &&
//                     "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
//                   )}
//                 >
//                   <button onClick={() => navigate(item.url)}>
//                     <item.icon className="size-4" />
//                     <span>{item.title}</span>
//                     {isActive(item.url) && open && (
//                       <ChevronRight className="ml-auto size-4" />
//                     )}
//                   </button>
//                 </SidebarMenuButton>
//               </SidebarMenuItem>
//             ))}
//           </SidebarMenu>
//         </SidebarGroup>

//         {/* Quick Stats */}
//         {open && (
//           <SidebarGroup className="mt-auto">
//             <SidebarGroupLabel>Quick Stats</SidebarGroupLabel>
//             <div className="px-3 py-2">
//               <div className="rounded-lg border bg-card p-3 shadow-sm">
//                 <div className="flex items-center justify-between mb-2">
//                   <span className="text-xs font-medium text-muted-foreground">
//                     Total Balance
//                   </span>
//                   <Wallet className="size-3 text-muted-foreground" />
//                 </div>
//                 <div className="text-2xl font-bold">$12,450.00</div>
//                 <p className="text-xs text-muted-foreground mt-1">
//                   <span className="text-emerald-500">+12.5%</span> from last month
//                 </p>
//               </div>
//             </div>
//           </SidebarGroup>
//         )}
//       </SidebarContent>

//       {/* Footer - User Menu */}
//       <SidebarFooter>
//         <SidebarMenu>
//           <SidebarMenuItem>
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <SidebarMenuButton
//                   size="lg"
//                   className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
//                 >
//                   <Avatar className="h-8 w-8 rounded-lg">
//                     <AvatarImage src={user?.avatar} alt={user?.name} />
//                     <AvatarFallback className="rounded-lg">
//                       {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
//                     </AvatarFallback>
//                   </Avatar>
//                   <div className="grid flex-1 text-left text-sm leading-tight">
//                     <span className="truncate font-semibold">
//                       {user?.name || 'User'}
//                     </span>
//                     <span className="truncate text-xs text-muted-foreground">
//                       {user?.email || 'user@example.com'}
//                     </span>
//                   </div>
//                   <ChevronRight className="ml-auto size-4 rotate-90" />
//                 </SidebarMenuButton>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent
//                 className="w-56"
//                 align="end"
//                 side="top"
//                 sideOffset={4}
//               >
//                 <DropdownMenuLabel className="p-0 font-normal">
//                   <div className="flex items-center gap-2 px-1 py-1.5">
//                     <Avatar className="h-8 w-8 rounded-lg">
//                       <AvatarImage src={user?.avatar} alt={user?.name} />
//                       <AvatarFallback className="rounded-lg">
//                         {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
//                       </AvatarFallback>
//                     </Avatar>
//                     <div className="grid flex-1 text-left text-sm leading-tight">
//                       <span className="truncate font-semibold">
//                         {user?.name || 'User'}
//                       </span>
//                       <span className="truncate text-xs text-muted-foreground">
//                         {user?.email || 'user@example.com'}
//                       </span>
//                     </div>
//                   </div>
//                 </DropdownMenuLabel>
//                 <DropdownMenuSeparator />
//                 <DropdownMenuGroup>
//                   <DropdownMenuItem onClick={() => navigate('/settings')}>
//                     <User className="mr-2 h-4 w-4" />
//                     Profile
//                   </DropdownMenuItem>
//                   <DropdownMenuItem>
//                     <CreditCard className="mr-2 h-4 w-4" />
//                     Billing
//                   </DropdownMenuItem>
//                   <DropdownMenuItem>
//                     <Bell className="mr-2 h-4 w-4" />
//                     Notifications
//                   </DropdownMenuItem>
//                   <DropdownMenuItem onClick={toggleTheme}>
//                     {theme === 'light' ? (
//                       <Moon className="mr-2 h-4 w-4" />
//                     ) : (
//                       <Sun className="mr-2 h-4 w-4" />
//                     )}
//                     Toggle Theme
//                   </DropdownMenuItem>
//                 </DropdownMenuGroup>
//                 <DropdownMenuSeparator />
//                 <DropdownMenuItem onClick={handleLogout} className="text-red-600">
//                   <LogOut className="mr-2 h-4 w-4" />
//                   Log out
//                 </DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu>
//           </SidebarMenuItem>
//         </SidebarMenu>
//       </SidebarFooter>
//       <SidebarRail />
//     </Sidebar>
//   );
// }

// components/app-sidebar.tsx
import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ArrowLeftRight,
  PiggyBank,
  Settings,
  Wallet,
  LogOut,
  User,
  Bell,
  CreditCard,
  Sun,
  Moon,
  Monitor,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import { useTheme } from "@/providers/ThemeProvider";
import { useCurrency } from "@/lib/currency";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
  SidebarGroup,
  SidebarGroupLabel,
  useSidebar,
} from "@/components/ui/sidebar";
import { useDashboardStore } from "@/store/dashboardStore";
import { userAPI } from "@/lib/api";

interface NavItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Transactions",
    url: "/transactions",
    icon: ArrowLeftRight,
  },
  {
    title: "Budget",
    url: "/budget",
    icon: PiggyBank,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { theme, setTheme } = useTheme();
  const { open } = useSidebar();
  const { format } = useCurrency();
  const { summary } = useDashboardStore();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="mr-2 h-4 w-4" />;
      case 'dark':
        return <Moon className="mr-2 h-4 w-4" />;
      default:
        return <Monitor className="mr-2 h-4 w-4" />;
    }
  };

  const { setUser } = useAuthStore();

  const handleThemeChange = async (newTheme: "light" | "dark" | "system") => {
    try {
      setTheme(newTheme);

      setUser({
        ...user!,
        theme: newTheme,
      });

      await userAPI.updateProfile({ theme: newTheme });
    } catch (error) {
      console.error("Failed to update theme preference:", error);
    }
  };

  // Mock balance - replace with actual data from API
  const totalBalance = summary?.summary.balance || 0;

  return (
    <Sidebar collapsible="icon" {...props}>
      {/* Header */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="hover:bg-accent">
              <button onClick={() => navigate('/dashboard')}>
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600">
                  <Wallet className="size-4 text-white" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Budget Tracker</span>
                  <span className="truncate text-xs text-muted-foreground">
                    Personal Finance
                  </span>
                </div>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive(item.url)}
                  tooltip={item.title}
                  className={cn(
                    "transition-all duration-200",
                    isActive(item.url) &&
                    "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                  )}
                >
                  <button onClick={() => navigate(item.url)}>
                    <item.icon className="size-4" />
                    <span>{item.title}</span>
                    {isActive(item.url) && open && (
                      <ChevronRight className="ml-auto size-4" />
                    )}
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        {/* Quick Stats */}
        {open && (
          <SidebarGroup className="mt-auto">
            <SidebarGroupLabel>Quick Stats</SidebarGroupLabel>
            <div className="px-3 py-2">
              <div className="rounded-lg border bg-card p-3 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-muted-foreground">
                    Total Balance
                  </span>
                  <Wallet className="size-3 text-muted-foreground" />
                </div>
                <div className="text-2xl font-bold">{format(totalBalance)}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span
                    className={
                      summary?.summary?.balance_change > 0
                        ? "text-emerald-500"
                        : summary?.summary?.balance_change < 0
                          ? "text-red-500"
                          : "text-gray-400"
                    }
                  >
                    {`${summary?.summary?.balance_change > 0 ? "+" : ""}${summary?.summary?.balance_change || 0}%`}
                  </span>{" "}
                  from last month
                </p>

              </div>
            </div>
          </SidebarGroup>
        )}
      </SidebarContent>

      {/* Footer - User Menu */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={user?.avatar} alt={user?.first_name} />
                    <AvatarFallback className="rounded-lg">
                      {user?.first_name?.[0]}{user?.last_name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {user?.first_name} {user?.last_name}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      {user?.email}
                    </span>
                  </div>
                  <ChevronRight className="ml-auto size-4 rotate-90" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56"
                align="end"
                side="top"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage src={user?.avatar} alt={user?.first_name} />
                      <AvatarFallback className="rounded-lg">
                        {user?.first_name?.[0]}{user?.last_name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {user?.first_name} {user?.last_name}
                      </span>
                      <span className="truncate text-xs text-muted-foreground">
                        {user?.email}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => navigate('/settings')}>
                    <User className="mr-2 h-4 w-4" />
                    Profile Settings
                  </DropdownMenuItem>
                  {/* <DropdownMenuItem>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Billing
                  </DropdownMenuItem> */}
                  <DropdownMenuItem>
                    <Bell className="mr-2 h-4 w-4" />
                    Notifications
                  </DropdownMenuItem>

                  {/* Theme Submenu */}
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      {getThemeIcon()}
                      Theme
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem onClick={() => handleThemeChange('light')}>
                        <Sun className="mr-2 h-4 w-4" />
                        Light
                        {theme === 'light' && <span className="ml-auto">✓</span>}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleThemeChange('dark')}>
                        <Moon className="mr-2 h-4 w-4" />
                        Dark
                        {theme === 'dark' && <span className="ml-auto">✓</span>}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleThemeChange('system')}>
                        <Monitor className="mr-2 h-4 w-4" />
                        System
                        {theme === 'system' && <span className="ml-auto">✓</span>}
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}