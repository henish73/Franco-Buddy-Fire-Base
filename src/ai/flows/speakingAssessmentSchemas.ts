// src/ai/flows/speakingAssessmentSchemas.ts
import { z } from 'zod';

export const SpeakingAssessmentInputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      "The student's spoken audio, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  promptText: z.string().describe('The text of the prompt the student responded to.'),
});
export type SpeakingAssessmentInput = z.infer<typeof SpeakingAssessmentInputSchema>;

export const SpeakingAssessmentOutputSchema = z.object({
  transcription: z.string().describe('The transcribed text from the student\'s audio.'),
  feedback: z.object({
    fluency: z.string().describe('Feedback on the student\'s fluency.'),
    pronunciation: z.string().describe('Feedback on the student\'s pronunciation.'),
    grammar: z.string().describe('Feedback on grammar usage.'),
    vocabulary: z.string().describe('Feedback on vocabulary usage.'),
    coherence: z.string().describe('Feedback on coherence and organization of speech.'),
  }),
  score: z.number().min(0).max(100).describe('An overall score for the speaking assessment (0-100).'),
  suggestionsForImprovement: z.array(z.string()).describe('Specific suggestions for improvement.'),
});
export type SpeakingAssessmentOutput = z.infer<typeof SpeakingAssessmentOutputSchema>;
