// src/app/(public)/enrollment-form/page.tsx
'use client'

import { useSearchParams } from 'next/navigation';
import EnrollmentForm from './EnrollmentForm';
import { coursesData } from '@/app/(public)/courses/mockCoursesData';
import { type Course } from '@/components/shared/CourseCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, CheckCircle, Star, Users, Award, Video, Lightbulb, UserCheck, BookOpen, Target } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import SectionTitle from '@/components/shared/SectionTitle';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from '@/components/ui/button';

const testimonials = [
  { quote: "FRANCOBUDDY was a game-changer! I scored 371/400 in my TEF Canada exam, crucial for my PR application in Toronto. The instructors are the best for anyone serious about immigration.", author: "Priya Sharma", role: "Software Engineer", location: "Toronto, ON", image: "https://picsum.photos/100/100", dataAiHint: "professional woman portrait", rating: 5 },
  { quote: "I needed a high TCF score for my work permit extension in Mississauga. FRANCOBUDDY's personalized approach helped me go from zero French to a confident B2. Highly recommend for TEF and TCF.", author: "Rahul Patel", role: "Business Analyst", location: "Mississauga, ON", image: "https://picsum.photos/100/100", dataAiHint: "professional man portrait", rating: 5 },
  { quote: "Living in Brampton, I needed flexible TEF classes. The online program was perfect, and the small class size helped me pass with flying colors for my Express Entry profile.", author: "Kavya Reddy", role: "University Student", location: "Brampton, ON", image: "https://picsum.photos/100/100", dataAiHint: "female student portrait", rating: 4.8 },
];

const whatYouGetItems = [
    { icon: UserCheck, title: "Expert Certified Instructors", description: "Learn from C1/C2 certified experts who specialize in TEF & TCF exam preparation." },
    { icon: BookOpen, title: "Proven, Structured Curriculum", description: "Follow a curriculum designed for success, focusing on all four language skills." },
    { icon: Target, title: "Personalized Small Groups", description: "Get individual attention with a maximum of 3-5 students per class." },
    { icon: Lightbulb, title: "24/7 AI Tutor Access", description: "Practice anytime with our AI for instant feedback on speaking and writing." },
    { icon: FileText, title: "Official Practice Materials", description: "Gain access to a wealth of official and mock test materials to ensure you're ready." },
    { icon: Users, title: "Supportive Community", description: "Join a network of motivated learners on the same journey to Canadian PR." },
]

const faqItems = [
    { q: "Which course is right for me?", a: "This enrollment form is for our comprehensive TEF/TCF program. Once you enroll, we'll place you in the appropriate level (Beginner, Intermediate, or Advanced) based on an initial assessment." },
    { q: "What are the class timings?", a: "We offer flexible batch timings on weekends (morning, afternoon, evening) to suit busy schedules. You can select your preference on the form." },
    { q: "What payment methods do you accept?", a: "We primarily accept Interac e-Transfer and Credit/Debit Cards. PayPal is also available, especially for international students." },
    { q: "What if I miss a class?", a: "All our sessions are recorded, so you can catch up on any missed classes by watching the recordings at your convenience." },
]


