// src/app/admin/ai-content/readingPassageActions.ts
"use server";

import { revalidatePath } from "next/cache";
import { 
  readingPassageSchema, 
  type ReadingPassageFormData, 
  type ReadingPassageFormState,
  type ReadingPassage,
  type QuizQuestion
} from './readingPassageSchemas';

// Simulated Database for Reading Passages
let simulatedReadingPassagesDb: ReadingPassage[] = [
  {
    id: "rp_passage_1",
    topic: "Le Télétravail",
    passageText: "Le télétravail, ou travail à distance, est devenu une pratique de plus en plus courante dans de nombreuses entreprises à travers le monde. Cette flexibilité offre des avantages tant pour les employés que pour les employeurs, mais présente également certains défis. Pour les employés, le télétravail peut signifier une meilleure conciliation entre vie professionnelle et vie personnelle, une réduction du temps de trajet et une plus grande autonomie. Pour les employeurs, cela peut se traduire par une réduction des coûts immobiliers et un accès à un bassin de talents plus large. Cependant, maintenir la cohésion d'équipe, assurer la sécurité des données et prévenir l'isolement des employés sont des aspects cruciaux à gérer.",
    difficultyLevel: "Intermediate (CLB 4-6)",
    tefSection: "Compréhension Écrite - Section A",
    questions: [
      {
        id: "q1_rp1",
        questionText: "Quel est l'un des avantages du télétravail pour les employés mentionné dans le texte ?",
        options: ["Augmentation des coûts immobiliers", "Réduction du temps de trajet", "Moins d'autonomie", "Difficulté à maintenir la cohésion d'équipe"],
        correctAnswer: "Réduction du temps de trajet",
        tefSkillTarget: "Identifier une information spécifique"
      },
      {
        id: "q2_rp1",
        questionText: "Quel est un défi du télétravail pour les employeurs ?",
        options: ["Accès à un bassin de talents plus restreint", "Augmentation de la cohésion d'équipe", "Prévenir l'isolement des employés", "Réduction des coûts de communication"],
        correctAnswer: "Prévenir l'isolement des employés",
        tefSkillTarget: "Comprendre les défis"
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "rp_passage_2",
    topic: "Les Énergies Renouvelables",
    passageText: "Face au changement climatique, le développement des énergies renouvelables est devenu une priorité mondiale. Les sources comme le solaire, l'éolien ou l'hydraulique offrent une alternative plus propre aux combustibles fossiles. Leur adoption massive est cependant freinée par des coûts initiaux parfois élevés et la nécessité d'adapter les réseaux électriques.",
    difficultyLevel: "Advanced (CLB 7+)",
    tefSection: "Compréhension Écrite - Section B",
    questions: [], // No questions initially
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export async function getReadingPassagesAction(): Promise<ReadingPassageFormState> {
  try {
    return {
      message: "Reading passages fetched successfully.",
      isSuccess: true,
      data: JSON.parse(JSON.stringify(simulatedReadingPassagesDb.sort((a,b) => (a.topic || "").localeCompare(b.topic || "")))),
    };
  } catch (error) {
    console.error("Error fetching reading passages:", error);
    return { message: "Failed to fetch reading passages.", isSuccess: false, data: null };
  }
}

export async function addReadingPassageAction(
  prevState: ReadingPassageFormState,
  formData: FormData
): Promise<ReadingPassageFormState> {
  const rawFormData = Object.fromEntries(formData.entries());
  const validatedFields = readingPassageSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      message: "Validation failed.",
      errors: validatedFields.error.flatten().fieldErrors,
      isSuccess: false,
    };
  }

  try {
    const newPassageData = validatedFields.data;
    const newPassage: ReadingPassage = {
      id: `rp_passage_${Date.now()}`,
      topic: newPassageData.topic,
      passageText: newPassageData.passageText,
      difficultyLevel: newPassageData.difficultyLevel,
      tefSection: newPassageData.tefSection,
      questions: newPassageData.questions || [], // Default to empty array if undefined
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    simulatedReadingPassagesDb.push(newPassage);
    revalidatePath("/admin/ai-content");
    return { message: "Reading passage added successfully!", isSuccess: true, data: newPassage };
  } catch (error) {
    console.error("Error adding reading passage:", error);
    return { message: "Failed to add reading passage.", isSuccess: false };
  }
}

export async function updateReadingPassageAction(
  prevState: ReadingPassageFormState,
  formData: FormData
): Promise<ReadingPassageFormState> {
  const rawFormData = Object.fromEntries(formData.entries());
  const validatedFields = readingPassageSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    console.log("Validation errors:", validatedFields.error.flatten().fieldErrors);
    return {
      message: "Validation failed.",
      errors: validatedFields.error.flatten().fieldErrors,
      isSuccess: false,
    };
  }

  const passageId = formData.get('id') as string;
  if (!passageId) {
    return { message: "Passage ID is missing for update.", isSuccess: false };
  }
  
  const passageIndex = simulatedReadingPassagesDb.findIndex(p => p.id === passageId);
  if (passageIndex === -1) {
    return { message: "Reading passage not found for update.", isSuccess: false };
  }

  try {
    const updatedData = validatedFields.data;
    const originalPassage = simulatedReadingPassagesDb[passageIndex];
    const updatedPassage: ReadingPassage = {
      ...originalPassage,
      topic: updatedData.topic,
      passageText: updatedData.passageText,
      difficultyLevel: updatedData.difficultyLevel,
      tefSection: updatedData.tefSection,
      questions: updatedData.questions || [],
      updatedAt: new Date().toISOString(),
    };
    
    simulatedReadingPassagesDb[passageIndex] = updatedPassage;
    revalidatePath("/admin/ai-content");
    return { message: "Reading passage updated successfully!", isSuccess: true, data: updatedPassage };
  } catch (error) {
    console.error("Error updating reading passage:", error);
    return { message: "Failed to update reading passage.", isSuccess: false };
  }
}

export async function deleteReadingPassageAction(passageId: string): Promise<ReadingPassageFormState> {
  try {
    const initialLength = simulatedReadingPassagesDb.length;
    simulatedReadingPassagesDb = simulatedReadingPassagesDb.filter(p => p.id !== passageId);
    
    if (simulatedReadingPassagesDb.length === initialLength) {
      return { message: "Reading passage not found for deletion.", isSuccess: false };
    }
    revalidatePath("/admin/ai-content");
    return { message: "Reading passage deleted successfully!", isSuccess: true };
  } catch (error) {
    console.error("Error deleting reading passage:", error);
    return { message: "Failed to delete reading passage.", isSuccess: false };
  }
}
