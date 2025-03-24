import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Invoice } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Search, Eye, DollarSign, FileText, CheckCircle } from "lucide-react";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";

export default function Billing() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  
  const { data: invoices, isLoading } = useQuery<Invoice[]>({
    queryKey: ['/api/invoices'],
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <Badge variant="outline">Draft</Badge>;
      case 'sent':
        return <Badge variant="secondary">Sent</Badge>;
      case 'paid':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Paid</Badge>;
      case 'overdue':
        return <Badge variant="destructive">Overdue</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount / 100);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "MMM d, yyyy");
    } catch (error) {
      return dateString;
    }
  };

  const filteredInvoices = invoices
    ? invoices.filter((invoice) => {
        // Filter by status
        if (filterStatus !== "all" && invoice.status !== filterStatus) {
          return false;
        }
        
        // Filter by search query
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          const tutorString = `${invoice.tutorId}`.toLowerCase();
          const parentString = `${invoice.parentId}`.toLowerCase();
          const amountString = `${formatCurrency(invoice.amount)}`.toLowerCase();
          const descriptionString = invoice.description.toLowerCase();
          
          return (
            tutorString.includes(query) ||
            parentString.includes(query) ||
            amountString.includes(query) ||
            descriptionString.includes(query)
          );
        }
        
        return true;
      })
    : [];

  return (
    <div className="container mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Billing & Invoices</h1>
          <p className="text-gray-500 mt-1">
            Manage invoices, payments, and financial records
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button onClick={() => toast({ title: "New Invoice", description: "Opening invoice creation form" })}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Create Invoice
          </Button>
        </div>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Outstanding</p>
                <h3 className="text-2xl font-bold mt-1">$9,840.50</h3>
              </div>
              <div className="rounded-full p-2 bg-red-100 text-red-600">
                <DollarSign className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-sm font-medium text-red-600">12 overdue</span>
              <span className="text-sm text-gray-500 ml-2">invoices</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500">Paid This Month</p>
                <h3 className="text-2xl font-bold mt-1">$12,450.75</h3>
              </div>
              <div className="rounded-full p-2 bg-green-100 text-green-600">
                <CheckCircle className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-sm font-medium text-green-600">+8.2%</span>
              <span className="text-sm text-gray-500 ml-2">from last month</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500">Pending Invoices</p>
                <h3 className="text-2xl font-bold mt-1">24</h3>
              </div>
              <div className="rounded-full p-2 bg-yellow-100 text-yellow-600">
                <FileText className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-sm font-medium text-yellow-600">$8,720.45</span>
              <span className="text-sm text-gray-500 ml-2">total value</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500">Average Payment Time</p>
                <h3 className="text-2xl font-bold mt-1">7.3 days</h3>
              </div>
              <div className="rounded-full p-2 bg-blue-100 text-blue-600">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-sm font-medium text-green-600">-1.2 days</span>
              <span className="text-sm text-gray-500 ml-2">from last quarter</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="px-6 py-4 border-b border-gray-200 flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold">Invoices</CardTitle>
        </CardHeader>
        
        <CardContent className="p-6">
          {/* Search and filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <form onSubmit={handleSearch} className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search invoices..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
            
            <div className="w-full sm:w-[180px]">
              <Select
                value={filterStatus}
                onValueChange={setFilterStatus}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Invoices Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Parent</TableHead>
                  <TableHead>Tutor</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Issue Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  // Loading skeletons
                  Array(5).fill(0).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                    </TableRow>
                  ))
                ) : filteredInvoices && filteredInvoices.length > 0 ? (
                  filteredInvoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">INV-{invoice.id.toString().padStart(5, '0')}</TableCell>
                      <TableCell>
                        <div className="font-medium">Parent #{invoice.parentId}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">Tutor #{invoice.tutorId}</div>
                      </TableCell>
                      <TableCell>{formatCurrency(invoice.amount)}</TableCell>
                      <TableCell>{formatDate(invoice.createdAt)}</TableCell>
                      <TableCell>{formatDate(invoice.dueDate)}</TableCell>
                      <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => toast({
                              title: "View Invoice",
                              description: `Viewing invoice details for INV-${invoice.id.toString().padStart(5, '0')}`
                            })}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          
                          {invoice.status === "draft" && (
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => toast({
                                title: "Send Invoice",
                                description: `Invoice INV-${invoice.id.toString().padStart(5, '0')} has been sent`
                              })}
                            >
                              <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                            </Button>
                          )}
                          
                          {(invoice.status === "sent" || invoice.status === "overdue") && (
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => toast({
                                title: "Mark as Paid",
                                description: `Invoice INV-${invoice.id.toString().padStart(5, '0')} has been marked as paid`
                              })}
                            >
                              <DollarSign className="h-4 w-4 text-green-600" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-6 text-gray-500">
                      {searchQuery || filterStatus !== "all" 
                        ? "No invoices match your filters" 
                        : "No invoices found"}
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
