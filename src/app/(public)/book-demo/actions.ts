// src/app/(public)/book-demo/actions.ts
"use server";

import { z } from 'zod';

// Define an enum for French levels for stricter validation
const FrenchLevelEnum = z.enum(["Beginner", "Lower Intermediate", "Upper Intermediate", "Advanced"]);
const AvailabilityEnum = z.enum([
  "Weekday Mornings", 
  "Weekday Afternoons", 
  "Weekday Evenings", 
  "Weekend Mornings", 
  "Weekend Afternoons"
]);

const demoBookingSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number."}).optional().or(z.literal('')),
  tefGoal: z.string().min(5, { message: "TEF Goal must be at least 5 characters." }),
  frenchLevel: FrenchLevelEnum,
  background: z.string().min(10, { message: "Background information must be at least 10 characters." }),
  availability: z.array(AvailabilityEnum).min(1, { message: "Please select at least one availability slot." }),
});

export type DemoBookingFormState = {
  message: string;
  errors?: {
    name?: string[];
    email?: string[];
    phone?: string[];
    tefGoal?: string[];
    frenchLevel?: string[];
    background?: string[];
    availability?: string[];
  };
  isSuccess: boolean;
};

const initialState: DemoBookingFormState = {
  message: "",
  isSuccess: false,
};

export async function submitDemoBookingForm(
  prevState: DemoBookingFormState,
  formData: FormData
): Promise<DemoBookingFormState> {
  
  const rawFormData = {
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    tefGoal: formData.get('tefGoal'),
    frenchLevel: formData.get('frenchLevel'),
    background: formData.get('background'),
    availability: formData.getAll('availability'), // getAll for multiple checkboxes
  };

  const validatedFields = demoBookingSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    console.log(validatedFields.error.flatten().fieldErrors);
    return {
      message: "Validation failed. Please check your input.",
      errors: validatedFields.error.flatten().fieldErrors,
      isSuccess: false,
    };
  }

  try {
    // In a real application, you would:
    // 1. Save the lead to Firestore:
    //    await db.collection('leads').add({
    //      type: 'demo_request',
    //      ...validatedFields.data,
    //      timestamp: new Date(),
    //      status: 'New'
    //    });
    // 2. Send an email notification to the admin.

    console.log("Demo booking submitted (simulated):", validatedFields.data);

    return {
      message: "Thank you! Your demo request has been submitted. We'll contact you shortly to schedule your session.",
      isSuccess: true,
    };
  } catch (error) {
    console.error("Error submitting demo booking form:", error);
    return {
      message: "An unexpected error occurred. Please try again later.",
      isSuccess: false,
    };
  }
}
