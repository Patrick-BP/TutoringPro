import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { insertInvoiceSchema, insertInvoiceItemSchema } from "@shared/schema";
import { useQuery, useQueryClient } from "@tanstack/react-query";

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
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Trash2 } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import { addDays } from "date-fns";

// Extend the insert schema with additional validation
const extendedInvoiceSchema = insertInvoiceSchema.extend({
  amount: z.number().min(1, { message: "Amount must be greater than 0" }),
  tutorId: z.number().min(1, { message: "Tutor must be selected" }),
  parentId: z.number().min(1, { message: "Parent must be selected" }),
  description: z.string().min(5, { message: "Description must be at least 5 characters" }),
  dueDate: z.date({
    required_error: "Due date is required",
  }),
});

// Define a schema for invoice items
const invoiceItemSchema = insertInvoiceItemSchema.extend({
  description: z.string().min(3, { message: "Description must be at least 3 characters" }),
  amount: z.number().min(1, { message: "Amount must be greater than 0" }),
  quantity: z.number().min(1, { message: "Quantity must be at least 1" }),
});

// Add items array to the invoice schema
const formSchema = extendedInvoiceSchema.extend({
  items: z.array(invoiceItemSchema).min(1, { message: "At least one item is required" }),
});

type InvoiceFormValues = z.infer<typeof formSchema>;

// Default empty invoice item
const emptyItem = {
  invoiceId: 0, // Will be updated after invoice creation
  description: "",
  amount: 0,
  quantity: 1,
  sessionId: null
};

interface InvoiceFormProps {
  tutorId?: number;
  parentId?: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function InvoiceForm({ tutorId, parentId, onSuccess, onCancel }: InvoiceFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch tutors for dropdown
  const { data: tutors } = useQuery({
    queryKey: ["/api/tutors"],
    enabled: !tutorId
  });

  // Fetch parents (users with role=parent) for dropdown
  const { data: parents } = useQuery({
    queryKey: ["/api/users?role=parent"],
    enabled: !parentId
  });

  // Set up form with default values
  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tutorId: tutorId || 0,
      parentId: parentId || 0,
      amount: 0, // Will be calculated from items
      description: "Tutoring Services",
      dueDate: addDays(new Date(), 14),
      items: [{ ...emptyItem }]
    }
  });

  // Watch items to calculate total
  const items = form.watch("items");
  
  // Calculate total amount from items
  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + (item.amount * item.quantity), 0);
  };

  // Update total amount when items change
  React.useEffect(() => {
    const total = calculateTotal();
    form.setValue("amount", total);
  }, [items]);

  // Add a new invoice item
  const addItem = () => {
    const currentItems = form.getValues("items");
    form.setValue("items", [...currentItems, { ...emptyItem }]);
  };

  // Remove an invoice item
  const removeItem = (index: number) => {
    const currentItems = form.getValues("items");
    if (currentItems.length > 1) {
      form.setValue("items", currentItems.filter((_, i) => i !== index));
    } else {
      toast({
        title: "Cannot Remove Item",
        description: "An invoice must have at least one item.",
        variant: "destructive"
      });
    }
  };

  async function onSubmit(data: InvoiceFormValues) {
    setIsSubmitting(true);
    try {
      // First create the invoice
      const invoiceData = {
        tutorId: data.tutorId,
        parentId: data.parentId,
        amount: data.amount,
        description: data.description,
        dueDate: data.dueDate.toISOString()
      };

      const invoice = await apiRequest("POST", "/api/invoices", invoiceData);
      const invoiceResponse = await invoice.json();
      
      // Then create each invoice item with the new invoice ID
      for (const item of data.items) {
        await apiRequest("POST", "/api/invoice-items", {
          ...item,
          invoiceId: invoiceResponse.id
        });
      }
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["/api/invoices"] });
      
      toast({
        title: "Invoice Created",
        description: "The invoice has been successfully created.",
      });
      
      form.reset();
      onSuccess?.();
    } catch (error) {
      toast({
        title: "Error Creating Invoice",
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
        <CardTitle>Create Invoice</CardTitle>
        <CardDescription>
          Create a new invoice for tutoring services.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {!tutorId && (
                <FormField
                  control={form.control}
                  name="tutorId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tutor</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(parseInt(value))}
                        defaultValue={field.value ? field.value.toString() : undefined}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a tutor" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {tutors?.map((tutor) => (
                            <SelectItem key={tutor.id} value={tutor.id.toString()}>
                              {tutor.id} {/* In a real app, we'd display tutor name */}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {!parentId && (
                <FormField
                  control={form.control}
                  name="parentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Parent</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(parseInt(value))}
                        defaultValue={field.value ? field.value.toString() : undefined}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a parent" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {parents?.map((parent) => (
                            <SelectItem key={parent.id} value={parent.id.toString()}>
                              {parent.fullName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Invoice Description</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      A brief description of what this invoice is for.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due Date</FormLabel>
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
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Amount ($)</FormLabel>
                    <FormControl>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 sm:text-sm">$</span>
                        </div>
                        <Input
                          type="text"
                          className="pl-7"
                          value={calculateTotal().toFixed(2)}
                          disabled
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Total is calculated from invoice items.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Invoice Items</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addItem}
                >
                  Add Item
                </Button>
              </div>

              {items.map((_, index) => (
                <div 
                  key={index} 
                  className="grid grid-cols-1 gap-4 p-4 border rounded-lg sm:grid-cols-12 relative"
                >
                  <FormField
                    control={form.control}
                    name={`items.${index}.description`}
                    render={({ field }) => (
                      <FormItem className="sm:col-span-6">
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Math tutoring session" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`items.${index}.quantity`}
                    render={({ field }) => (
                      <FormItem className="sm:col-span-2">
                        <FormLabel>Quantity</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`items.${index}.amount`}
                    render={({ field }) => (
                      <FormItem className="sm:col-span-3">
                        <FormLabel>Amount ($)</FormLabel>
                        <FormControl>
                          <div className="relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <span className="text-gray-500 sm:text-sm">$</span>
                            </div>
                            <Input
                              type="number"
                              className="pl-7"
                              placeholder="0.00"
                              min="0"
                              step="0.01"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex items-end sm:col-span-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(index)}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
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
                {isSubmitting ? "Creating..." : "Create Invoice"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
