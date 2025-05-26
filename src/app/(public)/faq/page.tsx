import Link from 'next/link';
import { Button } from '@/components/ui/button';
import SectionTitle from '@/components/shared/SectionTitle';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle, MessageSquare } from 'lucide-react';

// Placeholder FAQ data
const faqCategories = [
  {
    category: "General Questions",
    questions: [
      { q: "What is French.GTA?", a: "French.GTA is an elite learning platform specializing in TEF Canada preparation for Canadian immigration (Express Entry, PR) and work permit holders." },
      { q: "Who is French.GTA for?", a: "We cater to ambitious international students, work permit holders, and Express Entry applicants needing to prove French proficiency. We help learners from beginner to intermediate levels." },
      { q: "What makes French.GTA different?", a: "Our key differentiators are unmatched instructor quality, flexible batch timings, personalized one-on-one support, and singular TEF Canada expertise." },
    ],
  },
  {
    category: "TEF Exam Information",
    questions: [
      { q: "What is the TEF Canada exam?", a: "The TEF Canada is a French language proficiency test recognized by IRCC for Canadian immigration and citizenship purposes. It assesses four skills: listening, reading, speaking, and writing." },
      { q: "Why is TEF Canada important for Express Entry?", a: "A good score in TEF Canada, especially CLB 7 or higher, can significantly boost your Comprehensive Ranking System (CRS) points, increasing your chances of receiving an Invitation to Apply (ITA) for permanent residency." },
      { q: "How are TEF Canada scores calculated?", a: "Each section of the TEF Canada is scored, and these scores are then converted to Canadian Language Benchmark (CLB) levels. IRCC uses CLB levels to award points." },
    ],
  },
  {
    category: "Course & Enrollment",
    questions: [
      { q: "Which course is right for me?", a: "The best course depends on your current French level and your target CLB score. We recommend booking a free demo class or trying our AI Course Suggester for a personalized recommendation." },
      { q: "How do I enroll in a course?", a: "Currently, enrollment is processed after a free demo session where we assess your needs and discuss the best plan. You can book a demo through our website." },
      { q: "What are the class timings?", a: "We offer flexible batch timings, including weekday mornings, afternoons, evenings, and weekends to suit busy schedules." },
    ],
  },
  {
    category: "Payment & Fees",
    questions: [
      { q: "What are the course fees?", a: "Please visit our Pricing page for detailed information on course fees for 1:1 and 1:3 coaching options." },
      { q: "What payment methods do you accept?", a: "We primarily accept Interac e-Transfer. PayPal is also available as a secondary option, especially for international students (processing fees may apply)." },
      { q: "Are there any hidden charges?", a: "No, our pricing is transparent. The course fee covers all standard learning materials and instruction as outlined for each program." },
    ],
  },
];

export default function FAQPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <HelpCircle className="h-16 w-16 mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-lg md:text-xl text-primary-foreground/80 max-w-3xl mx-auto">
            Find answers to common questions about French.GTA, TEF Canada, our courses, and enrollment.
          </p>
        </div>
      </section>

      {/* FAQ Accordions Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {faqCategories.map((categoryItem) => (
              <div key={categoryItem.category} className="mb-8">
                <h2 className="text-2xl font-semibold text-primary mb-6">{categoryItem.category}</h2>
                <Accordion type="single" collapsible className="w-full space-y-4">
                  {categoryItem.questions.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`} className="bg-card shadow-sm rounded-lg px-2">
                      <AccordionTrigger className="text-left hover:no-underline py-4 px-4 text-base font-medium">
                        {faq.q}
                      </AccordionTrigger>
                      <AccordionContent className="py-4 px-4 text-muted-foreground">
                        {faq.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* "Still Have Questions?" CTA Section */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
           <div className="bg-card p-8 md:p-12 rounded-lg shadow-xl max-w-2xl mx-auto">
            <MessageSquare className="h-12 w-12 text-primary mx-auto mb-6" />
            <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-4">Still Have Questions?</h2>
            <p className="text-muted-foreground mb-8">
              If you can&apos;t find the answer you&apos;re looking for, please don&apos;t hesitate to reach out to us.
            </p>
            <Button asChild size="lg">
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
