import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SessionReport } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Search, Eye, CheckCircle2, XCircle } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";

export default function Reports() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: reports, isLoading } = useQuery<SessionReport[]>({
    queryKey: ['/api/session-reports'],
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Search",
      description: `Searching for reports: ${searchQuery}`,
    });
  };

  return (
    <div className="container mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Session Reports</h1>
          <p className="text-gray-500 mt-1">
            View and manage tutoring session reports and feedback
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button onClick={() => toast({ title: "New Report", description: "Opening report creation form" })}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Submit New Report
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader className="px-6 py-4 border-b border-gray-200 flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold">All Reports</CardTitle>
        </CardHeader>
        
        <CardContent className="p-6">
          {/* Search and filters */}
          <div className="mb-6">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search reports by student, subject, or tutor..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>

          {/* Reports Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Tutor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  // Loading skeletons
                  Array(5).fill(0).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                    </TableRow>
                  ))
                ) : reports && reports.length > 0 ? (
                  // Sample data for demonstration
                  [
                    { id: 1, date: "2023-10-18", student: "Jack Smith", subject: "Mathematics", tutor: "Michael Turner", adminApproved: true, sentToParent: true },
                    { id: 2, date: "2023-10-17", student: "Alice Davis", subject: "English", tutor: "Lisa Wright", adminApproved: true, sentToParent: false },
                    { id: 3, date: "2023-10-16", student: "Robert Johnson", subject: "Chemistry", tutor: "David Scott", adminApproved: false, sentToParent: false },
                    { id: 4, date: "2023-10-15", student: "Emma Wilson", subject: "Spanish", tutor: "Carlos Rodriguez", adminApproved: true, sentToParent: true },
                    { id: 5, date: "2023-10-14", student: "Tyler Brown", subject: "Physics", tutor: "Sarah Chen", adminApproved: false, sentToParent: false },
                  ].map((report) => (
                    <TableRow key={report.id}>
                      <TableCell>
                        {format(new Date(report.date), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{report.student}</div>
                      </TableCell>
                      <TableCell>{report.subject}</TableCell>
                      <TableCell>{report.tutor}</TableCell>
                      <TableCell>
                        {!report.adminApproved ? (
                          <Badge variant="secondary">Pending Approval</Badge>
                        ) : !report.sentToParent ? (
                          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                            Approved, Not Sent
                          </Badge>
                        ) : (
                          <Badge className="bg-green-100 text-green-800 border-green-200">
                            Sent to Parent
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => toast({
                              title: "View Report",
                              description: `Viewing report for ${report.student}`
                            })}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          
                          {!report.adminApproved && (
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => toast({
                                title: "Approve Report",
                                description: `Report for ${report.student} has been approved`
                              })}
                            >
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                            </Button>
                          )}
                          
                          {report.adminApproved && !report.sentToParent && (
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => toast({
                                title: "Send to Parent",
                                description: `Report for ${report.student} has been sent to parent`
                              })}
                            >
                              <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                      {searchQuery ? "No reports match your search" : "No reports found"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
