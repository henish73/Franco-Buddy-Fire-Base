// src/app/student/ai-tutor/page.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic, MessageSquareText, BookOpen, Headphones, Sparkles, BarChart3 } from 'lucide-react';

export default function AITutorHubPage() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      <header className="text-center">
        <Sparkles className="h-16 w-16 text-primary mx-auto mb-6" />
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">AI Language Tutor Hub</h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          Your personal AI-powered assistant for mastering French. Practice speaking, writing, reading, and listening skills.
        </p>
      </header>

      <section>
        <h2 className="text-2xl font-semibold text-foreground mb-6 text-center">Choose an Area to Practice</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="shadow-lg hover:shadow-primary/20 transition-shadow">
            <CardHeader>
              <Mic className="h-10 w-10 text-primary mb-3" />
              <CardTitle className="text-xl">Speaking Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Record yourself responding to prompts and get instant feedback on pronunciation, fluency, and grammar.</CardDescription>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href="/student/ai-tutor/speaking">Practice Speaking</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="shadow-lg hover:shadow-primary/20 transition-shadow">
            <CardHeader>
              <MessageSquareText className="h-10 w-10 text-primary mb-3" />
              <CardTitle className="text-xl">Writing Practice</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Submit written responses to TEF-style tasks and receive AI analysis on grammar, vocabulary, and structure.</CardDescription>
            </CardContent>
             <CardFooter>
              <Button asChild className="w-full">
                <Link href="/student/ai-tutor/writing">Practice Writing</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="shadow-lg hover:shadow-primary/20 transition-shadow">
            <CardHeader>
              <BookOpen className="h-10 w-10 text-primary mb-3" />
              <CardTitle className="text-xl">Reading Comprehension</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Read passages and answer TEF-style questions. Get insights into your understanding and vocabulary.</CardDescription>
            </CardContent>
             <CardFooter>
              <Button asChild className="w-full">
                <Link href="/student/ai-tutor/reading">Practice Reading</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="shadow-lg hover:shadow-primary/20 transition-shadow">
            <CardHeader>
              <Headphones className="h-10 w-10 text-primary mb-3" />
              <CardTitle className="text-xl">Listening Practice</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Listen to audio clips (or read transcripts) and answer comprehension questions. Improve your ability to understand spoken French.</CardDescription>
            </CardContent>
            <CardFooter>
               <Button asChild className="w-full">
                <Link href="/student/ai-tutor/listening">Practice Listening</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      <section className="text-center">
         <Card className="max-w-2xl mx-auto shadow-lg">
            <CardHeader>
                <BarChart3 className="h-10 w-10 text-primary mx-auto mb-3" />
                <CardTitle>Overall Progress</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">
                    Your detailed progress report across all skills will be available here soon.
                    Keep practicing to see your improvements!
                </p>
            </CardContent>
            <CardFooter>
                <Button variant="outline" disabled>View Full Report (Coming Soon)</Button>
            </CardFooter>
         </Card>
      </section>
    </div>
  );
}
