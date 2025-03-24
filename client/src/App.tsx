import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  
  if (!loggedIn) {
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
            <form onSubmit={(e) => { e.preventDefault(); setLoggedIn(true); }} className="space-y-4">
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
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white border-b p-4">
        <h1 className="text-2xl font-bold text-primary">TutorSync Dashboard</h1>
      </header>
      <main className="p-6">
        <h2 className="text-xl font-semibold mb-4">Welcome to TutorSync</h2>
        <p className="mb-4">This is a simplified version of the dashboard. The full application includes:</p>
        <ul className="list-disc ml-6 space-y-2">
          <li>Student and tutor management</li>
          <li>Inquiry processing</li>
          <li>Scheduling tools</li>
          <li>Session reporting</li>
          <li>Billing automation</li>
        </ul>
        <div className="mt-4">
          <Button onClick={() => setLoggedIn(false)}>
            Log Out
          </Button>
        </div>
      </main>
      <Toaster />
    </div>
  );
}
