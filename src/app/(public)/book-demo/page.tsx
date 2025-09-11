

import SectionTitle from '@/components/shared/SectionTitle';
import DemoBookingForm from './DemoBookingForm';
import { CalendarCheck, Sparkles, HelpCircle, Star, ShieldCheck, Users, UserCheck, BookOpen, Target, CheckCircle, Wallet } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import Image from 'next/image';

const testimonials = [
  { quote: "The free demo was so insightful! The instructor pinpointed my exact weaknesses in just 30 minutes and gave me a clear plan. It was the best decision I made for my TEF prep.", author: "Priya Sharma", location: "Canada", image: "https://picsum.photos/seed/t1/100/100", dataAiHint: "professional woman portrait", rating: 5 },
  { quote: "I was hesitant at first, but the demo class showed me how different FRANCOBUDDY is. The focus on immigration goals from day one is incredible. I signed up immediately.", author: "Rahul Patel", location: "Canada", image: "https://picsum.photos/seed/t2/100/100", dataAiHint: "professional man portrait", rating: 5 },
  { quote: "Booking the demo was the easiest and most valuable step. It gave me the confidence that I was choosing the right place to invest in my future in Canada.", author: "Kavya Reddy", location: "Canada", image: "https://picsum.photos/seed/t3/100/100", dataAiHint: "female student portrait", rating: 5 },
];


const faqItems = [
    {
        q: "Is the demo class really free?",
        a: "Yes, absolutely! The 30-minute demo class is 100% free with no obligation. It's our way of helping you understand our teaching style and how we can help you succeed."
    },
    {
        q: "What happens during the demo class?",
        a: "During the demo, our expert instructor will assess your current French level, discuss your goals, give you a short sample lesson, and recommend the best course for you."
    },
    {
        q: "What do I need for the demo class?",
        a: "Just a stable internet connection, a device with a microphone and camera (like a laptop or tablet), and a quiet place where you can focus for 30 minutes."
    },
    {
        q: "What happens after I submit the form?",
        a: "Our team will contact you via WhatsApp or email within a few hours to schedule your free demo class at a time that is convenient for you."
    }
]

