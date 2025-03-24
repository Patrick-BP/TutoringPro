import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tutor } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Search, Eye, Edit, Trash } from "lucide-react";

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

export default function Tutors() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: tutors, isLoading } = useQuery<Tutor[]>({
    queryKey: ['/api/tutors'],
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Search",
      description: `Searching for tutors: ${searchQuery}`,
    });
  };

  return (
    <div className="container mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Tutors</h1>
          <p className="text-gray-500 mt-1">
            Manage your tutor database and assignments
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button onClick={() => toast({ title: "New Tutor", description: "Opening tutor registration form" })}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add New Tutor
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader className="px-6 py-4 border-b border-gray-200 flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold">Tutor Directory</CardTitle>
        </CardHeader>
        
        <CardContent className="p-6">
          {/* Search and filters */}
          <div className="mb-6">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search tutors by name, subject, or location..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>

          {/* Tutors Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Subjects</TableHead>
                  <TableHead>Rate</TableHead>
                  <TableHead>Location</TableHead>
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
                      <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                    </TableRow>
                  ))
                ) : tutors && tutors.length > 0 ? (
                  // We would map the actual tutors here in a real implementation
                  [
                    { id: 1, firstName: "Michael", lastName: "Turner", subjects: ["Mathematics", "Physics"], hourlyRate: "$50", location: "Online", isActive: true },
                    { id: 2, firstName: "Lisa", lastName: "Wright", subjects: ["English", "Literature"], hourlyRate: "$45", location: "South Area", isActive: true },
                    { id: 3, firstName: "David", lastName: "Scott", subjects: ["Chemistry", "Biology"], hourlyRate: "$55", location: "North Area", isActive: true },
                    { id: 4, firstName: "Sarah", lastName: "Chen", subjects: ["Computer Science", "Mathematics"], hourlyRate: "$60", location: "Online", isActive: false },
                    { id: 5, firstName: "James", lastName: "Wilson", subjects: ["History", "Social Studies"], hourlyRate: "$40", location: "West Area", isActive: true },
                  ].map((tutor) => (
                    <TableRow key={tutor.id}>
                      <TableCell>
                        <div className="font-medium">{tutor.firstName} {tutor.lastName}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {tutor.subjects.map((subject, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {subject}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>{tutor.hourlyRate}</TableCell>
                      <TableCell>{tutor.location}</TableCell>
                      <TableCell>
                        {tutor.isActive ? (
                          <Badge className="bg-green-100 text-green-800 border-green-200">
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            Inactive
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => toast({
                              title: "View Tutor",
                              description: `Viewing ${tutor.firstName} ${tutor.lastName}'s profile`
                            })}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => toast({
                              title: "Edit Tutor",
                              description: `Editing ${tutor.firstName} ${tutor.lastName}'s profile`
                            })}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => toast({
                              title: "Delete Tutor",
                              description: `Are you sure you want to delete ${tutor.firstName} ${tutor.lastName}?`,
                              variant: "destructive"
                            })}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                      {searchQuery ? "No tutors match your search" : "No tutors found"}
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
