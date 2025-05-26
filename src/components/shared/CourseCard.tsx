import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronRight, type LucideIcon } from 'lucide-react';
import type { ElementType } from 'react';

export type Lesson = {
  id: string;
  title: string;
  description?: string; // General description of the lesson
  keyTopics?: string[]; // Bullet points of key topics
  skillsTargeted?: string[]; // e.g., "Speaking", "Listening"
  tefQuestionTypes?: string[]; // Specific TEF question types covered, e.g., "Compréhension Orale - Section A"
  exampleActivities?: string; // Brief description of example activities
  videoUrl?: string; // URL for embedded video
  notesFileUrl?: string; // URL for downloadable notes PDF
  order?: number; // For ordering lessons within a module
  // Link to AI Tutor exercises (will be IDs or structured objects later)
  // associatedAiPromptIds?: string[]; 
};

export type Module = {
  id: string;
  title: string;
  description?: string; // Overview of the module
  order?: number; // For ordering modules within a course
  lessons: Lesson[];
};

export type WhatsIncludedItem = {
  text: string;
  icon: ElementType; // Allow any React component, including Lucide icons
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
  imageUrl?: string;
  imageAiHint?: string;
  status?: 'Active' | 'Draft';
  price1on1?: number;
  price1on3?: number;
  // Detailed page fields
  detailedDescription?: string; // Full course overview
  isForYou?: string[]; // Array of strings describing target audience
  structure?: string; // Overview of course structure (e.g., weekly classes, assignments)
  learningResources?: string[]; // Kept for backward compatibility, prefer whatsIncluded
  tefFocus?: string; // Specific TEF Canada focus areas
  modules?: Module[]; // Detailed syllabus
  whatsIncluded?: WhatsIncludedItem[]; // Checklist of what the course offers
  instructorSpotlight?: InstructorSpotlight; // Info about the instructor
  courseSpecificTestimonials?: CourseTestimonial[]; // Testimonials for this course
};

type CourseCardProps = {
  course: Course;
};

export default function CourseCard({ course }: CourseCardProps) {
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
        <CardTitle className="text-2xl text-primary">{course.title}</CardTitle>
        <CardDescription className="h-16 overflow-hidden text-ellipsis">{course.shortDescription}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-2">
        <p><strong className="text-foreground">Target CLB:</strong> <span className="text-muted-foreground">{course.targetCLB}</span></p>
        <p><strong className="text-foreground">Format:</strong> <span className="text-muted-foreground">{course.format}</span></p>
        {course.price1on1 && <p><strong className="text-foreground">1:1 Price:</strong> <span className="text-muted-foreground">${course.price1on1}</span></p>}
        {course.price1on3 && <p><strong className="text-foreground">1:3 Price:</strong> <span className="text-muted-foreground">${course.price1on3}</span></p>}
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full" variant="default">
          <Link href={`/courses/${course.id}`}>
            View Details <ChevronRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
