// src/app/(public)/enrollment-form/actions.ts
"use server";

import { z } from 'zod';

const enrollmentSchema = z.object({
  courseId: z.string(),
  courseName: z.string(),
  fullName: z.string().min(3, { message: "Full name must be at least 3 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  age: z.coerce.number().int().min(16, "You must be at least 16 years old."),
  country: z.string().min(2, "Please enter your country of residence."),
  currentLevel: z.string().min(2, "Please enter your current French level."),
  learningGoal: z.string().min(5, "Please describe your learning goal."),
  previousExperience: z.string().optional(),
  preferredDays: z.enum(["Saturdays", "Sundays", "Both"], { errorMap: () => ({ message: "Please select your preferred day(s)." }) }),
  preferredTime: z.enum(["Morning", "Afternoon", "Evening"], { errorMap: () => ({ message: "Please select your preferred time." }) }),
  terms: z.literal("on", { errorMap: () => ({ message: "You must accept the terms and conditions." })}),
});

export type EnrollmentFormState = {
  message: string;
  errors?: Partial<Record<keyof z.infer<typeof enrollmentSchema>, string[]>>;
  isSuccess: boolean;
};

const initialState: EnrollmentFormState = {
  message: "",
  isSuccess: false,
};

export async function submitEnrollmentForm(
  prevState: EnrollmentFormState,
  formData: FormData
): Promise<EnrollmentFormState> {
  
  const rawFormData = Object.fromEntries(formData.entries());

  const validatedFields = enrollmentSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    console.log("Validation errors:", validatedFields.error.flatten().fieldErrors);
    return {
      message: "Validation failed. Please check your input.",
      errors: validatedFields.error.flatten().fieldErrors,
      isSuccess: false,
    };
  }

  try {
    // In a real application, you would:
    // 1. Save this enrollment data to Firestore with status 'pending_payment'.
    // 2. Send a confirmation email to the user with next steps (payment).
    // 3. Send a notification email to the admin.

    console.log("Enrollment form submitted (simulated save):", validatedFields.data);
    
    // For now, simulate success
    return {
      message: `Enrollment successful for ${validatedFields.data.courseName}! We have received your details and will contact you shortly with payment information and next steps.`,
      isSuccess: true,
    };

  } catch (error) {
    console.error("Error submitting enrollment form:", error);
    return {
      message: "An unexpected error occurred. Please try again later.",
      isSuccess: false,
    };
  }
}
