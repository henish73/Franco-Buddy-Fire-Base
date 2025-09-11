// src/app/(public)/book-demo/actions.ts
"use server";

import { z } from 'zod';
import { addDemoRequestAction } from '@/app/admin/leads/actions';
import { sendDemoConfirmationEmail } from '@/lib/email';

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
  const validatedFields = demoBookingSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      message: "Validation failed. Please check the form for errors.",
      errors: validatedFields.error.flatten().fieldErrors,
      isSuccess: false,
    };
  }

  try {
    // This now passes only the validated data. Defaults are handled in the receiving action.
    const result = await addDemoRequestAction(validatedFields.data);

    if (result.isSuccess) {
       // Send confirmation email
       await sendDemoConfirmationEmail(validatedFields.data);

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
