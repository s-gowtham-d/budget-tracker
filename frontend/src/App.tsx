// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import AuthPage from './pages/Auth';
import "./App.css";
// import LoginPage from './pages/Login';
// import SignupPage from './pages/Signup';
// import Dashboard from './pages/Dashboard';
// import BudgetPage from './pages/Budget';
// import TransactionsPage from './pages/Transaction';
// import Settings from './pages/Settings';
// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/auth" element={<AuthPage />} />
//         <Route path="/" element={<Navigate to="/auth" replace />} />
//         <Route path="/login" element={<LoginPage />} />
//         <Route path="/signup" element={<SignupPage />} />
//         <Route path='/dashboard' element={<Dashboard />} />
//         <Route path='/budget' element={<BudgetPage />} />
//         <Route path='/transactions' element={<TransactionsPage />} />
//         <Route path='/settings' element={<Settings/>} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import AuthPage from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transaction';
import Budget from './pages/Budget';
import Settings from './pages/Settings';
import { useAuthStore } from './store/authStore';
import LoginPage from "./pages/Login";
import SignupPage from "./pages/Signup";
import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "./providers/ThemeProvider";

// Protected Route Component
interface ProtectedRouteProps {
  children: React.ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}

function App() {
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    // Initialize stores on app load
    // You can fetch user data here if token exists

  }, []);

  return (
    <ThemeProvider>
      <Router>
        <Toaster />
        <Routes>
          {/* Public Routes */}
          <Route
            path="/login"
            element={
              isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />
            }
          />
          <Route
            path="/register"
            element={
              isAuthenticated ? <Navigate to="/dashboard" replace /> : <SignupPage />
            }
          />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/transactions"
            element={
              <ProtectedRoute>
                <Transactions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/budget"
            element={
              <ProtectedRoute>
                <Budget />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />

          {/* Root redirect */}
          <Route
            path="/"
            element={
              <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />
            }
          />

          {/* 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
