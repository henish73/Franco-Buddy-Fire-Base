// src/app/admin/site-management/page.tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, FileText, Settings, MessageSquareHeart } from "lucide-react";
import AdminCoursesPage from './courses/page';
import AdminBlogManagementPage from './blog-management/page';
import AdminAIContentPage from './ai-content/page';
import AdminSettingsPage from './settings/page';

export default function SiteManagementPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-primary">Site Management</h1>
      <p className="text-muted-foreground">
        Manage all content and configuration for the public-facing website and AI tools from here.
      </p>
      
      <Tabs defaultValue="courses" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="courses"><BookOpen className="mr-2 h-4 w-4"/>Courses</TabsTrigger>
          <TabsTrigger value="blog"><FileText className="mr-2 h-4 w-4"/>Blog</TabsTrigger>
          <TabsTrigger value="ai_content"><MessageSquareHeart className="mr-2 h-4 w-4"/>AI Content</TabsTrigger>
          <TabsTrigger value="settings"><Settings className="mr-2 h-4 w-4"/>Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="courses" className="mt-6">
          <AdminCoursesPage />
        </TabsContent>
        <TabsContent value="blog" className="mt-6">
          <AdminBlogManagementPage />
        </TabsContent>
        <TabsContent value="ai_content" className="mt-6">
          <AdminAIContentPage />
        </TabsContent>
         <TabsContent value="settings" className="mt-6">
          <AdminSettingsPage />
        </TabsContent>
      </Tabs>
    </div>
  );
}
