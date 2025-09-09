import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronRight, type LucideIcon, Badge } from 'lucide-react';
import type { ElementType } from 'react';

export type Lesson = {
  id: string;
  title: string;
  description?: string; 
  keyTopics?: string[]; 
  skillsTargeted?: string[];
  tefQuestionTypes?: string[]; 
  exampleActivities?: string; 
  videoUrl?: string; 
  notesFileUrl?: string; 
  order?: number;
};

export type Module = {
  id: string;
  title: string;
  description?: string;
  order?: number;
  lessons: Lesson[];
};

export type WhatsIncludedItem = {
  text: string;
  icon: ElementType; 
};

export type InstructorSpotlight = {
  name: string;
  bio: string;
  imageUrl?: string;
  imageAiHint?: string;
};

export type CourseTestimonial = {
  quote: string;
  author: string;
  image?: string;
  imageAiHint?: string;
};

export type Course = {
  id: string;
  title: string;
  shortDescription: string;
  targetCLB: string;
  format: string; 
  duration?: string;
  imageUrl?: string;
  imageAiHint?: string;
  status?: 'Active' | 'Draft';
  price1on1?: number;
  price1on3?: number;
  detailedDescription?: string;
  isForYou?: string[]; 
  structure?: string;
  learningResources?: string[]; 
  tefFocus?: string;
  modules?: Module[];
  whatsIncluded?: WhatsIncludedItem[]; 
  instructorSpotlight?: InstructorSpotlight;
  courseSpecificTestimonials?: CourseTestimonial[];
};

type CourseCardProps = {
  course: Course;
};

export default function CourseCard({ course }: CourseCardProps) {
  const getBadgeVariant = (title: string) => {
    if (title.toLowerCase().includes('beginner')) return 'default';
    if (title.toLowerCase().includes('intermediate')) return 'secondary';
    if (title.toLowerCase().includes('advanced')) return 'outline';
    if (title.toLowerCase().includes('test prep')) return 'destructive';
    return 'default';
  }

  return (
    <Card className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 h-full">
      {course.imageUrl && (
        <div className="relative w-full h-56">
          <Image 
            src={course.imageUrl} 
            alt={course.title} 
            fill 
            style={{ objectFit: 'cover' }}
            data-ai-hint={course.imageAiHint || "education learning"}
          />
        </div>
      )}
      <CardHeader>
        <div className="flex justify-between items-center mb-2">
            <CardTitle className="text-xl text-secondary">{course.title}</CardTitle>
            <div className="text-xs uppercase font-bold text-primary bg-primary/10 px-2 py-1 rounded-full">{course.title.split(' ')[0]}</div>
        </div>
        <CardDescription className="h-12 overflow-hidden text-ellipsis">{course.shortDescription}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-2">
        <p><strong className="text-foreground">Duration:</strong> <span className="text-muted-foreground">{course.duration}</span></p>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full" variant="outline">
          <Link href={`/courses/${course.id}`}>
            Learn More <ChevronRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
