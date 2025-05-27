
'use server';
/**
 * @fileOverview AI-powered reading assessment flow.
 *
 * - assessReading - A function that handles the reading assessment process.
 * - ReadingAssessmentInput - The input type for the assessReading function.
 * - ReadingAssessmentOutput - The return type for the assessReading function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { 
  ReadingAssessmentInputSchema, 
  type ReadingAssessmentInput, 
  ReadingAssessmentOutputSchema, 
  type ReadingAssessmentOutput 
} from './readingAssessmentSchemas';

export type { ReadingAssessmentInput, ReadingAssessmentOutput };

export async function assessReading(
  input: ReadingAssessmentInput
): Promise<ReadingAssessmentOutput> {
  return await readingAssessmentFlow(input);
}

const readingAssessmentInternalPrompt = ai.definePrompt({
  name: 'readingAssessmentInternalPrompt',
  input: { schema: ReadingAssessmentInputSchema },
  output: { schema: ReadingAssessmentOutputSchema },
  prompt: `
    You are an expert French language examiner specializing in TEF Canada reading comprehension assessments.
    The student was given the following passage to read:
    "{{{passageText}}}"

    The student's written response to questions or a summary task about the passage is:
    "{{{studentResponseText}}}"

    Please evaluate the student's reading comprehension and their written response based ONLY on the provided passage and their response. Provide:
    1.  **Understanding Feedback**: Assess how well the student understood the main ideas, details, and any inferences from the passage, as reflected in their response.
    2.  **Clarity Feedback**: Comment on the clarity and organization of the student's response.
    3.  **Language Use Feedback**: Evaluate the grammatical accuracy and vocabulary appropriateness in the student's response.
    4.  **Relevance to Passage Feedback**: Judge how well the student's response addresses the passage and any implicit or explicit questions related to it.
    5.  **Overall Score**: Provide an overall score from 0 to 100, considering all the above aspects.
    6.  **Suggestions for Improvement**: Offer 2-3 specific, actionable suggestions for improving reading comprehension skills and how to better respond to passage-based tasks.

    Ensure your output strictly adheres to the JSON schema provided.
  `,
  config: {
    safetySettings: [
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
    ],
  }
});

const readingAssessmentFlow = ai.defineFlow(
  {
    name: 'readingAssessmentFlow',
    inputSchema: ReadingAssessmentInputSchema,
    outputSchema: ReadingAssessmentOutputSchema,
  },
  async (input) => {
    const { output } = await readingAssessmentInternalPrompt(input);

    if (!output) {
      throw new Error('Failed to get reading assessment from AI model.');
    }
    return output;
  }
);
