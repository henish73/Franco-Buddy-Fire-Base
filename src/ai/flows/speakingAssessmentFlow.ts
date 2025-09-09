
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

export type { SpeakingAssessmentInput, SpeakingAssessmentOutput };

export async function assessSpeaking(
  input: SpeakingAssessmentInput
): Promise<SpeakingAssessmentOutput> {
  // Calls the actual Genkit flow
  return await speakingAssessmentFlow(input);
}

// This prompt now expects audioDataUri and will instruct the model to transcribe first.
const speakingAssessmentInternalPrompt = ai.definePrompt({
  name: 'speakingAssessmentInternalPrompt',
  input: { schema: SpeakingAssessmentInputSchema }, // Takes the full input including audio URI
  output: { schema: SpeakingAssessmentOutputSchema }, // Expects transcription in the output
  prompt: `
    You are an expert French language examiner specializing in TEF Canada assessments.
    You will be provided with an audio recording of a student's spoken response and the original prompt they were asked to respond to.

    Original Prompt:
    "{{{promptText}}}"
    (This prompt was for TEF Section: {{{tefSection}}}, Difficulty: {{{difficultyLevel}}})

    Student's Spoken Audio Response:
    {{media url=audioDataUri}}

    Your tasks are:
    1.  **Transcribe the Audio**: Listen to the student's spoken audio response and provide an accurate transcription. This transcription should be placed in the "transcription" field of your JSON output.
    2.  **Evaluate the Spoken Audio & Transcription**: Based on the original prompt, the generated transcription, AND by listening to the audio, evaluate the student's French speaking performance according to the following criteria. Populate the "feedback", "score", and "suggestionsForImprovement" fields in your JSON output.
        *   **Fluency Feedback**: Assess the flow and smoothness of the speech from the audio. Note any hesitations, awkward pauses, and overall pace.
        *   **Pronunciation Feedback**: Based *directly on the audio*, provide feedback on the student's pronunciation, intonation, and rhythm. Mention specific words that were mispronounced and provide corrections.
        *   **Grammar Feedback**: Identify any grammatical errors in the transcribed sentences. Provide specific examples of errors and suggest corrections. Comment on the correct use of tenses, agreements, and sentence structures visible in the transcription.
        *   **Vocabulary Feedback**: Evaluate the range, appropriateness, and precision of vocabulary used in the transcription in relation to the prompt. Note any misuse of words or suggest more suitable alternatives.
        *   **Coherence Feedback**: Judge how well the ideas in the transcription are organized and if they logically address all parts of the original prompt.
        *   **Task Achievement Feedback**: Assess how well the student's transcribed response addressed all parts of the original speaking prompt.
        *   **TEF Section Context Feedback**: Provide feedback on how well the student's response fits the expectations of the specific TEF section (e.g., formal tone for Section A, persuasive language for Section B).
        *   **Overall Score**: Provide an overall score from 0 to 100. This score should be determined by evaluating fluency, pronunciation, grammar, vocabulary, coherence, and task achievement.
        *   **Suggestions for Improvement**: Offer 2-3 specific, actionable suggestions for improving speaking skills based on your analysis. These should be concrete steps the student can take.

    Ensure your entire output strictly adheres to the JSON schema provided for 'transcription', 'feedback', 'score', and 'suggestionsForImprovement'.
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

const speakingAssessmentFlow = ai.defineFlow(
  {
    name: 'speakingAssessmentFlow',
    inputSchema: SpeakingAssessmentInputSchema,
    outputSchema: SpeakingAssessmentOutputSchema,
  },
  async (input) => {
    console.log("Received input for speakingAssessmentFlow:", input.promptText, input.tefSection, input.difficultyLevel);
    // Directly call the internal prompt with the full input, relying on Gemini to handle the audioDataUri
    const { output } = await speakingAssessmentInternalPrompt(input);

    if (!output) {
      throw new Error('Failed to get assessment from AI model.');
    }
    console.log("Output from AI model:", output);
    return output;
  }
);