export default function EnrollmentPage() {
  const searchParams = useSearchParams();
  const courseId = searchParams.get('course');
  const selectedCourse = coursesData.find(c => c.id === courseId);

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 to-accent/10 py-20 md:py-28">
        <div className="container mx-auto px-4 text-center">
          <FileText className="h-16 w-16 text-primary mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">FRANCOBUDDY Enrollment</h1>
          <p className="text-lg md:text-xl text-foreground/80 max-w-3xl mx-auto">
            You're just a few steps away from starting your TEF Canada journey. Fill out the form below to secure your spot!
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-5 gap-12 items-start">
                {/* Left Side: Form */}
                <div className="lg:col-span-3">
                    <EnrollmentForm course={selectedCourse} />
                </div>

                {/* Right Side: Info & Testimonials */}
                <aside className="lg:col-span-2 space-y-8 sticky top-24">
                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-xl text-primary">What You'll Get</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {whatYouGetItems.slice(0,4).map((item, index) => (
                                <div key={index} className="flex items-start gap-3">
                                    <item.icon className="h-5 w-5 text-secondary mt-1 shrink-0" />
                                    <div>
                                        <h4 className="font-semibold text-foreground">{item.title}</h4>
                                        <p className="text-xs text-muted-foreground">{item.description}</p>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                    
                    <Card className="shadow-lg">
                         <CardHeader>
                            <CardTitle className="text-xl text-primary">Student Success</CardTitle>
                        </CardHeader>
                        <CardContent>
                           {testimonials.slice(0,1).map((testimonial) => (
                                <blockquote key={testimonial.author} className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        {[...Array(5)].map((_, i) => <Star key={i} className={`h-4 w-4 text-yellow-400 fill-yellow-400`} />)}
                                    </div>
                                    <p className="text-sm text-muted-foreground italic">&quot;{testimonial.quote}&quot;</p>
                                    <div className="flex items-center gap-3">
                                        <Image src={testimonial.image} alt={testimonial.author} width={40} height={40} className="rounded-full" data-ai-hint={testimonial.dataAiHint} />
                                        <div>
                                            <p className="font-semibold text-xs text-foreground">{testimonial.author}</p>
                                            <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                                        </div>
                                    </div>
                                </blockquote>
                           ))}
                        </CardContent>
                    </Card>
                </aside>
            </div>
        </div>
      </section>
      
      {/* Why French is Important Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
            <SectionTitle title="Why is French Your Key to Canadian PR?" subtitle="Unlock up to 74 additional CRS points and fast-track your immigration journey."/>
            <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
                <div className="aspect-video bg-slate-800 rounded-lg flex items-center justify-center">
                    <Video className="h-16 w-16 text-muted-foreground" />
                    <p className="absolute text-background font-semibold">Video Coming Soon</p>
                </div>
                <div>
                     <p className="text-lg text-foreground/80 mb-4">
                        Proving French language proficiency is the single most effective way to boost your Express Entry profile. Achieving a CLB 7 or higher in French can add up to 74 points to your CRS score, significantly increasing your chances of receiving an Invitation to Apply (ITA).
                    </p>
                    <ul className="space-y-3">
                        <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-green-500 mt-1 shrink-0"/><span>Gain a competitive edge in the Express Entry pool.</span></li>
                        <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-green-500 mt-1 shrink-0"/><span>Open doors to specific Provincial Nominee Programs (PNPs).</span></li>
                        <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-green-500 mt-1 shrink-0"/><span>Enhance your job prospects across Canada.</span></li>
                    </ul>
                </div>
            </div>
        </div>
      </section>

      {/* Testimonials Grid Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
            <SectionTitle title="Join Our Community of High-Achievers" subtitle="See what our successful students from across the GTA are saying."/>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
               {testimonials.map((testimonial, index) => (
                 <Card key={index} className="p-6 shadow-lg h-full flex flex-col bg-card">
                    <CardContent className="flex-grow p-0">
                        <p className="text-muted-foreground italic">&quot;{testimonial.quote}&quot;</p>
                    </CardContent>
                     <div className="mt-4 flex items-center justify-between">
                         <div className="flex items-center gap-3">
                             <Image src={testimonial.image} alt={testimonial.author} width={40} height={40} className="rounded-full" data-ai-hint={testimonial.dataAiHint} />
                             <div>
                                 <h4 className="font-semibold text-primary">{testimonial.author}</h4>
                                 <p className="text-xs text-muted-foreground">{testimonial.location}</p>
                             </div>
                         </div>
                         <div className="flex items-center">
                            {[...Array(5)].map((_, i) => <Star key={i} className={`h-4 w-4 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`} />)}
                         </div>
                     </div>
                 </Card>
               ))}
            </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 max-w-3xl">
          <SectionTitle title="Frequently Asked Questions"/>
           <Accordion type="single" collapsible className="w-full">
              {faqItems.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="bg-card shadow-sm rounded-lg px-2 mb-4">
                  <AccordionTrigger className="text-left hover:no-underline py-4 px-4 text-base font-medium text-secondary">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="py-4 px-4 text-muted-foreground">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            <div className="text-center mt-8">
                <Button asChild variant="outline">
                    <Link href="/contact">Have More Questions? Contact Us</Link>
                </Button>
            </div>
        </div>
      </section>
    </>
  );
}
