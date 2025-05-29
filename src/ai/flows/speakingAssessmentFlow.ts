
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
  // Calls the actual Genkit flow
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
    // TODO: Replace with actual Speech-to-Text service call using input.audioDataUri.
    // For now, we simulate a transcription. This simulation does NOT process the actual audio.
    // It provides a generic learner-like text for the AI to analyze based on the prompt.
    let simulatedTranscription = `(Simulated Transcription for prompt: "${input.promptText}") \nBonjour. Euh, je voudrais parler de le sujet. C'est un sujet, uh, très intéressant. Je pense que... il y a beaucoup de choses à dire. Par exemple, si on regarde les statistiques, on voit que... Aussi, euh, il est important de considérer les opinions différentes. En conclusion, c'est complexe. Merci.`;

    if (input.promptText.toLowerCase().includes("vacances") || input.promptText.toLowerCase().includes("holidays")) {
        simulatedTranscription = `(Simulated Transcription for prompt: "${input.promptText}") \nSalut! Pour mes vacances, euh, je suis allé à la montagne. C'était, uh, super! J'ai fait de la randonnée et j'ai vu, um, des beaux paysages. J'ai aussi mangé de la bonne nourriture. Les vacances sont importantes pour relaxer. Merci.`;
    } else if (input.promptText.toLowerCase().includes("travail") || input.promptText.toLowerCase().includes("work")) {
        simulatedTranscription = `(Simulated Transcription for prompt: "${input.promptText}") \nBonjour. Concernant mon travail, je suis, euh, ingénieur. J'aime mon travail parce que c'est, um, stimulant. Je travaille sur des projets, uh, difficiles mais intéressants. Les collègues sont sympas. C'est tout.`;
    } else if (input.promptText.toLowerCase().includes("routine") || input.promptText.toLowerCase().includes("daily")) {
        simulatedTranscription = `(Simulated Transcription for prompt: "${input.promptText}") \nBonjour, euh... je veux parler de ma routine. Le matin, je me réveille et... je prends mon petit déjeuner. Après ça, je vais au travail. L'après-midi, je travaille beaucoup. Le soir, je rentre et je mange. J'aime ma routine. Merci.`;
    }
    
    console.log("Using Simulated Transcription for AI Analysis:", simulatedTranscription);
    console.log("Original Prompt for AI:", input.promptText);
    console.log("TEF Section for AI:", input.tefSection);
    console.log("Difficulty for AI:", input.difficultyLevel);
    
    // Step 2: Call the Gemini model for analysis using the defined prompt
    const { output } = await speakingAssessmentInternalPrompt({
      transcribedText: simulatedTranscription, // Pass the new simulated transcription
      originalPrompt: input.promptText,
      tefSection: input.tefSection,
      difficultyLevel: input.difficultyLevel,
    });

    if (!output) {
      throw new Error('Failed to get assessment from AI model.');
    }

    return {
      transcription: simulatedTranscription, // Return the new simulated transcription
      ...output, 
    };
  }
);
