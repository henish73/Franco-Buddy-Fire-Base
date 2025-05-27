// src/components/layout/AdminSidebar.tsx
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Users, BookOpen, Inbox, Settings, LogOut, BookMarked, ExternalLink, ClipboardList, Home, FileText, MessageSquareHeart // Added MessageSquareHeart
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
  SidebarGroupLabel,
  SidebarSeparator
} from '@/components/ui/sidebar'; 
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const adminNavItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/leads', label: 'Lead Management', icon: Inbox },
  { href: '/admin/students', label: 'Student Management', icon: Users },
  { href: '/admin/courses', label: 'Course Management', icon: BookOpen },
  { href: '/admin/enrollments', label: 'Enrollments', icon: ClipboardList },
  { href: '/admin/blog-management', label: 'Blog Management', icon: FileText },
  { href: '/admin/ai-content', label: 'AI Tutor Content', icon: MessageSquareHeart }, // New Link for AI Content
  { href: '/admin/settings', label: 'Site Settings', icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" variant="sidebar" side="left" className="border-r">
      <SidebarHeader className="p-4 items-center justify-center">
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          <BookMarked className="h-7 w-7 text-sidebar-primary" />
          <span className="font-semibold text-lg text-sidebar-primary group-data-[collapsible=icon]:hidden">
            French.GTA Admin
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent className="p-2 flex-grow">
        <SidebarMenu>
          {adminNavItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href))}
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
              <SidebarMenuButton
                asChild
                isActive={pathname === "/"}
                tooltip="Back to Main Content"
              >
                <Link href="/">
                  <Home />
                  <span>Back to Main Content</span>
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
              <AvatarImage src="https://placehold.co/100x100.png" alt="Admin" data-ai-hint="user avatar" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
            <div className="group-data-[collapsible=icon]:hidden">
                <p className="text-sm font-medium text-sidebar-foreground">Admin User</p>
                <p className="text-xs text-sidebar-foreground/70">Henish Patel</p>
            </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
