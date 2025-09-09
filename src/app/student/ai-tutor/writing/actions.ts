// src/app/student/ai-tutor/writing/actions.ts
"use server";

import { z } from "zod";
import { assessWriting } from "@/ai/flows/writingAssessmentFlow";
import { 
  type WritingAssessmentInput,
  type WritingAssessmentOutput,
  WritingAssessmentInputSchema
} from "@/ai/flows/writingAssessmentSchemas";

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
  input: WritingAssessmentInput
): Promise<WritingAssessmentFormState> {
  
  const validatedFields = WritingAssessmentInputSchema.safeParse(input);

  if (!validatedFields.success) {
    return {
      message: "Validation failed. Please check your input.",
      errors: validatedFields.error.flatten().fieldErrors,
      isSuccess: false,
    };
  }

  try {
    const result = await assessWriting(validatedFields.data);

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
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return {
      message: `An unexpected error occurred: ${errorMessage}`,
      isSuccess: false,
    };
  }
}
