import { Link, useLocation } from "wouter";
import { useAuth } from "@/context/auth-context";
import { cn } from "@/lib/utils";

// Use RemixIcon from CDN instead of importing locally
// Add this to your index.html: <link href="https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css" rel="stylesheet">

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className }: SidebarProps) {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  const isActive = (path: string) => {
    return location === path;
  };

  const NavLink = ({ href, icon, children }: { href: string; icon: string; children: React.ReactNode }) => (
    <Link href={href}>
      <a
        className={cn(
          "flex items-center px-3 py-2 text-sm font-medium rounded-md",
          isActive(href) 
            ? "bg-primary text-primary-foreground" 
            : "text-gray-700 hover:bg-gray-100"
        )}
      >
        <i className={`${icon} mr-3 text-lg`}></i>
        {children}
      </a>
    </Link>
  );

  return (
    <aside className={cn("hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-50", className)}>
      <div className="flex flex-col flex-grow pt-5 overflow-y-auto bg-white border-r">
        <div className="flex items-center flex-shrink-0 px-4 mb-5">
          <span className="text-xl font-semibold">TutorSync</span>
        </div>
        
        {/* Admin Nav Links */}
        {user?.role === "admin" && (
          <div className="px-3 mt-6 space-y-4">
            <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Admin</p>
            <NavLink href="/dashboard" icon="ri-dashboard-line">Dashboard</NavLink>
            <NavLink href="/tutors" icon="ri-user-line">Tutors</NavLink>
            <NavLink href="/students" icon="ri-group-line">Students</NavLink>
            <NavLink href="/inquiries" icon="ri-question-answer-line">Inquiries</NavLink>
            <NavLink href="/schedule" icon="ri-calendar-line">Schedule</NavLink>
            <NavLink href="/reports" icon="ri-file-list-3-line">Reports</NavLink>
            <NavLink href="/invoices" icon="ri-bill-line">Invoices</NavLink>
          </div>
        )}
        
        {/* Tutor Nav Links */}
        {user?.role === "tutor" && (
          <div className="px-3 mt-6 space-y-4">
            <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tutor</p>
            <NavLink href="/dashboard" icon="ri-dashboard-line">Dashboard</NavLink>
            <NavLink href="/students" icon="ri-group-line">My Students</NavLink>
            <NavLink href="/schedule" icon="ri-calendar-line">Schedule</NavLink>
            <NavLink href="/reports" icon="ri-file-list-3-line">Submit Report</NavLink>
            <NavLink href="/invoices" icon="ri-bill-line">Invoices</NavLink>
            <NavLink href="/profile" icon="ri-user-settings-line">Profile</NavLink>
          </div>
        )}
        
        {/* Parent Nav Links */}
        {user?.role === "parent" && (
          <div className="px-3 mt-6 space-y-4">
            <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Parent</p>
            <NavLink href="/dashboard" icon="ri-dashboard-line">Dashboard</NavLink>
            <NavLink href="/tutors" icon="ri-user-line">My Tutors</NavLink>
            <NavLink href="/schedule" icon="ri-calendar-line">Schedule</NavLink>
            <NavLink href="/reports" icon="ri-file-list-3-line">Reports</NavLink>
            <NavLink href="/invoices" icon="ri-bill-line">Invoices</NavLink>
            <NavLink href="/inquiries" icon="ri-question-answer-line">Submit Inquiry</NavLink>
          </div>
        )}
        
        <div className="mt-auto pb-4 px-3">
          <NavLink href="/settings" icon="ri-settings-4-line">Settings</NavLink>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              logout();
            }}
            className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100"
          >
            <i className="ri-logout-box-line mr-3 text-lg"></i>
            Logout
          </a>
        </div>
      </div>
    </aside>
  );
}
