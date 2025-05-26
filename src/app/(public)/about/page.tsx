import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import SectionTitle from '@/components/shared/SectionTitle';
import { Award, BookOpen, MapPin, Users, Lightbulb, ShieldCheck } from 'lucide-react';

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About French.GTA</h1>
          <p className="text-lg md:text-xl text-primary-foreground/80 max-w-3xl mx-auto">
            Your trusted partner in TEF Canada preparation, dedicated to helping you achieve your Canadian immigration and professional goals.
          </p>
        </div>
      </section>

      {/* Our Story/Genesis Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <SectionTitle title="Our Story" subtitle="Founded with a passion for language and a commitment to student success." />
          <div className="max-w-3xl mx-auto text-center text-foreground/80 space-y-6">
            <p>
              French.GTA was born from a simple observation: many ambitious individuals striving for a new life in Canada through Express Entry or work permits found TEF Canada to be a significant hurdle. Generic French classes often missed the mark, lacking the specific focus, flexibility, and personalized support needed for this high-stakes exam.
            </p>
            <p>
              We envisioned a platform that was different – a specialized, results-driven learning hub hyper-focused on TEF Canada. A place where students receive expert coaching, tailored strategies, and unwavering support, all designed to fit their busy lives.
            </p>
          </div>
        </div>
      </section>

      {/* Our Teaching Philosophy Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <SectionTitle title="Our Teaching Philosophy" subtitle="Empowering you with skills, confidence, and results." />
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="p-6 rounded-lg">
              <Lightbulb className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-primary mb-2">Focused Expertise</h3>
              <p className="text-muted-foreground">We concentrate solely on TEF Canada, ensuring every lesson and resource is laser-focused on your exam success.</p>
            </div>
            <div className="p-6 rounded-lg">
              <Users className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-primary mb-2">Student-Centric Approach</h3>
              <p className="text-muted-foreground">Your goals, learning style, and schedule are at the heart of our flexible and supportive teaching methods.</p>
            </div>
            <div className="p-6 rounded-lg">
              <ShieldCheck className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-primary mb-2">Results-Driven Methodology</h3>
              <p className="text-muted-foreground">We employ proven strategies, mock tests, and personalized feedback to help you achieve your target CLB score.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Meet the Founder Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <SectionTitle title="Meet the Founder" />
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 bg-card p-8 md:p-12 rounded-lg shadow-xl max-w-4xl mx-auto">
            <Image
              src="https://placehold.co/300x300.png" // Replace with actual image
              alt="Henish Patel, Founder of French.GTA"
              width={250}
              height={250}
              className="rounded-full shadow-lg border-4 border-primary object-cover"
              data-ai-hint="founder young professional"
            />
            <div className="text-center md:text-left">
              <h3 className="text-3xl font-semibold text-primary mb-2">Henish Patel</h3>
              <p className="text-lg text-muted-foreground mb-4">Computer Science Student & Aspiring AI Engineer</p>
              <p className="text-foreground/80 mb-3">
                &quot;Bonjour! I&apos;m Henish, a passionate Computer Science student at Algoma University in Brampton, with a deep interest in Artificial Intelligence. My journey into founding French.GTA stems from a desire to merge quality education with technology to solve real-world challenges.&quot;
              </p>
              <p className="text-foreground/80 mb-3">
                &quot;Seeing fellow students and newcomers struggle with TEF Canada preparation inspired me to create a platform that offers not just expert French coaching, but also the flexibility and personalized support that modern learners need. My vision is to make French.GTA the most trusted and effective resource for anyone aiming to prove their French proficiency for their Canadian dreams.&quot;
              </p>
              <p className="text-foreground/80">
                &quot;I believe in a human-centric approach, leveraging technology to enhance learning, not replace the crucial instructor-student connection. Let&apos;s achieve your TEF Canada goals together!&quot;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose French.GTA? Section (Summarized) */}
      <section className="py-16 md:py-24 bg-primary/5">
        <div className="container mx-auto px-4">
          <SectionTitle title="Why Choose French.GTA?" subtitle="The distinct advantages that set us apart." />
          <ul className="grid md:grid-cols-2 gap-x-8 gap-y-6 max-w-3xl mx-auto text-lg">
            <li className="flex items-start gap-3">
              <Award className="h-6 w-6 text-primary mt-1 shrink-0" />
              <span><strong>Unmatched Instructor Quality:</strong> Learn from the best in TEF Canada coaching.</span>
            </li>
            <li className="flex items-start gap-3">
              <BookOpen className="h-6 w-6 text-primary mt-1 shrink-0" />
              <span><strong>Singular TEF Canada Expertise:</strong> Our curriculum is 100% focused on the TEF exam.</span>
            </li>
            <li className="flex items-start gap-3">
              <Users className="h-6 w-6 text-primary mt-1 shrink-0" />
              <span><strong>Personalized One-on-One Support:</strong> Get tailored guidance to meet your individual needs.</span>
            </li>
            <li className="flex items-start gap-3">
              <Clock className="h-6 w-6 text-primary mt-1 shrink-0" />
              <span><strong>Flexible Batch Timings:</strong> We accommodate your busy schedule.</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Our Campus & Community Focus (Brampton) Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center bg-card p-8 md:p-12 rounded-lg shadow-xl">
            <MapPin className="h-12 w-12 text-primary mx-auto mb-6" />
            <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-4">Our Brampton Roots, Our Nationwide Reach</h2>
            <p className="text-foreground/80 mb-4">
              While we proudly serve students across Canada online, French.GTA is rooted in the vibrant community of Brampton, Ontario. We understand the specific needs of international students and newcomers in the Greater Toronto Area and strive to be a supportive local resource.
            </p>
            <p className="text-foreground/80">
              Our online platform allows us to extend our expert TEF Canada coaching to ambitious individuals nationwide, bringing quality French language education to your doorstep, wherever you are in Canada.
            </p>
          </div>
        </div>
      </section>


      {/* CTA Section */}
      <section className="py-20 bg-accent">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-accent-foreground mb-6">Ready to Excel in Your TEF Canada Exam?</h2>
          <p className="text-lg text-accent-foreground/80 mb-8 max-w-xl mx-auto">
            Join French.GTA and take the definitive step towards achieving your Canadian aspirations.
          </p>
          <Button asChild size="lg" variant="default" className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Link href="/book-demo">Book Your Free Demo!</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
