
// src/app/student/ai-tutor/listening/page.tsx
import { getListeningAudioAction } from '@/app/admin/ai-content/listeningAudioActions';
import type { ListeningAudio } from '@/app/admin/ai-content/listeningAudioSchemas';
import ListeningAssessmentClient from './ListeningAssessmentClient';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Headphones } from 'lucide-react';

export default async function ListeningAssessmentPage() {
  const audioItemsResult = await getListeningAudioAction();
  const listeningAudioItems = (audioItemsResult.isSuccess && Array.isArray(audioItemsResult.data)) ? audioItemsResult.data as ListeningAudio[] : [];

  if (!audioItemsResult.isSuccess) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Fetching Listening Content</AlertTitle>
          <AlertDescription>
            Could not load listening exercises at this time. Please try again later.
            {audioItemsResult.message && <p className="mt-2">{audioItemsResult.message}</p>}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (listeningAudioItems.length === 0) {
     return (
      <div className="container mx-auto px-4 py-8 text-center">
         <Headphones className="h-12 w-12 mx-auto mb-4 text-primary" />
        <h1 className="text-2xl font-semibold mb-4">No Listening Exercises Available</h1>
        <p className="text-muted-foreground">
          It seems there are no listening exercises set up yet. Please check back later or contact an administrator.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <header className="text-center">
        <Headphones className="h-12 w-12 mx-auto mb-4 text-primary" />
        <h1 className="text-3xl md:text-4xl font-bold text-primary">AI Listening Comprehension</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Practice your French listening skills and get instant feedback.
        </p>
      </header>
      <ListeningAssessmentClient audioItems={listeningAudioItems} />
    </div>
  );
}
