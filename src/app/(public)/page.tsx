import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import SectionTitle from '@/components/shared/SectionTitle';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CheckCircle, Users, Clock, Award, UserCheck, BookOpen, Star, TrendingUp, Target, ChevronRight, ShieldCheck, Heart, GitCommit, User, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const courses = [
  { id: "a1-a2-beginner", title: "A1-A2 Beginner", description: "Start your French journey here. Build a strong foundation.", duration: "12 Weeks", image: "https://picsum.photos/600/400", dataAiHint: "students learning class" },
  { id: "b1-b2-intermediate", title: "B1-B2 Intermediate", description: "Enhance your fluency and conversational skills for real-world scenarios.", duration: "16 Weeks", image: "https://picsum.photos/600/400", dataAiHint: "conversation discussion group" },
  { id: "c1-c2-advanced", title: "C1-C2 Advanced", description: "Perfect your French to a near-native level for professional use.", duration: "20 Weeks", image: "https://picsum.photos/600/400", dataAiHint: "professional presentation" },
  { id: "tef-canada-prep", title: "TEF Canada Test Prep", description: "Specialized, intensive preparation to ace the TEF exam.", duration: "8 Weeks", image: "https://picsum.photos/600/400", dataAiHint: "exam study focus" },
];

const testimonials = [
  { quote: "FRANCOBUDDY was a game-changer! I scored 371/400 in my TEF exam, which was crucial for my PR application. The instructors are simply the best.", author: "Priya Sharma", role: "Software Engineer", location: "Toronto, ON", image: "https://picsum.photos/100/100", dataAiHint: "professional woman portrait", rating: 5 },
  { quote: "I went from zero French (A0) to a confident B2 level, which helped me secure a promotion and an $18k salary increase. The personalized approach made all the difference.", author: "Rahul Patel", role: "Business Analyst", location: "Mississauga, ON", image: "https://picsum.photos/100/100", dataAiHint: "professional man portrait", rating: 5 },
  { quote: "As a university student, I needed to pass my DELF B2 exam. FRANCOBUDDY's flexible schedule and supportive community were perfect for me. I passed with flying colors!", author: "Kavya Reddy", role: "University Student", location: "Brampton, ON", image: "https://picsum.photos/100/100", dataAiHint: "female student portrait", rating: 4.8 },
];

const whyFrancoBuddyItems = [
  { icon: Heart, title: "Caring Instructors", description: "Our certified C1/C2 instructors are not just teachers, they are mentors dedicated to your success." },
  { icon: Users, title: "Supportive Community", description: "Join a community of learners who motivate and support each other on their journey." },
  { icon: Clock, title: "Flexible Learning", description: "Online and in-person classes with flexible schedules to fit your busy life." },
  { icon: Target, title: "Personalized Approach", description: "With a maximum of 3-5 students per class, you get the individual attention you deserve." },
  { icon: TrendingUp, title: "Proven Results", description: "Our curriculum is designed for success, helping you achieve your language goals faster." },
  { icon: UserCheck, title: "Expert Guidance", description: "We specialize in TEF Canada, providing you with the most effective preparation strategies." },
];

