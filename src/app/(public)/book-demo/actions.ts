// src/app/(public)/book-demo/actions.ts
"use server";

import { z } from 'zod';

const demoBookingSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number."}),
  frenchLevel: z.string().min(2, "Please describe your French level."),
  goals: z.string().min(10, { message: "Goals must be at least 10 characters." }),
  selectedDate: z.string().min(1, { message: "Please select a date for the demo." }),
  selectedTime: z.string().min(1, { message: "Please select a time for the demo." }),
});

export type DemoBookingFormState = {
  message: string;
  errors?: {
    name?: string[];
    email?: string[];
    phone?: string[];
    frenchLevel?: string[];
    goals?: string[];
    selectedDate?: string[];
    selectedTime?: string[];
  };
  isSuccess: boolean;
};

export async function submitDemoBookingForm(
  prevState: DemoBookingFormState,
  formData: FormData
): Promise<DemoBookingFormState> {
  
  const rawFormData = Object.fromEntries(formData.entries());

  const validatedFields = demoBookingSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      message: "Validation failed. Please check the form for errors.",
      errors: validatedFields.error.flatten().fieldErrors,
      isSuccess: false,
    };
  }

  try {
    // In a real application, you would:
    // 1. Save the lead to Firestore with status 'New Demo Request'.
    // 2. Integrate with Google Calendar API to create an event.
    // 3. Send a confirmation email to the user and a notification to the admin.

    console.log("Demo booking submitted (simulated):", validatedFields.data);

    // For now, simulate success.
    return {
      message: "Thank you! Your demo request has been submitted. We'll send you a confirmation email with the meeting link shortly.",
      isSuccess: true,
      errors: {},
    };
  } catch (error) {
    console.error("Error submitting demo booking form:", error);
    return {
      message: "An unexpected error occurred. Please try again later.",
      isSuccess: false,
    };
  }
}
