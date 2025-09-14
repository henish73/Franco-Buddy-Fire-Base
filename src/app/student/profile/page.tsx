// src/app/student/profile/page.tsx
import { UserCog, User, Mail, Phone, BookOpen } from 'lucide-react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

// Placeholder for the currently logged-in student's data
// In a real app, this would be fetched from a session or context
const studentData = {
  firstName: "Aisha",
  lastName: "K.",
  email: "aisha@example.com",
  phone: "555-123-4567",
  enrolledCourse: "TEF Pro - CLB 7+",
  status: "Active",
};

export default function StudentProfilePage() {
  return (
    <div className="space-y-8">
      <section className="relative h-64 rounded-2xl overflow-hidden flex items-center justify-center text-center">
        <Image 
          src="https://picsum.photos/1200/300?random=13"
          alt="Student profile settings"
          fill
          className="object-cover"
          data-ai-hint="profile settings abstract"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="container relative mx-auto px-4 text-white flex flex-col items-center">
          <UserCog className="h-16 w-16 mb-4" />
          <h1 className="text-3xl md:text-4xl font-bold">My Profile</h1>
          <p className="text-md md:text-lg mt-2">View your personal information and account status.</p>
        </div>
      </section>
      
      <div className='max-w-2xl mx-auto'>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-primary">Your Information</CardTitle>
            <CardDescription>
              This is your information on file. To make changes, please contact an administrator.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <User className="h-5 w-5 text-muted-foreground" />
              <div className="flex-grow">
                <Label className="text-xs text-muted-foreground">Full Name</Label>
                <p className="font-medium text-foreground">{studentData.firstName} {studentData.lastName}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div className="flex-grow">
                <Label className="text-xs text-muted-foreground">Email</Label>
                <p className="font-medium text-foreground">{studentData.email}</p>
              </div>
            </div>
             <div className="flex items-center gap-4">
              <Phone className="h-5 w-5 text-muted-foreground" />
              <div className="flex-grow">
                <Label className="text-xs text-muted-foreground">Phone</Label>
                <p className="font-medium text-foreground">{studentData.phone}</p>
              </div>
            </div>
             <div className="flex items-center gap-4">
              <BookOpen className="h-5 w-5 text-muted-foreground" />
              <div className="flex-grow">
                <Label className="text-xs text-muted-foreground">Enrolled Course</Label>
                <p className="font-medium text-foreground">{studentData.enrolledCourse}</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4">
            <Button asChild variant="outline">
              <Link href="/contact">Contact Support to Make Changes</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
