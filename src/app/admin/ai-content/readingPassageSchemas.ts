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
    if (!val || val.trim() === "" || val.trim() === "[]") return []; // Allow empty array string
    try {
      const parsed = JSON.parse(val);
      if (!Array.isArray(parsed)) {
         ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Questions must be a JSON array.",
        });
        return z.NEVER;
      }
      if (parsed.length === 0) return []; // Valid empty array

      const validatedQuestions = z.array(quizQuestionSchema).safeParse(parsed);
      if (!validatedQuestions.success) {
        // Construct a more detailed error message
        let errorMessages = "Invalid questions JSON structure or content: ";
        const fieldErrors = validatedQuestions.error.flatten().fieldErrors as Record<string, string[]>; // Type assertion
        const arrayErrors = validatedQuestions.error.flatten().formErrors;

        if (arrayErrors.length > 0) {
            errorMessages += arrayErrors.join('; ');
        }
        
        for (const key in fieldErrors) {
            if (Object.prototype.hasOwnProperty.call(fieldErrors, key) && fieldErrors[key]) {
                 errorMessages += ` Question index ${key}: ${fieldErrors[key]!.join(', ')}. `;
            }
        }
        // Fallback for nested errors not easily caught by fieldErrors (e.g. issues within an array item)
        if (validatedQuestions.error.issues.length > 0 && errorMessages === "Invalid questions JSON structure or content: ") {
            errorMessages += validatedQuestions.error.issues.map(issue => `At path ${issue.path.join('.')}: ${issue.message}`).join('; ');
        }

        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: errorMessages,
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
