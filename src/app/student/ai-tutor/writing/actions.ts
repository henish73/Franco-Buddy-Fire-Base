
// src/app/student/ai-tutor/writing/actions.ts
"use server";

import { z } from "zod";
import { assessWriting } from "@/ai/flows/writingAssessmentFlow";
import { 
  type WritingAssessmentInput, // Correct import path
  type WritingAssessmentOutput, // Correct import path
  WritingAssessmentInputSchema // If needed for validation within action
} from "@/ai/flows/writingAssessmentSchemas";


// Client-side validation schema could be defined here if different from backend,
// or re-use WritingAssessmentInputSchema if identical.
const ClientWritingAssessmentSchema = WritingAssessmentInputSchema; // Re-using for simplicity

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
  
  const validatedFields = ClientWritingAssessmentSchema.safeParse({
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

