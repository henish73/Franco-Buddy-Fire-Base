// src/ai/flows/writingAssessmentSchemas.ts
import { z } from 'zod';

export const WritingAssessmentInputSchema = z.object({
  promptText: z.string().describe('The text of the prompt the student responded to.'),
  studentResponseText: z.string().describe("The student's written response."),
});
export type WritingAssessmentInput = z.infer<typeof WritingAssessmentInputSchema>;

export const WritingAssessmentOutputSchema = z.object({
  feedback: z.object({
    grammar: z.string().describe('Feedback on grammar usage.'),
    vocabulary: z.string().describe('Feedback on vocabulary usage.'),
    structure: z.string().describe('Feedback on sentence and paragraph structure.'),
    coherence: z.string().describe('Feedback on coherence and organization of ideas.'),
    taskAchievement: z.string().describe('Feedback on how well the response addresses the prompt.'),
  }),
  score: z.number().min(0).max(100).describe('An overall score for the writing assessment (0-100).'),
  suggestionsForImprovement: z.array(z.string()).describe('Specific suggestions for improvement.'),
});
export type WritingAssessmentOutput = z.infer<typeof WritingAssessmentOutputSchema>;
