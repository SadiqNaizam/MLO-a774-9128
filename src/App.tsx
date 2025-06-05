import { Toaster as ShadcnToaster } from "@/components/ui/toaster"; // Original Toaster
import { Toaster as Sonner } from "@/components/ui/sonner"; // Sonner for richer notifications
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import AccountsDashboardPage from "./pages/AccountsDashboardPage";
import TransfersPage from "./pages/TransfersPage";
import PaymentsPage from "./pages/PaymentsPage";
import ProfileSettingsPage from "./pages/ProfileSettingsPage";
import NotFound from "./pages/NotFound"; // Assuming NotFound.tsx exists

const queryClient = new QueryClient();

// Mock authentication check (replace with actual auth context/logic)
const isAuthenticated = () => {
  // For demo purposes, let's assume if they navigate away from login, they are "authenticated"
  // In a real app, this would check for a token in localStorage, context, etc.
  // This basic check is just for redirecting from "/" if not on login.
  // A more robust solution would involve an AuthContext and protected routes.
  return sessionStorage.getItem("isLoggedIn") === "true" || true; // Simplified for example
};

// A simple ProtectedRoute component (can be enhanced)
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  // Simulate setting login status after successful login.
  // This is a hack for the demo. Proper auth state management is needed.
  if (window.location.pathname.startsWith('/accounts-dashboard')) { // Example trigger
     sessionStorage.setItem("isLoggedIn", "true");
  }
  
  if (!isAuthenticated() && window.location.pathname !== '/login') {
    // Redirect them to the /login page, but keeping the current location they were
    // trying to go to in the state, so we can send them along after login.
    return <Navigate to="/login" replace />;
  }
  return children;
};


const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ShadcnToaster /> {/* For shadcn's default toast system, if used */}
      <Sonner richColors /> {/* For sonner notifications, typically preferred */}
      <BrowserRouter>
        <Routes>
          {/* Public route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected routes */}
          <Route path="/accounts-dashboard" element={<ProtectedRoute><AccountsDashboardPage /></ProtectedRoute>} />
          <Route path="/transfers" element={<ProtectedRoute><TransfersPage /></ProtectedRoute>} />
          <Route path="/payments" element={<ProtectedRoute><PaymentsPage /></ProtectedRoute>} />
          <Route path="/profile-settings" element={<ProtectedRoute><ProfileSettingsPage /></ProtectedRoute>} />
          
          {/* Default route: Redirect to login or dashboard based on auth */}
          <Route 
            path="/" 
            element={
              isAuthenticated() && sessionStorage.getItem("isLoggedIn") === "true" ? <Navigate to="/accounts-dashboard" replace /> : <Navigate to="/login" replace />
            } 
          />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;