export default async function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-blue-800 text-primary-foreground py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <Badge variant="secondary" className="mb-4 text-sm font-semibold tracking-wider shadow-lg">
            🏆 TEF Canada Success Guaranteed
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Master French. Transform Your Future.
          </h1>
          <p className="text-lg md:text-xl opacity-90 mb-10 max-w-3xl mx-auto">
            Expert French language training for immigration success, career advancement, and personal growth. Join 250+ successful students in Toronto & GTA.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="shadow-lg hover:shadow-primary/50 transition-shadow bg-gradient-to-br from-secondary to-red-700 text-secondary-foreground hover:brightness-110">
              <Link href="/book-demo">Book FREE Demo Class</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
              <Link href="/courses">Explore Our Courses</Link>
            </Button>
            <Button asChild size="lg" variant="secondary" className="bg-gradient-to-br from-secondary to-red-700 hover:brightness-110">
              <Link href="/enrollment-form">Enroll Now</Link>
            </Button>
          </div>
           <div className="mt-12 flex justify-center items-center gap-8 opacity-90">
                <div className="flex -space-x-4 rtl:space-x-reverse">
                    <Avatar><AvatarImage src="https://picsum.photos/40/40" alt="Student 1" data-ai-hint="person avatar"/><AvatarFallback>S1</AvatarFallback></Avatar>
                    <Avatar><AvatarImage src="https://picsum.photos/40/40" alt="Student 2" data-ai-hint="person avatar"/><AvatarFallback>S2</AvatarFallback></Avatar>
                    <Avatar><AvatarImage src="https://picsum.photos/40/40" alt="Student 3" data-ai-hint="person avatar"/><AvatarFallback>S3</AvatarFallback></Avatar>
                </div>
                <div>
                    <p className="font-semibold">250+ Students</p>
                    <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400"/>
                        <span className="font-semibold">4.8/5</span> Rating
                    </div>
                </div>
            </div>
        </div>
      </section>
      
      {/* Trust Badges Banner */}
      <section className="bg-muted/50 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex items-center justify-center gap-3">
              <Award className="h-8 w-8 text-primary"/>
              <span className="font-semibold text-lg">Certified Instructors</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Users className="h-8 w-8 text-primary"/>
              <span className="font-semibold text-lg">250+ Students</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <ShieldCheck className="h-8 w-8 text-primary"/>
              <span className="font-semibold text-lg">96% Success Rate</span>
            </div>
          </div>
        </div>
      </section>

      {/* Course Preview Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <SectionTitle title="Our Courses" subtitle="Programs designed for every stage of your French learning journey, from absolute beginner to advanced fluency and test preparation." />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {courses.map((course) => (
              <Card key={course.id} className="overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col bg-card">
                <Image src={course.image} alt={course.title} width={600} height={400} className="w-full h-48 object-cover" data-ai-hint={course.dataAiHint} />
                <CardHeader>
                  <CardTitle className="text-xl text-secondary">{course.title}</CardTitle>
                  <CardDescription>Duration: {course.duration}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-muted-foreground">{course.description}</p>
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
          <SectionTitle title="Why Choose FRANCOBUDDY?" subtitle="We provide an unparalleled learning experience that goes beyond traditional language classes." />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {whyFrancoBuddyItems.map((item, index) => (
              <Card key={index} className="shadow-lg hover:shadow-2xl transition-shadow duration-300 bg-card">
                <CardHeader>
                  <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
                    <item.icon className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl text-secondary">{item.title}</CardTitle>
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
          <SectionTitle title="Success Stories" subtitle="Hear from students who transformed their lives with FRANCOBUDDY." />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="shadow-xl hover:shadow-2xl transition-shadow duration-300 flex flex-col p-6 bg-card">
                 <div className="flex items-center mb-4">
                    <Avatar className="h-16 w-16 mr-4">
                        <AvatarImage src={testimonial.image} alt={testimonial.author} data-ai-hint={testimonial.dataAiHint} />
                        <AvatarFallback>{testimonial.author.substring(0,2)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h4 className="font-semibold text-secondary">{testimonial.author}</h4>
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
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary to-blue-800 text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 max-w-5xl mx-auto">
            <Image src="https://picsum.photos/300/300" alt="Certified French Instructor" width={300} height={300} className="rounded-full shadow-lg border-4 border-secondary" data-ai-hint="instructor teacher portrait" />
            <div className="text-center md:text-left">
              <h3 className="text-3xl font-semibold mb-4">Meet Your Dedicated French Learning Partner</h3>
              <p className="mb-4 opacity-90">
                At FRANCOBUDDY, we are more than just a language school; we are your partners in achieving your Canadian dream. Our mission is to provide high-quality, personalized French instruction that empowers you to succeed in the TEF Canada exam and beyond. With over 250 students successfully trained, our results speak for themselves.
              </p>
              <Button asChild variant="secondary" className="bg-gradient-to-br from-red-500 to-red-700 hover:brightness-110">
                <Link href="/about">Learn More About Us <ChevronRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 md:py-32 bg-background">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Ready to Start Your French Journey?
          </h2>
          <p className="text-muted-foreground mb-2">Limited spots available for this month!</p>
          <div className="flex flex-wrap justify-center gap-4 my-8">
             <Button asChild size="lg" className="shadow-lg hover:shadow-primary/50 transition-shadow bg-gradient-to-br from-secondary to-red-700 text-secondary-foreground hover:brightness-110">
              <Link href="/book-demo">Book Your FREE Demo Now</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/courses">View All Course Plans</Link>
            </Button>
          </div>
          <div className="flex justify-center gap-x-8 gap-y-4 text-sm text-muted-foreground flex-wrap">
              <span className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500"/> No pressure, just support</span>
              <span className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500"/> Flexible scheduling</span>
              <span className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500"/> Certified instructors</span>
          </div>
        </div>
      </section>
    </>
  );
}
