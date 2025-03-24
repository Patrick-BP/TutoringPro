import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { insertInquirySchema } from "@shared/schema";
import { 
  gradeOptions, 
  subjectOptions, 
  timePreferenceOptions, 
  sessionFrequencyOptions, 
  locationPreferenceOptions, 
  contactPreferenceOptions,
  weekdayOptions,
  isValidEmail,
  isValidPhone
} from "@/lib/utils";

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
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useQueryClient } from "@tanstack/react-query";

// Extend the insert schema with additional validation
const extendedInquirySchema = insertInquirySchema.extend({
  email: z.string().refine(isValidEmail, { message: "Invalid email format" }),
  phone: z.string().optional()
    .refine(val => !val || isValidPhone(val), { message: "Invalid phone number format" }),
  days: z.array(z.string()).min(1, { message: "Please select at least one day" }),
  budget: z.number().min(1, { message: "Budget must be provided" })
});

type InquiryFormValues = z.infer<typeof extendedInquirySchema>;

interface InquiryFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function InquiryForm({ onSuccess, onCancel }: InquiryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InquiryFormValues>({
    resolver: zodResolver(extendedInquirySchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      grade: "",
      subject: "",
      learningNeeds: "",
      days: [],
      timePreference: "",
      sessionFrequency: "1",
      locationPreference: "online",
      budget: 0,
      parentName: "",
      email: "",
      phone: "",
      contactPreference: "email"
    }
  });

  async function onSubmit(data: InquiryFormValues) {
    setIsSubmitting(true);
    try {
      // Convert budget to cents for storage
      const submissionData = {
        ...data,
        budget: data.budget * 100,
      };
      
      await apiRequest("POST", "/api/inquiries", submissionData);
      
      queryClient.invalidateQueries({ queryKey: ["/api/inquiries"] });
      
      toast({
        title: "Inquiry Submitted",
        description: "Your tutoring inquiry has been successfully submitted.",
      });
      
      form.reset();
      onSuccess?.();
    } catch (error) {
      toast({
        title: "Error Submitting Inquiry",
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
        <CardTitle>Submit a Tutoring Inquiry</CardTitle>
        <CardDescription>
          Please fill out the form below to submit your tutoring request. We'll match you with the best tutor for your needs.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className="sm:col-span-3">
                    <FormLabel>Child's First Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem className="sm:col-span-3">
                    <FormLabel>Child's Last Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="grade"
                render={({ field }) => (
                  <FormItem className="sm:col-span-3">
                    <FormLabel>Grade Level</FormLabel>
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
                        {gradeOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem className="sm:col-span-3">
                    <FormLabel>Subject</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a subject" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {subjectOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="learningNeeds"
                render={({ field }) => (
                  <FormItem className="sm:col-span-6">
                    <FormLabel>Learning Needs</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Please describe any specific learning needs or goals..." 
                        className="resize-none" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Schedule & Location */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-4">Schedule Preferences</h4>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="days"
                  render={() => (
                    <FormItem>
                      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-7">
                        {weekdayOptions.map((option) => (
                          <FormField
                            key={option.value}
                            control={form.control}
                            name="days"
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
              </div>
            </div>

            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <FormField
                control={form.control}
                name="timePreference"
                render={({ field }) => (
                  <FormItem className="sm:col-span-3">
                    <FormLabel>Time Preference</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select time of day" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {timePreferenceOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sessionFrequency"
                render={({ field }) => (
                  <FormItem className="sm:col-span-3">
                    <FormLabel>Sessions Per Week</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {sessionFrequencyOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="locationPreference"
                render={({ field }) => (
                  <FormItem className="sm:col-span-3">
                    <FormLabel>Location Preference</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select location preference" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {locationPreferenceOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="budget"
                render={({ field }) => (
                  <FormItem className="sm:col-span-3">
                    <FormLabel>Budget (per hour)</FormLabel>
                    <FormControl>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 sm:text-sm">$</span>
                        </div>
                        <Input
                          type="number"
                          className="pl-7 pr-12"
                          placeholder="0.00"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 sm:text-sm">/hr</span>
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Parent Contact Information */}
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <FormField
                control={form.control}
                name="parentName"
                render={({ field }) => (
                  <FormItem className="sm:col-span-3">
                    <FormLabel>Parent/Guardian Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="sm:col-span-3">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="sm:col-span-3">
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input type="tel" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contactPreference"
                render={({ field }) => (
                  <FormItem className="sm:col-span-3">
                    <FormLabel>Preferred Contact Method</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select contact method" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {contactPreferenceOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
                {isSubmitting ? "Submitting..." : "Submit Inquiry"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
