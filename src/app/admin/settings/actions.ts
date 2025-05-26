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

// This would typically be a Firestore document ID or a known constant
const SITE_SETTINGS_DOC_ID = 'generalSiteInfo'; 

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
    // In a real application, you would:
    // 1. Initialize Firestore admin SDK (if not already done globally for server actions)
    // const db = admin.firestore(); // Assuming Firebase Admin SDK for server-side operations
    // 2. Update the document in Firestore
    // await db.collection('site_configuration').doc(SITE_SETTINGS_DOC_ID).set(validatedFields.data, { merge: true });
    
    console.log("Site settings would be saved to Firestore:", validatedFields.data);
    // For now, we'll simulate a successful save without actual DB interaction.
    // To make this truly live for other parts of the app, the reading parts (e.g., homepage)
    // would also need to fetch from Firestore.

    return {
      message: "Site settings updated successfully! (Data would be saved to Firestore)",
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

// New function to fetch settings (simulated)
export async function getSiteSettings(): Promise<{ adminContactEmail: string; studentsHelpedCount: string; successRateCLB7: string; } | null> {
  try {
    // In a real application, fetch from Firestore:
    // const db = admin.firestore();
    // const docRef = db.collection('site_configuration').doc(SITE_SETTINGS_DOC_ID);
    // const docSnap = await docRef.get();
    // if (docSnap.exists) {
    //   const data = docSnap.data();
    //   return {
    //      adminContactEmail: data.adminContactEmail,
    //      studentsHelpedCount: data.studentsHelpedCount.toString(), // Convert number to string for display consistency
    //      successRateCLB7: data.successRateCLB7.toString() + "%", // Add %
    //   };
    // } else {
    //   console.log("No site settings document found!");
    //   return null;
    // }

    // Simulate fetch for now, returning default values if not "saved"
    // This is a placeholder. In a real scenario, if the admin saves "200" and "95%",
    // this function (when connected to Firestore) would return those values.
    console.log(`Simulating fetch of site settings from Firestore. If admin saved new values, they would be reflected here.`);
    // For this example, to show it *can* be dynamic, let's return some values.
    // To see changes, you'd need to implement actual Firestore write in updateSiteSettings
    // and read here. This simulation won't pick up "saved" values from the admin panel yet
    // without actual database integration.
    return {
      adminContactEmail: "admin-from-db@frenchgta.ca", // Example
      studentsHelpedCount: "175+", // Example
      successRateCLB7: "93%", // Example
    };

  } catch (error) {
    console.error("Error fetching site settings:", error);
    return null;
  }
}
