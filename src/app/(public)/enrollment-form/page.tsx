// src/app/(public)/enrollment-form/page.tsx
'use client'

import { useSearchParams } from 'next/navigation';
import SectionTitle from '@/components/shared/SectionTitle';
import EnrollmentForm from './EnrollmentForm';
import { coursesData } from '@/app/(public)/courses/mockCoursesData';
import { type Course } from '@/components/shared/CourseCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function EnrollmentPage() {
  const searchParams = useSearchParams();
  const courseId = searchParams.get('course');
  const selectedCourse = coursesData.find(c => c.id === courseId);

  return (
    <>
      <section className="bg-gradient-to-br from-secondary/10 to-primary/10 py-20 md:py-28">
        <div className="container mx-auto px-4 text-center">
          <FileText className="h-16 w-16 text-secondary mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold text-secondary mb-4">Complete Your Enrollment</h1>
          <p className="text-lg md:text-xl text-foreground/80 max-w-3xl mx-auto">
            You're just a few steps away from starting your French journey with FRANCOBUDDY.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 flex flex-col lg:flex-row gap-12 items-start justify-center">
          <div className="lg:w-1/3 space-y-6 pt-8">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-2xl text-secondary">Your Selected Plan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {selectedCourse ? (
                  <>
                    <h3 className="text-xl font-semibold text-foreground">{selectedCourse.title}</h3>
                    <p className="text-sm text-muted-foreground">{selectedCourse.shortDescription}</p>
                    <div className="border-t pt-3 mt-3">
                      {selectedCourse.price1on1 && (
                        <p className="text-2xl font-bold text-primary">${selectedCourse.price1on1}<span className="text-base font-normal text-muted-foreground">/month (1:1)</span></p>
                      )}
                      {selectedCourse.price1on3 && (
                        <p className="text-2xl font-bold text-primary mt-2">${selectedCourse.price1on3}<span className="text-base font-normal text-muted-foreground">/month (Group)</span></p>
                      )}
                    </div>
                    {selectedCourse.whatsIncluded && (
                        <ul className="space-y-2 pt-4">
                            {selectedCourse.whatsIncluded.slice(0,4).map((item, index) => (
                                 <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                                    <span>{item.text}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                  </>
                ) : (
                  <p className="text-muted-foreground">No course selected. Please <Link href="/courses" className="text-primary underline">choose a course</Link> to enroll.</p>
                )}
              </CardContent>
            </Card>
             <p className="text-sm text-muted-foreground italic">
                Secure your spot by completing the enrollment form. Payment will be handled after submission.
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
