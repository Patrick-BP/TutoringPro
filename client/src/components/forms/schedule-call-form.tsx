import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { insertCallSchema } from "@shared/schema";

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
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import { addDays } from "date-fns";

// Extend the insert schema with additional validation
const callSchema = z.object({
  date: z.date({
    required_error: "Please select a date for the call.",
  }).min(new Date(), {
    message: "Call date must be in the future.",
  }),
  time: z.string({
    required_error: "Please select a time for the call.",
  }),
  inquiryId: z.number().optional(),
  parentId: z.number().optional(),
  adminId: z.number().optional(),
  notes: z.string().optional(),
});

type ScheduleCallFormValues = z.infer<typeof callSchema>;

interface ScheduleCallFormProps {
  inquiryId?: number;
  parentId?: number;
  adminId?: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export default function ScheduleCallForm({ 
  inquiryId, 
  parentId, 
  adminId, 
  open, 
  onOpenChange, 
  onSuccess 
}: ScheduleCallFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const timeSlots = [
    "9:00 AM", "10:00 AM", "11:00 AM", 
    "1:00 PM", "2:00 PM", "3:00 PM", 
    "4:00 PM", "5:00 PM", "6:00 PM"
  ];

  const form = useForm<ScheduleCallFormValues>({
    resolver: zodResolver(callSchema),
    defaultValues: {
      date: addDays(new Date(), 1),
      time: "",
      inquiryId,
      parentId,
      adminId,
      notes: ""
    },
  });

  async function onSubmit(values: ScheduleCallFormValues) {
    setIsSubmitting(true);
    try {
      // Combine date and time to create a Date object
      const [hours, minutes, period] = values.time.match(/(\d+):(\d+)\s+([AP]M)/).slice(1);
      const selectedDate = new Date(values.date);
      
      let hour = parseInt(hours);
      if (period === "PM" && hour !== 12) hour += 12;
      if (period === "AM" && hour === 12) hour = 0;
      
      selectedDate.setHours(hour, parseInt(minutes), 0);
      
      // Create the call data
      const callData = {
        inquiryId: values.inquiryId || null,
        parentId: values.parentId || null,
        adminId: values.adminId || null,
        date: selectedDate.toISOString(),
        notes: values.notes,
        duration: 30 // Default to 30 minute calls
      };

      await apiRequest("POST", "/api/calls", callData);
      
      // Invalidate calls cache
      queryClient.invalidateQueries({ queryKey: ["/api/calls"] });
      
      toast({
        title: "Call Scheduled",
        description: `Your call has been scheduled for ${formatDate(selectedDate)} at ${values.time}.`,
      });
      
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      toast({
        title: "Error Scheduling Call",
        description: error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Schedule a Parent Call</DialogTitle>
          <DialogDescription>
            Select a date and time for your call with our tutoring coordinator.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            formatDate(field.value)
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time</FormLabel>
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map((time) => (
                      <Button
                        key={time}
                        type="button"
                        variant={field.value === time ? "default" : "outline"}
                        className="py-2 px-2"
                        onClick={() => form.setValue("time", time)}
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any specific topics you'd like to discuss..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Scheduling..." : "Confirm"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
