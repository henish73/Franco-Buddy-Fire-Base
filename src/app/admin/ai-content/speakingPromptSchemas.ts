// src/app/admin/ai-content/speakingPromptSchemas.ts
import { z } from "zod";

// Data model type for a Speaking Prompt
export type SpeakingPrompt = {
  id: string;
  topic: string;
  promptText: string;
  expectedKeywords?: string[];
  createdAt?: string;
  updatedAt?: string;
};

// Zod schema for form validation
export const speakingPromptSchema = z.object({
  id: z.string().optional(),
  topic: z.string().min(3, "Topic is required (min 3 chars)"),
  promptText: z.string().min(10, "Prompt text is required (min 10 chars)"),
  expectedKeywords: z.preprocess(
    (val) => (typeof val === 'string' && val.trim() !== '' ? val.split(',').map(s => s.trim()).filter(Boolean) : []),
    z.array(z.string()).optional()
  ),
  // Add other fields as they are implemented (e.g., audioExampleUrl, difficultyLevel)
});
export type SpeakingPromptFormData = z.infer<typeof speakingPromptSchema>;

// Form State Type for server actions
export type SpeakingPromptFormState = {
  message: string;
  errors?: {
    topic?: string[];
    promptText?: string[];
    expectedKeywords?: string[];
    form?: string[];
  };
  isSuccess: boolean;
  data?: SpeakingPrompt | SpeakingPrompt[] | null;
};
