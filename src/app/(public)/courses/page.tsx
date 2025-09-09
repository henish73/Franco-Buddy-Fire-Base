import Link from 'next/link';
import { Button } from '@/components/ui/button';
import SectionTitle from '@/components/shared/SectionTitle';
import CourseCard from '@/components/shared/CourseCard';
import { HelpCircle, Star, Users, Award } from 'lucide-react';
import { coursesData } from './mockCoursesData'; 

export default function CoursesPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-secondary text-secondary-foreground py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Master French for Your Future</h1>
          <p className="text-lg md:text-xl text-secondary-foreground/80 max-w-3xl mx-auto">
            Choose the perfect TEF Canada preparation course designed to meet your specific CLB goals and learning preferences.
          </p>
           <div className="mt-8 flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-secondary-foreground/90">
            <span className="flex items-center gap-2"><Users className="h-5 w-5 text-primary"/> 184+ Students Helped</span>
            <span className="flex items-center gap-2"><Award className="h-5 w-5 text-primary"/> 96% Success Rate</span>
            <span className="flex items-center gap-2"><Star className="h-5 w-5 text-primary"/> 15+ Years Experience</span>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
             <Button asChild size="lg" variant="default" className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Link href="/pricing">View Plans</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-secondary-foreground text-secondary hover:bg-secondary-foreground/90">
              <Link href="/book-demo">Book Free Demo</Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Course Listing Area */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <SectionTitle title="Our Course Offerings" subtitle="Expertly crafted programs for every level."/>
          {coursesData.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
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
            <h2 className="text-2xl md:text-3xl font-semibold text-secondary mb-4">Not Sure Which Course is Right for You?</h2>
            <p className="text-muted-foreground mb-8">
              Let our experts guide you. Book a free demo class to discuss your goals and get a personalized recommendation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                <Link href="/book-demo">Book Free Demo</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
