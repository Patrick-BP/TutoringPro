import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate, formatTime } from "@/lib/utils";
import { Loader2, FileEdit, FileText } from "lucide-react";
import SessionReportForm from "@/components/forms/session-report-form";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function SessionList() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedSession, setSelectedSession] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isReportFormOpen, setIsReportFormOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isReportViewOpen, setIsReportViewOpen] = useState(false);

  // Determine query parameters based on user role
  let queryParams = '';
  if (user) {
    if (user.role === 'tutor') {
      // Assuming we have the tutor's ID stored or can derive it
      queryParams = `?tutorId=${user.id}`;
    } else if (user.role === 'parent') {
      // For parents, we might need a different endpoint/query to get sessions for their students
      // This is a simplified approach
      queryParams = `?parentId=${user.id}`;
    }
  }
  
  // Fetch sessions data
  const { data: sessions, isLoading, isError } = useQuery({
    queryKey: [`/api/sessions${queryParams}`]
  });

  // Define table columns
  const columns = [
    {
      header: "Date & Time",
      accessorKey: "startTime",
      cell: ({ row }) => (
        <div>
          <p className="text-sm font-medium">{formatDate(row.startTime)}</p>
          <p className="text-sm text-gray-500">
            {formatTime(row.startTime)} - {formatTime(row.endTime)}
          </p>
        </div>
      )
    },
    {
      header: "Subject",
      accessorKey: "subject"
    },
    {
      header: "Student",
      accessorKey: "studentId",
      cell: ({ row }) => <span>Student #{row.studentId}</span> // In a real app, you'd fetch and display the student name
    },
    {
      header: "Tutor",
      accessorKey: "tutorId",
      cell: ({ row }) => <span>Tutor #{row.tutorId}</span> // In a real app, you'd fetch and display the tutor name
    },
    {
      header: "Location",
      accessorKey: "location",
      cell: ({ row }) => <span>{row.location || "Not specified"}</span>
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }) => {
        switch (row.status) {
          case "scheduled":
            return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Scheduled</Badge>;
          case "completed":
            return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>;
          case "cancelled":
            return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Cancelled</Badge>;
          default:
            return <Badge variant="outline">{row.status}</Badge>;
        }
      }
    },
    {
      header: "Report",
      accessorKey: "id",
      cell: ({ row }) => {
        // Fetch the report for this session
        const { data: report } = useQuery({
          queryKey: [`/api/reports?sessionId=${row.id}`],
          enabled: row.status === "completed"
        });
        
        if (row.status !== "completed") {
          return <span className="text-gray-400">Not available</span>;
        }
        
        const hasReport = report && report.length > 0;
        
        if (hasReport) {
          return (
            <Button 
              variant="outline" 
              size="sm" 
              className="text-blue-600"
              onClick={() => viewReport(report[0])}
            >
              <FileText className="h-4 w-4 mr-1" />
              View
            </Button>
          );
        }
        
        if (user?.role === 'tutor') {
          return (
            <Button 
              variant="outline" 
              size="sm" 
              className="text-green-600"
              onClick={() => createReport(row)}
            >
              <FileEdit className="h-4 w-4 mr-1" />
              Create
            </Button>
          );
        }
        
        return <span className="text-yellow-600">Pending</span>;
      }
    },
    {
      header: "Actions",
      accessorKey: "id",
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => viewSessionDetails(row)}>
            View
          </Button>
          {user?.role === 'admin' && row.status === 'scheduled' && (
            <Button variant="outline" size="sm" className="text-green-600" onClick={() => markAsCompleted(row)}>
              Complete
            </Button>
          )}
        </div>
      )
    }
  ];

  // Handle viewing session details
  const viewSessionDetails = (session) => {
    setSelectedSession(session);
    setIsDialogOpen(true);
  };

  // Handle creating a report
  const createReport = (session) => {
    setSelectedSession(session);
    setIsReportFormOpen(true);
  };

  // Handle viewing a report
  const viewReport = (report) => {
    setSelectedReport(report);
    setIsReportViewOpen(true);
  };

  // Handle marking a session as completed
  const markAsCompleted = async (session) => {
    try {
      await apiRequest("PATCH", `/api/sessions/${session.id}`, {
        status: "completed"
      });
      
      toast({
        title: "Session Updated",
        description: "The session has been marked as completed.",
      });
      
      // Refresh the sessions data
      window.location.reload();
    } catch (error) {
      toast({
        title: "Error Updating Session",
        description: error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading sessions...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-64 text-red-500">
        Error loading sessions. Please try again.
      </div>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Tutoring Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable 
            columns={columns}
            data={sessions || []}
            pagination={true}
            search={true}
            searchPlaceholder="Search sessions..."
          />
        </CardContent>
      </Card>

      {/* Session Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Session Details</DialogTitle>
            <DialogDescription>
              Detailed information about the tutoring session
            </DialogDescription>
          </DialogHeader>
          
          {selectedSession && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900">Session Information</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    <strong>Date:</strong> {formatDate(selectedSession.startTime)}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    <strong>Time:</strong> {formatTime(selectedSession.startTime)} - {formatTime(selectedSession.endTime)}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    <strong>Subject:</strong> {selectedSession.subject}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    <strong>Status:</strong> {selectedSession.status}
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900">Location</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {selectedSession.location || "Not specified"}
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900">Notes</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {selectedSession.notes || "No notes provided."}
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900">Student Information</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    <strong>Student ID:</strong> {selectedSession.studentId}
                  </p>
                  {/* In a real app, you'd display more student information here */}
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900">Tutor Information</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    <strong>Tutor ID:</strong> {selectedSession.tutorId}
                  </p>
                  {/* In a real app, you'd display more tutor information here */}
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900">Created At</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {formatDate(selectedSession.createdAt)}
                  </p>
                </div>
                
                {user?.role === 'admin' && selectedSession.status === 'scheduled' && (
                  <div className="flex space-x-2 mt-6">
                    <Button 
                      className="ml-auto flex items-center"
                      onClick={() => {
                        setIsDialogOpen(false);
                        markAsCompleted(selectedSession);
                      }}
                    >
                      Mark as Completed
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Report Form Dialog */}
      {selectedSession && (
        <Dialog open={isReportFormOpen} onOpenChange={setIsReportFormOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Create Session Report</DialogTitle>
            </DialogHeader>
            <SessionReportForm 
              sessionId={selectedSession.id}
              onSuccess={() => {
                setIsReportFormOpen(false);
                toast({
                  title: "Report Submitted",
                  description: "Your session report has been submitted successfully."
                });
              }}
              onCancel={() => setIsReportFormOpen(false)}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Report View Dialog */}
      <Dialog open={isReportViewOpen} onOpenChange={setIsReportViewOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Session Report</DialogTitle>
            <DialogDescription>
              Report details for the tutoring session
            </DialogDescription>
          </DialogHeader>
          
          {selectedReport && (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900">Topics Covered</h3>
                <p className="mt-1 text-sm text-gray-700">{selectedReport.topicsCovered}</p>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900">Session Summary</h3>
                <p className="mt-1 text-sm text-gray-700 whitespace-pre-line">{selectedReport.summary}</p>
              </div>
              
              {selectedReport.homeworkAssigned && (
                <div>
                  <h3 className="font-medium text-gray-900">Homework Assigned</h3>
                  <p className="mt-1 text-sm text-gray-700 whitespace-pre-line">{selectedReport.homeworkAssigned}</p>
                </div>
              )}
              
              <div>
                <h3 className="font-medium text-gray-900">Progress Assessment</h3>
                <p className="mt-1 text-sm text-gray-700">{selectedReport.progressAssessment}</p>
              </div>
              
              {user?.role === 'admin' && (
                <div>
                  <h3 className="font-medium text-gray-900">Internal Notes</h3>
                  <p className="mt-1 text-sm text-gray-700 whitespace-pre-line">
                    {selectedReport.internalNotes || "No internal notes provided."}
                  </p>
                </div>
              )}
              
              <div className="pt-2">
                <p className="text-xs text-gray-500">
                  <strong>Status:</strong> {selectedReport.approved ? "Approved" : "Pending Approval"}
                </p>
                <p className="text-xs text-gray-500">
                  <strong>Submitted:</strong> {formatDate(selectedReport.createdAt)}
                </p>
              </div>
            </div>
          )}
          
          <DialogFooter>
            {user?.role === 'admin' && selectedReport && !selectedReport.approved && (
              <Button 
                onClick={async () => {
                  try {
                    await apiRequest("PATCH", `/api/reports/${selectedReport.id}`, {
                      approved: true
                    });
                    
                    toast({
                      title: "Report Approved",
                      description: "The session report has been approved and will be visible to parents."
                    });
                    
                    setIsReportViewOpen(false);
                  } catch (error) {
                    toast({
                      title: "Error Approving Report",
                      description: error instanceof Error ? error.message : "Please try again later.",
                      variant: "destructive"
                    });
                  }
                }}
              >
                Approve Report
              </Button>
            )}
            <Button variant="outline" onClick={() => setIsReportViewOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
