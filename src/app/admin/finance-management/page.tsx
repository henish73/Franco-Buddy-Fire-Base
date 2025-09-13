// src/app/admin/finance-management/page.tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClipboardList, Inbox } from "lucide-react";
import AdminLeadsPage from './leads/page';
import AdminEnrollmentsPage from './enrollments/page';

export default function FinanceManagementPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-primary">Finance & Sales Management</h1>
      <p className="text-muted-foreground">
        Track new leads from contact and demo forms, and manage student enrollments.
      </p>
      
      <Tabs defaultValue="leads" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:max-w-md">
          <TabsTrigger value="leads"><Inbox className="mr-2 h-4 w-4"/>Leads</TabsTrigger>
          <TabsTrigger value="enrollments"><ClipboardList className="mr-2 h-4 w-4"/>Enrollments</TabsTrigger>
        </TabsList>
        <TabsContent value="leads" className="mt-6">
          <AdminLeadsPage />
        </TabsContent>
        <TabsContent value="enrollments" className="mt-6">
          <AdminEnrollmentsPage />
        </TabsContent>
      </Tabs>
    </div>
  );
}
