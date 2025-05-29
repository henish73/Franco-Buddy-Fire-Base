
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
  input: { schema: z.object({ transcribedText: z.string(), originalPrompt: z.string(), tefSection: z.string().optional(), difficultyLevel: z.string().optional() }) },
  output: { schema: SpeakingAssessmentOutputSchema.omit({ transcription: true }) }, // Output schema for feedback part
  prompt: `
    You are an expert French language examiner specializing in TEF Canada assessments.
    The student was given the following prompt to respond to orally:
    "{{{originalPrompt}}}"
    (This prompt was for TEF Section: {{{tefSection}}}, Difficulty: {{{difficultyLevel}}})

    The student's spoken response has been transcribed (simulated) as:
    "{{{transcribedText}}}"

    Based ONLY on the provided transcribed text and the original prompt, please evaluate the student's French speaking performance. Provide:
    1.  **Fluency Feedback**: Assess the flow and smoothness. Note any textual evidence of hesitations (e.g., "euh", repeated short words if they seem like fillers), awkward pauses (if inferable from sentence structure), and overall pace.
    2.  **Pronunciation Feedback**: Based *only* on the transcribed words, provide general advice on common pronunciation challenges French learners face with the specific vocabulary used. For example, if "beaucoup" is present, you might mention the 'eau' sound. Do not attempt to infer actual mispronunciations from the text. If the transcription is too short or simple for this, state that. This feedback is for guidance and does not directly contribute to the Overall Score.
    3.  **Grammar Feedback**: Identify any grammatical errors in the transcribed sentences. Provide specific examples of errors and suggest corrections. Comment on the correct use of tenses, agreements, and sentence structures.
    4.  **Vocabulary Feedback**: Evaluate the range, appropriateness, and precision of vocabulary used in the transcription in relation to the prompt. Note any misuse of words or suggest more suitable alternatives.
    5.  **Coherence Feedback**: Judge how well the ideas in the transcription are organized and if they logically address all parts of the original prompt.
    6.  **Task Achievement Feedback**: Assess how well the student's response addressed all parts of the original speaking prompt.
    7.  **Overall Score**: Provide an overall score from 0 to 100. This score should be determined by evaluating fluency, grammar, vocabulary, coherence, and task achievement based on the transcribed text. Do not let the text-based pronunciation feedback directly influence this numerical score.
    8.  **Suggestions for Improvement**: Offer 2-3 specific, actionable suggestions for improving speaking skills based on your analysis of the transcription. These should be concrete steps the student can take.

    Ensure your output strictly adheres to the JSON schema provided for feedback, score, and suggestions.
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
    // Step 1: Speech-to-Text (Simulated)
    // TODO: Replace with actual Speech-to-Text service call.
    // For now, we'll create a very basic simulated transcription.
    // A real STT service would convert input.audioDataUri to text.
    // Making the simulated transcription a bit more learner-like for better AI feedback.
    const simulatedTranscription = `Bonjour, euh... je veux parler de mes vacances. Je suis allé à la plage et... c'était très amusant. Le temps était beau et je... je nage beaucoup. Aussi, j'ai mangé des bonnes nourritures. J'aime les vacances. Merci.`;
    
    console.log("Simulated Transcription:", simulatedTranscription);
    console.log("Original Prompt for AI:", input.promptText);
    console.log("TEF Section for AI:", input.tefSection);
    console.log("Difficulty for AI:", input.difficultyLevel);
    
    // Step 2: Call the Gemini model for analysis using the defined prompt
    const { output } = await speakingAssessmentInternalPrompt({
      transcribedText: simulatedTranscription,
      originalPrompt: input.promptText,
      tefSection: input.tefSection,
      difficultyLevel: input.difficultyLevel,
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
