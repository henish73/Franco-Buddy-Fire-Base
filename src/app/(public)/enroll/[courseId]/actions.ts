// src/app/(public)/enroll/[courseId]/actions.ts
"use server";

import { z } from 'zod';

// Enum for availability for stricter validation
const AvailabilityEnum = z.enum([
  "Weekday Mornings", 
  "Weekday Afternoons", 
  "Weekday Evenings", 
  "Weekend Mornings", 
  "Weekend Afternoons",
  "Flexible - Contact Me"
]);

const enrollmentSchema = z.object({
  courseId: z.string().min(1),
  courseName: z.string().min(1),
  fullName: z.string().min(3, { message: "Full name must be at least 3 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  streetAddress: z.string().optional(),
  city: z.string().optional(),
  province: z.string().optional(),
  postalCode: z.string().optional(),
  availability: z.array(AvailabilityEnum).min(1, { message: "Please select at least one availability slot." }),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  terms: z.literal("on", { errorMap: () => ({ message: "You must accept the terms and conditions." })}),
});

export type EnrollmentFormState = {
  message: string;
  errors?: {
    courseId?: string[];
    courseName?: string[];
    fullName?: string[];
    email?: string[];
    phone?: string[];
    streetAddress?: string[];
    city?: string[];
    province?: string[];
    postalCode?: string[];
    availability?: string[];
    emergencyContactName?: string[];
    emergencyContactPhone?: string[];
    terms?: string[];
  };
  isSuccess: boolean;
  redirectUrl?: string; // For redirecting to payment page
};

const initialState: EnrollmentFormState = {
  message: "",
  isSuccess: false,
};

export async function submitEnrollmentForm(
  prevState: EnrollmentFormState,
  formData: FormData
): Promise<EnrollmentFormState> {
  
  const rawFormData = {
    courseId: formData.get('courseId'),
    courseName: formData.get('courseName'),
    fullName: formData.get('fullName'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    streetAddress: formData.get('streetAddress') || undefined, // Ensure empty strings become undefined for optional fields
    city: formData.get('city') || undefined,
    province: formData.get('province') || undefined,
    postalCode: formData.get('postalCode') || undefined,
    availability: formData.getAll('availability'),
    emergencyContactName: formData.get('emergencyContactName') || undefined,
    emergencyContactPhone: formData.get('emergencyContactPhone') || undefined,
    terms: formData.get('terms'),
  };

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
    // 1. Potentially save this enrollment data to Firestore with status 'pending_payment'.
    //    const enrollmentId = await db.collection('enrollment_requests').add({
    //      ...validatedFields.data,
    //      status: 'pending_payment',
    //      submittedAt: new Date(),
    //    });
    // 2. Prepare for payment gateway interaction.

    console.log("Enrollment form submitted (simulated):", validatedFields.data);
    
    // For now, simulate success and provide a placeholder redirect URL
    // In a real scenario, this URL would be to your payment page (e.g., /payment/[enrollmentId] or similar)
    // const paymentPageUrl = `/payment?courseId=${validatedFields.data.courseId}&studentEmail=${validatedFields.data.email}`;
    
    // For now, we just log it, as full payment integration is a large next step
    return {
      message: `Enrollment data received for ${validatedFields.data.courseName}. You would now proceed to payment.`,
      isSuccess: true,
      // redirectUrl: paymentPageUrl // Add this back when payment page is ready
    };

  } catch (error) {
    console.error("Error submitting enrollment form:", error);
    return {
      message: "An unexpected error occurred. Please try again later.",
      isSuccess: false,
    };
  }
}
