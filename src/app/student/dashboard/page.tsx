import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, UserCircle, Bell, CheckSquare } from 'lucide-react';

// Placeholder data
const studentName = "Aisha K."; // Replace with dynamic data later
const enrolledCourses = [
  { id: "tef-pro-clb7", name: "TEF Pro - CLB 7+", progress: 65, nextClass: "Tomorrow, 6 PM: Speaking Practice" },
  // { id: "tef-foundation", name: "TEF Foundation", progress: 100, nextClass: "Completed" },
];

export default function StudentDashboardPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary">Welcome back, {studentName}!</h1>
          <p className="text-muted-foreground">Here&apos;s an overview of your learning journey.</p>
        </div>
        <Button asChild variant="outline">
          <Link href="/student/profile"><UserCircle className="mr-2 h-4 w-4" /> My Profile</Link>
        </Button>
      </div>

      {/* Enrolled Courses Section */}
      <section>
        <h2 className="text-xl font-semibold text-foreground mb-4">My Enrolled Courses</h2>
        {enrolledCourses.length > 0 ? (
          <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6">
            {enrolledCourses.map(course => (
              <Card key={course.id} className="shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl text-primary">{course.name}</CardTitle>
                    <BookOpen className="h-6 w-6 text-accent" />
                  </div>
                  <CardDescription>Your progress and upcoming activities.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm text-muted-foreground mb-1">
                      <span>Progress</span>
                      <span>{course.progress}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div className="bg-primary h-2.5 rounded-full" style={{ width: `${course.progress}%` }}></div>
                    </div>
                  </div>
                  <p className="text-sm"><strong className="text-foreground">Next class/activity:</strong> <span className="text-muted-foreground">{course.nextClass}</span></p>
                </CardContent>
                <CardFooter>
                  <Button variant="default" className="w-full" disabled>Continue Learning (Coming Soon)</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">You are not currently enrolled in any courses.</p>
              <Button asChild>
                <Link href="/courses">Explore Courses</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </section>

      {/* Placeholder for Announcements or Next Steps */}
       <section>
        <h2 className="text-xl font-semibold text-foreground mb-4">Announcements & Next Steps</h2>
        <div className="grid md:grid-cols-2 gap-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-lg font-medium">Recent Announcements</CardTitle>
                    <Bell className="h-5 w-5 text-primary"/>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">No new announcements at this time. Stay tuned!</p>
                    {/* Example Announcement:
                    <div className="border-l-4 border-accent pl-4 py-2 mt-2 bg-accent/10">
                        <h4 className="font-semibold">New Mock Test Available!</h4>
                        <p className="text-xs text-muted-foreground">A new full-length TEF mock test has been added to the "TEF Pro" course resources. Test your skills now!</p>
                    </div>
                    */}
                </CardContent>
            </Card>
            <Card>
                 <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-lg font-medium">Quick Actions</CardTitle>
                    <CheckSquare className="h-5 w-5 text-primary"/>
                </CardHeader>
                <CardContent className="space-y-2">
                     <Button variant="outline" className="w-full justify-start" disabled>View My Schedule (Coming Soon)</Button>
                     <Button variant="outline" className="w-full justify-start" disabled>Access Learning Materials (Coming Soon)</Button>
                     <Button asChild variant="outline" className="w-full justify-start">
                        <Link href="/faq">Visit FAQ</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
      </section>
    </div>
  );
}
