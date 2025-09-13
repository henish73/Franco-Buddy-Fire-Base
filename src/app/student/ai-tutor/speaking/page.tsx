// src/app/student/ai-tutor/speaking/page.tsx
import { getSpeakingPromptsAction } from '@/app/admin/site-management/ai-content/speakingPromptActions';
import type { SpeakingPrompt } from '@/app/admin/site-management/ai-content/schemas';
import SpeakingAssessmentClient from './SpeakingAssessmentClient';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Mic } from 'lucide-react';

export default async function SpeakingAssessmentPage() {
  const promptsResult = await getSpeakingPromptsAction();
  const speakingPrompts = (promptsResult.isSuccess && Array.isArray(promptsResult.data)) ? promptsResult.data as SpeakingPrompt[] : [];

  if (!promptsResult.isSuccess) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Fetching Prompts</AlertTitle>
          <AlertDescription>
            Could not load speaking prompts at this time. Please try again later.
            {promptsResult.message && <p className="mt-2">{promptsResult.message}</p>}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (speakingPrompts.length === 0) {
     return (
      <div className="container mx-auto px-4 py-8 text-center">
         <Mic className="h-12 w-12 mx-auto mb-4 text-primary" />
        <h1 className="text-2xl font-semibold mb-4">No Speaking Prompts Available</h1>
        <p className="text-muted-foreground">
          It seems there are no speaking prompts set up yet. Please check back later or contact an administrator.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <header className="text-center">
        <Mic className="h-12 w-12 mx-auto mb-4 text-primary" />
        <h1 className="text-3xl md:text-4xl font-bold text-primary">AI Speaking Assessment</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Practice your French speaking skills and get instant feedback.
        </p>
      </header>
      <SpeakingAssessmentClient prompts={speakingPrompts} />
    </div>
  );
}
