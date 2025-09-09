// src/app/public/enrollment-form/page.tsx
'use client'

import { useSearchParams } from 'next/navigation';
import EnrollmentForm from './EnrollmentForm';
import { coursesData } from '@/app/(public)/courses/mockCoursesData';
import { type Course } from '@/components/shared/CourseCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { FileText, CheckCircle, Star, Users, Award, Video, Lightbulb, UserCheck, BookOpen, Target, HelpCircle, Check, Sparkles } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import SectionTitle from '@/components/shared/SectionTitle';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from '@/components/ui/button';

const testimonials = [
  { quote: "FRANCOBUDDY was a game-changer! I scored 371/400 in my TEF Canada exam, crucial for my PR application in Toronto. The instructors are the best for anyone serious about immigration.", author: "Priya Sharma", role: "Software Engineer", location: "Toronto, ON", image: "https://picsum.photos/100/100", dataAiHint: "professional woman portrait", rating: 5 },
  { quote: "I needed a high TCF score for my work permit extension in Mississauga. FRANCOBUDDY's personalized approach helped me go from zero French to a confident B2. Highly recommend for TEF and TCF.", author: "Rahul Patel", role: "Business Analyst", location: "Mississauga, ON", image: "https://picsum.photos/101/101", dataAiHint: "professional man portrait", rating: 5 },
  { quote: "Living in Brampton, I needed flexible TEF classes. The online program was perfect, and the small class size helped me pass with flying colors for my Express Entry profile.", author: "Kavya Reddy", role: "University Student", location: "Brampton, ON", image: "https://picsum.photos/102/102", dataAiHint: "female student portrait", rating: 4.8 },
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

      {/* Why French is Important Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
            <SectionTitle title="Why is French Your Key to Canadian PR?" subtitle="Unlock up to 74 additional CRS points and fast-track your immigration journey."/>
            <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
                <div className="relative aspect-video rounded-lg overflow-hidden shadow-xl">
                    <Image src="https://picsum.photos/800/450" alt="Students in Canada celebrating PR" fill className="object-cover" data-ai-hint="canada landscape success"/>
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

      {/* Reviews & What You'll Get Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
            <SectionTitle title="Join Our Community of High-Achievers" subtitle="See what our successful students from across the GTA are saying."/>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
               {testimonials.map((testimonial, index) => (
                 <Card key={index} className="p-6 shadow-lg h-full flex flex-col bg-card rounded-2xl">
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

            <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="relative aspect-square rounded-lg overflow-hidden shadow-xl">
                     <Image src="https://picsum.photos/600/600" alt="French learning materials" fill className="object-cover" data-ai-hint="learning materials books"/>
                </div>
                <div>
                     <SectionTitle title="What You'll Get" subtitle="Everything you need to succeed in one comprehensive package." className="text-left" />
                    <div className="grid md:grid-cols-2 gap-6">
                        {whatYouGetItems.map((item, index) => (
                            <div key={index} className="flex items-start gap-3">
                                <item.icon className="h-8 w-8 text-primary shrink-0 mt-1" />
                                <div>
                                    <h3 className="text-lg font-semibold text-foreground mb-1">{item.title}</h3>
                                    <p className="text-sm text-muted-foreground">{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* AI Tutor Section */}
       <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
                <div>
                     <SectionTitle title="Practice Smarter with Your Personal AI Language Tutor" subtitle="Our standout feature that accelerates your learning and boosts your confidence." className="text-left" />
                     <p className="text-lg text-foreground/80 mb-4">
                        Gain a significant advantage with our revolutionary AI Tutor. Practice all four language skills—Speaking, Writing, Reading, and Listening—anytime, anywhere, and receive instant, TEF-aligned feedback.
                    </p>
                    <ul className="space-y-3">
                        <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-green-500 mt-1 shrink-0"/><span>**Instant Feedback:** Get immediate scores and suggestions on your performance.</span></li>
                        <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-green-500 mt-1 shrink-0"/><span>**24/7 Availability:** Practice whenever inspiration strikes, without needing a live instructor.</span></li>
                        <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-green-500 mt-1 shrink-0"/><span>**Targeted Practice:** Focus on TEF-specific tasks to build exam-day confidence.</span></li>
                    </ul>
                </div>
                <div className="relative aspect-square rounded-lg overflow-hidden shadow-xl">
                    <Image src="https://picsum.photos/600/600" alt="AI Tutor Interface showing feedback" fill className="object-cover" data-ai-hint="ai analytics chart"/>
                </div>
            </div>
        </div>
      </section>

      {/* Pricing Plan Section */}
      <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
              <SectionTitle title="Choose Your Learning Path" subtitle="Select the plan that best fits your learning style and goals." />
              <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
                  <Card className="shadow-xl border-primary border-2 rounded-2xl">
                      <CardHeader>
                          <CardTitle className="text-2xl text-primary">1:3 Small Group Learning</CardTitle>
                          <CardDescription>Collaborative learning with personalized attention.</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                          <p className="text-3xl font-bold text-foreground">$249 <span className="text-base font-normal text-muted-foreground">/month</span></p>
                          <ul className="space-y-2 text-sm text-muted-foreground">
                              <li className="flex items-start gap-2"><Check className="h-4 w-4 text-green-500 mt-1 shrink-0"/><span>Cost-effective and motivational.</span></li>
                              <li className="flex items-start gap-2"><Check className="h-4 w-4 text-green-500 mt-1 shrink-0"/><span>Learn from peers' questions and insights.</span></li>
                              <li className="flex items-start gap-2"><Check className="h-4 w-4 text-green-500 mt-1 shrink-0"/><span>Max 3-5 students for quality interaction.</span></li>
                          </ul>
                      </CardContent>
                      <CardFooter>
                         <Button asChild className="w-full rounded-full"><Link href="#enroll">Choose Group Plan</Link></Button>
                      </CardFooter>
                  </Card>
                  <Card className="shadow-xl rounded-2xl">
                      <CardHeader>
                          <CardTitle className="text-2xl text-primary">1:1 Personal Coaching</CardTitle>
                          <CardDescription>The fastest and most flexible path to fluency.</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                          <p className="text-3xl font-bold text-foreground">$399 <span className="text-base font-normal text-muted-foreground">/month</span></p>
                           <ul className="space-y-2 text-sm text-muted-foreground">
                              <li className="flex items-start gap-2"><Check className="h-4 w-4 text-green-500 mt-1 shrink-0"/><span>100% tailored to your specific needs.</span></li>
                              <li className="flex items-start gap-2"><Check className="h-4 w-4 text-green-500 mt-1 shrink-0"/><span>Flexible scheduling to fit your life.</span></li>
                              <li className="flex items-start gap-2"><Check className="h-4 w-4 text-green-500 mt-1 shrink-0"/><span>Intensive focus on your weak areas.</span></li>
                          </ul>
                      </CardContent>
                       <CardFooter>
                         <Button asChild className="w-full rounded-full"><Link href="#enroll">Choose Personal Plan</Link></Button>
                      </CardFooter>
                  </Card>
              </div>
          </div>
      </section>

      {/* Enrollment Form Section */}
      <section id="enroll" className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex justify-center">
            <EnrollmentForm course={selectedCourse} />
          </div>
        </div>
      </section>
      
       {/* "Not Sure Which Course?" CTA */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="bg-card p-8 md:p-12 rounded-2xl shadow-xl max-w-2xl mx-auto">
            <HelpCircle className="h-12 w-12 text-primary mx-auto mb-6" />
            <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-4">Not Sure or Have Questions?</h2>
            <p className="text-muted-foreground mb-8">
              Let our experts guide you. Book a free, no-obligation demo class to discuss your goals and get a personalized recommendation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="rounded-full">
                <Link href="/book-demo">Book Free Demo</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full">
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
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
                  <AccordionTrigger className="text-left hover:no-underline py-4 px-4 text-base font-medium text-secondary rounded-full">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="py-4 px-4 text-muted-foreground">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            <div className="text-center mt-8">
                <Button asChild variant="outline" className="rounded-full">
                    <Link href="/contact">Have More Questions? Contact Us</Link>
                </Button>
            </div>
        </div>
      </section>
    </>
  );
}
