// src/app/admin/settings/actions.ts
"use server";

import { z } from 'zod';

const siteSettingsSchema = z.object({
  adminContactEmail: z.string().email({ message: "Invalid admin email address." }),
  studentsHelpedCount: z.coerce.number().int().min(0, { message: "Must be a positive number." }),
  successRateCLB7: z.coerce.number().int().min(0).max(100, { message: "Must be between 0 and 100." }),
});

export type SiteSettingsFormState = {
  message: string;
  errors?: {
    adminContactEmail?: string[];
    studentsHelpedCount?: string[];
    successRateCLB7?: string[];
  };
  isSuccess: boolean;
};

// In a real app, this would be a Firestore document
let simulatedSiteSettingsDb = {
  adminContactEmail: "admin@frenchgta.ca",
  studentsHelpedCount: 250,
  successRateCLB7: 96,
};

export async function updateSiteSettings(
  prevState: SiteSettingsFormState,
  formData: FormData
): Promise<SiteSettingsFormState> {
  
  const rawFormData = {
    adminContactEmail: formData.get('adminContactEmail'),
    studentsHelpedCount: formData.get('studentsHelpedCount'),
    successRateCLB7: formData.get('successRateCLB7'),
  };

  const validatedFields = siteSettingsSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      message: "Validation failed. Please check your input.",
      errors: validatedFields.error.flatten().fieldErrors,
      isSuccess: false,
    };
  }

  try {
    // Update the simulated DB
    simulatedSiteSettingsDb = validatedFields.data;
    console.log("Site settings saved (simulated):", simulatedSiteSettingsDb);
    
    // In a real app, revalidate paths that use this data, e.g., the homepage
    // revalidatePath('/');

    return {
      message: "Site settings updated successfully!",
      isSuccess: true,
    };
  } catch (error) {
    console.error("Error updating site settings:", error);
    return {
      message: "An unexpected error occurred. Please try again later.",
      isSuccess: false,
    };
  }
}

export async function getSiteSettings(): Promise<typeof simulatedSiteSettingsDb> {
  try {
    // In a real app, fetch from Firestore. For now, return the simulated DB object.
    return { ...simulatedSiteSettingsDb };
  } catch (error) {
    console.error("Error fetching site settings:", error);
    // Return defaults on error
    return {
      adminContactEmail: "error@example.com",
      studentsHelpedCount: 0,
      successRateCLB7: 0,
    };
  }
}
