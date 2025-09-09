// src/app/student/ai-tutor/speaking/actions.ts
"use server";

import { z } from "zod";
import { assessSpeaking } from "@/ai/flows/speakingAssessmentFlow";
import { 
  type SpeakingAssessmentInput, 
  type SpeakingAssessmentOutput,
  SpeakingAssessmentInputSchema
} from "@/ai/flows/speakingAssessmentSchemas";


export type SpeakingAssessmentFormState = {
  message: string;
  errors?: {
    promptText?: string[];
    audioDataUri?: string[];
    form?: string[];
  };
  isSuccess: boolean;
  assessmentResult?: SpeakingAssessmentOutput;
};

export async function submitSpeakingAssessment(
  input: SpeakingAssessmentInput
): Promise<SpeakingAssessmentFormState> {
  
  const validatedFields = SpeakingAssessmentInputSchema.safeParse(input);

  if (!validatedFields.success) {
    return {
      message: "Validation failed. Please check your input.",
      errors: validatedFields.error.flatten().fieldErrors,
      isSuccess: false,
    };
  }

  try {
    const result = await assessSpeaking(validatedFields.data);

    if (result) {
      return {
        message: "Assessment processed successfully!",
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
    console.error("Error submitting speaking assessment:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return {
      message: `An unexpected error occurred: ${errorMessage}`,
      isSuccess: false,
    };
  }
}
