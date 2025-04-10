import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { insertTutorSchema } from "@shared/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";
import { MultiSelectSubjects } from "../ui/multi-select-subjects";

// Extend the base schema with more specific validation rules
const extendedTutorSchema = insertTutorSchema.extend({
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(10, {
    message: "Phone number must be at least 10 digits.",
  }),
  hourlyRate: z.string().min(1, {
    message: "Please enter an hourly rate.",
  }),
  subjects: z.array(z.string()).min(1, {
    message: "Please select at least one subject.",
  }),
  qualifications: z.string().min(10, {
    message: "Please enter qualifications (min 10 characters).",
  }),
  userId: z.number().optional(),
});

// Define form values type
type TutorFormValues = z.infer<typeof extendedTutorSchema>;

interface TutorFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  userId?: number;
}

// Component for creating or editing a tutor
export default function TutorForm({ onSuccess, onCancel, userId }: TutorFormProps) {
  const queryClient = useQueryClient();

  // Set up form with default values
  const form = useForm<TutorFormValues>({
    resolver: zodResolver(extendedTutorSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      hourlyRate: "",
      subjects: [],
      qualifications: "",
      userId: userId || undefined,
    },
  });

  // Set up mutation for form submission
  const mutation = useMutation({
    mutationFn: async (data: TutorFormValues) => {
      return apiRequest("/api/tutors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      toast({
        title: "Tutor created",
        description: "The tutor has been successfully added.",
      });
      // Invalidate relevant queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["/api/tutors"] });
      if (onSuccess) onSuccess();
    },
    onError: (error) => {
      console.error("Error creating tutor:", error);
      toast({
        title: "Error",
        description: "Failed to create tutor. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Form submission handler
  async function onSubmit(data: TutorFormValues) {
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
                  <Input placeholder="Jane" {...field} />
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
                  <Input placeholder="Smith" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="jane.smith@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input placeholder="555-123-4567" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="hourlyRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hourly Rate ($)</FormLabel>
                <FormControl>
                  <Input placeholder="45.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="subjects"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subjects</FormLabel>
                <FormControl>
                  <MultiSelectSubjects
                    selected={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormDescription>
                  Select all subjects that the tutor can teach
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="qualifications"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Qualifications</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe the tutor's education, credentials, and teaching experience" 
                  className="min-h-[120px]"
                  {...field} 
                />
              </FormControl>
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
            {mutation.isPending ? "Adding..." : "Add Tutor"}
          </Button>
        </div>
      </form>
    </Form>
  );
}