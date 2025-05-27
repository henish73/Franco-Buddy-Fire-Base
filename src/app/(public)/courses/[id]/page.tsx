import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import SectionTitle from '@/components/shared/SectionTitle';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
    Check, BookOpen, Users, Target, Info, Tag, CalendarDays, Video, FileText, Brain, 
    ClipboardCheck, Award, MessageSquare, MessageCircle, UserCircle as UserIcon 
} from 'lucide-react';
import type { Course, Module, Lesson } from '@/components/shared/CourseCard';

// Placeholder data - In a real app, this would come from Firestore based on params.id
// This data should now match the enhanced structure in mockCoursesData.ts
import { coursesData as allCourses } from '../mockCoursesData'; // Import from shared mock data

const coursesDataMap: { [key: string]: Course } = allCourses.reduce((acc, course) => {
  acc[course.id] = course;
  return acc;
}, {} as { [key: string]: Course });


export default function CourseDetailPage({ params }: { params: { id: string } }) {
  const course = coursesDataMap[params.id];

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <SectionTitle title="Course Not Found" subtitle="The course you are looking for does not exist or has been moved." />
        <Button asChild>
          <Link href="/courses">Back to Courses</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      {/* Breadcrumbs (simplified) */}
      <div className="bg-muted/50 py-4">
        <div className="container mx-auto px-4 text-sm">
          <Link href="/courses" className="text-primary hover:underline">Courses</Link>
          <span className="text-muted-foreground"> / {course.title}</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative py-20 md:py-32">
        {course.imageUrl && (
          <Image
            src={course.imageUrl}
            alt={course.title}
            fill
            style={{objectFit: "cover"}}
            className="absolute inset-0 z-0 opacity-20"
            data-ai-hint={course.imageAiHint}
            priority
          />
        )}
        <div className="relative z-10 container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">{course.title}</h1>
          <p className="text-lg md:text-xl text-foreground/80 mb-4 max-w-3xl mx-auto">{course.shortDescription}</p>
          <div className="flex justify-center items-center gap-4 text-foreground/90">
            <span className="flex items-center gap-1"><Target className="h-5 w-5 text-primary" /> CLB: {course.targetCLB}</span>
            <span className="flex items-center gap-1"><Users className="h-5 w-5 text-primary" /> Format: {course.format}</span>
          </div>
        </div>
      </section>
      
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid md:grid-cols-3 gap-12 items-start">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-12">
            {/* Detailed Overview Section */}
            <section>
              <h2 className="text-2xl font-semibold text-primary mb-4 flex items-center gap-2">
                <Info className="h-6 w-6" /> Detailed Overview
              </h2>
              <p className="text-foreground/80 leading-relaxed">{course.detailedDescription}</p>
            </section>

            {/* "Is This Course For You?" Section */}
             {course.isForYou && course.isForYou.length > 0 && (
                <section>
                <h2 className="text-2xl font-semibold text-primary mb-4 flex items-center gap-2">
                    <Target className="h-6 w-6" /> Is This Course For You?
                </h2>
                <ul className="space-y-2">
                    {course.isForYou.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-foreground/80">
                        <Check className="h-5 w-5 text-green-500 mt-1 shrink-0" />
                        <span>{item}</span>
                    </li>
                    ))}
                </ul>
                </section>
            )}
            
            {/* TEF Focus Section */}
            {course.tefFocus && (
              <section>
                <h2 className="text-2xl font-semibold text-primary mb-4 flex items-center gap-2">
                  <Award className="h-6 w-6" /> TEF Canada Focus
                </h2>
                <p className="text-foreground/80 leading-relaxed">{course.tefFocus}</p>
              </section>
            )}

            {/* Syllabus / Curriculum Section */}
            {course.modules && course.modules.length > 0 && (
              <section>
                <h2 className="text-2xl font-semibold text-primary mb-6 flex items-center gap-2">
                  <BookOpen className="h-6 w-6" /> Syllabus / Curriculum
                </h2>
                <Accordion type="single" collapsible className="w-full space-y-4">
                  {course.modules.sort((a,b) => (a.order || 0) - (b.order || 0)).map((module) => (
                    <AccordionItem key={module.id} value={module.id} className="bg-card shadow-sm rounded-lg border">
                      <AccordionTrigger className="text-left hover:no-underline py-4 px-6 text-lg font-medium text-primary">
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
                            {lesson.skillsTargeted && lesson.skillsTargeted.length > 0 && (
                              <p className="text-sm mb-1"><strong>Skills Targeted:</strong> {lesson.skillsTargeted.join(', ')}</p>
                            )}
                            {lesson.tefQuestionTypes && lesson.tefQuestionTypes.length > 0 && (
                                <p className="text-sm mb-1"><strong>TEF Question Types:</strong> {lesson.tefQuestionTypes.join(', ')}</p>
                            )}
                            {lesson.exampleActivities && (
                                <p className="text-sm"><strong>Example Activities:</strong> {lesson.exampleActivities}</p>
                            )}
                          </div>
                        ))}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </section>
            )}

            {/* "What's Included?" Section */}
            {course.whatsIncluded && course.whatsIncluded.length > 0 && (
              <section>
                <h2 className="text-2xl font-semibold text-primary mb-6 flex items-center gap-2">
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

            {/* Course Structure & Format */}
            {course.structure && (
              <section>
                <h2 className="text-2xl font-semibold text-primary mb-4 flex items-center gap-2">
                  <CalendarDays className="h-6 w-6" /> Course Structure & Format
                </h2>
                <p className="text-foreground/80 leading-relaxed">{course.structure}</p>
              </section>
            )}
            
            {/* Instructor Spotlight */}
            {course.instructorSpotlight && (
              <section>
                <h2 className="text-2xl font-semibold text-primary mb-6 flex items-center gap-2">
                  <UserIcon className="h-6 w-6" /> Instructor Spotlight
                </h2>
                <Card className="shadow-md overflow-hidden">
                  <div className="flex flex-col sm:flex-row">
                    {course.instructorSpotlight.imageUrl && (
                      <div className="sm:w-1/3 flex justify-center items-center p-4 bg-muted/30">
                        <Image 
                          src={course.instructorSpotlight.imageUrl} 
                          alt={course.instructorSpotlight.name}
                          width={150} // Standardized
                          height={150} // Standardized
                          className="object-cover rounded-full border-2 border-primary"
                          data-ai-hint={course.instructorSpotlight.imageAiHint}
                        />
                      </div>
                    )}
                    <div className="sm:w-2/3 p-6">
                      <CardTitle className="text-xl text-primary mb-1">{course.instructorSpotlight.name}</CardTitle>
                      <p className="text-foreground/80 leading-relaxed">{course.instructorSpotlight.bio}</p>
                    </div>
                  </div>
                </Card>
              </section>
            )}

            {/* Course Specific Testimonials */}
            {course.courseSpecificTestimonials && course.courseSpecificTestimonials.length > 0 && (
              <section>
                <h2 className="text-2xl font-semibold text-primary mb-6 flex items-center gap-2">
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
                              width={80} // Standardized
                              height={80} // Standardized
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
                 {/* Link to full testimonials page if needed */}
                 {/* <div className="text-center mt-8">
                    <Button variant="outline" asChild>
                        <Link href="/testimonials">View All Testimonials</Link>
                    </Button>
                 </div> */}
              </section>
            )}

          </div>

          {/* Sidebar - Pricing & Enrollment Block */}
          <aside className="md:col-span-1 space-y-6 sticky top-24">
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl text-primary flex items-center gap-2">
                  <Tag className="h-6 w-6" /> Pricing & Enrollment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {course.price1on1 && (
                  <div>
                    <h4 className="font-semibold text-foreground">1:1 Personal Coaching</h4>
                    <p className="text-2xl font-bold text-accent">${course.price1on1}</p>
                    <p className="text-xs text-muted-foreground">Full Course Fee</p>
                  </div>
                )}
                {course.price1on3 && (
                  <div>
                    <h4 className="font-semibold text-foreground">1:3 Small Group Coaching</h4>
                    <p className="text-2xl font-bold text-accent">${course.price1on3}</p>
                     <p className="text-xs text-muted-foreground">Per Participant, Full Course Fee</p>
                  </div>
                )}
                <Button asChild size="lg" className="w-full mt-4">
                  <Link href={`/enroll/${course.id}`}>Enroll Now</Link>
                </Button>
                <p className="text-xs text-muted-foreground text-center mt-2">
                  <Link href="/book-demo" className="hover:underline">Or Book a Free Demo</Link>
                </p>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </>
  );
}
