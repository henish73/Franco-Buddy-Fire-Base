// src/app/admin/layout.tsx
import type { PropsWithChildren } from 'react';
import AdminSidebar from '@/components/layout/AdminSidebar';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function AdminLayout({ children }: PropsWithChildren) {
  return (
    <SidebarProvider defaultOpen={true}>
      <AdminSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 shadow-sm justify-between md:justify-end">
            {/* Placeholder for Admin Header content, e.g., search, notifications, user menu */}
            {/* Trigger is typically used if sidebar is collapsible by header button */}
            <div className="md:hidden">
              <SidebarTrigger />
            </div>
            <p className="text-sm text-muted-foreground">Admin Panel</p>
        </header>
        <ScrollArea className="h-[calc(100vh-4rem)]"> {/* Adjust height based on header */}
          <main className="flex-1 p-6 md:p-8">
            {children}
          </main>
        </ScrollArea>
      </SidebarInset>
    </SidebarProvider>
  );
}
