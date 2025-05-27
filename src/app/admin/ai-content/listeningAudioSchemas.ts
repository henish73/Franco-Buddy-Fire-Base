// src/app/admin/ai-content/listeningAudioSchemas.ts
import { z } from "zod";

// Data model type for Listening Audio
export type ListeningAudio = {
  id: string;
  topic: string;
  audioFileUrlOrName: string; // For now, a text field. Later, actual file path from Storage.
  transcript?: string;
  // Later: difficultyLevel, associatedQuestions: Question[]
  createdAt?: string;
  updatedAt?: string;
};

// Zod schema for form validation
export const listeningAudioSchema = z.object({
  id: z.string().optional(),
  topic: z.string().min(3, "Topic is required (min 3 chars)"),
  audioFileUrlOrName: z.string().min(5, "Audio file URL or name is required (min 5 chars)"),
  transcript: z.string().optional(),
});
export type ListeningAudioFormData = z.infer<typeof listeningAudioSchema>;

// Form State Type for server actions
export type ListeningAudioFormState = {
  message: string;
  errors?: {
    topic?: string[];
    audioFileUrlOrName?: string[];
    transcript?: string[];
    form?: string[];
  };
  isSuccess: boolean;
  data?: ListeningAudio | ListeningAudio[] | null;
};
