
'use server';
/**
 * @fileOverview AI-powered listening assessment flow.
 *
 * - assessListening - A function that handles the listening assessment process.
 * - ListeningAssessmentInput - The input type for the assessListening function.
 * - ListeningAssessmentOutput - The return type for the assessListening function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { 
  ListeningAssessmentInputSchema, 
  type ListeningAssessmentInput, 
  ListeningAssessmentOutputSchema, 
  type ListeningAssessmentOutput 
} from './listeningAssessmentSchemas';

export type { ListeningAssessmentInput, ListeningAssessmentOutput };

export async function assessListening(
  input: ListeningAssessmentInput
): Promise<ListeningAssessmentOutput> {
  // For now, we directly use the provided transcript for assessment.
  // A full implementation would involve Speech-to-Text if an audio URI was provided.
  return await listeningAssessmentFlow(input);
}

const listeningAssessmentInternalPrompt = ai.definePrompt({
  name: 'listeningAssessmentInternalPrompt',
  input: { schema: ListeningAssessmentInputSchema },
  output: { schema: ListeningAssessmentOutputSchema },
  prompt: `
    You are an expert French language examiner specializing in TEF Canada listening comprehension assessments.
    The student was provided with the following audio transcript:
    "{{{audioTranscript}}}"

    The student's written response to questions or a summary task about the audio content is:
    "{{{studentResponseText}}}"

    Please evaluate the student's listening comprehension (as inferred from their response to the transcript) and their written response. Provide:
    1.  **Comprehension Feedback**: Assess how well the student understood the main ideas, details, and speaker intent from the transcript, as reflected in their response.
    2.  **Clarity Feedback**: Comment on the clarity and organization of the student's response.
    3.  **Language Use Feedback**: Evaluate the grammatical accuracy and vocabulary appropriateness in the student's response.
    4.  **Relevance to Transcript Feedback**: Judge how well the student's response addresses the content of the transcript.
    5.  **Overall Score**: Provide an overall score from 0 to 100, considering all the above aspects.
    6.  **Suggestions for Improvement**: Offer 2-3 specific, actionable suggestions for improving listening comprehension skills and how to better respond to tasks based on audio content.

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

const listeningAssessmentFlow = ai.defineFlow(
  {
    name: 'listeningAssessmentFlow',
    inputSchema: ListeningAssessmentInputSchema,
    outputSchema: ListeningAssessmentOutputSchema,
  },
  async (input) => {
    // In a full scenario with actual audio, this is where Speech-to-Text would happen.
    // Since we're using admin-provided transcripts for now, we pass it directly.
    // const transcript = await speechToText(input.audioDataUri); 
    // const { output } = await listeningAssessmentInternalPrompt({ audioTranscript: transcript, studentResponseText: input.studentResponseText });
    
    const { output } = await listeningAssessmentInternalPrompt(input);


    if (!output) {
      throw new Error('Failed to get listening assessment from AI model.');
    }
    return output;
  }
);
