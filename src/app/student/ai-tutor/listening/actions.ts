
// src/app/student/ai-tutor/listening/actions.ts
"use server";

import { z } from "zod";
import { assessListening } from "@/ai/flows/listeningAssessmentFlow";
import { 
  type ListeningAssessmentInput,
  type ListeningAssessmentOutput,
  ListeningAssessmentInputSchema
} from "@/ai/flows/listeningAssessmentSchemas";

export type ListeningAssessmentFormState = {
  message: string;
  errors?: {
    audioTranscript?: string[];
    studentResponseText?: string[];
    form?: string[];
  };
  isSuccess: boolean;
  assessmentResult?: ListeningAssessmentOutput;
};

export async function submitListeningAssessment(
  audioTranscript: string,
  studentResponseText: string
): Promise<ListeningAssessmentFormState> {
  
  const validatedFields = ListeningAssessmentInputSchema.safeParse({
    audioTranscript,
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
    const input: ListeningAssessmentInput = validatedFields.data;
    const result = await assessListening(input);

    if (result) {
      return {
        message: "Listening assessment processed successfully!",
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
    console.error("Error submitting listening assessment:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return {
      message: `An unexpected error occurred: ${errorMessage}`,
      isSuccess: false,
    };
  }
}
