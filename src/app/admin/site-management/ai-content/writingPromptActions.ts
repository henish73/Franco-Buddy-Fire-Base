// src/app/admin/site-management/ai-content/writingPromptActions.ts
"use server";

import { revalidatePath } from 'next/cache';
import { writingPromptSchema, type WritingPrompt, type WritingPromptFormState } from './schemas';

// --- In-memory DB for Writing Prompts ---
let simulatedWritingPromptsDb: WritingPrompt[] = [
    { id: 'wp1', topic: 'Letter of Complaint', taskType: 'Formal Letter', promptText: 'Write a letter to your landlord complaining about a broken heater.', sampleResponse: 'Cher Monsieur/Madame...', difficultyLevel: 'Intermediate (CLB 4-6)', tefSection: 'Writing Section A' },
    { id: 'wp2', topic: 'Opinion on Public Transport', taskType: 'Opinion Essay', promptText: 'Do you think public transport should be free? Justify your opinion.', sampleResponse: 'À mon avis, les transports en commun...', difficultyLevel: 'Advanced (CLB 7+)', tefSection: 'Writing Section B' },
];

export async function getWritingPromptsAction(): Promise<WritingPromptFormState> {
  try {
    return { message: "Writing prompts fetched.", isSuccess: true, data: JSON.parse(JSON.stringify(simulatedWritingPromptsDb)) };
  } catch (e) {
    return { message: "Failed to fetch writing prompts.", isSuccess: false };
  }
}

export async function addWritingPromptAction(prevState: WritingPromptFormState, formData: FormData): Promise<WritingPromptFormState> {
    const validatedFields = writingPromptSchema.safeParse(Object.fromEntries(formData));
    if (!validatedFields.success) {
        return { message: "Validation Failed", errors: validatedFields.error.flatten().fieldErrors, isSuccess: false };
    }
    try {
        const newPrompt: WritingPrompt = { ...validatedFields.data, id: `wp_${Date.now()}` };
        simulatedWritingPromptsDb.push(newPrompt);
        revalidatePath('/admin/site-management/ai-content');
        return { message: "Writing prompt added successfully!", isSuccess: true };
    } catch(e) {
        return { message: (e as Error).message, isSuccess: false };
    }
}

export async function updateWritingPromptAction(prevState: WritingPromptFormState, formData: FormData): Promise<WritingPromptFormState> {
    const id = formData.get('id') as string;
    if (!id) return { message: "ID is missing", isSuccess: false };
    
    const validatedFields = writingPromptSchema.safeParse(Object.fromEntries(formData));
    if (!validatedFields.success) {
        return { message: "Validation Failed", errors: validatedFields.error.flatten().fieldErrors, isSuccess: false };
    }

    try {
        const index = simulatedWritingPromptsDb.findIndex(p => p.id === id);
        if (index === -1) return { message: "Prompt not found", isSuccess: false };
        simulatedWritingPromptsDb[index] = { ...validatedFields.data, id };
        revalidatePath('/admin/site-management/ai-content');
        return { message: "Writing prompt updated successfully!", isSuccess: true };
    } catch(e) {
        return { message: (e as Error).message, isSuccess: false };
    }
}

export async function deleteWritingPromptAction(id: string): Promise<WritingPromptFormState> {
    try {
        simulatedWritingPromptsDb = simulatedWritingPromptsDb.filter(p => p.id !== id);
        revalidatePath('/admin/site-management/ai-content');
        return { message: "Writing prompt deleted successfully!", isSuccess: true };
    } catch(e) {
        return { message: (e as Error).message, isSuccess: false };
    }
}
