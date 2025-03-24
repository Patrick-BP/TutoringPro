import { useQuery } from "@tanstack/react-query";
import { ClipboardList, GraduationCap, Users, DollarSign } from "lucide-react";
import { DashboardStats } from "@/types";

import StatsCard from "@/components/dashboard/StatsCard";
import RecentInquiries from "@/components/dashboard/RecentInquiries";
import TodaySessions from "@/components/dashboard/TodaySessions";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const { toast } = useToast();
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ['/api/stats/dashboard'],
  });

  return (
    <div className="container mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Welcome back to your tutoring business management system
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
          <Button variant="outline" className="flex items-center" onClick={() => {
            toast({
              title: "Export",
              description: "Exporting dashboard data...",
            });
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Export
          </Button>
          <Link href="/inquiries">
            <Button className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              New Inquiry
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {isLoading ? (
          // Loading skeletons for stats cards
          Array(4).fill(0).map((_, index) => (
            <div key={index} className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <div className="flex justify-between items-center">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-16" />
                </div>
                <Skeleton className="h-10 w-10 rounded-full" />
              </div>
              <div className="mt-4 flex items-center">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="ml-2 h-4 w-24" />
              </div>
            </div>
          ))
        ) : (
          <>
            <StatsCard
              title="New Inquiries"
              value={stats?.newInquiries || 0}
              icon={ClipboardList}
              iconColor="text-blue-600"
              iconBgColor="bg-blue-100"
              change={{
                value: "+8.2%",
                isPositive: true,
                text: "from last week"
              }}
            />
            <StatsCard
              title="Active Students"
              value={stats?.activeStudents || 0}
              icon={GraduationCap}
              iconColor="text-green-600"
              iconBgColor="bg-green-100"
              change={{
                value: "+3.1%",
                isPositive: true,
                text: "from last month"
              }}
            />
            <StatsCard
              title="Active Tutors"
              value={stats?.activeTutors || 0}
              icon={Users}
              iconColor="text-purple-600"
              iconBgColor="bg-purple-100"
              change={{
                value: "+2 tutors",
                isPositive: true,
                text: "this month"
              }}
            />
            <StatsCard
              title="Monthly Revenue"
              value={stats?.monthlyRevenue || "$0"}
              icon={DollarSign}
              iconColor="text-green-600"
              iconBgColor="bg-green-100"
              change={{
                value: "+5.4%",
                isPositive: true,
                text: "from last month"
              }}
            />
          </>
        )}
      </div>

      {/* Recent Inquiries & Today's Sessions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <RecentInquiries />
        </div>
        <div className="lg:col-span-1">
          <TodaySessions />
        </div>
      </div>
    </div>
  );
}
