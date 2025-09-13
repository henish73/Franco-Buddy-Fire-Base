// src/app/admin/teacher-management/schema.ts
import { z } from 'zod';

// --- Teacher Data Type ---
export type Teacher = {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: "Active" | "Inactive";
};

// --- Zod Schema for Form Validation ---
export const teacherFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Valid phone number required"),
  password: z.string().min(6, "Password must be at least 6 characters").optional().or(z.literal('')),
  status: z.enum(["Active", "Inactive"]),
});
export type TeacherFormData = z.infer<typeof teacherFormSchema>;

// --- Form State Type ---
export type TeacherFormState = {
  message: string;
  errors?: Partial<Record<keyof TeacherFormData, string[]>>;
  isSuccess: boolean;
  data?: Teacher | Teacher[] | null;
};
