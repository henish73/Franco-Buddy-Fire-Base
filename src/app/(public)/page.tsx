import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import SectionTitle from '@/components/shared/SectionTitle';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CheckCircle, Users, Clock, Award, UserCheck, BookOpen, Star, TrendingUp, Target, ChevronRight, ShieldCheck, Heart, GitCommit, User, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { coursesData } from './courses/mockCoursesData';

const testimonials = [
  { quote: "FRANCOBUDDY was a game-changer! I scored 371/400 in my TEF Canada exam, crucial for my PR application in Toronto. The instructors are the best for anyone serious about immigration.", author: "Priya Sharma", role: "Software Engineer", location: "Toronto, ON", image: "https://picsum.photos/100/100", dataAiHint: "professional woman portrait", rating: 5 },
  { quote: "I needed a high TCF score for my work permit extension in Mississauga. FRANCOBUDDY's personalized approach helped me go from zero French to a confident B2. Highly recommend for TEF and TCF.", author: "Rahul Patel", role: "Business Analyst", location: "Mississauga, ON", image: "https://picsum.photos/100/100", dataAiHint: "professional man portrait", rating: 5 },
  { quote: "Living in Brampton, I needed flexible TEF classes. The online program was perfect, and the small class size helped me pass with flying colors for my Express Entry profile.", author: "Kavya Reddy", role: "University Student", location: "Brampton, ON", image: "https://picsum.photos/100/100", dataAiHint: "female student portrait", rating: 4.8 },
];

const whyFrancoBuddyItems = [
  { icon: Heart, title: "Caring Instructors for TEF/TCF", description: "Our certified C1/C2 instructors are experts in TEF and TCF preparation, dedicated to your Canadian immigration success." },
  { icon: Users, title: "A Supportive Community", description: "Join learners from Toronto, Brampton, and Mississauga who motivate each other on their French for PR journey." },
  { icon: Clock, title: "Flexible French Classes", description: "Online and in-person classes with flexible schedules to fit your busy life while you prepare for the TEF or TCF exam." },
  { icon: Target, title: "Personalized TEF Coaching", description: "With a maximum of 3-5 students per class, you get the individual attention needed to master the French language for immigration." },
  { icon: TrendingUp, title: "Proven Immigration Results", description: "Our curriculum is designed for TEF & TCF success, helping you achieve your language goals for Canadian PR faster." },
  { icon: UserCheck, title: "Expert TEF/TCF Guidance", description: "We specialize in TEF & TCF Canada tests, providing the most effective preparation strategies for residents of the GTA." },
];

