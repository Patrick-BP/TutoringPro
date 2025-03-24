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
      <header className="bg-white border-b p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-primary">TutorSync</h1>
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#" className="text-sm font-medium text-primary">Dashboard</a>
            <a href="#" className="text-sm font-medium text-gray-500 hover:text-primary">Inquiries</a>
            <a href="#" className="text-sm font-medium text-gray-500 hover:text-primary">Students</a>
            <a href="#" className="text-sm font-medium text-gray-500 hover:text-primary">Tutors</a>
            <a href="#" className="text-sm font-medium text-gray-500 hover:text-primary">Calendar</a>
            <a href="#" className="text-sm font-medium text-gray-500 hover:text-primary">Reports</a>
            <a href="#" className="text-sm font-medium text-gray-500 hover:text-primary">Billing</a>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-700">Admin User</span>
          <Button variant="outline" size="sm" onClick={() => setLoggedIn(false)}>
            Log Out
          </Button>
        </div>
      </header>

      <main className="flex-1 container mx-auto p-6">
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-gray-500">Welcome to your tutoring business management dashboard.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">New Inquiries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">3</div>
              <p className="text-xs text-gray-500 mt-1">+2 from last week</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Active Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">12</div>
              <p className="text-xs text-gray-500 mt-1">+1 from last month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Active Tutors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">8</div>
              <p className="text-xs text-gray-500 mt-1">Same as last month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Monthly Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">$5,280</div>
              <p className="text-xs text-gray-500 mt-1">+$430 from last month</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Recent Inquiries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <h3 className="font-medium">Tommy Smith (Grade 10)</h3>
                    <p className="text-sm text-gray-500">Math - Algebra II</p>
                  </div>
                  <div>
                    <Button size="sm" variant="default">Schedule Call</Button>
                  </div>
                </div>
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <h3 className="font-medium">Emma Davis (Grade 8)</h3>
                    <p className="text-sm text-gray-500">English - Essay Writing</p>
                  </div>
                  <div>
                    <Button size="sm" variant="default">Schedule Call</Button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Michael Johnson (Grade 12)</h3>
                    <p className="text-sm text-gray-500">Science - AP Chemistry</p>
                  </div>
                  <div>
                    <Button size="sm" variant="default">Schedule Call</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Today's Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center border-b pb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium mr-4">
                    TS
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">Tommy Smith with John Doe</h3>
                    <p className="text-sm text-gray-500">Math - 3:30 PM - 4:30 PM</p>
                  </div>
                </div>
                <div className="flex items-center border-b pb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium mr-4">
                    ED
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">Emma Davis with Jane Smith</h3>
                    <p className="text-sm text-gray-500">English - 5:00 PM - 6:00 PM</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium mr-4">
                    MJ
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">Michael Johnson with Robert Brown</h3>
                    <p className="text-sm text-gray-500">Science - 6:30 PM - 7:30 PM</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Toaster />
    </div>
  );
}
