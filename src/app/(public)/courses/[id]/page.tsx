import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import SectionTitle from '@/components/shared/SectionTitle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, BookOpen, Users, Target, Info, Tag, CalendarDays } from 'lucide-react';
import { type Course } from '@/components/shared/CourseCard'; // Assuming Course type is exported

// Placeholder data - In a real app, this would come from Firestore based on params.id
const coursesData: { [key: string]: Course } = {
  "tef-foundation": { 
    id: "tef-foundation", 
    title: "TEF Foundation", 
    shortDescription: "Master the fundamentals of French tailored for TEF Canada.", 
    targetCLB: "4-6", 
    format: "1:1 Personal Coaching / 1:3 Small Group",
    imageUrl: "https://placehold.co/1200x500.png",
    imageAiHint: "learning discussion group",
    price1on1: 500,
    price1on3: 300,
    detailedDescription: "Our TEF Foundation course is meticulously designed for beginners or those with basic French knowledge. We focus on building a strong grammatical base, essential vocabulary, and an introduction to all four TEF Canada modules: listening, reading, speaking, and writing. This course prepares you to confidently tackle the exam and aim for CLB 4-6.",
    isForYou: [
      "You are new to French or have very basic knowledge.",
      "You need to understand the TEF Canada exam format from scratch.",
      "You are aiming for CLB 4, 5, or 6 for specific immigration or work permit needs.",
      "You prefer a structured approach with foundational learning.",
    ],
    structure: "Weekly live classes, interactive exercises, access to notes, and basic mock tests.",
    learningResources: ["Live Classes", "Downloadable Notes", "Recorded Sessions", "Practice Quizzes"],
    tefFocus: "Introduction to all 4 TEF Canada sections, basic strategies, and confidence building."
  },
  "tef-pro-clb7": { 
    id: "tef-pro-clb7", 
    title: "TEF Pro - CLB 7+", 
    shortDescription: "Intensive, strategy-focused training to help you achieve CLB 7 and above.", 
    targetCLB: "7+", 
    format: "1:1 Personal Coaching / 1:3 Small Group",
    imageUrl: "https://placehold.co/1200x500.png",
    imageAiHint: "professional presentation success",
    price1on1: 800,
    price1on3: 550,
    detailedDescription: "The TEF Pro - CLB 7+ course is engineered for intermediate learners aiming for high scores essential for Express Entry. This program dives deep into advanced strategies for each TEF Canada module, with extensive practice, mock tests, and personalized feedback to ensure you are fully prepared to achieve CLB 7 or higher.",
    isForYou: [
      "You have an intermediate level of French (B1 or equivalent).",
      "You need to score CLB 7 or higher for Canadian Express Entry.",
      "You are looking for advanced strategies and intensive practice.",
      "You want personalized feedback to refine your skills.",
    ],
    structure: "Advanced strategy sessions, full-length mock tests, personalized feedback, targeted skill workshops.",
    learningResources: ["Advanced Live Classes", "Strategy Guides", "Extensive Mock Tests", "Personalized Feedback Reports", "Recordings of all sessions"],
    tefFocus: "Mastery of all 4 TEF Canada sections, advanced test-taking strategies, time management, and achieving high fluency."
  },
   "tef-excellence-clb9": { 
    id: "tef-excellence-clb9", 
    title: "TEF Excellence - CLB 9+", 
    shortDescription: "Advanced coaching for those aiming for top-tier CLB 9+ scores.", 
    targetCLB: "9+", 
    format: "1:1 Personal Coaching",
    imageUrl: "https://placehold.co/1200x500.png",
    imageAiHint: "expert award ceremony",
    price1on1: 1200,
    detailedDescription: "The TEF Excellence course is for advanced French speakers targeting the highest CLB levels (9 and above) to maximize their CRS points. This highly personalized 1:1 coaching focuses on perfecting nuances, advanced vocabulary, idiomatic expressions, and flawless execution in all TEF Canada sections.",
    isForYou: [
      "You have an advanced level of French (B2/C1 or equivalent).",
      "You aim to achieve CLB 9 or higher for maximum Express Entry points.",
      "You seek to perfect your French for professional and academic excellence in Canada.",
      "You require elite, personalized coaching to polish every aspect of your language skills.",
    ],
    structure: "Intensive 1:1 coaching, customized study plans, advanced material, specialized mock tests, and detailed error analysis.",
    learningResources: ["Elite 1:1 Live Sessions", "Advanced Custom Materials", "Full-Length Proctored Mock Tests", "In-depth Performance Analytics", "Access to Exclusive Resources"],
    tefFocus: "Achieving near-native proficiency across all TEF Canada sections, mastering complex structures, and ensuring impeccable accuracy."
  },
};


export default function CourseDetailPage({ params }: { params: { id: string } }) {
  const course = coursesData[params.id];

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
        <div className="grid md:grid-cols-3 gap-12">
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

            {/* Course Structure & Format (basic details) */}
            <section>
              <h2 className="text-2xl font-semibold text-primary mb-4 flex items-center gap-2">
                <CalendarDays className="h-6 w-6" /> Course Structure & Format
              </h2>
              <p className="text-foreground/80 leading-relaxed">{course.structure}</p>
            </section>

            {/* Learning Resources */}
            <section>
              <h2 className="text-2xl font-semibold text-primary mb-4 flex items-center gap-2">
                <BookOpen className="h-6 w-6" /> Learning Resources
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {course.learningResources.map((resource, index) => (
                  <div key={index} className="flex items-center gap-2 p-3 bg-muted/50 rounded-md">
                    <Check className="h-5 w-5 text-primary shrink-0" />
                    <span className="text-foreground/80">{resource}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* TEF Canada Exam Focus (brief) */}
            <section>
              <h2 className="text-2xl font-semibold text-primary mb-4">TEF Canada Exam Focus</h2>
              <p className="text-foreground/80 leading-relaxed">{course.tefFocus}</p>
            </section>
          </div>

          {/* Sidebar - Pricing & Enrollment Block */}
          <aside className="md:col-span-1 space-y-6">
            <Card className="shadow-xl sticky top-24">
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
                  <Link href="/book-demo">Enroll Now / Book Free Demo</Link>
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  Enrollment is currently processed after a demo session.
                </p>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </>
  );
}
