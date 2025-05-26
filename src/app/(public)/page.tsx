import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import SectionTitle from '@/components/shared/SectionTitle';
import StatCard from '@/components/shared/StatCard';
import { CheckCircle, Users, Clock, Award, UserCheck, BookOpen, Mic, Laptop, Star, TrendingUp, Target, UserCircle, ChevronRight, Home } from 'lucide-react';
import { getSiteSettings } from '@/app/admin/settings/actions'; // Import the new fetch function

// Placeholder data - In a real app, this would come from a CMS or database for courses/testimonials
const courses = [
  { id: "tef-foundation", title: "TEF Foundation", description: "Build a strong base for your TEF Canada journey. Ideal for beginners.", targetCLB: "4-6", format: "1:1 / 1:3", image: "https://placehold.co/600x400.png", dataAiHint: "study learning" },
  { id: "tef-pro-clb7", title: "TEF Pro - CLB 7+", description: "Intensive preparation to achieve CLB 7+ for Express Entry.", targetCLB: "7+", format: "1:1 / 1:3", image: "https://placehold.co/600x400.png", dataAiHint: "success achievement" },
];

const testimonials = [
  { quote: "French.GTA helped me achieve CLB 8! The personalized support was incredible.", author: "Priya S.", image: "https://placehold.co/100x100.png", dataAiHint: "student portrait" },
  { quote: "Flexible classes and expert instructors. Highly recommend for TEF Canada.", author: "Ahmed K.", image: "https://placehold.co/100x100.png", dataAiHint: "professional male" },
];

const whyFrenchGTAItems = [
  { icon: Target, title: "TEF-Only Focus", description: "We specialize exclusively in TEF Canada, ensuring targeted and effective preparation." },
  { icon: Award, title: "Expert Instructors", description: "Learn from certified professionals with years of TEF Canada coaching experience." },
  { icon: Clock, title: "Flexible Classes", description: "Batch timings designed to fit your busy schedule, including evenings and weekends." },
  { icon: UserCheck, title: "Personalized Support", description: "One-on-one guidance and doubt-clearing sessions to address your specific needs." },
  { icon: TrendingUp, title: "Proven Results", description: "Our students consistently achieve high CLB scores for immigration and work permits." },
];

const howWeWorkSteps = [
  { icon: BookOpen, title: "Assessment & Goal Setting", description: "We understand your current level and TEF objectives." },
  { icon: Laptop, title: "Structured Learning", description: "Engaging live classes, comprehensive notes, and recorded sessions." },
  { icon: Mic, title: "Mock Tests & Feedback", description: "Regular practice tests simulating real exam conditions with detailed feedback." },
  { icon: Star, title: "Personalized Coaching", description: "Targeted support to overcome weaknesses and maximize your score." },
];

