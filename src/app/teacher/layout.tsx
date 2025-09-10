// src/app/teacher/layout.tsx
import type { PropsWithChildren } from 'react';
import TeacherSidebar from '@/components/layout/TeacherSidebar';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function TeacherLayout({ children }: PropsWithChildren) {
  return (
    <SidebarProvider defaultOpen={true}>
      <TeacherSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 shadow-sm justify-between md:justify-end">
            <div className="md:hidden">
              <SidebarTrigger />
            </div>
            <p className="text-sm text-muted-foreground">Teacher Portal</p>
        </header>
        <ScrollArea className="h-[calc(100vh-4rem)]">
          <main className="flex-1 p-6 md:p-8">
            {children}
          </main>
        </ScrollArea>
      </SidebarInset>
    </SidebarProvider>
  );
}
