// src/app/admin/settings/actions.ts
"use server";

import { z } from 'zod';
import { revalidatePath } from 'next/cache';

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

const timeSlotSchema = z.object({
  id: z.string().optional(),
  timeSlot: z.string().regex(/^\d{2}:\d{2} [AP]M - \d{2}:\d{2} [AP]M$/, "Time slot must be in 'HH:MM AM/PM - HH:MM AM/PM' format."),
});

export type TimeSlotFormState = {
  message: string;
  errors?: {
    timeSlot?: string[];
  };
  isSuccess: boolean;
};


// In a real app, this would be a Firestore document
let simulatedSiteSettingsDb = {
  adminContactEmail: "admin@frenchgta.ca",
  studentsHelpedCount: 250,
  successRateCLB7: 96,
};

let simulatedTimeSlotsDb: { id: string; timeSlot: string }[] = [
  { id: 'ts1', timeSlot: '10:00 AM - 11:00 AM' },
  { id: 'ts2', timeSlot: '11:00 AM - 12:00 PM' },
  { id: 'ts3', timeSlot: '02:00 PM - 03:00 PM' },
  { id: 'ts4', timeSlot: '04:00 PM - 05:00 PM' },
];


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
    simulatedSiteSettingsDb = validatedFields.data;
    console.log("Site settings saved (simulated):", simulatedSiteSettingsDb);
    revalidatePath('/admin/settings');
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
    return { ...simulatedSiteSettingsDb };
  } catch (error) {
    console.error("Error fetching site settings:", error);
    return {
      adminContactEmail: "error@example.com",
      studentsHelpedCount: 0,
      successRateCLB7: 0,
    };
  }
}


// --- Time Slot Actions ---
export async function getTimeSlotsAction(): Promise<{ id: string, timeSlot: string }[]> {
  try {
    return JSON.parse(JSON.stringify(simulatedTimeSlotsDb));
  } catch (error) {
    console.error("Error fetching time slots:", error);
    return [];
  }
}

export async function addTimeSlotAction(prevState: TimeSlotFormState, formData: FormData): Promise<TimeSlotFormState> {
  const validatedFields = timeSlotSchema.safeParse({ timeSlot: formData.get('timeSlot') });

  if (!validatedFields.success) {
    return { message: "Validation failed", errors: validatedFields.error.flatten().fieldErrors, isSuccess: false };
  }

  if (simulatedTimeSlotsDb.some(ts => ts.timeSlot === validatedFields.data.timeSlot)) {
    return { message: "This time slot already exists.", isSuccess: false };
  }
  
  try {
    const newTimeSlot = {
      id: `ts_${Date.now()}`,
      timeSlot: validatedFields.data.timeSlot,
    };
    simulatedTimeSlotsDb.push(newTimeSlot);
    revalidatePath('/admin/settings');
    revalidatePath('/book-demo');
    return { message: "Time slot added successfully!", isSuccess: true };
  } catch (e) {
    return { message: "Failed to add time slot.", isSuccess: false };
  }
}

export async function deleteTimeSlotAction(id: string): Promise<TimeSlotFormState> {
    try {
        const initialLength = simulatedTimeSlotsDb.length;
        simulatedTimeSlotsDb = simulatedTimeSlotsDb.filter(ts => ts.id !== id);
        if (initialLength === simulatedTimeSlotsDb.length) {
            return { message: "Time slot not found.", isSuccess: false };
        }
        revalidatePath('/admin/settings');
        revalidatePath('/book-demo');
        return { message: "Time slot deleted successfully!", isSuccess: true };
    } catch (e) {
        return { message: "Failed to delete time slot.", isSuccess: false };
    }
}