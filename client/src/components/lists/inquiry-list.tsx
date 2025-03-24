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
  DialogTitle 
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate, getInitials, subjectOptions, gradeOptions } from "@/lib/utils";
import { Loader2, Calendar, PhoneCall } from "lucide-react";
import ScheduleCallForm from "@/components/forms/schedule-call-form";
import { useAuth } from "@/context/auth-context";

export default function InquiryList() {
  const { user } = useAuth();
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSchedulingCall, setIsSchedulingCall] = useState(false);

  // Only fetch parent-specific inquiries if the user is a parent
  const parentQuery = user?.role === 'parent' ? `?parentId=${user.id}` : '';
  
  // Fetch inquiries data
  const { data: inquiries, isLoading, isError } = useQuery({
    queryKey: [`/api/inquiries${parentQuery}`]
  });

  // Get translated subject and grade labels
  const getSubjectLabel = (value) => {
    const subject = subjectOptions.find(s => s.value === value);
    return subject ? subject.label : value;
  };

  const getGradeLabel = (value) => {
    const grade = gradeOptions.find(g => g.value === value);
    return grade ? grade.label : value;
  };

  // Define table columns
  const columns = [
    {
      header: "Student",
      accessorKey: "firstName",
      cell: ({ row }) => (
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
              <span className="text-xs font-medium leading-none text-gray-800">
                {getInitials(`${row.firstName} ${row.lastName}`)}
              </span>
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-gray-900">{`${row.firstName} ${row.lastName}`}</p>
            <p className="truncate text-sm text-gray-500">{getGradeLabel(row.grade)} • {getSubjectLabel(row.subject)}</p>
          </div>
        </div>
      )
    },
    {
      header: "Parent",
      accessorKey: "parentName",
      cell: ({ row }) => (
        <div>
          <p className="text-sm font-medium">{row.parentName}</p>
          <p className="text-sm text-gray-500">{row.email}</p>
        </div>
      )
    },
    {
      header: "Submitted",
      accessorKey: "createdAt",
      cell: ({ row }) => <span className="text-sm">{formatDate(row.createdAt)}</span>
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }) => {
        switch (row.status) {
          case "new":
            return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">New</Badge>;
          case "in_progress":
            return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">In Progress</Badge>;
          case "matched":
            return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Matched</Badge>;
          case "closed":
            return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Closed</Badge>;
          default:
            return <Badge variant="outline">{row.status}</Badge>;
        }
      }
    },
    {
      header: "Actions",
      accessorKey: "id",
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => viewInquiryDetails(row)}>
            View
          </Button>
          {user?.role === 'admin' && row.status !== 'closed' && (
            <Button variant="outline" size="sm" className="text-blue-600" onClick={() => scheduleCall(row)}>
              <PhoneCall className="h-4 w-4 mr-1" />
              Call
            </Button>
          )}
        </div>
      )
    }
  ];

  // Handle viewing inquiry details
  const viewInquiryDetails = (inquiry) => {
    setSelectedInquiry(inquiry);
    setIsDialogOpen(true);
  };

  // Handle scheduling a call
  const scheduleCall = (inquiry) => {
    setSelectedInquiry(inquiry);
    setIsSchedulingCall(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading inquiries...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-64 text-red-500">
        Error loading inquiries. Please try again.
      </div>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Tutoring Inquiries</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable 
            columns={columns}
            data={inquiries || []}
            pagination={true}
            search={true}
            searchPlaceholder="Search inquiries..."
          />
        </CardContent>
      </Card>

      {/* Inquiry Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Inquiry Details</DialogTitle>
            <DialogDescription>
              Detailed information about the tutoring inquiry
            </DialogDescription>
          </DialogHeader>
          
          {selectedInquiry && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900">Student Information</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    <strong>Name:</strong> {selectedInquiry.firstName} {selectedInquiry.lastName}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    <strong>Grade:</strong> {getGradeLabel(selectedInquiry.grade)}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    <strong>Subject:</strong> {getSubjectLabel(selectedInquiry.subject)}
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900">Learning Needs</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {selectedInquiry.learningNeeds || "No specific learning needs provided."}
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900">Parent Information</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    <strong>Name:</strong> {selectedInquiry.parentName}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    <strong>Email:</strong> {selectedInquiry.email}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    <strong>Phone:</strong> {selectedInquiry.phone || "Not provided"}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    <strong>Preferred Contact:</strong> {selectedInquiry.contactPreference}
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900">Schedule Preferences</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    <strong>Days:</strong> {selectedInquiry.days?.join(', ') || "Not specified"}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    <strong>Time of Day:</strong> {selectedInquiry.timePreference || "Not specified"}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    <strong>Sessions per Week:</strong> {selectedInquiry.sessionFrequency || "Not specified"}
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900">Location & Budget</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    <strong>Location Preference:</strong> {selectedInquiry.locationPreference || "Not specified"}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    <strong>Budget:</strong> ${(selectedInquiry.budget / 100).toFixed(2)}/hr
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900">Status Information</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    <strong>Status:</strong> {selectedInquiry.status}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    <strong>Submitted:</strong> {formatDate(selectedInquiry.createdAt)}
                  </p>
                </div>
                
                {user?.role === 'admin' && (
                  <div className="flex space-x-2 mt-6">
                    <Button className="ml-auto flex items-center" onClick={() => {
                      setIsDialogOpen(false);
                      scheduleCall(selectedInquiry);
                    }}>
                      <Calendar className="h-4 w-4 mr-2" />
                      Schedule Parent Call
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Call Scheduling Dialog */}
      {selectedInquiry && (
        <ScheduleCallForm
          open={isSchedulingCall}
          onOpenChange={setIsSchedulingCall}
          inquiryId={selectedInquiry.id}
          parentId={selectedInquiry.parentId}
          adminId={user?.role === 'admin' ? user.id : undefined}
          onSuccess={() => {
            setSelectedInquiry(null);
          }}
        />
      )}
    </>
  );
}
