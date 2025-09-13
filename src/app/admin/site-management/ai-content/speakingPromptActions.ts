// src/app/admin/site-management/ai-content/speakingPromptActions.ts
"use server";

import { revalidatePath } from 'next/cache';
import { speakingPromptSchema, type SpeakingPrompt, type SpeakingPromptFormState } from './schemas';

// --- In-memory DB for Speaking Prompts ---
let simulatedSpeakingPromptsDb: SpeakingPrompt[] = [
  { id: 'spk1', topic: 'Daily Routine', promptText: 'Describe your typical daily routine.', expectedKeywords: ['matin', 'travail', 'soir'], difficultyLevel: 'Beginner (CLB 1-3)', tefSection: 'Speaking Section B' },
  { id: 'spk2', topic: 'Favorite Holiday', promptText: 'Talk about your favorite holiday destination and why you like it.', expectedKeywords: ['voyage', 'plage', 'montagne'], difficultyLevel: 'Intermediate (CLB 4-6)', tefSection: 'Speaking Section B' }
];

export async function getSpeakingPromptsAction(): Promise<SpeakingPromptFormState> {
  try {
    return { message: "Speaking prompts fetched.", isSuccess: true, data: JSON.parse(JSON.stringify(simulatedSpeakingPromptsDb)) };
  } catch (e) {
    return { message: "Failed to fetch speaking prompts.", isSuccess: false };
  }
}

export async function addSpeakingPromptAction(prevState: SpeakingPromptFormState, formData: FormData): Promise<SpeakingPromptFormState> {
  const rawData = {
    ...Object.fromEntries(formData),
  };
  const validatedFields = speakingPromptSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return { message: "Validation Failed", errors: validatedFields.error.flatten().fieldErrors, isSuccess: false };
  }
  try {
    const newPrompt: SpeakingPrompt = {
      ...validatedFields.data,
      id: `spk_${Date.now()}`,
      expectedKeywords: validatedFields.data.expectedKeywords?.split(',').map(kw => kw.trim()).filter(Boolean) || []
    };
    simulatedSpeakingPromptsDb.push(newPrompt);
    revalidatePath('/admin/site-management/ai-content');
    return { message: "Speaking prompt added successfully!", isSuccess: true };
  } catch (e) {
    return { message: (e as Error).message, isSuccess: false };
  }
}

export async function updateSpeakingPromptAction(prevState: SpeakingPromptFormState, formData: FormData): Promise<SpeakingPromptFormState> {
  const id = formData.get('id') as string;
  if (!id) return { message: "ID is missing", isSuccess: false };

  const rawData = {
    ...Object.fromEntries(formData),
  };
  const validatedFields = speakingPromptSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return { message: "Validation Failed", errors: validatedFields.error.flatten().fieldErrors, isSuccess: false };
  }

  try {
    const index = simulatedSpeakingPromptsDb.findIndex(p => p.id === id);
    if (index === -1) return { message: "Prompt not found", isSuccess: false };

    simulatedSpeakingPromptsDb[index] = { 
      ...validatedFields.data, 
      id,
      expectedKeywords: validatedFields.data.expectedKeywords?.split(',').map(kw => kw.trim()).filter(Boolean) || []
    };
    revalidatePath('/admin/site-management/ai-content');
    return { message: "Speaking prompt updated successfully!", isSuccess: true };
  } catch (e) {
    return { message: (e as Error).message, isSuccess: false };
  }
}

export async function deleteSpeakingPromptAction(id: string): Promise<SpeakingPromptFormState> {
  try {
    simulatedSpeakingPromptsDb = simulatedSpeakingPromptsDb.filter(p => p.id !== id);
    revalidatePath('/admin/site-management/ai-content');
    return { message: "Speaking prompt deleted successfully!", isSuccess: true };
  } catch (e) {
    return { message: (e as Error).message, isSuccess: false };
  }
}
