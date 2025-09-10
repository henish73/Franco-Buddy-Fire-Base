// src/components/layout/StudentNavbar.tsx
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, UserCircle, BookOpen, LogOut, BookMarked, Menu, Home, MessageSquareHeart, GraduationCap } from 'lucide-react'; // Added GraduationCap
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';
import { Logo } from '../icons/Logo';

const studentNavLinks = [
  { href: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/student/ai-tutor', label: 'AI Tutor', icon: MessageSquareHeart },
  { href: '/student/profile', label: 'My Profile', icon: UserCircle },
  { href: '/teacher/dashboard', label: 'Teacher Portal', icon: GraduationCap }, // Added teacher portal link
  { href: '/', label: 'Back to Main Content', icon: Home },
];

export default function StudentNavbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <Link href="/student/dashboard" className="flex items-center gap-2">
          <Logo className="h-7 w-7 text-primary" />
          <span className="font-bold text-xl text-primary">FrancoBuddy Student</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          {studentNavLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "transition-colors hover:text-foreground/80 flex items-center gap-2",
                (pathname === link.href || (link.href !== '/student/dashboard' && pathname.startsWith(link.href)))
                 ? "text-foreground font-semibold" : "text-foreground/60"
              )}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
           <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="https://placehold.co/100x100.png" alt="Student Avatar" data-ai-hint="student avatar" />
                  <AvatarFallback>ST</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Student Name</p> {/* Placeholder */}
                  <p className="text-xs leading-none text-muted-foreground">
                    student@example.com {/* Placeholder */}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/student/profile"><UserCircle className="mr-2 h-4 w-4" /> Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem> {/* Implement logout */}
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[360px]">
              <div className="flex flex-col p-6 gap-6">
                <Link href="/student/dashboard" className="flex items-center gap-2 mb-4">
                  <Logo className="h-7 w-7 text-primary" />
                  <span className="font-bold text-lg">FrancoBuddy Student</span>
                </Link>
                {studentNavLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                     className={cn(
                        "text-lg transition-colors hover:text-foreground/80 flex items-center gap-3 py-2",
                        (pathname === link.href || (link.href !== '/student/dashboard' && pathname.startsWith(link.href)))
                        ? "text-foreground font-semibold" : "text-foreground/60"
                    )}
                  >
                    <link.icon className="h-5 w-5" />
                    {link.label}
                  </Link>
                ))}
                <Button variant="outline" className="mt-4"> {/* Implement logout */}
                  <LogOut className="mr-2 h-4 w-4" /> Logout
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
