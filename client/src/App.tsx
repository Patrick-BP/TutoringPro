import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { useState } from "react";
import { AuthUser } from "./types";

// Pages
import Login from "@/pages/login";
import Dashboard from "@/pages/dashboard";
import Inquiries from "@/pages/inquiries";
import Tutors from "@/pages/tutors";
import Students from "@/pages/students";
import Calendar from "@/pages/calendar";
import Reports from "@/pages/reports";
import Billing from "@/pages/billing";
import NotFound from "@/pages/not-found";

// Layout
import AppLayout from "@/components/layout/AppLayout";

export default function App() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [location] = useLocation();

  // For demonstration purposes, let's handle demo login
  const handleDemoLogin = () => {
    // Create a dummy authenticated user for demonstration
    const demoUser: AuthUser = {
      id: 1,
      username: "admin",
      firstName: "Admin",
      lastName: "User",
      email: "admin@tutorsync.com",
      role: "admin",
      phone: "555-123-4567",
      avatar: null,
      isAuthenticated: true,
    };
    setUser(demoUser);
  };

  return (
    <QueryClientProvider client={queryClient}>
      {!user ? (
        <Login onLogin={(loggedInUser) => setUser(loggedInUser)} />
      ) : (
        <AppLayout user={user}>
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/inquiries" component={Inquiries} />
            <Route path="/tutors" component={Tutors} />
            <Route path="/students" component={Students} />
            <Route path="/calendar" component={Calendar} />
            <Route path="/reports" component={Reports} />
            <Route path="/billing" component={Billing} />
            <Route component={NotFound} />
          </Switch>
        </AppLayout>
      )}
      <Toaster />
    </QueryClientProvider>
  );
}
