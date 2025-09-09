// src/app/admin/dashboard/page.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import StatCard from '@/components/shared/StatCard';
import { Users, Inbox, BookOpen, BarChart3, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { getLeadStatsAction } from '../leads/actions';
import { getStudentCountAction } from '../students/actions';
import { getCourseCountAction } from '../courses/actions';

export default async function AdminDashboardPage() {
  // Fetch real stats using server actions
  const leadStats = await getLeadStatsAction();
  const studentCount = await getStudentCountAction();
  const courseCount = await getCourseCountAction();

  const quickLinks = [
    { href: "/admin/leads", label: "Manage Leads", icon: Inbox },
    { href: "/admin/students", label: "Manage Students", icon: Users },
    { href: "/admin/courses", label: "Manage Courses", icon: BookOpen },
    { href: "/admin/blog-management", label: "Manage Blog", icon: BookOpen },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="relative h-48 rounded-2xl overflow-hidden flex items-center justify-center text-center">
        <Image 
          src="https://picsum.photos/1200/300?random=12"
          alt="Admin Dashboard Banner"
          fill
          className="object-cover"
          data-ai-hint="abstract geometric pattern"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="container relative mx-auto px-4 text-white">
          <h1 className="text-3xl md:text-4xl font-bold">Admin Dashboard</h1>
        </div>
      </section>
      
      {/* Key Metrics Section */}
      <section>
        <h2 className="text-xl font-semibold text-foreground mb-4">Overview</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatCard title="New Demo Requests" value={leadStats.demoRequests} icon={Inbox} description="Awaiting action" />
          <StatCard title="Contact Submissions" value={leadStats.contactSubmissions} icon={Inbox} description="Needs review" />
          <StatCard title="Total Students" value={studentCount} icon={Users} description="Enrolled" />
          <StatCard title="Active Courses" value={courseCount} icon={BookOpen} description="Currently offered" />
        </div>
      </section>

      {/* Quick Links Section */}
      <section>
        <h2 className="text-xl font-semibold text-foreground mb-4">Quick Links</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {quickLinks.map(link => (
            <Card key={link.href} className="shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-medium text-primary">{link.label}</CardTitle>
                <link.icon className="h-6 w-6 text-accent" />
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">Quickly access and manage {link.label.toLowerCase()}.</p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" size="sm" className="w-full rounded-full">
                  <Link href={link.href}>Go to {link.label} <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* Placeholder for more advanced charts or reports */}
      <section>
         <h2 className="text-xl font-semibold text-foreground mb-4">Activity Feed (Placeholder)</h2>
         <Card className="shadow-md">
            <CardHeader>
                <CardTitle className="text-lg">Recent Activities</CardTitle>
                <CardDescription>A log of recent important actions and events.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                    <BarChart3 className="h-12 w-12 mx-auto mb-2"/>
                    <p>Activity feed and detailed analytics will be available in a future update.</p>
                </div>
            </CardContent>
         </Card>
      </section>
    </div>
  );
}
