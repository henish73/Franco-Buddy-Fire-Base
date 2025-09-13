// src/app/student/ai-tutor/writing/page.tsx
import { getWritingPromptsAction } from '@/app/admin/site-management/ai-content/writingPromptActions';
import type { WritingPrompt } from '@/app/admin/site-management/ai-content/writingPromptSchemas';
import WritingAssessmentClient from './WritingAssessmentClient';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, MessageSquareText } from 'lucide-react';

export default async function WritingAssessmentPage() {
  const promptsResult = await getWritingPromptsAction();
  const writingPrompts = (promptsResult.isSuccess && Array.isArray(promptsResult.data)) ? promptsResult.data as WritingPrompt[] : [];

  if (!promptsResult.isSuccess) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Fetching Prompts</AlertTitle>
          <AlertDescription>
            Could not load writing prompts at this time. Please try again later.
            {promptsResult.message && <p className="mt-2">{promptsResult.message}</p>}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (writingPrompts.length === 0) {
     return (
      <div className="container mx-auto px-4 py-8 text-center">
         <MessageSquareText className="h-12 w-12 mx-auto mb-4 text-primary" />
        <h1 className="text-2xl font-semibold mb-4">No Writing Prompts Available</h1>
        <p className="text-muted-foreground">
          It seems there are no writing prompts set up yet. Please check back later or contact an administrator.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <header className="text-center">
        <MessageSquareText className="h-12 w-12 mx-auto mb-4 text-primary" />
        <h1 className="text-3xl md:text-4xl font-bold text-primary">AI Writing Assessment</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Practice your French writing skills and get instant feedback.
        </p>
      </header>
      <WritingAssessmentClient prompts={writingPrompts} />
    </div>
  );
}
