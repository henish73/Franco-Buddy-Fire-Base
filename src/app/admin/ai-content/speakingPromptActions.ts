// src/app/admin/ai-content/speakingPromptActions.ts
"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import type { SpeakingPrompt } from "./page"; // Import type from the page component for now

// Zod schema for Speaking Prompt form validation
export const speakingPromptSchema = z.object({
  id: z.string().optional(),
  topic: z.string().min(3, "Topic is required (min 3 chars)"),
  promptText: z.string().min(10, "Prompt text is required (min 10 chars)"),
  expectedKeywords: z.preprocess(
    (val) => (typeof val === 'string' && val.trim() !== '' ? val.split(',').map(s => s.trim()).filter(Boolean) : []),
    z.array(z.string()).optional()
  ),
  // Add other fields as they are implemented (e.g., audioExampleUrl, difficultyLevel)
});
export type SpeakingPromptFormData = z.infer<typeof speakingPromptSchema>;

// Form State Type
export type SpeakingPromptFormState = {
  message: string;
  errors?: {
    topic?: string[];
    promptText?: string[];
    expectedKeywords?: string[];
    form?: string[];
  };
  isSuccess: boolean;
  data?: SpeakingPrompt | SpeakingPrompt[] | null;
};

// Simulated Database for Speaking Prompts
let simulatedSpeakingPromptsDb: SpeakingPrompt[] = [
  {
    id: "spk_prompt_1",
    topic: "Daily Routine",
    promptText: "Parlez-moi de votre routine quotidienne. Que faites-vous habituellement le matin, l'après-midi et le soir?",
    expectedKeywords: ["matin", "réveille", "déjeuner", "travail", "soir", "dîner", "coucher"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "spk_prompt_2",
    topic: "Hobbies",
    promptText: "Quels sont vos passe-temps préférés? Pourquoi les aimez-vous?",
    expectedKeywords: ["loisirs", "temps libre", "aime", "préféré", "intéressant"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

// Server Actions
export async function getSpeakingPromptsAction(): Promise<SpeakingPromptFormState> {
  try {
    // Simulate fetching from Firestore
    return {
      message: "Speaking prompts fetched successfully.",
      isSuccess: true,
      data: JSON.parse(JSON.stringify(simulatedSpeakingPromptsDb.sort((a,b) => (a.topic || "").localeCompare(b.topic || "")))),
    };
  } catch (error) {
    console.error("Error fetching speaking prompts:", error);
    return { message: "Failed to fetch speaking prompts.", isSuccess: false, data: null };
  }
}

export async function addSpeakingPromptAction(
  prevState: SpeakingPromptFormState,
  formData: FormData
): Promise<SpeakingPromptFormState> {
  const rawFormData = Object.fromEntries(formData.entries());
  const validatedFields = speakingPromptSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      message: "Validation failed.",
      errors: validatedFields.error.flatten().fieldErrors,
      isSuccess: false,
    };
  }

  try {
    const newPromptData = validatedFields.data;
    const newPrompt: SpeakingPrompt = {
      ...newPromptData,
      id: `spk_prompt_${Date.now()}`, // Generate unique ID
      expectedKeywords: newPromptData.expectedKeywords || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    simulatedSpeakingPromptsDb.push(newPrompt);
    console.log("[Server Action] Added new speaking prompt:", newPrompt);
    
    revalidatePath("/admin/ai-content");
    
    return { message: "Speaking prompt added successfully!", isSuccess: true, data: newPrompt };
  } catch (error) {
    console.error("Error adding speaking prompt:", error);
    return { message: "Failed to add speaking prompt.", isSuccess: false };
  }
}

export async function updateSpeakingPromptAction(
  prevState: SpeakingPromptFormState,
  formData: FormData
): Promise<SpeakingPromptFormState> {
  const rawFormData = Object.fromEntries(formData.entries());
  const validatedFields = speakingPromptSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      message: "Validation failed.",
      errors: validatedFields.error.flatten().fieldErrors,
      isSuccess: false,
    };
  }

  const promptId = formData.get('id') as string;
  if (!promptId) {
    return { message: "Prompt ID is missing for update.", isSuccess: false };
  }
  
  const promptIndex = simulatedSpeakingPromptsDb.findIndex(p => p.id === promptId);
  if (promptIndex === -1) {
    return { message: "Speaking prompt not found for update.", isSuccess: false };
  }

  try {
    const updatedData = validatedFields.data;
    const originalPrompt = simulatedSpeakingPromptsDb[promptIndex];
    const updatedPrompt: SpeakingPrompt = {
      ...originalPrompt,
      ...updatedData,
      expectedKeywords: updatedData.expectedKeywords || [],
      updatedAt: new Date().toISOString(),
    };
    
    simulatedSpeakingPromptsDb[promptIndex] = updatedPrompt;
    console.log("[Server Action] Updated speaking prompt:", updatedPrompt);

    revalidatePath("/admin/ai-content");
    
    return { message: "Speaking prompt updated successfully!", isSuccess: true, data: updatedPrompt };
  } catch (error) {
    console.error("Error updating speaking prompt:", error);
    return { message: "Failed to update speaking prompt.", isSuccess: false };
  }
}

export async function deleteSpeakingPromptAction(promptId: string): Promise<SpeakingPromptFormState> {
  try {
    const initialLength = simulatedSpeakingPromptsDb.length;
    simulatedSpeakingPromptsDb = simulatedSpeakingPromptsDb.filter(p => p.id !== promptId);
    
    if (simulatedSpeakingPromptsDb.length === initialLength) {
      return { message: "Speaking prompt not found for deletion.", isSuccess: false };
    }
    console.log(`[Server Action] Deleted speaking prompt ${promptId}.`);

    revalidatePath("/admin/ai-content");
    
    return { message: "Speaking prompt deleted successfully!", isSuccess: true };
  } catch (error) {
    console.error("Error deleting speaking prompt:", error);
    return { message: "Failed to delete speaking prompt.", isSuccess: false };
  }
}