export default async function HomePage() {
  // Fetch dynamic quick stats
  const siteSettings = await getSiteSettings();
  const quickStats = {
    studentsHelped: siteSettings?.studentsHelpedCount || "150+", // Fallback to default
    successRate: siteSettings?.successRateCLB7 || "92%",    // Fallback to default
  };

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 to-background py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-primary mb-6">
            Unlock Your Canadian Dream with TEF Canada Mastery
          </h1>
          <p className="text-lg md:text-xl text-foreground/80 mb-10 max-w-3xl mx-auto">
            Achieve CLB 7+ in TEF Canada. Expert guidance, flexible classes, and personalized support for Express Entry and Work Permit success.
          </p>
          <Button asChild size="lg" className="shadow-lg hover:shadow-primary/50 transition-shadow">
            <Link href="/book-demo">Book Your FREE Demo Class Now</Link>
          </Button>
          <div className="mt-16">
            <Image
              src="https://placehold.co/1200x600.png"
              alt="Students learning French for TEF Canada"
              width={1200}
              height={600}
              className="rounded-lg shadow-2xl mx-auto"
              data-ai-hint="diverse students collaboration"
              priority
            />
          </div>
        </div>
      </section>

      {/* Quick Stats Banner */}
      <section className="bg-muted py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center md:text-left">
            <StatCard title="Students Helped" value={quickStats.studentsHelped} description="Achieve their TEF Canada goals" />
            <StatCard title="CLB 7+ Success Rate" value={quickStats.successRate} description="For Express Entry points" />
          </div>
        </div>
      </section>

      {/* Why French.GTA? Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <SectionTitle title="Why Choose French.GTA?" subtitle="Your dedicated partner for TEF Canada success. We offer unparalleled expertise and support tailored to your immigration and professional goals." />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {whyFrenchGTAItems.map((item, index) => (
              <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
                    <item.icon className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl text-primary">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Course Spotlights Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <SectionTitle title="Our TEF Canada Courses" subtitle="Expertly crafted programs to help you excel in the TEF Canada exam." />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {courses.map((course) => (
              <Card key={course.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
                <Image src={course.image} alt={course.title} width={600} height={400} className="w-full h-64 object-cover" data-ai-hint={course.dataAiHint} />
                <CardHeader>
                  <CardTitle className="text-2xl text-primary">{course.title}</CardTitle>
                  <CardDescription>{course.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-muted-foreground"><strong>Target CLB:</strong> {course.targetCLB}</p>
                  <p className="text-sm text-muted-foreground"><strong>Format:</strong> {course.format}</p>
                </CardContent>
                <CardFooter>
                  <Button asChild variant="default" className="w-full">
                    <Link href={`/courses/${course.id}`}>View Details <ChevronRight className="ml-2 h-4 w-4" /></Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
           <div className="text-center mt-12">
            <Button asChild variant="outline" size="lg">
              <Link href="/courses">Explore All Courses</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How We Get You TEF-Ready Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <SectionTitle title="How We Get You TEF-Ready" subtitle="Our structured 4-step process ensures comprehensive preparation and optimal results." />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {howWeWorkSteps.map((step, index) => (
              <Card key={index} className="text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                    <step.icon className="h-10 w-10 text-primary" />
                  </div>
                  <CardTitle className="text-lg text-primary">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof - Testimonial Snippets */}
      <section className="py-16 md:py-24 bg-primary/5">
        <div className="container mx-auto px-4">
          <SectionTitle title="Success Stories" subtitle="Hear from students who achieved their Canadian dreams with French.GTA." />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="shadow-lg flex flex-col items-center text-center p-6">
                <Image src={testimonial.image} alt={testimonial.author} width={80} height={80} className="rounded-full mb-4 border-2 border-primary" data-ai-hint={testimonial.dataAiHint} />
                <CardContent className="flex-grow">
                  <p className="text-muted-foreground italic">&quot;{testimonial.quote}&quot;</p>
                </CardContent>
                <CardFooter>
                  <p className="font-semibold text-primary">- {testimonial.author}</p>
                </CardFooter>
              </Card>
            ))}
          </div>
          {/* <div className="text-center mt-12">
            <Button asChild variant="link">
              <Link href="/testimonials">Read More Testimonials <ChevronRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div> */}
        </div>
      </section>
      
      {/* CLB Points / Express Entry Focus Block */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="bg-primary text-primary-foreground p-8 md:p-12 rounded-lg shadow-xl text-center">
            <Users className="h-16 w-16 text-background mx-auto mb-6 opacity-80" />
            <h3 className="text-3xl md:text-4xl font-bold mb-4">Maximize Your Express Entry Points</h3>
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Achieving CLB 7 or higher in French can significantly boost your CRS score by up to 50-68 points. Let us help you secure those crucial points for Canadian Permanent Residency.
            </p>
            <Button asChild variant="secondary" size="lg">
              <Link href="/book-demo">Boost Your CRS Score Now</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Meet Your Guide - Brief Founder Intro */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <SectionTitle title="Meet Your Guide" />
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 max-w-4xl mx-auto">
            <Image src="https://placehold.co/300x300.png" alt="Henish Patel - Founder of French.GTA" width={250} height={250} className="rounded-full shadow-lg border-4 border-primary" data-ai-hint="founder portrait young" />
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-semibold text-primary mb-2">Henish Patel</h3>
              <p className="text-md text-muted-foreground mb-4">Founder & Lead TEF Canada Coach</p>
              <p className="text-foreground/80 mb-4">
                As a Computer Science student at Algoma University, Brampton, with a passion for AI, I founded French.GTA to provide high-quality, tech-enhanced TEF Canada preparation. My goal is to help you succeed with a modern, supportive, and results-driven approach.
              </p>
              <Button asChild variant="outline">
                <Link href="/about">Learn More About Henish <ChevronRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action Section */}
      <section className="py-20 md:py-32 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
            Ready to Start Your TEF Canada Journey?
          </h2>
          <p className="text-lg md:text-xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto">
            Your Canadian dream is within reach. Take the first step today with our expert guidance.
          </p>
          <Button asChild size="lg" variant="secondary" className="shadow-lg hover:shadow-xl transition-shadow">
            <Link href="/book-demo">Book Your FREE Demo Class</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
