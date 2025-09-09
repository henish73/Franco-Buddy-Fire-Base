// src/app/(public)/courses/page.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import SectionTitle from '@/components/shared/SectionTitle';
import CourseCard, { type Course } from '@/components/shared/CourseCard';
import { HelpCircle, Star, Users, Award } from 'lucide-react';
import { getCoursesAction } from '@/app/admin/courses/actions';
import Image from 'next/image';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default async function CoursesPage() {
  const result = await getCoursesAction();
  const coursesData = (result.isSuccess && Array.isArray(result.data)) ? result.data.filter(c => c.status === 'Active') as Course[] : [];
  
  return (
    <>
      {/* Hero Section */}
      <section className="relative h-96">
        <Image 
          src="https://picsum.photos/1920/1080?random=1" 
          alt="French courses for Canadian immigration" 
          className="object-cover w-full h-full"
          fill
          data-ai-hint="learning online education"
        />
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
          <div className="text-center text-white p-4">
            <h1 className="text-4xl md:text-6xl font-bold">Our Courses</h1>
            <p className="text-lg md:text-xl mt-4 max-w-2xl">
              Choose the perfect TEF Canada preparation course designed to meet your specific CLB goals.
            </p>
          </div>
        </div>
      </section>
      
      {/* Course Listing Area */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <SectionTitle title="Our Course Offerings" subtitle="Expertly crafted programs for every level."/>
          {!result.isSuccess && (
             <Alert variant="destructive" className="max-w-2xl mx-auto">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error Loading Courses</AlertTitle>
              <AlertDescription>
                {result.message || "We couldn't load the courses right now. Please try again later."}
              </AlertDescription>
            </Alert>
          )}
          {result.isSuccess && coursesData.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 animate-fade-in">
              {coursesData.map((course, index) => (
                <div key={course.id} style={{ animationDelay: `${index * 100}ms` }} className="animate-fade-in-up">
                  <CourseCard course={course} />
                </div>
              ))}
            </div>
          ) : (
             result.isSuccess && <p className="text-center text-muted-foreground">No active courses available at the moment. Please check back soon!</p>
          )}
        </div>
      </section>

      {/* "Not Sure Which Course?" CTA */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="bg-card p-8 md:p-12 rounded-lg shadow-xl max-w-2xl mx-auto animate-fade-in-up">
            <HelpCircle className="h-12 w-12 text-primary mx-auto mb-6" />
            <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-4">Not Sure Which Course is Right for You?</h2>
            <p className="text-muted-foreground mb-8">
              Let our experts guide you. Book a free demo class to discuss your goals and get a personalized recommendation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="animate-pulse rounded-full">
                <Link href="/book-demo">Book Free Demo</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full">
                <Link href="/ai-course-suggester">Use AI Suggester</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
