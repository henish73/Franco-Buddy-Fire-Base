
// src/app/student/ai-tutor/writing/actions.ts
"use server";

import { z } from "zod";
import { assessWriting, type WritingAssessmentInput, type WritingAssessmentOutput } from "@/ai/flows/writingAssessmentFlow";

const WritingAssessmentClientSchema = z.object({
  promptText: z.string().min(1, { message: "Prompt text is required." }),
  studentResponseText: z.string().min(10, { message: "Response must be at least 10 characters." }),
});

export type WritingAssessmentFormState = {
  message: string;
  errors?: {
    promptText?: string[];
    studentResponseText?: string[];
    form?: string[];
  };
  isSuccess: boolean;
  assessmentResult?: WritingAssessmentOutput;
};

export async function submitWritingAssessment(
  promptText: string,
  studentResponseText: string
): Promise<WritingAssessmentFormState> {
  
  const validatedFields = WritingAssessmentClientSchema.safeParse({
    promptText,
    studentResponseText,
  });

  if (!validatedFields.success) {
    return {
      message: "Validation failed. Please check your input.",
      errors: validatedFields.error.flatten().fieldErrors,
      isSuccess: false,
    };
  }

  try {
    const input: WritingAssessmentInput = validatedFields.data;
    const result = await assessWriting(input); // This currently returns mock data

    if (result) {
      return {
        message: "Writing assessment processed successfully!",
        isSuccess: true,
        assessmentResult: result,
      };
    } else {
      return {
        message: "Failed to get assessment from AI model.",
        isSuccess: false,
      };
    }
  } catch (error) {
    console.error("Error submitting writing assessment:", error);
    return {
      message: "An unexpected error occurred while processing your assessment. Please try again.",
      isSuccess: false,
    };
  }
}
