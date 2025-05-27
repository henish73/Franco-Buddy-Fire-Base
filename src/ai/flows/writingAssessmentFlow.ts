
'use server';
/**
 * @fileOverview AI-powered writing assessment flow.
 *
 * - assessWriting - A function that handles the writing assessment process.
 * - WritingAssessmentInput - The input type for the assessWriting function.
 * - WritingAssessmentOutput - The return type for the assessWriting function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

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

export async function assessWriting(
  input: WritingAssessmentInput
): Promise<WritingAssessmentOutput> {
  // Placeholder: In a real scenario, this would call the Genkit flow.
  // For now, return mock data.
  console.log('assessWriting called with input:', input.promptText, input.studentResponseText.substring(0,50) + "...");

  // Simulate AI analysis and feedback generation
  return {
    feedback: {
      grammar: "Good use of basic sentence structures. Ensure subject-verb agreement in complex sentences.",
      vocabulary: "Your vocabulary is appropriate for the task. Try to use more varied synonyms for common words.",
      structure: "Paragraphs are generally well-organized. Ensure clear topic sentences for each paragraph.",
      coherence: "Ideas are mostly logical and easy to follow. Use transition words more effectively between paragraphs.",
      taskAchievement: "The response addresses the main points of the prompt. Could elaborate more on [specific aspect].",
    },
    score: 78, // Mock score
    suggestionsForImprovement: [
      "Review rules for adjective agreement.",
      "Practice using different sentence openers to improve flow.",
      "Expand on your arguments with more specific examples.",
    ],
  };
}

// Define the Genkit prompt (actual AI interaction logic will go here)
// For now, this prompt definition is a placeholder and the flow does not call it.
const writingAssessmentInternalPrompt = ai.definePrompt({
  name: 'writingAssessmentInternalPrompt',
  input: { schema: WritingAssessmentInputSchema },
  output: { schema: WritingAssessmentOutputSchema },
  prompt: `
    You are an expert French language tutor providing feedback on a student's written response.
    The student was given the following prompt:
    "{{{promptText}}}"

    The student's written response is:
    "{{{studentResponseText}}}"

    Please provide:
    1. Feedback on grammar.
    2. Feedback on vocabulary.
    3. Feedback on structure.
    4. Feedback on coherence.
    5. Feedback on task achievement.
    6. An overall score (0-100).
    7. Specific suggestions for improvement.

    Structure your output according to the defined schema.
  `,
});

// Define the Genkit flow
// This flow is currently NOT being called by the exported assessWriting function for simplicity.
const writingAssessmentFlow = ai.defineFlow(
  {
    name: 'writingAssessmentFlow',
    inputSchema: WritingAssessmentInputSchema,
    outputSchema: WritingAssessmentOutputSchema,
  },
  async (input) => {
    const { output } = await writingAssessmentInternalPrompt(input);

    if (!output) {
      throw new Error('Failed to get assessment from AI model.');
    }
    return output;
  }
);

