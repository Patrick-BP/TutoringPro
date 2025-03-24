import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "./context/auth-context";
import DashboardLayout from "./layouts/dashboard-layout";
import AuthLayout from "./layouts/auth-layout";

// Dashboard Pages
import Dashboard from "@/pages/dashboard";
import Inquiries from "@/pages/inquiries";
import Tutors from "@/pages/tutors";
import Students from "@/pages/students";
import Schedule from "@/pages/schedule";
import Reports from "@/pages/reports";
import Invoices from "@/pages/invoices";

// Auth Pages
import Login from "@/pages/auth/login";
import Register from "@/pages/auth/register";

// 404 Page
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      {/* Auth Routes */}
      <Route path="/login">
        <AuthLayout>
          <Login />
        </AuthLayout>
      </Route>
      <Route path="/register">
        <AuthLayout>
          <Register />
        </AuthLayout>
      </Route>

      {/* Dashboard Routes */}
      <Route path="/">
        <DashboardLayout>
          <Dashboard />
        </DashboardLayout>
      </Route>
      <Route path="/dashboard">
        <DashboardLayout>
          <Dashboard />
        </DashboardLayout>
      </Route>
      <Route path="/inquiries">
        <DashboardLayout>
          <Inquiries />
        </DashboardLayout>
      </Route>
      <Route path="/tutors">
        <DashboardLayout>
          <Tutors />
        </DashboardLayout>
      </Route>
      <Route path="/students">
        <DashboardLayout>
          <Students />
        </DashboardLayout>
      </Route>
      <Route path="/schedule">
        <DashboardLayout>
          <Schedule />
        </DashboardLayout>
      </Route>
      <Route path="/reports">
        <DashboardLayout>
          <Reports />
        </DashboardLayout>
      </Route>
      <Route path="/invoices">
        <DashboardLayout>
          <Invoices />
        </DashboardLayout>
      </Route>

      {/* Fallback to 404 */}
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
