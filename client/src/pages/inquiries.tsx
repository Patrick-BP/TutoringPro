import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InquiryForm from "@/components/inquiries/InquiryForm";
import InquiryList from "@/components/inquiries/InquiryList";

export default function Inquiries() {
  const [activeTab, setActiveTab] = useState("list");
  
  return (
    <div className="container mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Parent Inquiries</h1>
        <p className="text-gray-500 mt-1">
          Manage inquiries and schedule initial consultations
        </p>
      </div>
      
      <Tabs defaultValue="list" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">Inquiry List</TabsTrigger>
          <TabsTrigger value="new">New Inquiry</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list" className="space-y-4">
          <InquiryList />
        </TabsContent>
        
        <TabsContent value="new" className="space-y-4">
          <InquiryForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
