// src/ai/flows/readingAssessmentSchemas.ts
import { z } from 'zod';

export const ReadingAssessmentInputSchema = z.object({
  passageText: z.string().min(1, "Passage text cannot be empty."),
  studentResponseText: z.string().min(10, "Student response must be at least 10 characters."),
  tefSection: z.string().optional().describe('The specific TEF Canada section this passage relates to.'),
  difficultyLevel: z.string().optional().describe('The difficulty level of the passage.'),
});
export type ReadingAssessmentInput = z.infer<typeof ReadingAssessmentInputSchema>;

export const ReadingAssessmentOutputSchema = z.object({
  feedback: z.object({
    understanding: z.string().describe('Feedback on the student\'s understanding of the passage.'),
    clarity: z.string().describe('Feedback on the clarity of the student\'s response.'),
    languageUse: z.string().describe('Feedback on the student\'s language use (grammar, vocabulary) in their response.'),
    relevanceToPassage: z.string().describe('Feedback on how relevant the student\'s response is to the passage.'),
  }),
  score: z.number().min(0).max(100).describe('An overall score for the reading comprehension assessment (0-100).'),
  suggestionsForImprovement: z.array(z.string()).describe('Specific suggestions for improving reading comprehension and response skills.'),
});
export type ReadingAssessmentOutput = z.infer<typeof ReadingAssessmentOutputSchema>;
