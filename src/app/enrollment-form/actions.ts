// src/app/(public)/enrollment-form/actions.ts
"use server";

import { z } from 'zod';
import { addEnrollmentAction } from '@/app/admin/enrollments/actions';
import { addStudentAction } from '@/app/admin/students/actions';

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
  preferredDays: z.enum(["Saturdays", "Sundays", "Both"], { errorMap: () => ({ message: "Please select your preferred day(s)." }) }).optional(),
  preferredTime: z.enum(["Morning", "Afternoon", "Evening"], { errorMap: () => ({ message: "Please select your preferred time." }) }).optional(),
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
    return {
      message: "Validation failed. Please check your input.",
      errors: validatedFields.error.flatten().fieldErrors,
      isSuccess: false,
    };
  }

  try {
    const { fullName, email, phone, courseId, courseName } = validatedFields.data;
    const [firstName, ...lastNameParts] = fullName.split(' ');
    const lastName = lastNameParts.join(' ') || '';

    // Step 1: Create a new student record
    // This is a simplified approach. A more robust system would check if the student
    // already exists by email and link the new enrollment instead of creating a new student.
    const newStudentData = new FormData();
    newStudentData.append('firstName', firstName);
    newStudentData.append('lastName', lastName);
    newStudentData.append('email', email);
    newStudentData.append('phone', phone);
    newStudentData.append('enrolledCourse', courseName);
    newStudentData.append('status', 'Active');
    // A temporary password would be generated and emailed in a real app.
    newStudentData.append('password', 'password123'); // Placeholder password

    const studentResult = await addStudentAction({message: '', isSuccess: false}, newStudentData);

    if (!studentResult.isSuccess || !studentResult.data || !Array.isArray(studentResult.data) && !('id' in studentResult.data)) {
      return { message: studentResult.message || "Failed to create a student profile for this enrollment.", isSuccess: false, errors: studentResult.errors };
    }
    
    // We need to handle both cases where data is a single object or an array.
    // Assuming addStudentAction returns the new student object in the data property.
    const newStudent = Array.isArray(studentResult.data) ? studentResult.data[0] : studentResult.data;
    const studentId = newStudent?.id;

    if(!studentId) {
        return { message: "Failed to retrieve new student ID.", isSuccess: false };
    }

    // Step 2: Create the enrollment record linked to the new student
    const enrollmentResult = await addEnrollmentAction({
      studentId: studentId,
      fullName: fullName,
      email: email,
      phone: phone,
      courseId: courseId,
      courseName: courseName,
      date: new Date().toISOString(),
    });
    
    if (enrollmentResult.isSuccess) {
      return {
        message: enrollmentResult.message,
        isSuccess: true,
      };
    } else {
      // Potentially roll back student creation here if transaction fails
      return {
        message: enrollmentResult.message,
        isSuccess: false
      }
    }

  } catch (error) {
    console.error("Error submitting enrollment form:", error);
    return {
      message: "An unexpected error occurred. Please try again later.",
      isSuccess: false,
    };
  }
}
