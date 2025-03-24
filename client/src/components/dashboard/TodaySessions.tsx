import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { TodaySession } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";

export default function TodaySessions() {
  const today = new Date();
  const formattedDate = format(today, "EEEE, MMMM d, yyyy");
  
  const { data: sessions, isLoading, error } = useQuery<TodaySession[]>({
    queryKey: ['/api/sessions/today'],
  });

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Today's Sessions</CardTitle>
          <CardDescription>{formattedDate}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-red-500">Failed to load today's sessions</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden h-full">
      <CardHeader className="p-6 border-b border-gray-200">
        <CardTitle className="text-lg font-semibold">Today's Sessions</CardTitle>
        <CardDescription className="text-sm text-gray-500 mt-1">{formattedDate}</CardDescription>
      </CardHeader>
      
      <CardContent className="p-6">
        {isLoading ? (
          <div className="space-y-6">
            {Array(3).fill(0).map((_, index) => (
              <div key={index} className="relative pl-6 pb-4 border-l-2 border-primary-200">
                <Skeleton className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full" />
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-5 w-48 mb-2" />
                <div className="mt-1 flex items-center">
                  <Skeleton className="w-6 h-6 rounded-full" />
                  <Skeleton className="ml-2 h-3 w-24" />
                </div>
                <div className="mt-1 flex items-center">
                  <Skeleton className="w-6 h-6 rounded-full" />
                  <Skeleton className="ml-2 h-3 w-32" />
                </div>
              </div>
            ))}
          </div>
        ) : sessions && sessions.length > 0 ? (
          <div className="space-y-4">
            {sessions.map((session) => (
              <div key={session.id} className="relative pl-6 pb-4 border-l-2 border-primary-200">
                <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-primary-500"></div>
                <p className="text-sm font-medium">{session.time}</p>
                <h4 className="text-sm font-semibold mt-1">{session.subject} - {session.topic}</h4>
                
                <div className="mt-1 flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xs font-medium">
                      {session.student.initials}
                    </div>
                  </div>
                  <p className="ml-2 text-xs text-gray-500">{session.student.name}</p>
                </div>
                
                <div className="mt-1 flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 text-xs font-medium">
                      {session.tutor.initials}
                    </div>
                  </div>
                  <p className="ml-2 text-xs text-gray-500">{session.tutor.name} (Tutor)</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">
            <p>No sessions scheduled for today</p>
          </div>
        )}
      </CardContent>
      
      {sessions && sessions.length > 0 && (
        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <Link href="/calendar" className="block text-center text-sm text-primary hover:text-primary-700 font-medium">
            View Full Calendar
          </Link>
        </div>
      )}
    </Card>
  );
}
