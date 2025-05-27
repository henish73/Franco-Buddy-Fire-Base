
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
import { 
  WritingAssessmentInputSchema, 
  type WritingAssessmentInput, 
  WritingAssessmentOutputSchema, 
  type WritingAssessmentOutput 
} from './writingAssessmentSchemas';

export type { WritingAssessmentInput, WritingAssessmentOutput };

export async function assessWriting(
  input: WritingAssessmentInput
): Promise<WritingAssessmentOutput> {
  // Now calls the actual Genkit flow
  return await writingAssessmentFlow(input);
}

const writingAssessmentInternalPrompt = ai.definePrompt({
  name: 'writingAssessmentInternalPrompt',
  input: { schema: WritingAssessmentInputSchema },
  output: { schema: WritingAssessmentOutputSchema },
  prompt: `
    You are an expert French language examiner specializing in TEF Canada assessments.
    The student was given the following writing prompt:
    "{{{promptText}}}"

    The student's written response is:
    "{{{studentResponseText}}}"

    Please evaluate the student's French writing performance based ONLY on their response and the original prompt. Provide:
    1.  **Grammar Feedback**: Assess the grammatical accuracy of the sentences.
    2.  **Vocabulary Feedback**: Evaluate the range and appropriateness of vocabulary used.
    3.  **Structure Feedback**: Comment on the organization of ideas, paragraph structure, and use of linking words.
    4.  **Coherence Feedback**: Judge how well the ideas are logically connected and if the response is easy to follow.
    5.  **Task Achievement Feedback**: Assess how well the student's response addresses all parts of the given prompt.
    6.  **Overall Score**: Provide an overall score from 0 to 100, considering all the above aspects.
    7.  **Suggestions for Improvement**: Offer 2-3 specific, actionable suggestions for improving writing skills based on your analysis of the response.

    Ensure your output strictly adheres to the JSON schema provided for feedback, score, and suggestions.
  `,
  config: { // Added safety settings, can be adjusted
    safetySettings: [
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
    ],
  }
});

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
