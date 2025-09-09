// src/ai/flows/speakingAssessmentSchemas.ts
import { z } from 'zod';

export const SpeakingAssessmentInputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      "The student's spoken audio, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  promptText: z.string().describe('The text of the prompt the student responded to.'),
  tefSection: z.string().optional().describe('The specific TEF Canada section this prompt relates to (e.g., "Section A: Information Gathering").'),
  difficultyLevel: z.string().optional().describe('The difficulty level of the prompt (e.g., "Intermediate (CLB 4-6)").'),
});
export type SpeakingAssessmentInput = z.infer<typeof SpeakingAssessmentInputSchema>;

export const SpeakingAssessmentOutputSchema = z.object({
  transcription: z.string().describe('The transcribed text from the student\'s audio (simulated if actual STT is not used).'),
  feedback: z.object({
    fluency: z.string().describe('Detailed feedback on the student\'s fluency, noting smoothness, hesitations, and pace as inferable from the transcription.'),
    pronunciation: z.string().describe('General feedback on pronunciation based on the words used in the transcription, highlighting common challenges for learners. Does not assess actual spoken pronunciation.'),
    grammar: z.string().describe('Feedback on grammatical accuracy, including examples of errors and corrections if any are identified in the transcription.'),
    vocabulary: z.string().describe('Evaluation of vocabulary range, appropriateness, and precision in relation to the prompt and TEF context.'),
    coherence: z.string().describe('Assessment of how well ideas are organized and logically connected in the transcribed response.'),
    taskAchievement: z.string().describe('Feedback on how well the student\'s response addressed all parts of the original speaking prompt.'),
  }),
  score: z.number().min(0).max(100).describe('An overall score (0-100) based on the analysis of the transcribed text, considering fluency, grammar, vocabulary, coherence, and task achievement. Pronunciation feedback provided is general advice and does not directly contribute to this numerical score.'),
  suggestionsForImprovement: z.array(z.string()).describe('Specific, actionable suggestions for improving speaking skills based on the analysis of the transcription.'),
});
export type SpeakingAssessmentOutput = z.infer<typeof SpeakingAssessmentOutputSchema>;
