import Link from 'next/link';
import { Button } from '@/components/ui/button';
import SectionTitle from '@/components/shared/SectionTitle';
import CourseCard, { type Course } from '@/components/shared/CourseCard'; // Adjust path as needed
import { HelpCircle } from 'lucide-react';

// Placeholder data - In a real app, this would come from Firestore
const coursesData: Course[] = [
  { 
    id: "tef-foundation", 
    title: "TEF Foundation", 
    shortDescription: "Master the fundamentals of French tailored for TEF Canada. Ideal for beginners aiming for CLB 4-6.", 
    targetCLB: "4-6", 
    format: "1:1 Personal Coaching / 1:3 Small Group",
    imageUrl: "https://placehold.co/600x400.png",
    imageAiHint: "classroom study group",
    price1on1: 500, // Example price
    price1on3: 300, // Example price
  },
  { 
    id: "tef-pro-clb7", 
    title: "TEF Pro - CLB 7+", 
    shortDescription: "Intensive, strategy-focused training to help you achieve CLB 7 and above for Express Entry success.", 
    targetCLB: "7+", 
    format: "1:1 Personal Coaching / 1:3 Small Group",
    imageUrl: "https://placehold.co/600x400.png",
    imageAiHint: "professional success graph",
    price1on1: 800, // Example price
    price1on3: 550, // Example price
  },
  { 
    id: "tef-excellence-clb9", 
    title: "TEF Excellence - CLB 9+", 
    shortDescription: "Advanced coaching for those aiming for top-tier CLB 9+ scores, maximizing their CRS points.", 
    targetCLB: "9+", 
    format: "1:1 Personal Coaching",
    imageUrl: "https://placehold.co/600x400.png",
    imageAiHint: "award certificate graduation",
    price1on1: 1200, // Example price
  },
];

export default function CoursesPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our TEF Canada Courses</h1>
          <p className="text-lg md:text-xl text-primary-foreground/80 max-w-3xl mx-auto">
            Choose the perfect TEF Canada preparation course designed to meet your specific CLB goals and learning preferences.
          </p>
        </div>
      </section>

      {/* Introduction to TEF Canada */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <SectionTitle title="Understanding TEF Canada" subtitle="Your gateway to Canadian immigration and professional opportunities." />
          <div className="max-w-3xl mx-auto text-center text-foreground/80 space-y-4">
            <p>
              The Test d&apos;Évaluation de Français pour le Canada (TEF Canada) is a French language proficiency test recognized by Immigration, Refugees and Citizenship Canada (IRCC) for economic immigration programs and obtaining Canadian citizenship.
            </p>
            <p>
              Achieving a high score, particularly CLB 7 or above, can significantly increase your Comprehensive Ranking System (CRS) points for Express Entry, bringing you closer to your dream of living and working in Canada. Our courses are meticulously designed to help you excel in all sections of the TEF Canada: Compréhension écrite, Compréhension orale, Expression écrite, and Expression orale.
            </p>
          </div>
        </div>
      </section>
      
      {/* Course Listing Area */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <SectionTitle title="Explore Our Programs" />
          {coursesData.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {coursesData.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">No courses available at the moment. Please check back soon!</p>
          )}
        </div>
      </section>

      {/* "Not Sure Which Course?" CTA */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="bg-card p-8 md:p-12 rounded-lg shadow-xl max-w-2xl mx-auto">
            <HelpCircle className="h-12 w-12 text-primary mx-auto mb-6" />
            <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-4">Not Sure Which Course is Right for You?</h2>
            <p className="text-muted-foreground mb-8">
              Let our experts guide you. Book a free demo class to discuss your goals and get a personalized recommendation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/book-demo">Book Free Demo</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/ai-course-suggester">Try AI Course Suggester</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
