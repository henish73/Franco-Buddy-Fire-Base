// src/components/layout/TeacherSidebar.tsx
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Users, CalendarCheck, LogOut, ExternalLink, Home
} from 'lucide-react';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarSeparator
} from '@/components/ui/sidebar'; 
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Logo } from '../icons/Logo';

const teacherNavItems = [
  { href: '/teacher/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/teacher/attendance', label: 'Attendance', icon: CalendarCheck },
  { href: '/teacher/students', label: 'My Students', icon: Users },
];

export default function TeacherSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" variant="sidebar" side="left" className="border-r">
      <SidebarHeader className="p-4 items-center justify-center">
        <Link href="/teacher/dashboard" className="flex items-center gap-2">
          <Logo className="h-7 w-7 text-sidebar-primary" />
          <span className="font-semibold text-lg text-sidebar-primary group-data-[collapsible=icon]:hidden">
            Teacher Portal
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent className="p-2 flex-grow">
        <SidebarMenu>
          {teacherNavItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href || (item.href !== '/teacher/dashboard' && pathname.startsWith(item.href))}
                tooltip={item.label}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Back to Main Site">
              <Link href="/">
                <Home />
                <span>Main Site</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>

      <SidebarSeparator />

      <SidebarFooter className="p-4">
        <SidebarGroup>
            <SidebarMenuButton asChild tooltip="View Public Site">
                <Link href="/" target="_blank">
                    <ExternalLink/>
                    <span>View Site</span>
                </Link>
            </SidebarMenuButton>
            <SidebarMenuButton tooltip="Logout"> {/* Implement logout functionality */}
                <LogOut />
                <span>Logout</span>
            </SidebarMenuButton>
        </SidebarGroup>
        <div className="flex items-center gap-3 p-2 mt-4 group-data-[collapsible=icon]:justify-center">
            <Avatar className="h-9 w-9">
              <AvatarImage src="https://placehold.co/100x100.png" alt="Teacher" data-ai-hint="teacher avatar" />
              <AvatarFallback>T</AvatarFallback>
            </Avatar>
            <div className="group-data-[collapsible=icon]:hidden">
                <p className="text-sm font-medium text-sidebar-foreground">Teacher Name</p>
                <p className="text-xs text-sidebar-foreground/70">instructor@francobuddy.com</p>
            </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
