import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Inquiry } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Search, Check, Phone, User, Users } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import ScheduleCallModal from "@/components/scheduling/ScheduleCallModal";

export default function InquiryList() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [filteredInquiries, setFilteredInquiries] = useState<Inquiry[]>([]);
  
  const { data: inquiries, isLoading, error } = useQuery<Inquiry[]>({
    queryKey: ['/api/inquiries'],
  });

  useEffect(() => {
    if (inquiries) {
      setFilteredInquiries(
        inquiries.filter((inquiry) => {
          const searchLower = searchQuery.toLowerCase();
          return (
            inquiry.parentFirstName.toLowerCase().includes(searchLower) ||
            inquiry.parentLastName.toLowerCase().includes(searchLower) ||
            inquiry.studentName.toLowerCase().includes(searchLower) ||
            inquiry.subject.toLowerCase().includes(searchLower) ||
            (inquiry.specificNeeds && inquiry.specificNeeds.toLowerCase().includes(searchLower))
          );
        })
      );
    }
  }, [inquiries, searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge>New</Badge>;
      case 'scheduled':
        return <Badge variant="secondary">Call Scheduled</Badge>;
      case 'matched':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Matched</Badge>;
      case 'completed':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const openScheduleModal = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);
    setIsScheduleModalOpen(true);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "MMM d, yyyy");
    } catch (error) {
      return dateString;
    }
  };

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Inquiries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-500">Failed to load inquiries</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="px-6 py-4 border-b border-gray-200 flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold">Parent Inquiries</CardTitle>
          <Button onClick={() => toast({ title: "New Inquiry", description: "Opening new inquiry form" })}>
            <PlusCircle className="h-4 w-4 mr-2" />
            New Inquiry
          </Button>
        </CardHeader>
        
        <CardContent className="p-6">
          {/* Search and filters */}
          <div className="mb-6">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search inquiries..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>

          {/* Inquiries Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Parent</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  // Loading skeletons
                  Array(5).fill(0).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                    </TableRow>
                  ))
                ) : filteredInquiries && filteredInquiries.length > 0 ? (
                  filteredInquiries.map((inquiry) => (
                    <TableRow key={inquiry.id}>
                      <TableCell>
                        <div className="font-medium">{inquiry.parentFirstName} {inquiry.parentLastName}</div>
                        <div className="text-sm text-gray-500">{inquiry.parentEmail}</div>
                      </TableCell>
                      <TableCell>{inquiry.studentName}</TableCell>
                      <TableCell>
                        <div>{inquiry.subject}</div>
                        {inquiry.specificNeeds && (
                          <div className="text-xs text-gray-500">{inquiry.specificNeeds}</div>
                        )}
                      </TableCell>
                      <TableCell>{formatDate(inquiry.createdAt)}</TableCell>
                      <TableCell>{getStatusBadge(inquiry.status)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                className="h-4 w-4" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                              >
                                <path 
                                  strokeLinecap="round" 
                                  strokeLinejoin="round" 
                                  strokeWidth="2" 
                                  d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" 
                                />
                              </svg>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openScheduleModal(inquiry)}>
                              <Phone className="h-4 w-4 mr-2" />
                              Schedule Call
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toast({ title: "Match Tutor", description: "Opening tutor matching dialog" })}>
                              <Users className="h-4 w-4 mr-2" />
                              Match with Tutor
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toast({ title: "View Details", description: "Opening inquiry details" })}>
                              <User className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toast({ title: "Mark as Completed", description: "Inquiry marked as completed" })}>
                              <Check className="h-4 w-4 mr-2" />
                              Mark Completed
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                      {searchQuery ? "No inquiries match your search" : "No inquiries found"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {selectedInquiry && (
        <ScheduleCallModal
          inquiry={selectedInquiry}
          isOpen={isScheduleModalOpen}
          onClose={() => setIsScheduleModalOpen(false)}
        />
      )}
    </>
  );
}
