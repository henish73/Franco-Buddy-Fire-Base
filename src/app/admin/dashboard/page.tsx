import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import StatCard from '@/components/shared/StatCard';
import { Users, Inbox, BookOpen, BarChart3, ArrowRight } from 'lucide-react';

// Placeholder data - In a real app, this would be fetched from Firestore
const adminStats = {
  demoRequests: 12, // Placeholder
  contactSubmissions: 5, // Placeholder
  totalStudents: 25, // Placeholder
  activeCourses: 3, // Placeholder
};

const quickLinks = [
  { href: "/admin/leads", label: "Manage Leads", icon: Inbox },
  { href: "/admin/students", label: "Manage Students", icon: Users },
  { href: "/admin/courses", label: "Manage Courses", icon: BookOpen },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-primary">Admin Dashboard</h1>
      
      {/* Key Metrics Section */}
      <section>
        <h2 className="text-xl font-semibold text-foreground mb-4">Overview</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatCard title="New Demo Requests" value={adminStats.demoRequests} icon={Inbox} description="Awaiting action" />
          <StatCard title="Contact Submissions" value={adminStats.contactSubmissions} icon={Inbox} description="Needs review" />
          <StatCard title="Total Students" value={adminStats.totalStudents} icon={Users} description="Enrolled" />
          <StatCard title="Active Courses" value={adminStats.activeCourses} icon={BookOpen} description="Currently offered" />
        </div>
      </section>

      {/* Quick Links Section */}
      <section>
        <h2 className="text-xl font-semibold text-foreground mb-4">Quick Links</h2>
        <div className="grid gap-6 md:grid-cols-3">
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
                <Button asChild variant="outline" size="sm" className="w-full">
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
