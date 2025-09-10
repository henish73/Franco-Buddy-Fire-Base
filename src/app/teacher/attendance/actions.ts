// src/app/teacher/attendance/actions.ts
"use server";

import { z } from 'zod';
import { revalidatePath } from 'next/cache';

// --- Types and Schemas ---
export type Attendee = {
  studentId: string;
  studentName: string;
  present: boolean;
};

export type ClassSession = {
  id: string;
  date: Date;
  time: string; // e.g., "18:00 - 19:30"
  topicTaught: string;
  notes?: string;
  attendees: Attendee[];
  status: 'Pending Approval' | 'Completed' | 'Scheduled' | 'Cancelled';
  compensation?: number; // For future use
};

const attendeeSchema = z.object({
  studentId: z.string(),
  studentName: z.string(),
  present: z.boolean(),
});

export const classSessionSchema = z.object({
  id: z.string().optional(),
  date: z.date(),
  time: z.string().regex(/^\d{2}:\d{2}\s-\s\d{2}:\d{2}$/, "Time must be in HH:MM - HH:MM format."),
  topicTaught: z.string().min(3, "Topic is required."),
  notes: z.string().optional(),
  attendees: z.array(attendeeSchema),
  status: z.enum(['Pending Approval', 'Completed', 'Scheduled', 'Cancelled']),
});

export type ClassSessionFormData = z.infer<typeof classSessionSchema>;

export type ClassSessionFormState = {
  message: string;
  errors?: Partial<Record<keyof ClassSessionFormData, string[]>>;
  isSuccess: boolean;
  data?: ClassSession[] | ClassSession | null;
};

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
