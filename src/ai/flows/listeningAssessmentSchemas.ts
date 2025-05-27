
// src/ai/flows/listeningAssessmentSchemas.ts
import { z } from 'zod';

export const ListeningAssessmentInputSchema = z.object({
  audioTranscript: z.string().min(1, "Audio transcript cannot be empty."),
  studentResponseText: z.string().min(10, "Student response must be at least 10 characters."),
});
export type ListeningAssessmentInput = z.infer<typeof ListeningAssessmentInputSchema>;

export const ListeningAssessmentOutputSchema = z.object({
  feedback: z.object({
    comprehension: z.string().describe('Feedback on the student\'s comprehension of the audio transcript.'),
    clarity: z.string().describe('Feedback on the clarity of the student\'s response based on the transcript.'),
    languageUse: z.string().describe('Feedback on the student\'s language use in their response.'),
    relevanceToTranscript: z.string().describe('Feedback on how relevant the student\'s response is to the transcript content.'),
  }),
  score: z.number().min(0).max(100).describe('An overall score for the listening comprehension assessment (0-100).'),
  suggestionsForImprovement: z.array(z.string()).describe('Specific suggestions for improving listening comprehension and response skills.'),
});
export type ListeningAssessmentOutput = z.infer<typeof ListeningAssessmentOutputSchema>;
