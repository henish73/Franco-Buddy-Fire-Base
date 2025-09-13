// src/app/admin/site-management/ai-content/listeningAudioActions.ts
"use server";

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { listeningAudioSchema, type ListeningAudio, type ListeningAudioFormState } from './schemas';

// --- In-memory DB for Listening Audio ---
let simulatedListeningAudioDb: ListeningAudio[] = [
    { 
        id: 'la1', 
        topic: 'Annonce à la Gare',
        audioFileUrlOrName: '/audio/annonce_gare.mp3', // Example path
        transcript: 'Le train à destination de Lyon partira à 14h30, voie B.',
        difficultyLevel: 'Beginner (CLB 1-3)', 
        tefSection: 'Compréhension Orale Section A',
        questions: [
            { id: 'q1', questionText: 'À quelle heure part le train?', options: ['14h00', '14h30', '15h00'], correctAnswer: '14h30' },
            { id: 'q2', questionText: 'De quelle voie part le train?', options: ['Voie A', 'Voie B', 'Voie C'], correctAnswer: 'Voie B' }
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

export async function getListeningAudioAction(): Promise<ListeningAudioFormState> {
  try {
    return { message: "Listening audio items fetched.", isSuccess: true, data: JSON.parse(JSON.stringify(simulatedListeningAudioDb)) };
  } catch (e) {
    return { message: "Failed to fetch listening audio items.", isSuccess: false };
  }
}

export async function addListeningAudioAction(prevState: ListeningAudioFormState, formData: FormData): Promise<ListeningAudioFormState> {
    const rawData = Object.fromEntries(formData);
    try {
        const validatedFields = listeningAudioSchema.safeParse(rawData);
        if (!validatedFields.success) {
            return { message: "Validation Failed", errors: validatedFields.error.flatten().fieldErrors, isSuccess: false };
        }
        
        const questions = parseJsonField(validatedFields.data.questions, z.array(z.any()), 'questions');

        const newItem: ListeningAudio = { ...validatedFields.data, id: `la_${Date.now()}`, questions };
        simulatedListeningAudioDb.push(newItem);
        revalidatePath('/admin/site-management/ai-content');
        return { message: "Listening audio item added successfully!", isSuccess: true };
    } catch(e) {
        return { message: (e as Error).message, isSuccess: false };
    }
}

export async function updateListeningAudioAction(prevState: ListeningAudioFormState, formData: FormData): Promise<ListeningAudioFormState> {
    const id = formData.get('id') as string;
    if (!id) return { message: "ID is missing", isSuccess: false };
    
    const rawData = Object.fromEntries(formData);
    try {
        const validatedFields = listeningAudioSchema.safeParse(rawData);
        if (!validatedFields.success) {
            return { message: "Validation Failed", errors: validatedFields.error.flatten().fieldErrors, isSuccess: false };
        }

        const index = simulatedListeningAudioDb.findIndex(p => p.id === id);
        if (index === -1) return { message: "Item not found", isSuccess: false };
        
        const questions = parseJsonField(validatedFields.data.questions, z.array(z.any()), 'questions');

        simulatedListeningAudioDb[index] = { ...validatedFields.data, id, questions };
        revalidatePath('/admin/site-management/ai-content');
        return { message: "Listening audio item updated successfully!", isSuccess: true };
    } catch(e) {
        return { message: (e as Error).message, isSuccess: false };
    }
}

export async function deleteListeningAudioAction(id: string): Promise<ListeningAudioFormState> {
    try {
        simulatedListeningAudioDb = simulatedListeningAudioDb.filter(p => p.id !== id);
        revalidatePath('/admin/site-management/ai-content');
        return { message: "Listening audio item deleted successfully!", isSuccess: true };
    } catch(e) {
        return { message: (e as Error).message, isSuccess: false };
    }
}
