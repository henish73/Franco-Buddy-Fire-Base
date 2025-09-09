
import SectionTitle from '@/components/shared/SectionTitle';
import DemoBookingForm from './DemoBookingForm';
import { CalendarCheck, Sparkles, HelpCircle, Star, ShieldCheck, Users, UserCheck, BookOpen, Target } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card } from '@/components/ui/card';


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
        q: "Can I reschedule my demo class?",
        a: "Yes, you can reschedule your demo class up to 24 hours in advance. Please contact us via email or WhatsApp to make changes."
    }
]

export default function BookDemoPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-secondary/10 to-primary/10 py-20 md:py-28">
        <div className="container mx-auto px-4 text-center">
          <CalendarCheck className="h-16 w-16 text-secondary mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold text-secondary mb-4">Book Your FREE Demo Class</h1>
          <div className="mt-4 flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-foreground/80">
            <span className="flex items-center gap-1"><ShieldCheck className="h-5 w-5 text-green-500"/> 96% Success Rate</span>
            <span className="flex items-center gap-1"><Users className="h-5 w-5 text-green-500"/> 500+ Happy Students</span>
            <span className="flex items-center gap-1"><Star className="h-5 w-5 text-yellow-400 fill-yellow-400"/> 4.9/5 Average Rating</span>
          </div>
        </div>
      </section>

      {/* 3-Step Booking Process */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
            <SectionTitle title="Your 3-Step Path to Success" subtitle="Booking your free demo is quick and easy."/>
            <div className="grid md:grid-cols-3 gap-8 text-center max-w-4xl mx-auto">
                <div className="p-6">
                    <div className="relative mb-4">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary/20 text-primary font-bold h-16 w-16 rounded-full flex items-center justify-center text-2xl">1</div>
                    </div>
                    <h3 className="text-xl font-semibold mt-20 text-secondary">Select Date</h3>
                    <p className="text-muted-foreground mt-2">Choose a convenient Saturday or Sunday from the calendar.</p>
                </div>
                 <div className="p-6">
                    <div className="relative mb-4">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary/20 text-primary font-bold h-16 w-16 rounded-full flex items-center justify-center text-2xl">2</div>
                    </div>
                    <h3 className="text-xl font-semibold mt-20 text-secondary">Choose Time</h3>
                    <p className="text-muted-foreground mt-2">Pick one of the available time slots that fits your schedule.</p>
                </div>
                 <div className="p-6">
                    <div className="relative mb-4">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary/20 text-primary font-bold h-16 w-16 rounded-full flex items-center justify-center text-2xl">3</div>
                    </div>
                    <h3 className="text-xl font-semibold mt-20 text-secondary">Confirm Details</h3>
                    <p className="text-muted-foreground mt-2">Fill in your details and tell us about your goals. That's it!</p>
                </div>
            </div>
            <div className="mt-12 flex justify-center">
                <DemoBookingForm />
            </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <SectionTitle title="What to Expect from Your Demo" subtitle="This is more than just a trial; it's the first step in your personalized learning plan."/>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <Card className="text-center p-6"><Sparkles className="h-8 w-8 mx-auto text-primary mb-3"/><h4 className="font-semibold text-secondary">Personalized Level Assessment</h4></Card>
            <Card className="text-center p-6"><UserCheck className="h-8 w-8 mx-auto text-primary mb-3"/><h4 className="font-semibold text-secondary">Meet Our Expert Instructors</h4></Card>
            <Card className="text-center p-6"><BookOpen className="h-8 w-8 mx-auto text-primary mb-3"/><h4 className="font-semibold text-secondary">Understand Our Teaching Style</h4></Card>
            <Card className="text-center p-6"><Target className="h-8 w-8 mx-auto text-primary mb-3"/><h4 className="font-semibold text-secondary">Get a Custom Learning Plan</h4></Card>
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
    </>
  );
}
