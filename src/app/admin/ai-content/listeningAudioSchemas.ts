// src/app/admin/ai-content/listeningAudioSchemas.ts
import { z } from "zod";
import { quizQuestionSchema, type QuizQuestion } from "./readingPassageSchemas"; // Re-use QuizQuestion

// Data model type for Listening Audio
export type ListeningAudio = {
  id: string;
  topic: string;
  audioFileUrlOrName: string; // For now, a text field. Later, actual file path from Storage.
  transcript?: string;
  difficultyLevel?: "Beginner (CLB 1-3)" | "Intermediate (CLB 4-6)" | "Advanced (CLB 7+)";
  tefSection?: string;
  questions?: QuizQuestion[]; // Array of quiz questions
  createdAt?: string;
  updatedAt?: string;
};

// Zod schema for form validation
export const listeningAudioSchema = z.object({
  id: z.string().optional(),
  topic: z.string().min(3, "Topic is required (min 3 chars)"),
  audioFileUrlOrName: z.string().min(5, "Audio file URL or name is required (min 5 chars)"),
  transcript: z.string().optional(),
  difficultyLevel: z.enum(["Beginner (CLB 1-3)", "Intermediate (CLB 4-6)", "Advanced (CLB 7+)"]).optional(),
  tefSection: z.string().optional(),
  questions: z.string().optional().transform((val, ctx) => { // Questions entered as JSON string
    if (!val || val.trim() === "") return [];
    try {
      const parsed = JSON.parse(val);
      const validatedQuestions = z.array(quizQuestionSchema).safeParse(parsed);
      if (!validatedQuestions.success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Invalid questions JSON structure or content: " + validatedQuestions.error.flatten().fieldErrors,
        });
        return z.NEVER;
      }
      return validatedQuestions.data;
    } catch (e) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Invalid JSON format for questions.",
      });
      return z.NEVER;
    }
  }),
});
export type ListeningAudioFormData = z.infer<typeof listeningAudioSchema>;

// Form State Type for server actions
export type ListeningAudioFormState = {
  message: string;
  errors?: {
    topic?: string[];
    audioFileUrlOrName?: string[];
    transcript?: string[];
    difficultyLevel?: string[];
    tefSection?: string[];
    questions?: string[];
    form?: string[];
  };
  isSuccess: boolean;
  data?: ListeningAudio | ListeningAudio[] | null;
};
