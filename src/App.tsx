import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

// Public pages
import Index from "./pages/Index";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ForgotPassword from "./pages/auth/ForgotPassword";
import About from "./pages/About";
import Contact from "./pages/Contact";

// User dashboard
import Dashboard from "./pages/dashboard/Dashboard";
import LoanApplication from "./pages/dashboard/LoanApplication";
import OpenAccount from "./pages/dashboard/OpenAccount";

// Admin pages
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected Route Component for regular users
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading, isAdmin } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // If user is admin, redirect to admin dashboard
  if (isAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }
  
  return <>{children}</>;
};

// Admin Route Component
const AdminRoute: React.FC<{ 
  children: React.ReactNode; 
  allowedRoles?: ('credit' | 'audit' | 'coo' | 'operations' | 'md')[];
}> = ({ children, allowedRoles }) => {
  const { user, isLoading, adminRole } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }
  
  if (!user || !adminRole) {
    return <Navigate to="/admin/login" replace />;
  }
  
  // Check if user has required role
  if (allowedRoles && !allowedRoles.includes(adminRole)) {
    return <Navigate to="/admin/dashboard" replace />;
  }
  
  return <>{children}</>;
};

// Public Route - redirect authenticated users
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading, isAdmin } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }
  
  if (user) {
    if (isAdmin) {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => (
  <Routes>
    {/* Public Routes */}
    <Route path="/" element={<Index />} />
    <Route path="/about" element={<About />} />
    <Route path="/contact" element={<Contact />} />
    <Route 
      path="/login" 
      element={
        <PublicRoute>
          <Login />
        </PublicRoute>
      } 
    />
    <Route 
      path="/signup" 
      element={
        <PublicRoute>
          <Signup />
        </PublicRoute>
      } 
    />
    <Route path="/forgot-password" element={<ForgotPassword />} />
    
    {/* Protected User Routes */}
    <Route 
      path="/dashboard" 
      element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/apply" 
      element={
        <ProtectedRoute>
          <LoanApplication />
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/open-account" 
      element={
        <ProtectedRoute>
          <OpenAccount />
        </ProtectedRoute>
      } 
    />
    
    {/* Admin Routes */}
    <Route path="/admin/login" element={<AdminLogin />} />
    <Route 
      path="/admin/dashboard" 
      element={
        <AdminRoute>
          <AdminDashboard />
        </AdminRoute>
      } 
    />
    
    {/* Catch-all */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
