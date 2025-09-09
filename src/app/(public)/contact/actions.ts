// src/app/(public)/contact/actions.ts
"use server";

import { z } from 'zod';
import { redirect } from 'next/navigation';

const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  phone: z.string().min(10, "Please enter a valid phone number."),
  inquiryType: z.string().min(1, "Please select an inquiry type."),
  frenchLevel: z.string().optional(),
  timeline: z.string().optional(),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

export type ContactFormState = {
  message: string;
  errors?: {
    name?: string[];
    email?: string[];
    phone?: string[];
    inquiryType?: string[];
    frenchLevel?: string[];
    timeline?: string[];
    message?: string[];
  };
  isSuccess: boolean;
};

export async function submitContactForm(
  prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const rawFormData = Object.fromEntries(formData.entries());

  const validatedFields = contactFormSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      message: "Validation failed. Please check your input.",
      errors: validatedFields.error.flatten().fieldErrors,
      isSuccess: false,
    };
  }

  try {
    const { name, email, phone, inquiryType, frenchLevel, timeline, message } = validatedFields.data;
    
    // In a real application, save the lead to a database here.
    console.log("Contact form submitted (simulated save):", validatedFields.data);

    const whatsappMessage = `
New Contact Form Submission from FRANCOBUDDY Website:
*Name:* ${name}
*Email:* ${email}
*Phone:* ${phone}
*Inquiry Type:* ${inquiryType}
*French Level:* ${frenchLevel || 'Not specified'}
*Timeline:* ${timeline || 'Not specified'}
---
*Message:*
${message}
    `.trim();

    const whatsappUrl = `https://wa.me/13653062049?text=${encodeURIComponent(whatsappMessage)}`;
    
    // Redirect to the WhatsApp URL
    redirect(whatsappUrl);

  } catch (error) {
    console.error("Error submitting contact form:", error);
    // This part might not be reached if redirect is successful
    if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
      // This is expected, do nothing.
    } else {
      return {
        message: "An unexpected error occurred. Please try again later.",
        isSuccess: false,
      };
    }
  }
  // Fallback state, should not be reached on success due to redirect
  return {
    message: "",
    isSuccess: false,
  };
}
