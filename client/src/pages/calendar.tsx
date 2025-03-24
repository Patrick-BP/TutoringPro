import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Session } from "@/types";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format, parseISO, isToday, isThisWeek, isThisMonth } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { CalendarIcon, Plus, Clock, MapPin, User } from "lucide-react";

export default function Calendar() {
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [view, setView] = useState("week");
  
  const { data: sessions, isLoading } = useQuery<Session[]>({
    queryKey: ['/api/sessions'],
  });

  const filteredSessions = sessions
    ? sessions.filter((session) => {
        const sessionDate = parseISO(session.date.toString());
        switch (view) {
          case "day":
            return isToday(sessionDate);
          case "week":
            return isThisWeek(sessionDate);
          case "month":
            return isThisMonth(sessionDate);
          default:
            return true;
        }
      })
    : [];

  return (
    <div className="container mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Calendar</h1>
          <p className="text-gray-500 mt-1">
            Manage all tutoring sessions and appointments
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button onClick={() => toast({ title: "New Session", description: "Opening session creation form" })}>
            <Plus className="h-4 w-4 mr-2" />
            Add Session
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-1">
          <CardHeader className="px-6 py-4 border-b border-gray-200">
            <CardTitle className="text-lg font-semibold">Date Picker</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <CalendarComponent
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>
        
        {/* Schedule View */}
        <Card className="lg:col-span-2">
          <CardHeader className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-semibold">
                Schedule {date && `- ${format(date, "MMMM d, yyyy")}`}
              </CardTitle>
              <Tabs value={view} onValueChange={setView}>
                <TabsList>
                  <TabsTrigger value="day">Day</TabsTrigger>
                  <TabsTrigger value="week">Week</TabsTrigger>
                  <TabsTrigger value="month">Month</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {isLoading ? (
              <div className="text-center py-8">Loading sessions...</div>
            ) : filteredSessions.length > 0 ? (
              <div className="space-y-4">
                {/* Sample data for demonstration */}
                {[
                  { 
                    id: 1, 
                    date: "2023-10-18", 
                    startTime: "15:30", 
                    endTime: "16:30", 
                    subject: "Mathematics", 
                    topic: "Algebra II", 
                    student: "Jack Smith", 
                    tutor: "Michael Turner",
                    location: "Online"
                  },
                  { 
                    id: 2, 
                    date: "2023-10-18", 
                    startTime: "17:00", 
                    endTime: "18:00", 
                    subject: "English", 
                    topic: "Essay Writing", 
                    student: "Alice Davis", 
                    tutor: "Lisa Wright",
                    location: "Student's Home"
                  },
                  { 
                    id: 3, 
                    date: "2023-10-18", 
                    startTime: "19:15", 
                    endTime: "20:15", 
                    subject: "Chemistry", 
                    topic: "AP Prep", 
                    student: "Robert Johnson", 
                    tutor: "David Scott",
                    location: "Tutor's Office"
                  },
                ].map((session) => (
                  <div key={session.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                      <div className="flex items-center">
                        <CalendarIcon className="h-5 w-5 text-primary mr-2" />
                        <span className="font-medium">{format(parseISO(session.date), "MMMM d, yyyy")}</span>
                      </div>
                      <div className="flex items-center mt-2 sm:mt-0">
                        <Clock className="h-5 w-5 text-gray-500 mr-2" />
                        <span>{session.startTime} - {session.endTime}</span>
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-semibold mt-2">{session.subject} - {session.topic}</h3>
                    
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center">
                        <User className="h-5 w-5 text-gray-500 mr-2" />
                        <div>
                          <div className="text-sm">Student: <span className="font-medium">{session.student}</span></div>
                          <div className="text-sm">Tutor: <span className="font-medium">{session.tutor}</span></div>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <MapPin className="h-5 w-5 text-gray-500 mr-2" />
                        <span className="text-sm">{session.location}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => toast({
                          title: "Edit Session",
                          description: `Editing session for ${session.student}`
                        })}
                      >
                        Edit
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => toast({
                          title: "View Details",
                          description: `Viewing details for ${session.student}'s session`
                        })}
                      >
                        Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No sessions scheduled for the selected period
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
