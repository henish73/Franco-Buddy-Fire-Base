// src/app/(public)/book-demo/actions.ts
"use server";

import { z } from 'zod';
import { addDemoRequestAction } from '@/app/admin/finance-management/actions';
// Removed: import { sendDemoConfirmationEmail } from '@/lib/email';

const demoBookingSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number."}),
  selectedDate: z.string().min(1, { message: "Please select a date for the demo." }),
  selectedTime: z.string().min(1, { message: "Please select a time for the demo." }),
});

export type DemoBookingData = z.infer<typeof demoBookingSchema>;

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
  bookingDetails?: DemoBookingData & { googleMeetLink: string };
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
    const result = await addDemoRequestAction(validatedFields.data);

    if (result.isSuccess) {
        const googleMeetLink = `https://meet.google.com/lookup/${Math.random().toString(36).substring(2, 12)}`;
        
        return {
            message: "Thank you! Your demo has been scheduled. Please add it to your calendar below.",
            isSuccess: true,
            errors: {},
            bookingDetails: {
                ...validatedFields.data,
                googleMeetLink,
            }
        };
    } else {
      return {
        message: result.message || "An unexpected error occurred while saving your request.",
        isSuccess: false,
      }
    }
  } catch (error) {
    console.error("Error submitting demo booking form:", error);
    return {
      message: "A critical unexpected error occurred. Please try again later.",
      isSuccess: false,
    };
  }
}