export default function BookDemoPage() {
  return (
    <>
      {/* Hero Section */}
       <section className="relative h-96">
        <Image 
          src="https://picsum.photos/1920/1080?random=11" 
          alt="Student booking a free demo class for French lessons" 
          className="object-cover w-full h-full"
          fill
          data-ai-hint="planning schedule calendar"
        />
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
          <div className="text-center text-white p-4">
              <CalendarCheck className="h-16 w-16 text-secondary mx-auto mb-6" />
              <h1 className="text-4xl md:text-5xl font-bold text-secondary-foreground mb-4">Book Your FREE TEF Demo Class</h1>
              <p className="text-lg md:text-xl text-secondary-foreground/80 max-w-3xl mx-auto">
                Take the first and most important step towards acing your TEF Canada exam. Discover your current level, get a personalized study plan, and meet our expert instructors.
              </p>
               <div className="mt-8 flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-secondary-foreground/90">
                <span className="flex items-center gap-1"><ShieldCheck className="h-5 w-5 text-green-400"/> No Obligation, 100% Free</span>
                <span className="flex items-center gap-1"><Users className="h-5 w-5 text-green-400"/> 500+ Students Helped</span>
                <span className="flex items-center gap-1"><Star className="h-5 w-5 text-yellow-400 fill-yellow-400"/> 4.9/5 Average Rating</span>
              </div>
          </div>
        </div>
      </section>

      {/* Main Form Section */}
      <section id="book-demo-form" className="py-16 md:py-24">
        <div className="container mx-auto px-4 flex flex-col items-center gap-8">
            <SectionTitle 
                title="Secure Your Free Spot Now" 
                subtitle="Select a date and time that works for you, and we'll confirm your personalized 30-minute demo class." 
            />
           <DemoBookingForm />
        </div>
      </section>
      
       {/* Testimonials Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <SectionTitle title="Students Who Started with a Demo" subtitle="See what our successful students say about their initial demo experience." />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="shadow-xl flex flex-col p-6 bg-card">
                 <div className="flex items-center mb-4">
                    <Image src={testimonial.image} alt={testimonial.author} width={60} height={60} className="rounded-full mr-4" data-ai-hint={testimonial.dataAiHint} />
                    <div>
                        <h4 className="font-semibold text-primary">{testimonial.author}</h4>
                        <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                    </div>
                </div>
                <CardContent className="flex-grow p-0">
                  <p className="text-muted-foreground italic">&quot;{testimonial.quote}&quot;</p>
                   <div className="flex items-center mt-4">
                        {[...Array(5)].map((_, i) => <Star key={i} className={`h-5 w-5 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />)}
                   </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <SectionTitle title="What to Expect from Your Demo" subtitle="This is more than just a trial; it's the first step in your personalized learning plan."/>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <Card className="text-center p-6 shadow-md"><Sparkles className="h-8 w-8 mx-auto text-primary mb-3"/><h4 className="font-semibold text-secondary">Personalized Level Assessment</h4></Card>
            <Card className="text-center p-6 shadow-md"><UserCheck className="h-8 w-8 mx-auto text-primary mb-3"/><h4 className="font-semibold text-secondary">Meet Our Expert Instructors</h4></Card>
            <Card className="text-center p-6 shadow-md"><BookOpen className="h-8 w-8 mx-auto text-primary mb-3"/><h4 className="font-semibold text-secondary">Understand Our Teaching Style</h4></Card>
            <Card className="text-center p-6 shadow-md"><Target className="h-8 w-8 mx-auto text-primary mb-3"/><h4 className="font-semibold text-secondary">Get a Custom Learning Plan</h4></Card>
          </div>
        </div>
      </section>

       {/* Pricing Plan Section */}
      <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
              <SectionTitle title="Our Transparent Pricing" subtitle="We offer clear, straightforward monthly plans. No hidden fees." />
              <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
                  <Card className="shadow-xl border-primary border-2 rounded-2xl">
                      <CardHeader>
                          <CardTitle className="text-2xl text-primary">1:3 Small Group Learning</CardTitle>
                          <CardDescription>Collaborative learning with personalized attention.</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                          <p className="text-3xl font-bold text-foreground">$249 <span className="text-base font-normal text-muted-foreground">/month</span></p>
                      </CardContent>
                  </Card>
                  <Card className="shadow-xl rounded-2xl">
                      <CardHeader>
                          <CardTitle className="text-2xl text-primary">1:1 Personal Coaching</CardTitle>
                          <CardDescription>The fastest and most flexible path to fluency.</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                          <p className="text-3xl font-bold text-foreground">$399 <span className="text-base font-normal text-muted-foreground">/month</span></p>
                      </CardContent>
                  </Card>
              </div>
              <div className="text-center mt-8">
                <Button asChild variant="link">
                    <Link href="/pricing">View Full Pricing Details</Link>
                </Button>
              </div>
          </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24">
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
        </div>
      </section>

       <section className="py-20 bg-primary/10">
        <div className="container mx-auto px-4 text-center">
            <div className="grid md:grid-cols-2 gap-8 items-center max-w-4xl mx-auto">
                <div className="relative aspect-video rounded-lg overflow-hidden shadow-xl">
                    <Image src="https://picsum.photos/seed/enroll/800/450" alt="Student enrolling in a course" fill className="object-cover" data-ai-hint="enroll now student laptop"/>
                </div>
                <div className="text-left">
                    <h2 className="text-3xl font-bold text-primary mb-6">Ready to Take the Next Step?</h2>
                    <p className="text-muted-foreground mb-6">Once you've had your demo, you'll be ready to join our community of successful learners. Enroll in a course and start your journey to fluency.</p>
                    <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 animate-pulse rounded-full">
                        <Link href="/enrollment-form">Enroll in a Course Now</Link>
                    </Button>
                </div>
            </div>
        </div>
      </section>
    </>
  );
}