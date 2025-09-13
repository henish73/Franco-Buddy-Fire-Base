// src/app/admin/site-management/ai-content/schemas.ts
import { z } from 'zod';

// --- Speaking Schemas ---
export const speakingPromptSchema = z.object({
  id: z.string().optional(),
  topic: z.string().min(3, "Topic is required."),
  promptText: z.string().min(10, "Prompt text is required."),
  expectedKeywords: z.string().optional(),
  difficultyLevel: z.string().min(1, "Difficulty level is required."),
  tefSection: z.string().optional(),
});
export type SpeakingPromptFormData = z.infer<typeof speakingPromptSchema>;
export type SpeakingPrompt = SpeakingPromptFormData & {
  id: string;
  expectedKeywords: string[];
};
export type SpeakingPromptFormState = {
  message: string;
  errors?: Partial<Record<keyof SpeakingPromptFormData, string[]>>;
  isSuccess: boolean;
  data?: SpeakingPrompt[] | SpeakingPrompt | null;
};


// --- Writing Schemas ---
export const writingPromptSchema = z.object({
  id: z.string().optional(),
  topic: z.string().min(3, "Topic is required."),
  taskType: z.string().min(3, "Task type is required."),
  promptText: z.string().min(10, "Prompt text is required."),
  sampleResponse: z.string().optional(),
  difficultyLevel: z.string().min(1, "Difficulty level is required."),
  tefSection: z.string().optional(),
});
export type WritingPromptFormData = z.infer<typeof writingPromptSchema>;
export type WritingPrompt = WritingPromptFormData & { id: string };
export type WritingPromptFormState = {
  message: string;
  errors?: Partial<Record<keyof WritingPromptFormData, string[]>>;
  isSuccess: boolean;
  data?: WritingPrompt[] | WritingPrompt | null;
};


// --- Reading Schemas ---
export const quizQuestionSchema = z.object({
  id: z.string(),
  questionText: z.string(),
  options: z.array(z.string()),
  correctAnswer: z.string(),
  tefSkillTarget: z.string().optional(),
});
export type QuizQuestion = z.infer<typeof quizQuestionSchema>;

export const readingPassageSchema = z.object({
  id: z.string().optional(),
  topic: z.string().min(3, "Topic is required."),
  passageText: z.string().min(20, "Passage text is required."),
  difficultyLevel: z.string().min(1, "Difficulty level is required."),
  tefSection: z.string().optional(),
  questions: z.string(), // JSON string for questions
});
export type ReadingPassageFormData = z.infer<typeof readingPassageSchema>;
export type ReadingPassage = Omit<ReadingPassageFormData, 'questions'> & { 
  id: string;
  questions: QuizQuestion[];
};
export type ReadingPassageFormState = {
  message: string;
  errors?: Partial<Record<keyof ReadingPassageFormData, string[]>>;
  isSuccess: boolean;
  data?: ReadingPassage[] | ReadingPassage | null;
};


// --- Listening Schemas ---
export const listeningAudioSchema = z.object({
  id: z.string().optional(),
  topic: z.string().min(3, "Topic is required."),
  audioFileUrlOrName: z.string().min(1, "Audio file URL/name is required."),
  transcript: z.string().optional(),
  difficultyLevel: z.string().min(1, "Difficulty level is required."),
  tefSection: z.string().optional(),
  questions: z.string(), // JSON string for questions
});
export type ListeningAudioFormData = z.infer<typeof listeningAudioSchema>;
export type ListeningAudio = Omit<ListeningAudioFormData, 'questions'> & { 
  id: string;
  questions?: QuizQuestion[];
};
export type ListeningAudioFormState = {
  message: string;
  errors?: Partial<Record<keyof ListeningAudioFormData, string[]>>;
  isSuccess: boolean;
  data?: ListeningAudio[] | ListeningAudio | null;
};
