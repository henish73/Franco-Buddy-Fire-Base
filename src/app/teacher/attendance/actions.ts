// src/app/teacher/attendance/actions.ts
"use server";

import { revalidatePath } from 'next/cache';
import {
  classSessionSchema,
  type ClassSession,
  type ClassSessionFormData,
  type ClassSessionFormState,
} from './schema';

// --- Simulated Constants ---
const TEACHER_PAY_PER_HOUR = 25; // Example rate in dollars

// --- In-memory DB ---
let simulatedSessionsDb: ClassSession[] = [
    {
        id: 'sess1',
        date: new Date(new Date().setDate(new Date().getDate() - 1)), // Yesterday
        time: '18:00 - 19:30',
        durationHours: 1.5,
        topicTaught: 'Passé Composé vs. Imparfait',
        attendees: [
            { studentId: 'std1', studentName: 'Aisha K.', present: true },
            { studentId: 'std2', studentName: 'John Doe', present: true },
            { studentId: 'std3', studentName: 'Jane Smith', present: false },
        ],
        status: 'Completed',
        compensation: 1.5 * TEACHER_PAY_PER_HOUR, // 37.5
    },
    {
        id: 'sess2',
        date: new Date(), // Today
        time: '10:00 - 11:00',
        durationHours: 1,
        topicTaught: 'Subjonctif Présent',
        attendees: [
            { studentId: 'std1', studentName: 'Aisha K.', present: false },
            { studentId: 'std4', studentName: 'Peter Jones', present: true },
        ],
        status: 'Pending Approval',
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

function calculateCompensation(session: ClassSessionFormData): number | undefined {
    if (session.status === 'Completed') {
        return session.durationHours * TEACHER_PAY_PER_HOUR;
    }
    return undefined;
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
            compensation: calculateCompensation(validatedFields.data),
        };
        simulatedSessionsDb.push(newSession);
        revalidatePath('/teacher/attendance');
        revalidatePath('/teacher/payroll');
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

        const updatedSessionData = { 
            ...validatedFields.data,
            compensation: calculateCompensation(validatedFields.data)
        };
        const updatedSession = { ...simulatedSessionsDb[sessionIndex], ...updatedSessionData };
        simulatedSessionsDb[sessionIndex] = updatedSession;
        
        revalidatePath('/teacher/attendance');
        revalidatePath('/teacher/payroll');
        return { message: "Session updated successfully.", isSuccess: true, data: updatedSession };
    } catch(e) {
        return { message: "Failed to update session.", isSuccess: false };
    }
}
