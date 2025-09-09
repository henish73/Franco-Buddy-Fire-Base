import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import SectionTitle from '@/components/shared/SectionTitle';
import { Award, BookOpen, MapPin, Users, Lightbulb, ShieldCheck, Clock, TrendingUp, Target, Heart, GitCommit, CheckCircle, Sparkles } from 'lucide-react';

const ourApproachItems = [
  { icon: GitCommit, title: "Structured Learning Paths", description: "Our curriculum is logically structured to take you from foundational concepts to advanced fluency, ensuring no gaps in your learning." },
  { icon: Users, title: "Personalized Instruction", description: "With small class sizes, our instructors tailor their teaching methods to your unique learning style and pace." },
  { icon: Sparkles, title: "Practical Communication Focus", description: "We emphasize real-world communication skills, so you can confidently use French in everyday and professional situations." },
  { icon: Heart, title: "Cultural Integration", description: "Learn more than just the language. We integrate cultural nuances to give you a holistic understanding of the French-speaking world." },
  { icon: Lightbulb, title: "Technology-Enhanced Learning", description: "We leverage modern tools and our AI Tutor to provide an interactive and effective learning experience." },
  { icon: TrendingUp, title: "Continuous Assessment", description: "Regular feedback and mock tests ensure you're always on track to meet your TEF Canada goals." },
];

