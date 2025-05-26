import SectionTitle from '@/components/shared/SectionTitle';
import DemoBookingForm from './DemoBookingForm';
import { CalendarCheck, Sparkles } from 'lucide-react';

export default function BookDemoPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 to-accent/10 py-20 md:py-28">
        <div className="container mx-auto px-4 text-center">
          <CalendarCheck className="h-16 w-16 text-primary mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">Secure Your Free TEF Demo Class</h1>
          <p className="text-lg md:text-xl text-foreground/80 max-w-3xl mx-auto">
            Experience our expert coaching firsthand. This no-obligation demo is your first step towards TEF Canada success.
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 flex flex-col lg:flex-row gap-12 items-start justify-center">
          <div className="lg:w-1/3 space-y-6  pt-8">
            <SectionTitle title="Why Book a Demo?" subtitle="Discover how French.GTA can help you achieve your goals." className="text-left mb-6" titleClassName="text-3xl" />
            <ul className="space-y-3 text-foreground/80">
              <li className="flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-accent mt-1 shrink-0" />
                <span>Personalized assessment of your current French level.</span>
              </li>
              <li className="flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-accent mt-1 shrink-0" />
                <span>Clear understanding of our teaching methodology and course structure.</span>
              </li>
              <li className="flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-accent mt-1 shrink-0" />
                <span>Opportunity to meet our expert instructors.</span>
              </li>
              <li className="flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-accent mt-1 shrink-0" />
                <span>Get answers to all your TEF Canada related questions.</span>
              </li>
              <li className="flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-accent mt-1 shrink-0" />
                <span>Receive a tailored recommendation for the best course for you.</span>
              </li>
            </ul>
            <p className="text-sm text-muted-foreground mt-6 italic">
              This is a crucial step to ensure we provide you with the most effective learning path.
            </p>
          </div>
          <div className="lg:w-2/3 flex justify-center">
            <DemoBookingForm />
          </div>
        </div>
      </section>
    </>
  );
}
