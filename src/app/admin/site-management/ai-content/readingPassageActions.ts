// src/app/admin/site-management/ai-content/readingPassageActions.ts
"use server";

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { readingPassageSchema, type ReadingPassage, type ReadingPassageFormState } from './schemas';

// --- In-memory DB for Reading Passages ---
let simulatedReadingPassagesDb: ReadingPassage[] = [
    { 
        id: 'rp1', 
        topic: 'Le Télétravail',
        passageText: 'Le télétravail a connu une croissance exponentielle...',
        difficultyLevel: 'Intermediate (CLB 4-6)', 
        tefSection: 'Compréhension Écrite Section B',
        questions: [
            { id: 'q1', questionText: 'Quel est le sujet principal du texte?', options: ['Les vacances', 'Le télétravail', 'Le sport'], correctAnswer: 'Le télétravail', tefSkillTarget: 'Main Idea' },
            { id: 'q2', questionText: 'Le texte mentionne-t-il un avantage du télétravail?', options: ['Oui', 'Non'], correctAnswer: 'Oui', tefSkillTarget: 'Detail Identification' }
        ]
    }
];

// Helper to parse JSON fields safely
function parseJsonField(jsonString: string | undefined | null, schema: z.ZodTypeAny, fieldName: string) {
    if (!jsonString || jsonString.trim() === "") return [];
    try {
        const parsed = JSON.parse(jsonString);
        return schema.parse(parsed);
    } catch (e) {
        throw new Error(`Invalid JSON format for ${fieldName}: ${(e as Error).message}`);
    }
}

export async function getReadingPassagesAction(): Promise<ReadingPassageFormState> {
  try {
    return { message: "Reading passages fetched.", isSuccess: true, data: JSON.parse(JSON.stringify(simulatedReadingPassagesDb)) };
  } catch (e) {
    return { message: "Failed to fetch reading passages.", isSuccess: false };
  }
}

export async function addReadingPassageAction(prevState: ReadingPassageFormState, formData: FormData): Promise<ReadingPassageFormState> {
    const rawData = Object.fromEntries(formData);
    try {
        const validatedFields = readingPassageSchema.safeParse(rawData);
        if (!validatedFields.success) {
            return { message: "Validation Failed", errors: validatedFields.error.flatten().fieldErrors, isSuccess: false };
        }
        
        const questions = parseJsonField(validatedFields.data.questions, z.array(z.any()), 'questions');

        const newPassage: ReadingPassage = { ...validatedFields.data, id: `rp_${Date.now()}`, questions };
        simulatedReadingPassagesDb.push(newPassage);
        revalidatePath('/admin/site-management/ai-content');
        return { message: "Reading passage added successfully!", isSuccess: true };
    } catch(e) {
        return { message: (e as Error).message, isSuccess: false };
    }
}

export async function updateReadingPassageAction(prevState: ReadingPassageFormState, formData: FormData): Promise<ReadingPassageFormState> {
    const id = formData.get('id') as string;
    if (!id) return { message: "ID is missing", isSuccess: false };
    
    const rawData = Object.fromEntries(formData);
    try {
        const validatedFields = readingPassageSchema.safeParse(rawData);
        if (!validatedFields.success) {
            return { message: "Validation Failed", errors: validatedFields.error.flatten().fieldErrors, isSuccess: false };
        }

        const index = simulatedReadingPassagesDb.findIndex(p => p.id === id);
        if (index === -1) return { message: "Passage not found", isSuccess: false };
        
        const questions = parseJsonField(validatedFields.data.questions, z.array(z.any()), 'questions');

        simulatedReadingPassagesDb[index] = { ...validatedFields.data, id, questions };
        revalidatePath('/admin/site-management/ai-content');
        return { message: "Reading passage updated successfully!", isSuccess: true };
    } catch(e) {
        return { message: (e as Error).message, isSuccess: false };
    }
}

export async function deleteReadingPassageAction(id: string): Promise<ReadingPassageFormState> {
    try {
        simulatedReadingPassagesDb = simulatedReadingPassagesDb.filter(p => p.id !== id);
        revalidatePath('/admin/site-management/ai-content');
        return { message: "Reading passage deleted successfully!", isSuccess: true };
    } catch(e) {
        return { message: (e as Error).message, isSuccess: false };
    }
}
