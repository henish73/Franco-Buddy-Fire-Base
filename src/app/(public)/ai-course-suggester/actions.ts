// src/app/(public)/ai-course-suggester/actions.ts
"use server";

import { z } from 'zod';
import { suggestCourse, type CourseSuggestionInput, type CourseSuggestionOutput } from '@/ai/flows/course-suggestion';

const AISuggestionSchema = z.object({
  tefGoal: z.string().min(5, { message: "TEF Goal must be at least 5 characters." }),
  frenchLevel: z.string().min(1, { message: "Please select your French level." }), // Could be an enum if levels are predefined
  background: z.string().min(10, { message: "Background information must be at least 10 characters." }),
});

export type AISuggestionFormState = {
  message: string;
  errors?: {
    tefGoal?: string[];
    frenchLevel?: string[];
    background?: string[];
  };
  isSuccess: boolean;
  suggestion?: CourseSuggestionOutput;
};

const initialState: AISuggestionFormState = {
  message: "",
  isSuccess: false,
};

export async function getCourseSuggestion(
  prevState: AISuggestionFormState,
  formData: FormData
): Promise<AISuggestionFormState> {
  
  const rawFormData = {
    tefGoal: formData.get('tefGoal'),
    frenchLevel: formData.get('frenchLevel'),
    background: formData.get('background'),
  };

  const validatedFields = AISuggestionSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      ...initialState, // Reset suggestion on validation error
      message: "Validation failed. Please check your input.",
      errors: validatedFields.error.flatten().fieldErrors,
      isSuccess: false,
    };
  }

  try {
    const input: CourseSuggestionInput = validatedFields.data;
    const suggestionOutput = await suggestCourse(input);

    if (suggestionOutput) {
      return {
        message: "Here is your personalized course suggestion!",
        isSuccess: true,
        suggestion: suggestionOutput,
      };
    } else {
      return {
        ...initialState,
        message: "Could not generate a suggestion at this time. Please try again.",
        isSuccess: false,
      };
    }

  } catch (error) {
    console.error("Error getting course suggestion:", error);
    return {
      ...initialState,
      message: "An unexpected error occurred while generating your suggestion. Please try again later.",
      isSuccess: false,
    };
  }
}
