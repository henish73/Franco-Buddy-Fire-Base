// src/app/student/dashboard/page.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { BookOpen, UserCircle, Bell, CheckSquare, Mic, MessageSquareText, Headphones, Sparkles, BarChart3, FileText, Video } from 'lucide-react';
import { getMostRecentAiTutorFeedbackAction, type RecentFeedbackSnippet } from './actions';
import Image from 'next/image';

// Placeholder data
const studentName = "Aisha K."; // Replace with dynamic data later
const enrolledCourses = [
  { id: "tef-pro-clb7", name: "TEF Pro - CLB 7+", progress: 65, nextClass: "Tomorrow, 6 PM: Speaking Practice" },
];
const testimonials = [
  { quote: "FRANCOBUDDY was a game-changer! I scored 371/400 in my TEF Canada exam, crucial for my PR application in Toronto. The instructors are the best for anyone serious about immigration.", author: "Priya Sharma", role: "Software Engineer", location: "Toronto, ON", image: "https://picsum.photos/100/100", dataAiHint: "professional woman portrait", rating: 5 },
  { quote: "I needed a high TCF score for my work permit extension in Mississauga. FRANCOBUDDY's personalized approach helped me go from zero French to a confident B2. Highly recommend for TEF and TCF.", author: "Rahul Patel", role: "Business Analyst", location: "Mississauga, ON", image: "https://picsum.photos/101/101", dataAiHint: "professional man portrait", rating: 5 },
  { quote: "Living in Brampton, I needed flexible TEF classes. The online program was perfect, and the small class size helped me pass with flying colors for my Express Entry profile.", author: "Kavya Reddy", role: "University Student", location: "Brampton, ON", image: "https://picsum.photos/102/102", dataAiHint: "female student portrait", rating: 4.8 },
];

