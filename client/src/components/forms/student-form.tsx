import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { insertStudentSchema } from "@shared/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Extend the base schema with more specific validation rules
const extendedStudentSchema = insertStudentSchema.extend({
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  grade: z.string().min(1, {
    message: "Please select a grade.",
  }),
  school: z.string().optional(),
  parentId: z.number().optional(),
  notes: z.string().optional(),
});

// Define form values type
type StudentFormValues = z.infer<typeof extendedStudentSchema>;

interface StudentFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  parentId?: number;
}

export default function StudentForm({ onSuccess, onCancel, parentId }: StudentFormProps) {
  const queryClient = useQueryClient();

  // Define form with default values
  const form = useForm<StudentFormValues>({
    resolver: zodResolver(extendedStudentSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      grade: "",
      school: "",
      parentId: parentId || 1, // Default to first parent if not provided
      notes: "",
    },
  });

  // Set up the mutation for form submission
  const mutation = useMutation({
    mutationFn: async (data: StudentFormValues) => {
      return apiRequest("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      toast({
        title: "Student created",
        description: "The student has been successfully added.",
      });
      // Invalidate the students query to refresh the data
      queryClient.invalidateQueries({ queryKey: ["/api/students"] });
      if (onSuccess) onSuccess();
    },
    onError: (error) => {
      console.error("Error creating student:", error);
      toast({
        title: "Error",
        description: "Failed to create student. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Form submission handler
  async function onSubmit(data: StudentFormValues) {
    mutation.mutate(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="John" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="grade"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Grade</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a grade" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="K">Kindergarten</SelectItem>
                    <SelectItem value="1">1st Grade</SelectItem>
                    <SelectItem value="2">2nd Grade</SelectItem>
                    <SelectItem value="3">3rd Grade</SelectItem>
                    <SelectItem value="4">4th Grade</SelectItem>
                    <SelectItem value="5">5th Grade</SelectItem>
                    <SelectItem value="6">6th Grade</SelectItem>
                    <SelectItem value="7">7th Grade</SelectItem>
                    <SelectItem value="8">8th Grade</SelectItem>
                    <SelectItem value="9">9th Grade</SelectItem>
                    <SelectItem value="10">10th Grade</SelectItem>
                    <SelectItem value="11">11th Grade</SelectItem>
                    <SelectItem value="12">12th Grade</SelectItem>
                    <SelectItem value="college">College</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="school"
            render={({ field }) => (
              <FormItem>
                <FormLabel>School</FormLabel>
                <FormControl>
                  <Input placeholder="Westside High School" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Any additional information about the student" 
                  className="min-h-[120px]"
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                Include any relevant information about learning style, specific needs, etc.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4">
          {onCancel && (
            <Button variant="outline" type="button" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button 
            type="submit" 
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Adding..." : "Add Student"}
          </Button>
        </div>
      </form>
    </Form>
  );
}