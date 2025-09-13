// src/app/student/ai-tutor/reading/page.tsx
import { getReadingPassagesAction } from '@/app/admin/site-management/ai-content/readingPassageActions';
import type { ReadingPassage } from '@/app/admin/site-management/ai-content/schemas';
import ReadingAssessmentClient from './ReadingAssessmentClient';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, BookOpen } from 'lucide-react';

export default async function ReadingAssessmentPage() {
  const passagesResult = await getReadingPassagesAction();
  const readingPassages = (passagesResult.isSuccess && Array.isArray(passagesResult.data)) ? passagesResult.data as ReadingPassage[] : [];

  if (!passagesResult.isSuccess) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Fetching Passages</AlertTitle>
          <AlertDescription>
            Could not load reading passages at this time. Please try again later.
            {passagesResult.message && <p className="mt-2">{passagesResult.message}</p>}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (readingPassages.length === 0) {
     return (
      <div className="container mx-auto px-4 py-8 text-center">
         <BookOpen className="h-12 w-12 mx-auto mb-4 text-primary" />
        <h1 className="text-2xl font-semibold mb-4">No Reading Passages Available</h1>
        <p className="text-muted-foreground">
          It seems there are no reading passages set up yet. Please check back later or contact an administrator.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <header className="text-center">
        <BookOpen className="h-12 w-12 mx-auto mb-4 text-primary" />
        <h1 className="text-3xl md:text-4xl font-bold text-primary">AI Reading Comprehension</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Practice your French reading skills and get instant feedback.
        </p>
      </header>
      <ReadingAssessmentClient passages={readingPassages} />
    </div>
  );
}
