// src/app/teacher/attendance/actions.ts
"use server";

import { revalidatePath } from 'next/cache';
import {
  classSessionSchema,
  type ClassSession,
  type ClassSessionFormData,
  type ClassSessionFormState,
} from './schema';

// --- In-memory DB ---
let simulatedSessionsDb: ClassSession[] = [
    {
        id: 'sess1', date: new Date(), time: '18:00 - 19:30', topicTaught: 'Passé Composé vs. Imparfait',
        attendees: [
            { studentId: 'std1', studentName: 'Aisha K.', present: true },
            { studentId: 'std2', studentName: 'John Doe', present: true },
            { studentId: 'std3', studentName: 'Jane Smith', present: false },
        ],
        status: 'Completed'
    },
];

// --- Server Actions ---

export async function getClassSessionsAction(): Promise<ClassSessionFormState> {
  try {
    return { message: "Sessions fetched.", isSuccess: true, data: JSON.parse(JSON.stringify(simulatedSessionsDb)) };
  } catch (e) {
    return { message: "Failed to fetch sessions.", isSuccess: false };
  }
}

export async function addClassSessionAction(data: ClassSessionFormData): Promise<ClassSessionFormState> {
    const validatedFields = classSessionSchema.safeParse(data);
    if (!validatedFields.success) {
        return { message: "Validation failed", errors: validatedFields.error.flatten().fieldErrors, isSuccess: false };
    }
    try {
        const newSession: ClassSession = {
            ...validatedFields.data,
            id: `sess_${Date.now()}`,
            status: 'Pending Approval' // Default status for new sessions
        };
        simulatedSessionsDb.push(newSession);
        revalidatePath('/teacher/attendance');
        return { message: "Class session submitted for approval.", isSuccess: true, data: newSession };
    } catch(e) {
        return { message: "Failed to add session.", isSuccess: false };
    }
}

export async function updateClassSessionAction(data: ClassSessionFormData): Promise<ClassSessionFormState> {
    if (!data.id) return { message: "Session ID is missing.", isSuccess: false };

    const validatedFields = classSessionSchema.safeParse(data);
    if (!validatedFields.success) {
        return { message: "Validation failed", errors: validatedFields.error.flatten().fieldErrors, isSuccess: false };
    }
    
    try {
        const sessionIndex = simulatedSessionsDb.findIndex(s => s.id === data.id);
        if (sessionIndex === -1) return { message: "Session not found.", isSuccess: false };

        const updatedSession = { ...simulatedSessionsDb[sessionIndex], ...validatedFields.data };
        simulatedSessionsDb[sessionIndex] = updatedSession;
        
        revalidatePath('/teacher/attendance');
        return { message: "Session updated successfully.", isSuccess: true, data: updatedSession };
    } catch(e) {
        return { message: "Failed to update session.", isSuccess: false };
    }
}
