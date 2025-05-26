// src/app/student/profile/actions.ts
"use server";

import { z } from 'zod';

const profileSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters."),
  lastName: z.string().min(2, "Last name must be at least 2 characters."),
  phone: z.string().min(10, "Please enter a valid phone number.").optional().or(z.literal('')),
});

const passwordChangeSchema = z.object({
  currentPassword: z.string().min(6, "Current password is required."),
  newPassword: z.string().min(6, "New password must be at least 6 characters."),
  confirmPassword: z.string().min(6, "Confirm new password."),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "New passwords don't match.",
  path: ["confirmPassword"], // path of error
});


export type ProfileFormState = {
  message: string;
  errors?: {
    firstName?: string[];
    lastName?: string[];
    phone?: string[];
    currentPassword?: string[];
    newPassword?: string[];
    confirmPassword?: string[];
    form?: string[]; // General form errors
  };
  isSuccess: boolean;
  updatedField?: 'details' | 'password';
};

const initialState: ProfileFormState = {
  message: "",
  isSuccess: false,
};

export async function updateProfileDetails(
  prevState: ProfileFormState,
  formData: FormData
): Promise<ProfileFormState> {
  const rawFormData = {
    firstName: formData.get('firstName'),
    lastName: formData.get('lastName'),
    phone: formData.get('phone'),
  };

  const validatedFields = profileSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      message: "Validation failed. Please check your input.",
      errors: validatedFields.error.flatten().fieldErrors,
      isSuccess: false,
    };
  }

  try {
    // In a real application, update student details in Firestore
    // For example: await db.collection('users').doc(userId).update(validatedFields.data);
    console.log("Updating profile details (simulated):", validatedFields.data);
    return {
      message: "Profile details updated successfully!",
      isSuccess: true,
      updatedField: 'details',
    };
  } catch (error) {
    console.error("Error updating profile details:", error);
    return {
      message: "An unexpected error occurred. Please try again.",
      isSuccess: false,
    };
  }
}


export async function changePassword(
  prevState: ProfileFormState,
  formData: FormData
): Promise<ProfileFormState> {
  const rawFormData = {
    currentPassword: formData.get('currentPassword'),
    newPassword: formData.get('newPassword'),
    confirmPassword: formData.get('confirmPassword'),
  };

  const validatedFields = passwordChangeSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      message: "Validation failed. Please check your input.",
      errors: validatedFields.error.flatten().fieldErrors,
      isSuccess: false,
    };
  }

  try {
    // In a real application:
    // 1. Verify currentPassword against the authenticated user.
    // 2. If valid, update the user's password in Firebase Auth.
    //    (This requires re-authentication for security reasons typically)
    // For example: 
    // const user = firebase.auth().currentUser;
    // const credential = firebase.auth.EmailAuthProvider.credential(user.email, validatedFields.data.currentPassword);
    // await user.reauthenticateWithCredential(credential);
    // await user.updatePassword(validatedFields.data.newPassword);

    console.log("Changing password (simulated) for user."); // Don't log passwords

    // Simulate success, in real app check if current password is correct
    if (validatedFields.data.currentPassword === "oldpassword123") { // MOCK check
         return {
            message: "Password changed successfully!",
            isSuccess: true,
            updatedField: 'password',
        };
    } else {
        return {
            message: "Incorrect current password.",
            errors: { currentPassword: ["Incorrect current password."] },
            isSuccess: false,
        }
    }

  } catch (error: any) {
    console.error("Error changing password:", error);
    return {
      message: error.message || "An unexpected error occurred while changing password. Please try again.",
      isSuccess: false,
    };
  }
}
