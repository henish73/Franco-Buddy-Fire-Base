// src/app/admin/ai-content/listeningAudioActions.ts
"use server";

import { revalidatePath } from "next/cache";
import { 
  listeningAudioSchema, 
  type ListeningAudioFormData, 
  type ListeningAudioFormState,
  type ListeningAudio
} from './listeningAudioSchemas';

// Simulated Database for Listening Audio
let simulatedListeningAudioDb: ListeningAudio[] = [
  {
    id: "la_audio_1",
    topic: "Annonce à la Gare",
    audioFileUrlOrName: "gare_annonce_train_retard.mp3", // Placeholder
    transcript: "Mesdames et messieurs, en raison d'un incident technique, le train à destination de Lyon, initialement prévu à 14h30, subira un retard d'environ 20 minutes. Nous vous prions de nous excuser pour ce désagrément.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export async function getListeningAudioAction(): Promise<ListeningAudioFormState> {
  try {
    return {
      message: "Listening audio items fetched successfully.",
      isSuccess: true,
      data: JSON.parse(JSON.stringify(simulatedListeningAudioDb.sort((a,b) => (a.topic || "").localeCompare(b.topic || "")))),
    };
  } catch (error) {
    console.error("Error fetching listening audio items:", error);
    return { message: "Failed to fetch listening audio items.", isSuccess: false, data: null };
  }
}

export async function addListeningAudioAction(
  prevState: ListeningAudioFormState,
  formData: FormData
): Promise<ListeningAudioFormState> {
  const rawFormData = Object.fromEntries(formData.entries());
  const validatedFields = listeningAudioSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      message: "Validation failed.",
      errors: validatedFields.error.flatten().fieldErrors,
      isSuccess: false,
    };
  }

  try {
    const newAudioData = validatedFields.data;
    // Here, you would handle actual file upload if this were fully integrated with storage.
    // For now, audioFileUrlOrName is just a string.
    const newAudio: ListeningAudio = {
      id: `la_audio_${Date.now()}`,
      ...newAudioData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    simulatedListeningAudioDb.push(newAudio);
    revalidatePath("/admin/ai-content");
    return { message: "Listening audio item added successfully!", isSuccess: true, data: newAudio };
  } catch (error) {
    console.error("Error adding listening audio item:", error);
    return { message: "Failed to add listening audio item.", isSuccess: false };
  }
}

export async function updateListeningAudioAction(
  prevState: ListeningAudioFormState,
  formData: FormData
): Promise<ListeningAudioFormState> {
  const rawFormData = Object.fromEntries(formData.entries());
  const validatedFields = listeningAudioSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      message: "Validation failed.",
      errors: validatedFields.error.flatten().fieldErrors,
      isSuccess: false,
    };
  }

  const audioId = formData.get('id') as string;
  if (!audioId) {
    return { message: "Audio ID is missing for update.", isSuccess: false };
  }
  
  const audioIndex = simulatedListeningAudioDb.findIndex(p => p.id === audioId);
  if (audioIndex === -1) {
    return { message: "Listening audio item not found for update.", isSuccess: false };
  }

  try {
    const updatedData = validatedFields.data;
    const originalAudio = simulatedListeningAudioDb[audioIndex];
    const updatedAudio: ListeningAudio = {
      ...originalAudio,
      ...updatedData,
      updatedAt: new Date().toISOString(),
    };
    
    simulatedListeningAudioDb[audioIndex] = updatedAudio;
    revalidatePath("/admin/ai-content");
    return { message: "Listening audio item updated successfully!", isSuccess: true, data: updatedAudio };
  } catch (error) {
    console.error("Error updating listening audio item:", error);
    return { message: "Failed to update listening audio item.", isSuccess: false };
  }
}

export async function deleteListeningAudioAction(audioId: string): Promise<ListeningAudioFormState> {
  try {
    const initialLength = simulatedListeningAudioDb.length;
    simulatedListeningAudioDb = simulatedListeningAudioDb.filter(p => p.id !== audioId);
    
    if (simulatedListeningAudioDb.length === initialLength) {
      return { message: "Listening audio item not found for deletion.", isSuccess: false };
    }
    revalidatePath("/admin/ai-content");
    return { message: "Listening audio item deleted successfully!", isSuccess: true };
  } catch (error) {
    console.error("Error deleting listening audio item:", error);
    return { message: "Failed to delete listening audio item.", isSuccess: false };
  }
}
