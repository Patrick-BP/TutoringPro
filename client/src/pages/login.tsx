import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { AuthUser } from "@/types";
import { apiRequest } from "@/lib/queryClient";

interface LoginProps {
  onLogin: (user: AuthUser) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("password");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [_, setLocation] = useLocation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast({
        title: "Invalid input",
        description: "Please enter both username and password",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // For demonstration purposes, we're creating a demo user directly
      // In a real application, this would come from the server
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
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      onLogin(demoUser);
      
      toast({
        title: "Login successful",
        description: "Welcome back to TutorSync!",
      });
      
      setLocation("/dashboard");
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login failed",
        description: "Invalid username or password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight text-primary">
            TutorSync
          </CardTitle>
          <CardDescription>
            Enter your credentials to sign in
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
