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
import { type Course, type Module, type Lesson } from '@/components/shared/CourseCard';

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
    tefFocus: "Introduction to all 4 TEF Canada sections, basic strategies, and confidence building.",
    modules: [
      { id: "m1-found", title: "Module 1: Introduction to TEF Canada & French Basics", order: 1, description: "Understand the exam and learn essential greetings.", lessons: [
        { id: "l1-1-found", title: "Lesson 1.1: Understanding the TEF Canada Exam", keyTopics: ["Exam structure (sections, duration)", "Scoring system (CLB levels)", "Registration process overview"], skillsTargeted: ["General Knowledge"], tefQuestionTypes: ["N/A - Informational"], exampleActivities: "Review official TEF Canada exam guide." },
        { id: "l1-2-found", title: "Lesson 1.2: Basic French Greetings & Introductions", keyTopics: ["Common salutations (Bonjour, Salut, Bonsoir)", "Introducing oneself (Je m'appelle...)", "Asking basic questions (Comment ça va?)"], skillsTargeted: ["Speaking", "Listening"], tefQuestionTypes: ["Expression Orale - Section A (simulated)"], exampleActivities: "Role-playing introductions and simple conversations." },
      ]},
      { id: "m2-found", title: "Module 2: Core Grammar & Vocabulary Building", order: 2, description: "Build your French grammar and vocabulary foundation.", lessons: [
        { id: "l2-1-found", title: "Lesson 2.1: Essential Verbs (être, avoir, aller)", keyTopics: ["Present tense conjugation", "Usage in common sentences", "Forming simple questions"], skillsTargeted: ["Writing", "Reading", "Speaking"], tefQuestionTypes: ["Lexique et Structure"], exampleActivities: "Fill-in-the-blanks exercises, sentence creation." },
        { id: "l2-2-found", title: "Lesson 2.2: Nouns, Articles, and Gender", keyTopics: ["Masculine vs. Feminine nouns", "Definite and indefinite articles (le, la, les, un, une, des)", "Basic agreement rules"], skillsTargeted: ["Reading", "Writing"], tefQuestionTypes: ["Lexique et Structure"], exampleActivities: "Identifying noun genders, matching articles to nouns." },
      ]}
    ],
    whatsIncluded: [
      { text: "Live Interactive Classes", icon: Users },
      { text: "Certified TEF Instructors", icon: Award },
      { text: "Class Recordings (24/7 Access)", icon: Video },
      { text: "Comprehensive Class Notes (PDF)", icon: FileText },
      { text: "AI Language Tutor Access (Speaking & Writing)", icon: Brain },
      { text: "Official TEF Practice Materials", icon: ClipboardCheck },
      { text: "Regular Mock Tests & Feedback", icon: Target },
      { text: "One-on-One Support Sessions (as per plan)", icon: MessageSquare },
      { text: "Dedicated WhatsApp Group for Batch", icon: MessageCircle },
    ],
    instructorSpotlight: {
      name: "Prof. Marie Dupont",
      bio: "Marie is a certified FLE (French as a Foreign Language) instructor with over 8 years of experience specializing in TEF Canada preparation. She is passionate about helping students achieve their immigration goals through language mastery.",
      imageUrl: "https://placehold.co/150x150.png",
      imageAiHint: "female instructor friendly",
    },
    courseSpecificTestimonials: [
      { quote: "The TEF Foundation course was perfect for my beginner level. I learned so much!", author: "R. Singh", image: "https://placehold.co/80x80.png", imageAiHint: "student happy" },
    ],
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
    tefFocus: "Mastery of all 4 TEF Canada sections, advanced test-taking strategies, time management, and achieving high fluency.",
    modules: [
      { id: "m1-pro", title: "Module 1: Advanced Listening Comprehension (Compréhension Orale)", order: 1, lessons: [
        { id: "l1-1-pro", title: "Lesson 1.1: Identifying Nuances and Implied Meanings", keyTopics: ["Inferencing speaker intent", "Understanding idiomatic expressions", "Recognizing different accents and registers"], skillsTargeted: ["Listening"], tefQuestionTypes: ["Compréhension Orale - Section B, C"], exampleActivities: "Practice with advanced audio clips, analyzing speaker tone." },
      ]},
      { id: "m2-pro", title: "Module 2: Mastering Speaking Sections (Expression Orale)", order: 2, lessons: [
        { id: "l2-1-pro", title: "Lesson 2.1: Structuring Arguments for Section B", keyTopics: ["Developing persuasive arguments", "Organizing ideas logically (introduction, arguments, conclusion)", "Using appropriate vocabulary and connectors"], skillsTargeted: ["Speaking"], tefQuestionTypes: ["Expression Orale - Section B"], exampleActivities: "Timed speaking practice on various topics with structured feedback." },
      ]}
    ],
    whatsIncluded: [
      { text: "Advanced Live Interactive Classes", icon: Users },
      { text: "Expert TEF Instructors (CLB 9+)", icon: Award },
      { text: "All Class Recordings (24/7 Access)", icon: Video },
      { text: "Detailed Strategy Guides & Notes (PDF)", icon: FileText },
      { text: "AI Language Tutor Access (All Modules)", icon: Brain },
      { text: "Extensive Official TEF Practice Materials", icon: ClipboardCheck },
      { text: "Multiple Full-Length Mock Tests & In-depth Feedback", icon: Target },
      { text: "Dedicated One-on-One Strategy Sessions", icon: MessageSquare },
      { text: "Priority Support via WhatsApp Group", icon: MessageCircle },
    ],
    instructorSpotlight: {
      name: "Dr. Jean Moreau",
      bio: "Jean holds a PhD in French Linguistics and has a stellar track record of guiding students to CLB 7+ scores. His approach focuses on strategic test-taking and building true language confidence.",
      imageUrl: "https://placehold.co/150x150.png",
      imageAiHint: "male instructor serious",
    },
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
    tefFocus: "Achieving near-native proficiency across all TEF Canada sections, mastering complex structures, and ensuring impeccable accuracy.",
    modules: [], 
    whatsIncluded: [ 
        { text: "Elite 1:1 Coaching Sessions", icon: Users },
        { text: "Personalized Study Plan", icon: ClipboardCheck },
        { text: "Advanced Material & Error Analysis", icon: Brain },
    ],
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
                        {module.lessons.sort((a,b) => (a.order || 0) - (b.order || 0)).map((lesson) => (
                          <div key={lesson.id} className="p-4 border-l-2 border-primary/30 bg-muted/30 rounded-r-md">
                            <h4 className="font-semibold text-foreground mb-2 text-md">{lesson.title}</h4>
                            {lesson.description && <p className="text-sm mb-2">{lesson.description}</p>}
                            {lesson.keyTopics && lesson.keyTopics.length > 0 && (
                              <p className="text-sm mb-1"><strong>Key Topics:</strong> {lesson.keyTopics.join('; ')}</p>
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
                      <div className="sm:w-1/3">
                        <Image 
                          src={course.instructorSpotlight.imageUrl} 
                          alt={course.instructorSpotlight.name}
                          width={200}
                          height={200}
                          className="object-cover w-full h-full"
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
                              width={60}
                              height={60}
                              className="rounded-full mt-1"
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
