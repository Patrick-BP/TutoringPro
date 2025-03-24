import { useLocation, Link } from "wouter";
import { cn } from "@/lib/utils";
import { AuthUser } from "@/types";
import { 
  LayoutDashboard, 
  ClipboardList, 
  Users, 
  GraduationCap, 
  Calendar, 
  FileText, 
  CreditCard, 
  Settings,
  X
} from "lucide-react";

interface SidebarProps {
  user: AuthUser;
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ user, isOpen, onClose }: SidebarProps) {
  const [location] = useLocation();

  const isActive = (path: string) => {
    if (path === '/dashboard' && location === '/') return true;
    return location === path;
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5 mr-2" /> },
    { path: '/inquiries', label: 'Inquiries', icon: <ClipboardList className="h-5 w-5 mr-2" /> },
    { path: '/tutors', label: 'Tutors', icon: <Users className="h-5 w-5 mr-2" /> },
    { path: '/students', label: 'Students', icon: <GraduationCap className="h-5 w-5 mr-2" /> },
    { path: '/calendar', label: 'Calendar', icon: <Calendar className="h-5 w-5 mr-2" /> },
    { path: '/reports', label: 'Reports', icon: <FileText className="h-5 w-5 mr-2" /> },
    { path: '/billing', label: 'Billing', icon: <CreditCard className="h-5 w-5 mr-2" /> },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div 
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-200 transition-transform lg:relative lg:translate-x-0 lg:z-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center px-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-primary">TutorSync</h1>
          <button 
            onClick={onClose}
            className="ml-auto rounded-full p-1 text-gray-500 hover:bg-gray-100 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {user.role === "admin" && (
            <>
              <div className="mb-2 text-xs font-semibold text-gray-500 uppercase">Admin</div>
              {navItems.map((item) => (
                <Link key={item.path} href={item.path}>
                  <a
                    className={cn(
                      "flex items-center px-3 py-2 text-sm font-medium rounded-md",
                      isActive(item.path)
                        ? "bg-primary-50 text-primary-700"
                        : "text-gray-700 hover:bg-gray-100"
                    )}
                  >
                    {item.icon}
                    {item.label}
                  </a>
                </Link>
              ))}
            </>
          )}

          {user.role === "tutor" && (
            <>
              <div className="mb-2 text-xs font-semibold text-gray-500 uppercase">Tutor</div>
              <Link href="/dashboard">
                <a className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-md",
                  isActive('/dashboard') ? "bg-primary-50 text-primary-700" : "text-gray-700 hover:bg-gray-100"
                )}>
                  <LayoutDashboard className="h-5 w-5 mr-2" />
                  Dashboard
                </a>
              </Link>
              <Link href="/calendar">
                <a className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-md",
                  isActive('/calendar') ? "bg-primary-50 text-primary-700" : "text-gray-700 hover:bg-gray-100"
                )}>
                  <Calendar className="h-5 w-5 mr-2" />
                  My Schedule
                </a>
              </Link>
              <Link href="/reports">
                <a className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-md",
                  isActive('/reports') ? "bg-primary-50 text-primary-700" : "text-gray-700 hover:bg-gray-100"
                )}>
                  <FileText className="h-5 w-5 mr-2" />
                  Submit Reports
                </a>
              </Link>
              <Link href="/billing">
                <a className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-md",
                  isActive('/billing') ? "bg-primary-50 text-primary-700" : "text-gray-700 hover:bg-gray-100"
                )}>
                  <CreditCard className="h-5 w-5 mr-2" />
                  Invoices
                </a>
              </Link>
            </>
          )}

          {user.role === "parent" && (
            <>
              <div className="mb-2 text-xs font-semibold text-gray-500 uppercase">Parent</div>
              <Link href="/dashboard">
                <a className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-md",
                  isActive('/dashboard') ? "bg-primary-50 text-primary-700" : "text-gray-700 hover:bg-gray-100"
                )}>
                  <LayoutDashboard className="h-5 w-5 mr-2" />
                  Dashboard
                </a>
              </Link>
              <Link href="/calendar">
                <a className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-md",
                  isActive('/calendar') ? "bg-primary-50 text-primary-700" : "text-gray-700 hover:bg-gray-100"
                )}>
                  <Calendar className="h-5 w-5 mr-2" />
                  Sessions
                </a>
              </Link>
              <Link href="/reports">
                <a className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-md",
                  isActive('/reports') ? "bg-primary-50 text-primary-700" : "text-gray-700 hover:bg-gray-100"
                )}>
                  <FileText className="h-5 w-5 mr-2" />
                  Reports
                </a>
              </Link>
              <Link href="/billing">
                <a className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-md",
                  isActive('/billing') ? "bg-primary-50 text-primary-700" : "text-gray-700 hover:bg-gray-100"
                )}>
                  <CreditCard className="h-5 w-5 mr-2" />
                  Payments
                </a>
              </Link>
            </>
          )}
        </nav>
        
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-primary-200 flex items-center justify-center text-primary-700 font-semibold">
              {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{user.firstName} {user.lastName}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
