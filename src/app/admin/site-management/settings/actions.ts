// src/app/admin/site-management/settings/actions.ts
"use server";

import { revalidatePath } from 'next/cache';
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
    
    revalidatePath('/', 'layout'); // Revalidate all pages that might use this data

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

// --- Time Slot Management ---

export type TimeSlot = {
  id: string;
  dateTime: string; // ISO string
  timeSlotText: string; // e.g., "10:00 AM - 10:30 AM"
};

type TimeSlotFormState = {
    message: string;
    isSuccess: boolean;
}

// In a real app, this would be a Firestore collection
let simulatedTimeSlotsDb: TimeSlot[] = [
    { id: 'ts1', dateTime: new Date().toISOString(), timeSlotText: "10:00 AM - 10:30 AM" },
    { id: 'ts2', dateTime: new Date().toISOString(), timeSlotText: "11:00 AM - 11:30 AM" },
];

export async function getTimeSlotsAction(): Promise<TimeSlot[]> {
    try {
        return JSON.parse(JSON.stringify(simulatedTimeSlotsDb));
    } catch(e) {
        return [];
    }
}

export async function updateTimeSlotsAction(slots: TimeSlot[]): Promise<TimeSlotFormState> {
    try {
        // Here, you would perform validation on the array of slots if needed
        simulatedTimeSlotsDb = slots;
        console.log("Time slots updated (simulated):", simulatedTimeSlotsDb);
        revalidatePath('/book-demo'); // Revalidate page that uses these slots
        return { message: "Time slots updated successfully!", isSuccess: true };
    } catch(e) {
        return { message: "Failed to update time slots.", isSuccess: false };
    }
}
