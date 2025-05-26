import type { PropsWithChildren } from 'react';
import StudentNavbar from '@/components/layout/StudentNavbar';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function StudentLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex flex-col min-h-screen">
      <StudentNavbar />
       <ScrollArea className="flex-grow">
        <main className="container mx-auto px-4 py-8 md:py-12">
          {children}
        </main>
      </ScrollArea>
       <footer className="border-t bg-muted/50 py-4 text-center">
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} French.GTA Student Portal
        </p>
      </footer>
    </div>
  );
}
