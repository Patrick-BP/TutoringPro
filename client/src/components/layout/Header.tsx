import { useState } from "react";
import { Menu, Bell, ChevronDown, Search } from "lucide-react";
import { AuthUser } from "@/types";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

interface HeaderProps {
  user: AuthUser;
  onMenuClick: () => void;
}

export default function Header({ user, onMenuClick }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const [_, setLocation] = useLocation();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
      
      // Force page reload to reset the app state
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Logout failed",
        description: "An error occurred during logout",
        variant: "destructive",
      });
    }
  };

  const handleProfileClick = () => {
    toast({
      title: "Profile",
      description: "Profile management coming soon",
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      toast({
        title: "Search",
        description: `Searching for: ${searchQuery}`,
      });
    }
  };

  return (
    <header className="sticky top-0 z-10 h-16 bg-white border-b border-gray-200 flex items-center px-4 lg:px-6">
      <button
        type="button"
        className="lg:hidden mr-4 text-gray-500"
        onClick={onMenuClick}
      >
        <Menu className="h-6 w-6" />
      </button>
      
      <div className="lg:hidden flex-1">
        <h1 className="text-lg font-bold text-primary">TutorSync</h1>
      </div>
      
      <div className="hidden lg:flex lg:flex-1 lg:items-center">
        <form onSubmit={handleSearch} className="relative w-full max-w-lg">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="Search..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
      </div>
      
      <div className="flex items-center space-x-4">
        <button
          type="button"
          className="p-1 text-gray-500 hover:text-gray-700"
          onClick={() => {
            toast({
              title: "Notifications",
              description: "No new notifications",
            });
          }}
        >
          <Bell className="h-6 w-6" />
        </button>
        
        <div className="h-8 w-px bg-gray-200"></div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button type="button" className="flex items-center text-sm font-medium">
              <span className="hidden md:block">{user.firstName} {user.lastName}</span>
              <ChevronDown className="ml-1 h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleProfileClick}>
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLocation("/settings")}>
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
