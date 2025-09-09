// src/app/(public)/enroll/[courseId]/page.tsx
'use client'

import { useSearchParams } from 'next/navigation';
import SectionTitle from '@/components/shared/SectionTitle';
import EnrollmentForm from '@/app/(public)/enrollment-form/EnrollmentForm'; // Point to the new shared form
import { coursesData } from '@/app/(public)/courses/mockCoursesData';
import { type Course } from '@/components/shared/CourseCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function SpecificCourseEnrollmentPage() {
  const searchParams = useSearchParams();
  const courseId = searchParams.get('course'); // This component is now more of a redirect/prefill mechanism
  const selectedCourse = coursesData.find(c => c.id === courseId);

  // This page can be simplified or even removed in favor of just using /enrollment-form?course=...
  // For now, let's make it show the selected course and the main form.
  
  if (!selectedCourse) {
     return (
        <div className="space-y-8 py-16 md:py-24 container mx-auto px-4">
            <SectionTitle 
                title="Enroll in Our Program"
                subtitle="Please fill out the form below to get started. If you had a specific course in mind, you can select it on our main courses page."
            />
            <div className="flex justify-center">
                 <EnrollmentForm />
            </div>
        </div>
     )
  }

  return (
    <>
      <section className="bg-gradient-to-br from-primary/10 to-accent/10 py-20 md:py-28">
        <div className="container mx-auto px-4 text-center">
          <FileText className="h-16 w-16 text-primary mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">Enroll in: {selectedCourse.title}</h1>
          <p className="text-lg md:text-xl text-foreground/80 max-w-3xl mx-auto">
            You're just a few steps away from starting your journey with FrancoBuddy.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 flex flex-col lg:flex-row gap-12 items-start justify-center">
          <div className="lg:w-1/3 space-y-6 pt-8">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-2xl text-primary">Order Summary</CardTitle>
                <CardDescription>You have selected:</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <h3 className="text-xl font-semibold text-foreground">{selectedCourse.title}</h3>
                <p className="text-sm text-muted-foreground">{selectedCourse.shortDescription}</p>
                <div className="border-t pt-3">
                  {selectedCourse.price1on1 && (
                    <p className="text-xl font-bold text-primary">${selectedCourse.price1on1}<span className="text-sm font-normal text-muted-foreground">/month (1:1)</span></p>
                  )}
                   {selectedCourse.price1on3 && (
                    <p className="text-xl font-bold text-primary mt-1">${selectedCourse.price1on3}<span className="text-sm font-normal text-muted-foreground">/month (Group)</span></p>
                  )}
                </div>
              </CardContent>
            </Card>
             <p className="text-sm text-muted-foreground italic">
                Complete the form to secure your spot. Payment will be handled after submission.
            </p>
          </div>
          <div className="lg:w-2/3 flex justify-center">
            <EnrollmentForm course={selectedCourse} />
          </div>
        </div>
      </section>
    </>
  );
}

