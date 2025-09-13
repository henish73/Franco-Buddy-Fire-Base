// src/components/layout/AdminSidebar.tsx
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Users, BookOpen, Settings, LogOut, Home, Wallet, GraduationCap
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

const adminNavItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/finance-management', label: 'Finance', icon: Wallet },
  { href: '/admin/student-management', label: 'Students', icon: Users },
  { href: '/admin/teacher-management', label: 'Teachers', icon: GraduationCap },
  { href: '/admin/site-management', label: 'Site Management', icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" variant="sidebar" side="left" className="border-r">
      <SidebarHeader className="p-4 items-center justify-center">
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          <Logo className="h-7 w-7 text-sidebar-primary" />
          <span className="font-semibold text-lg text-sidebar-primary group-data-[collapsible=icon]:hidden">
            FrancoBuddy Admin
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
           <SidebarSeparator />
           <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith("/teacher")}
                tooltip="Teacher Portal"
              >
                <Link href="/teacher/dashboard">
                  <GraduationCap />
                  <span>Teacher Portal</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
           <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === "/"}
                tooltip="Back to Public Site"
              >
                <Link href="/">
                  <Home />
                  <span>Public Site</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>

      <SidebarSeparator />

      <SidebarFooter className="p-4">
        <SidebarGroup>
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
