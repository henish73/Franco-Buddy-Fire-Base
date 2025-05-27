// src/app/admin/ai-content/readingPassageSchemas.ts
import { z } from "zod";

// Data model type for a Reading Passage
export type ReadingPassage = {
  id: string;
  topic: string;
  passageText: string;
  // Later: difficultyLevel, associatedQuestions: Question[]
  createdAt?: string;
  updatedAt?: string;
};

// Zod schema for form validation
export const readingPassageSchema = z.object({
  id: z.string().optional(),
  topic: z.string().min(3, "Topic is required (min 3 chars)"),
  passageText: z.string().min(50, "Passage text is required (min 50 chars)"),
});
export type ReadingPassageFormData = z.infer<typeof readingPassageSchema>;

// Form State Type for server actions
export type ReadingPassageFormState = {
  message: string;
  errors?: {
    topic?: string[];
    passageText?: string[];
    form?: string[];
  };
  isSuccess: boolean;
  data?: ReadingPassage | ReadingPassage[] | null;
};
