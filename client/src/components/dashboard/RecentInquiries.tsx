import { useQuery } from "@tanstack/react-query";
import { Inquiry } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

export default function RecentInquiries() {
  const { toast } = useToast();
  const { data: inquiries, isLoading, error } = useQuery<Inquiry[]>({
    queryKey: ['/api/inquiries/recent'],
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge variant="default">New</Badge>;
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

  const handleAction = (action: string, inquiry: Inquiry) => {
    switch (action) {
      case 'schedule':
        toast({
          title: "Schedule",
          description: `Scheduling call for ${inquiry.parentFirstName} ${inquiry.parentLastName}`,
        });
        break;
      case 'view':
        toast({
          title: "View Details",
          description: `Viewing details for ${inquiry.parentFirstName} ${inquiry.parentLastName}`,
        });
        break;
      case 'edit':
        toast({
          title: "Edit",
          description: `Editing inquiry for ${inquiry.parentFirstName} ${inquiry.parentLastName}`,
        });
        break;
      default:
        break;
    }
  };

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Inquiries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-500">Failed to load inquiries</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="px-6 py-4 border-b border-gray-200 flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Recent Inquiries</CardTitle>
        <Link href="/inquiries">
          <a className="text-sm text-primary hover:text-primary-600">View all</a>
        </Link>
      </CardHeader>
      
      <CardContent className="px-0">
        <div className="divide-y divide-gray-200">
          {isLoading ? (
            // Loading skeletons
            Array(4).fill(0).map((_, index) => (
              <div key={index} className="py-4 px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <div className="ml-4">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-40 mt-1" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-6 w-6 rounded-full" />
                  </div>
                </div>
              </div>
            ))
          ) : inquiries && inquiries.length > 0 ? (
            inquiries.map((inquiry) => (
              <div key={inquiry.id} className="py-4 px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
                        {inquiry.parentFirstName.charAt(0)}{inquiry.parentLastName.charAt(0)}
                      </div>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-sm font-medium">{inquiry.parentFirstName} {inquiry.parentLastName}</h4>
                      <p className="text-xs text-gray-500">{inquiry.subject} for {inquiry.studentName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(inquiry.status)}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleAction('view', inquiry)}>
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAction('schedule', inquiry)}>
                          Schedule Call
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAction('edit', inquiry)}>
                          Edit Inquiry
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-6 px-6 text-center text-gray-500">
              No recent inquiries found
            </div>
          )}
        </div>
      </CardContent>
      
      {inquiries && inquiries.length > 0 && (
        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => toast({
              title: "Load More",
              description: "Loading more inquiries...",
            })}
          >
            Load More
          </Button>
        </div>
      )}
    </Card>
  );
}
