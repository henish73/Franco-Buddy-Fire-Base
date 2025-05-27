// src/app/admin/ai-content/listeningAudioActions.ts
"use server";

import { revalidatePath } from "next/cache";
import { 
  listeningAudioSchema, 
  type ListeningAudioFormData, 
  type ListeningAudioFormState,
  type ListeningAudio,
  type QuizQuestion
} from './listeningAudioSchemas';

// Simulated Database for Listening Audio
let simulatedListeningAudioDb: ListeningAudio[] = [
  {
    id: "la_audio_1",
    topic: "Annonce à la Gare",
    audioFileUrlOrName: "https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3",
    transcript: "Mesdames et messieurs, en raison d'un incident technique, le train à destination de Lyon, initialement prévu à 14h30, subira un retard d'environ 20 minutes. Nous vous prions de nous excuser pour ce désagrément.",
    difficultyLevel: "Intermediate (CLB 4-6)",
    tefSection: "Compréhension Orale - Section A",
    questions: [
      {
        id: "q1_la1",
        questionText: "Quelle est la destination du train mentionné ?",
        options: ["Paris", "Lyon", "Marseille", "Lille"],
        correctAnswer: "Lyon",
        tefSkillTarget: "Comprendre une information clé"
      },
      {
        id: "q2_la1",
        questionText: "De combien de temps le train sera-t-il en retard ?",
        options: ["10 minutes", "15 minutes", "20 minutes", "30 minutes"],
        correctAnswer: "20 minutes",
        tefSkillTarget: "Comprendre une durée"
      }
    ],
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
    const newAudio: ListeningAudio = {
      id: `la_audio_${Date.now()}`,
      topic: newAudioData.topic,
      audioFileUrlOrName: newAudioData.audioFileUrlOrName,
      transcript: newAudioData.transcript,
      difficultyLevel: newAudioData.difficultyLevel,
      tefSection: newAudioData.tefSection,
      questions: newAudioData.questions || [],
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
    console.log("Validation errors:", validatedFields.error.flatten().fieldErrors);
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
      topic: updatedData.topic,
      audioFileUrlOrName: updatedData.audioFileUrlOrName,
      transcript: updatedData.transcript,
      difficultyLevel: updatedData.difficultyLevel,
      tefSection: updatedData.tefSection,
      questions: updatedData.questions || [],
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
