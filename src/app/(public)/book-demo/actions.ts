// src/app/(public)/book-demo/actions.ts
"use server";

import { z } from 'zod';
import { addDemoRequestAction } from '@/app/admin/leads/actions';

const demoBookingSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number."}),
  selectedDate: z.string().min(1, { message: "Please select a date for the demo." }),
  selectedTime: z.string().min(1, { message: "Please select a time for the demo." }),
});

export type DemoBookingFormState = {
  message: string;
  errors?: {
    name?: string[];
    email?: string[];
    phone?: string[];
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
  // The 'goals' and 'frenchLevel' fields are no longer on the simplified form
  const dataToValidate = {
      name: rawFormData.name,
      email: rawFormData.email,
      phone: rawFormData.phone,
      selectedDate: rawFormData.selectedDate,
      selectedTime: rawFormData.selectedTime,
  };
  const validatedFields = demoBookingSchema.safeParse(dataToValidate);

  if (!validatedFields.success) {
    return {
      message: "Validation failed. Please check the form for errors.",
      errors: validatedFields.error.flatten().fieldErrors,
      isSuccess: false,
    };
  }

  try {
    // Add the lead with a status of 'Demo Scheduled'
    const result = await addDemoRequestAction({
        ...validatedFields.data,
        goals: 'N/A', // No longer collected on this form
        frenchLevel: 'N/A', // No longer collected on this form
        status: 'Demo Scheduled' // Set status directly
    });

    if (result.isSuccess) {
       return {
        message: "Thank you! Your demo has been scheduled. We'll send you a confirmation email with the meeting link shortly.",
        isSuccess: true,
        errors: {},
      };
    } else {
      return {
        message: result.message || "An unexpected error occurred while saving the lead.",
        isSuccess: false,
      }
    }
  } catch (error) {
    console.error("Error submitting demo booking form:", error);
    return {
      message: "An unexpected error occurred. Please try again later.",
      isSuccess: false,
    };
  }
}
