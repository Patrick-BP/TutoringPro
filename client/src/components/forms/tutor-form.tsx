import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { insertTutorSchema } from "@shared/schema";
import { subjectOptions } from "@/lib/utils";

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
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useQueryClient } from "@tanstack/react-query";

// Extend the insert schema with additional validation
const extendedTutorSchema = insertTutorSchema.extend({
  subjects: z.array(z.string()).min(1, { message: "Please select at least one subject" }),
  hourlyRate: z.number().min(1, { message: "Hourly rate must be provided" })
});

type TutorFormValues = z.infer<typeof extendedTutorSchema>;

interface TutorFormProps {
  userId: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function TutorForm({ userId, onSuccess, onCancel }: TutorFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<TutorFormValues>({
    resolver: zodResolver(extendedTutorSchema),
    defaultValues: {
      userId: userId,
      subjects: [],
      availability: {},
      education: "",
      hourlyRate: 0,
      location: "",
      bio: "",
      active: true
    }
  });

  async function onSubmit(data: TutorFormValues) {
    setIsSubmitting(true);
    try {
      await apiRequest("POST", "/api/tutors", data);
      
      queryClient.invalidateQueries({ queryKey: ["/api/tutors"] });
      
      toast({
        title: "Tutor Profile Created",
        description: "The tutor profile has been successfully created.",
      });
      
      form.reset();
      onSuccess?.();
    } catch (error) {
      toast({
        title: "Error Creating Tutor Profile",
        description: error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Tutor Profile</CardTitle>
        <CardDescription>
          Fill out the details to create a new tutor profile in the system.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="subjects"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base">Subjects</FormLabel>
                    <FormDescription>
                      Select all subjects the tutor can teach
                    </FormDescription>
                  </div>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                    {subjectOptions.map((option) => (
                      <FormField
                        key={option.value}
                        control={form.control}
                        name="subjects"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={option.value}
                              className="flex items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(option.value)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, option.value])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== option.value
                                          )
                                        )
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {option.label}
                              </FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="education"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Education</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., B.Sc. Mathematics, University of Example" {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter the tutor's educational qualifications.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hourlyRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hourly Rate ($)</FormLabel>
                  <FormControl>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">$</span>
                      </div>
                      <Input
                        type="number"
                        className="pl-7"
                        placeholder="0.00"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Enter the tutor's hourly rate in dollars.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Downtown, North Side, etc." {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter the area where the tutor is available for in-person sessions.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Biography</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="A brief description of the tutor's experience and teaching style..." 
                      className="min-h-[120px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Enter a brief professional bio for the tutor.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Active
                    </FormLabel>
                    <FormDescription>
                      Indicate if the tutor is currently available for new students.
                    </FormDescription>
                  </div>
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
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Tutor Profile"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
