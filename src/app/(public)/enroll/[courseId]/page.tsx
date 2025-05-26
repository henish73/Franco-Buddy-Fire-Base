// src/app/(public)/enroll/[courseId]/page.tsx
import SectionTitle from '@/components/shared/SectionTitle';
import EnrollmentForm from './EnrollmentForm';
import { coursesData } from '@/app/(public)/courses/mockCoursesData'; // Using a shared mock data for now
import { type Course } from '@/components/shared/CourseCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

// In a real app, fetch course details from a service/API
async function getCourseDetails(courseId: string): Promise<Course | undefined> {
  return coursesData.find(course => course.id === courseId);
}

export default async function EnrollmentPage({ params }: { params: { courseId: string } }) {
  const course = await getCourseDetails(params.courseId);

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <SectionTitle title="Course Not Found" subtitle="The course you are trying to enroll in does not exist." />
        <Button asChild>
          <Link href="/courses">Browse Courses</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <section className="bg-gradient-to-br from-primary/10 to-accent/10 py-20 md:py-28">
        <div className="container mx-auto px-4 text-center">
          <ShoppingCart className="h-16 w-16 text-primary mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">Enroll in: {course.title}</h1>
          <p className="text-lg md:text-xl text-foreground/80 max-w-3xl mx-auto">
            You&apos;re just a few steps away from starting your TEF Canada journey with French.GTA.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 flex flex-col lg:flex-row gap-12 items-start justify-center">
          <div className="lg:w-1/3 space-y-6 pt-8">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-2xl text-primary">Order Summary</CardTitle>
                <CardDescription>Review your selected course.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <h3 className="text-xl font-semibold text-foreground">{course.title}</h3>
                <p className="text-sm text-muted-foreground">{course.shortDescription}</p>
                <div className="border-t pt-3">
                  <p className="text-lg font-semibold text-foreground">Format: <span className="text-accent">{course.format}</span></p>
                  {/* Add more details like price if needed, assuming 1on1 for simplicity or choice later */}
                  {course.price1on1 && (
                    <p className="text-2xl font-bold text-primary mt-2">${course.price1on1}</p>
                  )}
                   <p className="text-xs text-muted-foreground">Full course fee. Payment options available on the next step.</p>
                </div>
              </CardContent>
            </Card>
             <p className="text-sm text-muted-foreground italic">
                Secure your spot by completing the enrollment form. Payment will be processed on the next page.
            </p>
          </div>
          <div className="lg:w-2/3 flex justify-center">
            <EnrollmentForm courseName={course.title} courseId={course.id} />
          </div>
        </div>
      </section>
    </>
  );
}