const ourValuesItems = [
  { title: "Excellence", description: "We uphold the highest standards in teaching and curriculum design." },
  { title: "Student Success", description: "Your goals are our goals. We are deeply committed to your achievement." },
  { title: "Innovation", description: "We continuously evolve our methods and integrate technology for better outcomes." },
  { title: "Community", description: "We foster a supportive and collaborative environment for all learners." },
  { title: "Transparency", description: "Clear, honest communication in our pricing, curriculum, and feedback." },
  { title: "Passion", description: "Our love for the French language and teaching inspires everything we do." },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-secondary via-background to-background text-foreground py-20 md:py-32 animate-background-pan">
        <div className="container mx-auto px-4 text-center animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About FRANCOBUDDY</h1>
          <p className="text-lg md:text-xl opacity-80 max-w-3xl mx-auto">
            Your dedicated partner in online French education, specializing in TEF Canada success.
          </p>
          <div className="mt-8 flex justify-center gap-x-8 gap-y-4 opacity-90">
            <span className="font-semibold">184+ Students Trained</span>
            <span className="font-semibold">96% Satisfaction Rate</span>
            <span className="font-semibold">89% TEF Canada Pass Rate</span>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-16 md:py-24 animate-fade-in">
        <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
                <div className="text-center md:text-left">
                    <SectionTitle title="Our Mission" className="text-center md:text-left mb-4" />
                    <p className="text-lg text-foreground/80 leading-relaxed">
                        To provide high-quality, accessible, and personalized French language instruction that empowers individuals to unlock new opportunities, achieve their Canadian immigration goals, and connect with the global Francophone community.
                    </p>
                </div>
                 <div className="text-center md:text-left">
                    <SectionTitle title="Our Vision" className="text-center md:text-left mb-4" />
                    <p className="text-lg text-foreground/80 leading-relaxed">
                        To be the most trusted and effective online French language school for aspiring Canadians, recognized for our commitment to student success, innovative teaching methods, and the vibrant community we build.
                    </p>
                </div>
            </div>
        </div>
      </section>

      {/* Our Approach Section */}
      <section className="py-16 md:py-24 bg-muted/30 animate-fade-in-up">
        <div className="container mx-auto px-4">
          <SectionTitle title="Our Approach" subtitle="A learning methodology built for results." />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ourApproachItems.map((item, index) => (
              <div key={index} className="p-6 rounded-lg text-center bg-card shadow-lg hover:shadow-xl transition-shadow duration-300">
                <item.icon className="h-10 w-10 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-secondary mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Our Values Section */}
      <section className="py-16 md:py-24 animate-fade-in">
        <div className="container mx-auto px-4">
           <SectionTitle title="Our Core Values" />
           <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-8">
            {ourValuesItems.map((item, index) => (
              <div key={index} className="text-center">
                <h3 className="text-xl font-semibold text-secondary mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.description}</p>
              </div>
            ))}
           </div>
        </div>
      </section>

      {/* Why Choose Us Section (Summarized) */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground animate-fade-in-up">
        <div className="container mx-auto px-4">
          <SectionTitle title="Why Choose Us?" subtitle="The distinct advantages that set us apart." titleClassName="text-background" subtitleClassName="opacity-80" />
          <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6 max-w-4xl mx-auto text-lg">
            <li className="flex items-start gap-3">
              <Award className="h-6 w-6 text-secondary mt-1 shrink-0" />
              <span><strong>Certified Expertise:</strong> Learn from the best C1/C2 certified instructors.</span>
            </li>
            <li className="flex items-start gap-3">
              <Clock className="h-6 w-6 text-secondary mt-1 shrink-0" />
              <span><strong>Flexible Scheduling:</strong> Online & In-person classes that fit your life.</span>
            </li>
            <li className="flex items-start gap-3">
              <Users className="h-6 w-6 text-secondary mt-1 shrink-0" />
              <span><strong>Small Class Sizes:</strong> Maximum 3-5 students for personalized attention.</span>
            </li>
             <li className="flex items-start gap-3">
              <BookOpen className="h-6 w-6 text-secondary mt-1 shrink-0" />
              <span><strong>Proven Curriculum:</strong> A results-driven curriculum focused on TEF Canada success.</span>
            </li>
             <li className="flex items-start gap-3">
              <ShieldCheck className="h-6 w-6 text-secondary mt-1 shrink-0" />
              <span><strong>Success Guarantee:</strong> We are committed to helping you achieve your goals.</span>
            </li>
             <li className="flex items-start gap-3">
              <Lightbulb className="h-6 w-6 text-secondary mt-1 shrink-0" />
              <span><strong>24/7 Support:</strong> Our team and community are here for you every step of the way.</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Our Commitment Section */}
      <section className="py-16 md:py-24 animate-fade-in">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <SectionTitle title="Our Commitment to You" />
          <p className="text-lg text-foreground/80 mb-8">
            Your success is the measure of our success. We are committed to providing you with the tools, support, and expert guidance necessary to not only pass the TEF Canada exam but to thrive in your new life in Canada. We promise to be your dedicated partner throughout your French learning journey.
          </p>
           <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-left">
              <span className="flex items-center gap-2 text-muted-foreground"><CheckCircle className="h-4 w-4 text-green-500 shrink-0"/> Highest Quality Instruction</span>
              <span className="flex items-center gap-2 text-muted-foreground"><CheckCircle className="h-4 w-4 text-green-500 shrink-0"/> Unwavering Support</span>
              <span className="flex items-center gap-2 text-muted-foreground"><CheckCircle className="h-4 w-4 text-green-500 shrink-0"/> Transparent Pricing</span>
              <span className="flex items-center gap-2 text-muted-foreground"><CheckCircle className="h-4 w-4 text-green-500 shrink-0"/> Flexible Learning Options</span>
              <span className="flex items-center gap-2 text-muted-foreground"><CheckCircle className="h-4 w-4 text-green-500 shrink-0"/> A Positive Community</span>
           </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary/10">
        <div className="container mx-auto px-4 text-center animate-fade-in-up">
          <h2 className="text-3xl font-bold text-primary mb-6">Ready to Excel in Your TEF Canada Exam?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            Join FRANCOBUDDY and take the definitive step towards achieving your Canadian aspirations.
          </p>
          <Button asChild size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 animate-pulse">
            <Link href="/book-demo">Book Your Free Demo!</Link>
          </Button>
        </div>
      </section>
    </>
  );
}