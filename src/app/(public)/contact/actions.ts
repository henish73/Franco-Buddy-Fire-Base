// src/app/(public)/contact/actions.ts
"use server";

import { z } from 'zod';

const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  phone: z.string().optional(),
  subject: z.string().min(5, { message: "Subject must be at least 5 characters." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

export type ContactFormState = {
  message: string;
  errors?: {
    name?: string[];
    email?: string[];
    phone?: string[];
    subject?: string[];
    message?: string[];
  };
  isSuccess: boolean;
};

export async function submitContactForm(
  prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const rawFormData = {
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    subject: formData.get('subject'),
    message: formData.get('message'),
  };

  const validatedFields = contactFormSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
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
    //      type: 'contact',
    //      ...validatedFields.data,
    //      timestamp: new Date(),
    //      status: 'New'
    //    });
    // 2. Send an email notification to the admin:
    //    await sendEmail({ to: 'admin@frenchgta.ca', subject: 'New Contact Form Submission', ... });

    console.log("Contact form submitted (simulated):", validatedFields.data);

    return {
      message: "Thank you! Your message has been sent successfully. We'll get back to you soon.",
      isSuccess: true,
    };
  } catch (error) {
    console.error("Error submitting contact form:", error);
    return {
      message: "An unexpected error occurred. Please try again later.",
      isSuccess: false,
    };
  }
}
