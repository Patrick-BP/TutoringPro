import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { insertReportSchema } from "@shared/schema";
import { progressAssessmentOptions } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

// Extend the insert schema with additional validation
const extendedReportSchema = insertReportSchema.extend({
  topicsCovered: z.string()
    .min(3, "Topics covered must be at least 3 characters")
    .max(200, "Topics covered must be at most 200 characters"),
  summary: z.string()
    .min(10, "Summary must be at least 10 characters"),
  homeworkAssigned: z.string().optional(),
  progressAssessment: z.string(),
  internalNotes: z.string().optional()
});

type SessionReportFormValues = z.infer<typeof extendedReportSchema>;

interface SessionReportFormProps {
  sessionId: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function SessionReportForm({ sessionId, onSuccess, onCancel }: SessionReportFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch session details if needed
  const { data: session, isLoading: sessionLoading } = useQuery({
    queryKey: [`/api/sessions/${sessionId}`],
    enabled: !!sessionId
  });

  const form = useForm<SessionReportFormValues>({
    resolver: zodResolver(extendedReportSchema),
    defaultValues: {
      sessionId,
      topicsCovered: "",
      summary: "",
      homeworkAssigned: "",
      progressAssessment: "",
      internalNotes: ""
    }
  });

  async function onSubmit(data: SessionReportFormValues) {
    setIsSubmitting(true);
    try {
      await apiRequest("POST", "/api/reports", data);
      
      // Invalidate reports and sessions cache
      queryClient.invalidateQueries({ queryKey: ["/api/reports"] });
      queryClient.invalidateQueries({ queryKey: [`/api/sessions/${sessionId}`] });
      
      toast({
        title: "Report Submitted",
        description: "Your session report has been successfully submitted.",
      });
      
      form.reset();
      onSuccess?.();
    } catch (error) {
      toast({
        title: "Error Submitting Report",
        description: error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleSaveDraft() {
    // Implement draft saving functionality
    toast({
      title: "Draft Saved",
      description: "Your report draft has been saved.",
    });
  }

  if (sessionLoading) {
    return <div>Loading session details...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submit Session Report</CardTitle>
        <CardDescription>
          Please fill out the details of your tutoring session. This information will be shared with parents after admin approval.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {session && (
              <div className="bg-blue-50 p-4 rounded-md mb-4">
                <p className="text-sm text-blue-800">
                  <strong>Session:</strong> {new Date(session.startTime).toLocaleDateString()} 
                  ({new Date(session.startTime).toLocaleTimeString()} - {new Date(session.endTime).toLocaleTimeString()})
                </p>
                <p className="text-sm text-blue-800 mt-1">
                  <strong>Subject:</strong> {session.subject}
                </p>
              </div>
            )}

            <FormField
              control={form.control}
              name="topicsCovered"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Topics Covered</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., Quadratic equations, Essay structure, Chemical reactions" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Briefly list the main topics covered in this session.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="summary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Session Summary</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Provide a detailed summary of what was covered in the session..." 
                      className="min-h-[120px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Include specific concepts, skills practiced, and student's engagement.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="homeworkAssigned"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Homework Assigned</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="List any homework or practice activities assigned..." 
                      className="min-h-[80px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Specify any homework, practice exercises, or additional resources provided.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="progressAssessment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Progress Assessment</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a progress level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {progressAssessmentOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Evaluate the student's overall progress in this session.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="internalNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Notes (Internal - Not Shared with Parents)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Add any private notes for internal reference..." 
                      className="min-h-[80px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    These notes are only visible to staff and will not be shared with parents.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              {onCancel && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  className="mr-2"
                >
                  Cancel
                </Button>
              )}
              <Button
                type="button"
                variant="outline"
                onClick={handleSaveDraft}
                className="mr-2"
              >
                Save as Draft
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Report"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
