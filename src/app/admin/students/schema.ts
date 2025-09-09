// src/app/admin/students/schema.ts
import { z } from 'zod';

// --- Student Data Type ---
export type Student = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  enrolledCourse: string;
  status: "Active" | "Inactive";
};

// --- Zod Schema for Form Validation ---
export const studentFormSchema = z.object({
  id: z.string().optional(),
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Valid phone number required"),
  password: z.string().min(6, "Password must be at least 6 characters").optional().or(z.literal('')),
  enrolledCourse: z.string().min(3, "Enrolled course is required"),
  status: z.enum(["Active", "Inactive"]),
});
export type StudentFormData = z.infer<typeof studentFormSchema>;

// --- Form State Type ---
export type StudentFormState = {
  message: string;
  errors?: Partial<Record<keyof StudentFormData, string[]>>;
  isSuccess: boolean;
  data?: Student | Student[] | null;
};