export default async function StudentDashboardPage() {
  const recentFeedback: RecentFeedbackSnippet | null = await getMostRecentAiTutorFeedbackAction();

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="relative h-64 rounded-2xl overflow-hidden flex items-center justify-center text-center">
        <Image 
          src="https://picsum.photos/1920/400?random=11"
          alt="Student learning environment"
          fill
          className="object-cover"
          data-ai-hint="library learning student"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="container relative mx-auto px-4 text-white">
          <h1 className="text-3xl md:text-4xl font-bold">Welcome back, {studentName}!</h1>
          <p className="text-md md:text-lg mt-2">Here's an overview of your learning journey.</p>
        </div>
      </section>

      {/* AI Language Tutor Quick Access Panel */}
      <section>
        <h2 className="text-2xl font-semibold text-foreground mb-4 text-center">AI Language Tutor</h2>
        <Card className="shadow-lg bg-primary/5">
            <CardHeader>
                <CardTitle className="text-primary text-center">Practice & Get Feedback</CardTitle>
                <CardDescription className="text-center">Sharpen your French skills with our AI-powered tools.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button asChild variant="default" size="lg" className="flex flex-col h-auto py-4 rounded-full">
                    <Link href="/student/ai-tutor/speaking">
                        <Mic className="h-8 w-8 mb-2"/>
                        <span>Speaking</span>
                    </Link>
                </Button>
                 <Button asChild variant="default" size="lg" className="flex flex-col h-auto py-4 rounded-full">
                    <Link href="/student/ai-tutor/writing">
                        <MessageSquareText className="h-8 w-8 mb-2"/>
                        <span>Writing</span>
                    </Link>
                </Button>
                 <Button asChild variant="default" size="lg" className="flex flex-col h-auto py-4 rounded-full">
                    <Link href="/student/ai-tutor/reading">
                        <BookOpen className="h-8 w-8 mb-2"/>
                        <span>Reading</span>
                    </Link>
                </Button>
                 <Button asChild variant="default" size="lg" className="flex flex-col h-auto py-4 rounded-full">
                    <Link href="/student/ai-tutor/listening">
                        <Headphones className="h-8 w-8 mb-2"/>
                        <span>Listening</span>
                    </Link>
                </Button>
            </CardContent>
        </Card>
      </section>

      {/* Recent AI Tutor Feedback Snippet */}
      {recentFeedback && (
        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4 text-center">My Recent AI Tutor Feedback</h2>
          <Card className="shadow-md bg-accent/10 max-w-3xl mx-auto">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg text-primary/90">
                  Latest: {recentFeedback.assessmentType} Practice
                  {recentFeedback.promptTopic && <span className="block text-sm font-normal text-muted-foreground">Topic: {recentFeedback.promptTopic}</span>}
                </CardTitle>
                <Sparkles className="h-6 w-6 text-accent" />
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {recentFeedback.score !== undefined && (
                <p className="text-2xl font-bold text-primary">
                  Score: {recentFeedback.score}/100
                </p>
              )}
              {recentFeedback.keyFeedback && (
                <div>
                  <p className="text-sm font-semibold text-foreground">Key Suggestion:</p>
                  <p className="text-sm text-muted-foreground">{recentFeedback.keyFeedback}</p>
                </div>
              )}
              {recentFeedback.timestamp && (
                <p className="text-xs text-muted-foreground pt-2">
                  Assessed on: {new Date(recentFeedback.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
              )}
            </CardContent>
            <CardFooter>
              <Button asChild variant="link" className="p-0 h-auto rounded-full">
                <Link href="/student/ai-tutor/report">View Detailed AI Tutor Report</Link>
              </Button>
            </CardFooter>
          </Card>
        </section>
      )}


      {/* Enrolled Courses Section */}
      <section>
        <h2 className="text-2xl font-semibold text-foreground mb-4 text-center">My Enrolled Courses</h2>
        {enrolledCourses.length > 0 ? (
          <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6">
            {enrolledCourses.map(course => (
              <Card key={course.id} className="shadow-lg hover:shadow-xl transition-shadow rounded-2xl">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl text-primary">{course.name}</CardTitle>
                    <FileText className="h-6 w-6 text-accent" />
                  </div>
                  <CardDescription>Your progress and upcoming activities.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm text-muted-foreground mb-1">
                      <span>Progress</span>
                      <span>{course.progress}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div className="bg-primary h-2.5 rounded-full" style={{ width: `${course.progress}%` }}></div>
                    </div>
                  </div>
                  <p className="text-sm"><strong className="text-foreground">Next class/activity:</strong> <span className="text-muted-foreground">{course.nextClass}</span></p>
                </CardContent>
                <CardFooter>
                  <Button variant="default" className="w-full rounded-full" disabled>Continue Learning (Coming Soon)</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center py-12 rounded-2xl">
            <CardContent>
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">You are not currently enrolled in any courses.</p>
              <Button asChild className="rounded-full">
                <Link href="/courses">Explore Courses</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </section>

      {/* Announcements or Next Steps Section */}
       <section>
        <h2 className="text-2xl font-semibold text-foreground mb-4 text-center">Announcements & Next Steps</h2>
        <div className="grid md:grid-cols-2 gap-6">
            <Card className="rounded-2xl">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-lg font-medium">Recent Announcements</CardTitle>
                    <Bell className="h-5 w-5 text-primary"/>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">No new announcements at this time. Stay tuned!</p>
                </CardContent>
            </Card>
            <Card className="rounded-2xl">
                 <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-lg font-medium">Quick Actions</CardTitle>
                    <CheckSquare className="h-5 w-5 text-primary"/>
                </CardHeader>
                <CardContent className="space-y-2">
                     <Button variant="outline" className="w-full justify-start rounded-full" disabled>View My Schedule (Coming Soon)</Button>
                     <Button variant="outline" className="w-full justify-start rounded-full" disabled>Access Learning Materials (Coming Soon)</Button>
                     <Button asChild variant="outline" className="w-full justify-start rounded-full">
                        <Link href="/faq">Visit FAQ</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
      </section>
    </div>
  );
}
