// src/app/(public)/login/actions.ts
"use server";

import { z } from 'zod';

// Define fixed passwords for roles (highly insecure, for demo only)
const ADMIN_PASSWORD = "admin123";
const STUDENT_PASSWORD = "student123";
const TEACHER_PASSWORD = "teacher123"; // Added teacher password

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});

export type LoginFormState = {
  message: string;
  errors?: {
    email?: string[];
    password?: string[];
    form?: string[]; // For general form errors
  };
  isSuccess: boolean;
  redirectUrl?: string | null;
};

const initialState: LoginFormState = {
  message: "",
  isSuccess: false,
  redirectUrl: null,
};

export async function handleLogin(
  prevState: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {
  
  const rawFormData = {
    email: formData.get('email'),
    password: formData.get('password'),
  };

  const validatedFields = loginSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      ...initialState,
      message: "Validation failed. Please check your input.",
      errors: validatedFields.error.flatten().fieldErrors,
      isSuccess: false,
    };
  }

  const { email, password } = validatedFields.data;

  // IMPORTANT: This is NOT a secure way to handle authentication or roles.
  // This is purely for demonstrating redirection based on a password as requested.
  // In a real application, use a proper authentication system (e.g., Firebase Auth)
  // and manage roles securely on the backend.

  if (password === ADMIN_PASSWORD) {
    // Simulate admin login
    // In a real app, you would set a session cookie or JWT here.
    return {
      message: "Admin login successful. Redirecting...",
      isSuccess: true,
      redirectUrl: "/admin/dashboard",
    };
  } else if (password === STUDENT_PASSWORD) {
    // Simulate student login
    return {
      message: "Student login successful. Redirecting...",
      isSuccess: true,
      redirectUrl: "/student/dashboard",
    };
  } else if (password === TEACHER_PASSWORD) {
    // Simulate teacher login
    return {
      message: "Teacher login successful. Redirecting...",
      isSuccess: true,
      redirectUrl: "/teacher/dashboard",
    };
  }
  else {
    return {
      ...initialState,
      message: "Invalid email or password.",
      isSuccess: false,
      errors: { form: ["Invalid email or password."] }
    };
  }
}
