import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Student } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Search, Eye, Edit, Trash } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Students() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: students, isLoading } = useQuery<Student[]>({
    queryKey: ['/api/students'],
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Search",
      description: `Searching for students: ${searchQuery}`,
    });
  };

  return (
    <div className="container mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Students</h1>
          <p className="text-gray-500 mt-1">
            Manage student profiles and tutoring sessions
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button onClick={() => toast({ title: "New Student", description: "Opening student registration form" })}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add New Student
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader className="px-6 py-4 border-b border-gray-200 flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold">Student Directory</CardTitle>
        </CardHeader>
        
        <CardContent className="p-6">
          {/* Search and filters */}
          <div className="mb-6">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search students by name, grade, or parent..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>

          {/* Students Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Parent</TableHead>
                  <TableHead>Subjects</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  // Loading skeletons
                  Array(5).fill(0).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-40" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                    </TableRow>
                  ))
                ) : students && students.length > 0 ? (
                  // Sample data for demonstration
                  [
                    { id: 1, firstName: "Jack", lastName: "Smith", grade: "10th Grade", parent: "Robert Smith", subjects: ["Mathematics", "Physics"] },
                    { id: 2, firstName: "Alice", lastName: "Davis", grade: "8th Grade", parent: "Emily Davis", subjects: ["English", "Literature"] },
                    { id: 3, firstName: "Robert", lastName: "Johnson", grade: "12th Grade", parent: "Michael Johnson", subjects: ["Chemistry", "AP Physics"] },
                    { id: 4, firstName: "Emma", lastName: "Wilson", grade: "9th Grade", parent: "Daniel Wilson", subjects: ["Spanish", "History"] },
                    { id: 5, firstName: "Tyler", lastName: "Brown", grade: "11th Grade", parent: "Jennifer Brown", subjects: ["Mathematics", "Computer Science"] },
                  ].map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>
                        <div className="font-medium">{student.firstName} {student.lastName}</div>
                      </TableCell>
                      <TableCell>{student.grade}</TableCell>
                      <TableCell>{student.parent}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {student.subjects.join(", ")}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => toast({
                              title: "View Student",
                              description: `Viewing ${student.firstName} ${student.lastName}'s profile`
                            })}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => toast({
                              title: "Edit Student",
                              description: `Editing ${student.firstName} ${student.lastName}'s profile`
                            })}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => toast({
                              title: "Delete Student",
                              description: `Are you sure you want to delete ${student.firstName} ${student.lastName}?`,
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
                    <TableCell colSpan={5} className="text-center py-6 text-gray-500">
                      {searchQuery ? "No students match your search" : "No students found"}
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
