// src/app/(public)/courses/[id]/page.tsx
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import SectionTitle from '@/components/shared/SectionTitle';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
    Check, BookOpen, Users, Target, Info, Tag, CalendarDays, Video, FileText, Brain, 
    ClipboardCheck, Award, MessageSquare, MessageCircle, User as UserIcon, Star, ShieldCheck, Clock
} from 'lucide-react';
import type { Course, Module, Lesson } from '@/components/shared/CourseCard';
import { getCoursesAction } from '@/app/admin/courses/actions'; 
import { notFound } from 'next/navigation';

export default async function CourseDetailPage({ params }: { params: { id: string } }) {
  const result = await getCoursesAction();
  if (!result.isSuccess || !Array.isArray(result.data)) {
    // Handle error case, maybe show a generic error page
    return <div>Error loading courses.</div>;
  }
  const course = result.data.find(c => c.id === params.id);

  if (!course) {
    notFound();
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-secondary text-secondary-foreground">
        <div className="relative z-10 container mx-auto px-4 text-center">
          <p className="font-semibold text-primary uppercase tracking-wider mb-2">FRANCOBUDDY Course</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{course.title}</h1>
          <p className="text-lg md:text-xl opacity-80 mb-8 max-w-3xl mx-auto">{course.shortDescription}</p>
          <div className="mt-8 flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-secondary-foreground/90">
            <span className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-primary" /> 96% Success Rate</span>
            <span className="flex items-center gap-2"><Clock className="h-5 w-5 text-primary" /> {course.duration || 'Flexible'}</span>
            <span className="flex items-center gap-2"><Users className="h-5 w-5 text-primary" /> 3-5 Students Max</span>
          </div>
           <div className="mt-8">
              <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full">
                <Link href={`/enrollment-form?course=${course.id}`}>Enroll Now</Link>
              </Button>
           </div>
        </div>
      </section>
      
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid md:grid-cols-3 gap-12 items-start">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-12">
            
            {/* Detailed Overview Section */}
            <section>
              <h2 className="text-2xl font-semibold text-secondary mb-4 flex items-center gap-2">
                <Info className="h-6 w-6" /> Detailed Overview
              </h2>
              <p className="text-foreground/80 leading-relaxed">{course.detailedDescription}</p>
            </section>

             {/* Features Section */}
            {course.whatsIncluded && course.whatsIncluded.length > 0 && (
              <section>
                <h2 className="text-2xl font-semibold text-secondary mb-6 flex items-center gap-2">
                  <Check className="h-6 w-6" /> What&apos;s Included?
                </h2>
                <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-4">
                  {course.whatsIncluded.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <item.icon className="h-6 w-6 text-green-500 mt-1 shrink-0" />
                      <span className="text-foreground/80">{item.text}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Syllabus / Curriculum Section */}
            {course.modules && course.modules.length > 0 && (
              <section>
                <h2 className="text-2xl font-semibold text-secondary mb-6 flex items-center gap-2">
                  <BookOpen className="h-6 w-6" /> Syllabus / Curriculum
                </h2>
                <Accordion type="single" collapsible className="w-full space-y-4">
                  {course.modules.sort((a,b) => (a.order || 0) - (b.order || 0)).map((module) => (
                    <AccordionItem key={module.id} value={module.id} className="bg-card shadow-sm rounded-lg border">
                      <AccordionTrigger className="text-left hover:no-underline py-4 px-6 text-lg font-medium text-secondary">
                        {module.title}
                      </AccordionTrigger>
                      <AccordionContent className="py-4 px-6 text-muted-foreground space-y-4">
                        {module.description && <p className="mb-4 italic text-sm">{module.description}</p>}
                        {module.lessons && module.lessons.sort((a,b) => (a.order || 0) - (b.order || 0)).map((lesson) => (
                          <div key={lesson.id} className="p-4 border-l-2 border-primary/30 bg-muted/30 rounded-r-md">
                            <h4 className="font-semibold text-foreground mb-2 text-md">{lesson.title}</h4>
                            {lesson.description && <p className="text-sm mb-2">{lesson.description}</p>}
                            {lesson.keyTopics && lesson.keyTopics.length > 0 && (
                              <div className='mb-2'>
                                <strong className="text-sm text-foreground">Key Topics:</strong>
                                <ul className="list-disc list-inside text-sm space-y-1 mt-1">
                                    {lesson.keyTopics.map((topic, i) => <li key={i}>{topic}</li>)}
                                </ul>
                              </div>
                            )}
                          </div>
                        ))}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </section>
            )}

             {/* Course Specific Testimonials */}
            {course.courseSpecificTestimonials && course.courseSpecificTestimonials.length > 0 && (
              <section>
                <h2 className="text-2xl font-semibold text-secondary mb-6 flex items-center gap-2">
                  <MessageSquare className="h-6 w-6" /> Student Success Stories
                </h2>
                <div className="space-y-6">
                  {course.courseSpecificTestimonials.map((testimonial, index) => (
                    <Card key={index} className="shadow-md">
                      <CardContent className="p-6 flex items-start gap-4">
                        {testimonial.image && (
                           <Image 
                              src={testimonial.image} 
                              alt={testimonial.author}
                              width={80}
                              height={80}
                              className="rounded-full mt-1 border-2 border-primary/50"
                              data-ai-hint={testimonial.imageAiHint}
                           />
                        )}
                        <div>
                          <blockquote className="italic text-foreground/80 before:content-['“'] after:content-['”']">
                            {testimonial.quote}
                          </blockquote>
                          <p className="text-sm font-semibold text-primary mt-2 text-right">- {testimonial.author}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}

          </div>

          {/* Sidebar - Pricing & Enrollment Block */}
          <aside className="md:col-span-1 space-y-6 sticky top-24">
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl text-secondary flex items-center gap-2">
                  <Tag className="h-6 w-6" /> Course Plans
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {course.price1on1 && (
                  <div>
                    <h4 className="font-semibold text-foreground">1:1 Personal Coaching</h4>
                    <p className="text-2xl font-bold text-primary">${course.price1on1}/month</p>
                  </div>
                )}
                {course.price1on3 && (
                  <div className="border-t pt-4 mt-4">
                    <h4 className="font-semibold text-foreground">1:3 Small Group</h4>
                    <p className="text-2xl font-bold text-primary">${course.price1on3}/month</p>
                  </div>
                )}
              </CardContent>
               <CardFooter className="flex-col items-stretch gap-3">
                <Button asChild size="lg" className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-full">
                  <Link href={`/enrollment-form?course=${course.id}`}>Enroll Now</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="w-full rounded-full">
                    <Link href="/book-demo">Book a Free Demo</Link>
                </Button>
              </CardFooter>
            </Card>
          </aside>
        </div>
      </div>
    </>
  );
}
