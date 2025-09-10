// src/app/teacher/dashboard/page.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import StatCard from '@/components/shared/StatCard';
import { Users, CalendarCheck, BarChart3, ArrowRight } from 'lucide-react';
import Image from 'next/image';

// Placeholder data - this would be fetched dynamically
const teacherName = "Ms. Dubois";
const assignedStudentsCount = 12;
const classesThisWeek = 5;

const quickLinks = [
    { href: "/teacher/attendance", label: "Manage Attendance", icon: CalendarCheck },
    { href: "/teacher/students", label: "View My Students", icon: Users },
];

export default function TeacherDashboardPage() {
  return (
    <div className="space-y-8">
      <section className="relative h-48 rounded-2xl overflow-hidden flex items-center justify-center text-center">
        <Image 
          src="https://picsum.photos/1200/300?random=14"
          alt="Teacher Dashboard Banner"
          fill
          className="object-cover"
          data-ai-hint="classroom teaching environment"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="container relative mx-auto px-4 text-white">
          <h1 className="text-3xl md:text-4xl font-bold">Welcome, {teacherName}!</h1>
          <p className="text-md mt-2">This is your central hub for managing your classes and students.</p>
        </div>
      </section>
      
      <section>
        <h2 className="text-xl font-semibold text-foreground mb-4">Your Overview</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Assigned Students" value={assignedStudentsCount} icon={Users} description="Active students" />
          <StatCard title="Classes This Week" value={classesThisWeek} icon={CalendarCheck} description="Scheduled sessions" />
          {/* Add more stats as features are built out */}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-foreground mb-4">Quick Actions</h2>
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
    </div>
  );
}
