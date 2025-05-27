// src/app/admin/ai-content/readingPassageSchemas.ts
import { z } from "zod";

// Define the structure for a single quiz question
export const quizQuestionSchema = z.object({
  id: z.string().min(1, "Question ID is required."),
  questionText: z.string().min(5, "Question text is required."),
  options: z.array(z.string().min(1, "Option text cannot be empty.")).min(2, "At least two options are required."),
  correctAnswer: z.string().min(1, "Correct answer is required."), // This should match one of the options' text
  tefSkillTarget: z.string().optional().describe("e.g., Identifying main idea, Understanding vocabulary in context"),
});
export type QuizQuestion = z.infer<typeof quizQuestionSchema>;

// Data model type for a Reading Passage
export type ReadingPassage = {
  id: string;
  topic: string;
  passageText: string;
  difficultyLevel?: "Beginner (CLB 1-3)" | "Intermediate (CLB 4-6)" | "Advanced (CLB 7+)";
  tefSection?: string; // e.g., "Section A: Understanding articles", "Section B: Understanding instructions"
  questions?: QuizQuestion[]; // Array of quiz questions
  createdAt?: string;
  updatedAt?: string;
};

// Zod schema for form validation, including questions as a JSON string
export const readingPassageSchema = z.object({
  id: z.string().optional(),
  topic: z.string().min(3, "Topic is required (min 3 chars)"),
  passageText: z.string().min(50, "Passage text is required (min 50 chars)"),
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
export type ReadingPassageFormData = z.infer<typeof readingPassageSchema>;

// Form State Type for server actions
export type ReadingPassageFormState = {
  message: string;
  errors?: {
    topic?: string[];
    passageText?: string[];
    difficultyLevel?: string[];
    tefSection?: string[];
    questions?: string[]; // For JSON validation errors
    form?: string[];
  };
  isSuccess: boolean;
  data?: ReadingPassage | ReadingPassage[] | null;
};
