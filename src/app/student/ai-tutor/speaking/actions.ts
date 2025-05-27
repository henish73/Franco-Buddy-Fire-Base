
// src/app/student/ai-tutor/speaking/actions.ts
"use server";

import { z } from "zod";
import { assessSpeaking, type SpeakingAssessmentInput, type SpeakingAssessmentOutput } from "@/ai/flows/speakingAssessmentFlow";

const SpeakingAssessmentClientSchema = z.object({
  promptText: z.string().min(1, { message: "Prompt text is required." }),
  audioDataUri: z.string().startsWith("data:audio/", { message: "Invalid audio data URI." }),
});

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
  promptText: string,
  audioDataUri: string
): Promise<SpeakingAssessmentFormState> {
  
  const validatedFields = SpeakingAssessmentClientSchema.safeParse({
    promptText,
    audioDataUri,
  });

  if (!validatedFields.success) {
    return {
      message: "Validation failed. Please check your input.",
      errors: validatedFields.error.flatten().fieldErrors,
      isSuccess: false,
    };
  }

  try {
    const input: SpeakingAssessmentInput = validatedFields.data;
    const result = await assessSpeaking(input); // This currently returns mock data

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
    return {
      message: "An unexpected error occurred while processing your assessment. Please try again.",
      isSuccess: false,
    };
  }
}
