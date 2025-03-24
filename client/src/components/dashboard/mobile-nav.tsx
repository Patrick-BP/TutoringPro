import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

export default function MobileNav() {
  const [location] = useLocation();

  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-white z-10">
      <div className="grid grid-cols-5 h-16">
        <Link href="/dashboard">
          <a className={cn(
            "flex flex-col items-center justify-center",
            isActive("/dashboard") ? "text-primary" : "text-gray-600"
          )}>
            <i className="ri-dashboard-line text-xl"></i>
            <span className="text-xs mt-1">Dashboard</span>
          </a>
        </Link>
        <Link href="/schedule">
          <a className={cn(
            "flex flex-col items-center justify-center",
            isActive("/schedule") ? "text-primary" : "text-gray-600"
          )}>
            <i className="ri-calendar-line text-xl"></i>
            <span className="text-xs mt-1">Schedule</span>
          </a>
        </Link>
        <Link href="/inquiries">
          <a className={cn(
            "flex flex-col items-center justify-center",
            isActive("/inquiries") ? "text-primary" : "text-gray-600"
          )}>
            <i className="ri-question-answer-line text-xl"></i>
            <span className="text-xs mt-1">Inquiries</span>
          </a>
        </Link>
        <Link href="/reports">
          <a className={cn(
            "flex flex-col items-center justify-center",
            isActive("/reports") ? "text-primary" : "text-gray-600"
          )}>
            <i className="ri-file-list-3-line text-xl"></i>
            <span className="text-xs mt-1">Reports</span>
          </a>
        </Link>
        <div className="flex flex-col items-center justify-center text-gray-600 relative group">
          <i className="ri-menu-line text-xl"></i>
          <span className="text-xs mt-1">Menu</span>
        </div>
      </div>
    </nav>
  );
}
