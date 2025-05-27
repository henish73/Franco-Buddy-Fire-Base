// src/app/admin/ai-content/writingPromptSchemas.ts
import { z } from "zod";

// Data model type for a Writing Prompt
export type WritingPrompt = {
  id: string;
  topic: string;
  taskType: string; // e.g., "Formal Letter", "Opinion Essay", "Summary"
  promptText: string;
  sampleResponse?: string;
  createdAt?: string;
  updatedAt?: string;
};

// Zod schema for form validation
export const writingPromptSchema = z.object({
  id: z.string().optional(),
  topic: z.string().min(3, "Topic is required (min 3 chars)"),
  taskType: z.string().min(3, "Task type is required (e.g., Formal Letter)"),
  promptText: z.string().min(10, "Prompt text is required (min 10 chars)"),
  sampleResponse: z.string().optional(),
});
export type WritingPromptFormData = z.infer<typeof writingPromptSchema>;

// Form State Type for server actions
export type WritingPromptFormState = {
  message: string;
  errors?: {
    topic?: string[];
    taskType?: string[];
    promptText?: string[];
    sampleResponse?: string[];
    form?: string[];
  };
  isSuccess: boolean;
  data?: WritingPrompt | WritingPrompt[] | null;
};