export default async function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-background via-primary/10 to-background text-foreground py-20 md:py-32">
        <Image 
          src="https://picsum.photos/1200/800"
          alt="Students learning French for PR in a modern classroom in Toronto"
          fill
          className="object-cover opacity-10"
          data-ai-hint="classroom study group"
        />
        <div className="container relative mx-auto px-4 text-center animate-fade-in-up">
          <Badge variant="secondary" className="mb-4 text-sm font-semibold tracking-wider shadow-lg">
            🏆 Your #1 Choice for TEF & TCF in the GTA
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-primary">
            Ace TEF & TCF for Canadian PR | French Classes in Toronto, Brampton & Mississauga
          </h1>
          <p className="text-lg md:text-xl opacity-90 mb-10 max-w-3xl mx-auto">
            Unlock your Canadian dream with expert French language training. We specialize in TEF and TCF test preparation for immigration, helping professionals in Toronto, Brampton, and Mississauga achieve their PR goals.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="shadow-lg hover:shadow-primary/50 transition-shadow animate-pulse">
              <Link href="/book-demo">Book FREE Demo Class</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
              <Link href="/courses">Explore TEF/TCF Courses</Link>
            </Button>
            <Button asChild size="lg" variant="default">
              <Link href="/enrollment-form">Enroll Now</Link>
            </Button>
          </div>
           <div className="mt-12 flex justify-center items-center gap-8 opacity-90">
                <div className="flex -space-x-4 rtl:space-x-reverse">
                    <Avatar><AvatarImage src="https://picsum.photos/40/40" alt="Student from Toronto" data-ai-hint="person avatar"/><AvatarFallback>S1</AvatarFallback></Avatar>
                    <Avatar><AvatarImage src="https://picsum.photos/40/40" alt="Student from Brampton" data-ai-hint="person avatar"/><AvatarFallback>S2</AvatarFallback></Avatar>
                    <Avatar><AvatarImage src="https://picsum.photos/40/40" alt="Student from Mississauga" data-ai-hint="person avatar"/><AvatarFallback>S3</AvatarFallback></Avatar>
                </div>
                <div>
                    <p className="font-semibold">250+ Students in the GTA</p>
                    <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400"/>
                        <span className="font-semibold">4.8/5</span> Rating for French Immigration Success
                    </div>
                </div>
            </div>
        </div>
      </section>
      
      {/* Trust Badges Banner */}
      <section className="bg-muted/50 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center animate-fade-in">
            <div className="flex items-center justify-center gap-3">
              <Award className="h-8 w-8 text-primary"/>
              <span className="font-semibold text-lg">Certified TEF/TCF Instructors</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Users className="h-8 w-8 text-primary"/>
              <span className="font-semibold text-lg">250+ GTA Students</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <ShieldCheck className="h-8 w-8 text-primary"/>
              <span className="font-semibold text-lg">96% PR Immigration Success Rate</span>
            </div>
          </div>
        </div>
      </section>

      {/* Course Preview Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <SectionTitle title="TEF & TCF Courses for Canadian Immigration" subtitle="Our programs are specifically designed for your success in exams required for PR, serving Brampton, Mississauga, and Toronto." />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {coursesData.map((course) => (
              <Card key={course.id} className="overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col bg-card animate-fade-in-up">
                <Image src={course.imageUrl || 'https://placehold.co/600x400.png'} alt={`${course.title} - French classes for PR`} width={600} height={400} className="w-full h-48 object-cover" data-ai-hint={course.imageAiHint} />
                <CardHeader>
                  <CardTitle className="text-xl text-primary">{course.title}</CardTitle>
                  <CardDescription>Duration: {course.duration}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-muted-foreground">{course.shortDescription}</p>
                </CardContent>
                <CardFooter>
                  <Button asChild variant="outline" className="w-full">
                    <Link href={`/courses/${course.id}`}>View Plans</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <SectionTitle title="Why Choose FRANCOBUDDY for TEF in the GTA?" subtitle="We provide an unparalleled learning experience for students in Toronto, Brampton, and Mississauga aiming for PR." />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in-up">
            {whyFrancoBuddyItems.map((item, index) => (
              <Card key={index} className="shadow-lg hover:shadow-2xl transition-shadow duration-300 bg-card">
                <CardHeader>
                  <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
                    <item.icon className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl text-foreground">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <SectionTitle title="Real Immigration Success Stories" subtitle="Hear from students from Toronto, Mississauga, and Brampton who transformed their lives with our TEF/TCF coaching." />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="shadow-xl hover:shadow-2xl transition-shadow duration-300 flex flex-col p-6 bg-card">
                 <div className="flex items-center mb-4">
                    <Avatar className="h-16 w-16 mr-4">
                        <AvatarImage src={testimonial.image} alt={`${testimonial.author} - TEF Success Story`} data-ai-hint={testimonial.dataAiHint} />
                        <AvatarFallback>{testimonial.author.substring(0,2)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h4 className="font-semibold text-primary">{testimonial.author}</h4>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                    </div>
                </div>
                <CardContent className="flex-grow p-0">
                  <p className="text-muted-foreground italic">&quot;{testimonial.quote}&quot;</p>
                   <div className="flex items-center mt-4">
                        {[...Array(5)].map((_, i) => <Star key={i} className={`h-5 w-5 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />)}
                        <span className="ml-2 text-sm font-bold text-foreground">{testimonial.rating}/5</span>
                   </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Snippet Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-background via-primary/10 to-background text-foreground">
        <div className="container mx-auto px-4 animate-fade-in-up">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 max-w-5xl mx-auto">
            <Image src="https://picsum.photos/300/300" alt="Certified French Instructor for TEF TCF in Toronto" width={300} height={300} className="rounded-full shadow-lg border-4 border-secondary" data-ai-hint="instructor teacher portrait" />
            <div className="text-center md:text-left">
              <h3 className="text-3xl font-semibold mb-4 text-primary">Your Partner for French Immigration Success</h3>
              <p className="mb-4 opacity-90">
                At FRANCOBUDDY, we are your partners in achieving your Canadian dream. Our mission is to provide high-quality, personalized French instruction that empowers you to succeed in the TEF and TCF exams. If you're looking for French classes for PR in Toronto, Mississauga, or Brampton, you're in the right place.
              </p>
              <Button asChild variant="secondary">
                <Link href="/about">Learn More About Our Method <ChevronRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 md:py-32 bg-background">
        <div className="container mx-auto px-4 text-center animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Ready to Start Your French for PR Journey?
          </h2>
          <p className="text-muted-foreground mb-2">Limited spots available for our TEF/TCF batches in the GTA!</p>
          <div className="flex flex-wrap justify-center gap-4 my-8">
             <Button asChild size="lg" className="shadow-lg hover:shadow-primary/50 transition-shadow animate-pulse">
              <Link href="/book-demo">Book Your FREE Demo Now</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/courses">View All Course Plans</Link>
            </Button>
          </div>
          <div className="flex justify-center gap-x-8 gap-y-4 text-sm text-muted-foreground flex-wrap">
              <span className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500"/> Expert guidance for immigration</span>
              <span className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500"/> Flexible scheduling for professionals</span>
              <span className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500"/> Certified C1/C2 instructors</span>
          </div>
        </div>
      </section>
    </>
  );
}
