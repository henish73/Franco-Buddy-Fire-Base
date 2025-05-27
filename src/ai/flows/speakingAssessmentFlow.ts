
'use server';
/**
 * @fileOverview AI-powered speaking assessment flow.
 *
 * - assessSpeaking - A function that handles the speaking assessment process.
 * - SpeakingAssessmentInput - The input type for the assessSpeaking function.
 * - SpeakingAssessmentOutput - The return type for the assessSpeaking function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import {
  SpeakingAssessmentInputSchema,
  type SpeakingAssessmentInput,
  SpeakingAssessmentOutputSchema,
  type SpeakingAssessmentOutput,
} from './speakingAssessmentSchemas';

export { type SpeakingAssessmentInput, type SpeakingAssessmentOutput };

export async function assessSpeaking(
  input: SpeakingAssessmentInput
): Promise<SpeakingAssessmentOutput> {
  // Now calls the actual Genkit flow
  return await speakingAssessmentFlow(input);
}

const speakingAssessmentInternalPrompt = ai.definePrompt({
  name: 'speakingAssessmentInternalPrompt',
  input: { schema: z.object({ transcribedText: z.string(), originalPrompt: z.string() }) },
  output: { schema: SpeakingAssessmentOutputSchema.omit({ transcription: true }) }, // Output schema for feedback part
  prompt: `
    You are an expert French language examiner specializing in TEF Canada assessments.
    The student was given the following prompt to respond to orally:
    "{{{originalPrompt}}}"

    The student's spoken response has been transcribed as:
    "{{{transcribedText}}}"

    Based ONLY on the provided transcribed text and the original prompt, please evaluate the student's French speaking performance. Provide:
    1.  **Fluency Feedback**: Comment on the flow and smoothness of the language used in the transcription.
    2.  **Pronunciation Feedback**: Based on common phonetic challenges that might be inferred from a typical learner's speech pattern for the given text (as you cannot hear the audio), provide general pronunciation advice relevant to the words used. If the transcription is too short or simple for this, state that.
    3.  **Grammar Feedback**: Assess the grammatical accuracy of the transcribed sentences.
    4.  **Vocabulary Feedback**: Evaluate the range and appropriateness of vocabulary used in the transcription in relation to the prompt.
    5.  **Coherence Feedback**: Judge how well the ideas in the transcription are organized and if they logically address the prompt.
    6.  **Overall Score**: Provide an overall score from 0 to 100, considering all the above aspects, for the *transcribed text*.
    7.  **Suggestions for Improvement**: Offer 2-3 specific, actionable suggestions for improving speaking skills based on your analysis of the transcription.

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

const speakingAssessmentFlow = ai.defineFlow(
  {
    name: 'speakingAssessmentFlow',
    inputSchema: SpeakingAssessmentInputSchema,
    outputSchema: SpeakingAssessmentOutputSchema,
  },
  async (input) => {
    // Step 1: Speech-to-Text (Simulated)
    // TODO: Replace with actual Speech-to-Text service call.
    // For now, we'll create a very basic simulated transcription.
    // A real STT service would convert input.audioDataUri to text.
    const simulatedTranscription = `This is a simulated transcription for the audio related to the prompt: "${input.promptText}". The student likely expressed some ideas clearly here, perhaps mentioning things relevant to the topic. The goal of this simulation is to provide text for the AI to analyze. Je suis en train de pratiquer mon français.`;
    
    console.log("Simulated Transcription:", simulatedTranscription);
    console.log("Original Prompt for AI:", input.promptText);
    
    // Step 2: Call the Gemini model for analysis using the defined prompt
    const { output } = await speakingAssessmentInternalPrompt({
      transcribedText: simulatedTranscription,
      originalPrompt: input.promptText,
    });

    if (!output) {
      throw new Error('Failed to get assessment from AI model.');
    }

    return {
      transcription: simulatedTranscription, // Return the (simulated) transcription
      ...output, // Spread the AI's feedback, score, and suggestions
    };
  }
);
