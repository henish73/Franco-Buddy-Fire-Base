
// src/app/student/ai-tutor/reading/actions.ts
"use server";

import { z } from "zod";
import { assessReading } from "@/ai/flows/readingAssessmentFlow";
import { 
  type ReadingAssessmentInput,
  type ReadingAssessmentOutput,
  ReadingAssessmentInputSchema
} from "@/ai/flows/readingAssessmentSchemas";

export type ReadingAssessmentFormState = {
  message: string;
  errors?: {
    passageText?: string[];
    studentResponseText?: string[];
    form?: string[];
  };
  isSuccess: boolean;
  assessmentResult?: ReadingAssessmentOutput;
};

export async function submitReadingAssessment(
  passageText: string,
  studentResponseText: string
): Promise<ReadingAssessmentFormState> {
  
  const validatedFields = ReadingAssessmentInputSchema.safeParse({
    passageText,
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
    const input: ReadingAssessmentInput = validatedFields.data;
    const result = await assessReading(input);

    if (result) {
      return {
        message: "Reading assessment processed successfully!",
        isSuccess: true,
        assessmentResult: result,
      };
    } else {
      // This case might not be hit if assessReading throws an error for !output
      return {
        message: "Failed to get assessment from AI model.",
        isSuccess: false,
      };
    }
  } catch (error) {
    console.error("Error submitting reading assessment:", error);
    // Check if error is an instance of Error to safely access message
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return {
      message: `An unexpected error occurred: ${errorMessage}`,
      isSuccess: false,
    };
  }
}
