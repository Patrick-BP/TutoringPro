import { useState } from "react";
import { Route, Switch, Link, useLocation } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  MessageSquareText, 
  Users, 
  GraduationCap, 
  Calendar as CalendarIcon, 
  FileBarChart, 
  CreditCard,
  MenuIcon,
  X,
  LogOut,
  User
} from "lucide-react";

// Pages
import Dashboard from "@/pages/dashboard";
import Inquiries from "@/pages/inquiries";
import Students from "@/pages/students";
import Tutors from "@/pages/tutors";
import Calendar from "@/pages/calendar";
import Reports from "@/pages/reports";
import Billing from "@/pages/billing";
import NotFound from "@/pages/not-found";

// User type
import { AuthUser } from "@/types";

export default function App() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  const isActive = (path: string) => {
    return location === path;
  };

  const handleLogin = (userData: AuthUser) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };
  
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold tracking-tight text-primary">
              TutorSync
            </CardTitle>
            <p className="text-gray-500">
              Tutoring Business Automation Platform
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={(e) => { 
              e.preventDefault(); 
              const demoUser: AuthUser = {
                id: 1,
                username: "admin",
                email: "admin@tutorsync.com",
                firstName: "Admin",
                lastName: "User",
                role: "admin",
                phone: null,
                avatar: null,
                isAuthenticated: true
              };
              handleLogin(demoUser);
            }} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" defaultValue="admin" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" defaultValue="password" />
              </div>
              <Button type="submit" className="w-full">
                Sign In
              </Button>
            </form>
          </CardContent>
        </Card>
        <Toaster />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - large screens */}
      <div className="w-64 bg-white border-r hidden md:flex md:flex-col">
        <div className="p-4 border-b">
          <h1 className="text-2xl font-bold text-primary">TutorSync</h1>
        </div>
        <nav className="px-4 py-6 flex-1">
          <ul className="space-y-2">
            <li>
              <Link href="/dashboard">
                <a className={cn(
                  "flex items-center p-2 text-sm font-medium rounded-md",
                  isActive("/dashboard") ? "text-primary bg-primary/10" : "text-gray-600 hover:bg-gray-100"
                )}>
                  <LayoutDashboard className="mr-3 h-5 w-5" />
                  Dashboard
                </a>
              </Link>
            </li>
            <li>
              <Link href="/inquiries">
                <a className={cn(
                  "flex items-center p-2 text-sm font-medium rounded-md",
                  isActive("/inquiries") ? "text-primary bg-primary/10" : "text-gray-600 hover:bg-gray-100"
                )}>
                  <MessageSquareText className="mr-3 h-5 w-5" />
                  Inquiries
                </a>
              </Link>
            </li>
            <li>
              <Link href="/students">
                <a className={cn(
                  "flex items-center p-2 text-sm font-medium rounded-md",
                  isActive("/students") ? "text-primary bg-primary/10" : "text-gray-600 hover:bg-gray-100"
                )}>
                  <Users className="mr-3 h-5 w-5" />
                  Students
                </a>
              </Link>
            </li>
            <li>
              <Link href="/tutors">
                <a className={cn(
                  "flex items-center p-2 text-sm font-medium rounded-md",
                  isActive("/tutors") ? "text-primary bg-primary/10" : "text-gray-600 hover:bg-gray-100"
                )}>
                  <GraduationCap className="mr-3 h-5 w-5" />
                  Tutors
                </a>
              </Link>
            </li>
            <li>
              <Link href="/calendar">
                <a className={cn(
                  "flex items-center p-2 text-sm font-medium rounded-md",
                  isActive("/calendar") ? "text-primary bg-primary/10" : "text-gray-600 hover:bg-gray-100"
                )}>
                  <CalendarIcon className="mr-3 h-5 w-5" />
                  Calendar
                </a>
              </Link>
            </li>
            <li>
              <Link href="/reports">
                <a className={cn(
                  "flex items-center p-2 text-sm font-medium rounded-md",
                  isActive("/reports") ? "text-primary bg-primary/10" : "text-gray-600 hover:bg-gray-100"
                )}>
                  <FileBarChart className="mr-3 h-5 w-5" />
                  Reports
                </a>
              </Link>
            </li>
            <li>
              <Link href="/billing">
                <a className={cn(
                  "flex items-center p-2 text-sm font-medium rounded-md",
                  isActive("/billing") ? "text-primary bg-primary/10" : "text-gray-600 hover:bg-gray-100"
                )}>
                  <CreditCard className="mr-3 h-5 w-5" />
                  Billing
                </a>
              </Link>
            </li>
          </ul>
        </nav>
        <div className="p-4 border-t">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-3">
              <User className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{user.firstName} {user.lastName}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setMobileMenuOpen(false)}></div>
          <div className="fixed inset-y-0 left-0 flex flex-col w-full max-w-xs bg-white">
            <div className="p-4 border-b flex items-center justify-between">
              <h1 className="text-2xl font-bold text-primary">TutorSync</h1>
              <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <nav className="px-4 py-6 flex-1 overflow-y-auto">
              <ul className="space-y-2">
                <li>
                  <Link href="/dashboard">
                    <a className={cn(
                      "flex items-center p-2 text-sm font-medium rounded-md",
                      isActive("/dashboard") ? "text-primary bg-primary/10" : "text-gray-600 hover:bg-gray-100"
                    )} onClick={() => setMobileMenuOpen(false)}>
                      <LayoutDashboard className="mr-3 h-5 w-5" />
                      Dashboard
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/inquiries">
                    <a className={cn(
                      "flex items-center p-2 text-sm font-medium rounded-md",
                      isActive("/inquiries") ? "text-primary bg-primary/10" : "text-gray-600 hover:bg-gray-100"
                    )} onClick={() => setMobileMenuOpen(false)}>
                      <MessageSquareText className="mr-3 h-5 w-5" />
                      Inquiries
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/students">
                    <a className={cn(
                      "flex items-center p-2 text-sm font-medium rounded-md",
                      isActive("/students") ? "text-primary bg-primary/10" : "text-gray-600 hover:bg-gray-100"
                    )} onClick={() => setMobileMenuOpen(false)}>
                      <Users className="mr-3 h-5 w-5" />
                      Students
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/tutors">
                    <a className={cn(
                      "flex items-center p-2 text-sm font-medium rounded-md",
                      isActive("/tutors") ? "text-primary bg-primary/10" : "text-gray-600 hover:bg-gray-100"
                    )} onClick={() => setMobileMenuOpen(false)}>
                      <GraduationCap className="mr-3 h-5 w-5" />
                      Tutors
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/calendar">
                    <a className={cn(
                      "flex items-center p-2 text-sm font-medium rounded-md",
                      isActive("/calendar") ? "text-primary bg-primary/10" : "text-gray-600 hover:bg-gray-100"
                    )} onClick={() => setMobileMenuOpen(false)}>
                      <CalendarIcon className="mr-3 h-5 w-5" />
                      Calendar
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/reports">
                    <a className={cn(
                      "flex items-center p-2 text-sm font-medium rounded-md",
                      isActive("/reports") ? "text-primary bg-primary/10" : "text-gray-600 hover:bg-gray-100"
                    )} onClick={() => setMobileMenuOpen(false)}>
                      <FileBarChart className="mr-3 h-5 w-5" />
                      Reports
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/billing">
                    <a className={cn(
                      "flex items-center p-2 text-sm font-medium rounded-md",
                      isActive("/billing") ? "text-primary bg-primary/10" : "text-gray-600 hover:bg-gray-100"
                    )} onClick={() => setMobileMenuOpen(false)}>
                      <CreditCard className="mr-3 h-5 w-5" />
                      Billing
                    </a>
                  </Link>
                </li>
              </ul>
            </nav>
            <div className="p-4 border-t">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-3">
                  <User className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{user.firstName} {user.lastName}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b p-4 flex items-center md:hidden">
          <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(true)} className="mr-2">
            <MenuIcon className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-bold text-primary">TutorSync</h1>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          <Switch>
            <Route path="/dashboard" component={() => <Dashboard />} />
            <Route path="/inquiries" component={Inquiries} />
            <Route path="/students" component={Students} />
            <Route path="/tutors" component={Tutors} />
            <Route path="/calendar" component={Calendar} />
            <Route path="/reports" component={Reports} />
            <Route path="/billing" component={Billing} />
            <Route path="/" component={() => <Dashboard />} />
            <Route component={NotFound} />
          </Switch>
        </main>
      </div>
      <Toaster />
    </div>
  );
}
