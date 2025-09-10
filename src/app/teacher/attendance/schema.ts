// src/app/teacher/attendance/schema.ts
import { z } from 'zod';

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
