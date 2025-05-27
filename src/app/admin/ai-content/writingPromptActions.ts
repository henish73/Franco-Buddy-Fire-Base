// src/app/admin/ai-content/writingPromptActions.ts
"use server";

import { revalidatePath } from "next/cache";
import { 
  writingPromptSchema, 
  type WritingPromptFormData, 
  type WritingPromptFormState,
  type WritingPrompt
} from './writingPromptSchemas';

// Simulated Database for Writing Prompts
let simulatedWritingPromptsDb: WritingPrompt[] = [
  {
    id: "wp_prompt_1",
    topic: "Work Experience",
    taskType: "Cover Letter Snippet",
    promptText: "Write a short paragraph describing your most relevant work experience for a customer service role. Mention your communication skills and problem-solving abilities.",
    sampleResponse: "In my previous role at Tech Solutions Inc., I served as a Senior Customer Support Specialist for three years, where I honed my communication skills by assisting over 50 clients daily via phone and email. A key part of my responsibilities involved troubleshooting complex technical issues, often requiring creative problem-solving to ensure customer satisfaction and swift resolution.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export async function getWritingPromptsAction(): Promise<WritingPromptFormState> {
  try {
    return {
      message: "Writing prompts fetched successfully.",
      isSuccess: true,
      data: JSON.parse(JSON.stringify(simulatedWritingPromptsDb.sort((a,b) => (a.topic || "").localeCompare(b.topic || "")))),
    };
  } catch (error) {
    console.error("Error fetching writing prompts:", error);
    return { message: "Failed to fetch writing prompts.", isSuccess: false, data: null };
  }
}

export async function addWritingPromptAction(
  prevState: WritingPromptFormState,
  formData: FormData
): Promise<WritingPromptFormState> {
  const rawFormData = Object.fromEntries(formData.entries());
  const validatedFields = writingPromptSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      message: "Validation failed.",
      errors: validatedFields.error.flatten().fieldErrors,
      isSuccess: false,
    };
  }

  try {
    const newPromptData = validatedFields.data;
    const newPrompt: WritingPrompt = {
      id: `wp_prompt_${Date.now()}`,
      ...newPromptData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    simulatedWritingPromptsDb.push(newPrompt);
    revalidatePath("/admin/ai-content");
    return { message: "Writing prompt added successfully!", isSuccess: true, data: newPrompt };
  } catch (error) {
    console.error("Error adding writing prompt:", error);
    return { message: "Failed to add writing prompt.", isSuccess: false };
  }
}

export async function updateWritingPromptAction(
  prevState: WritingPromptFormState,
  formData: FormData
): Promise<WritingPromptFormState> {
  const rawFormData = Object.fromEntries(formData.entries());
  const validatedFields = writingPromptSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      message: "Validation failed.",
      errors: validatedFields.error.flatten().fieldErrors,
      isSuccess: false,
    };
  }

  const promptId = formData.get('id') as string;
  if (!promptId) {
    return { message: "Prompt ID is missing for update.", isSuccess: false };
  }
  
  const promptIndex = simulatedWritingPromptsDb.findIndex(p => p.id === promptId);
  if (promptIndex === -1) {
    return { message: "Writing prompt not found for update.", isSuccess: false };
  }

  try {
    const updatedData = validatedFields.data;
    const originalPrompt = simulatedWritingPromptsDb[promptIndex];
    const updatedPrompt: WritingPrompt = {
      ...originalPrompt,
      ...updatedData,
      updatedAt: new Date().toISOString(),
    };
    
    simulatedWritingPromptsDb[promptIndex] = updatedPrompt;
    revalidatePath("/admin/ai-content");
    return { message: "Writing prompt updated successfully!", isSuccess: true, data: updatedPrompt };
  } catch (error) {
    console.error("Error updating writing prompt:", error);
    return { message: "Failed to update writing prompt.", isSuccess: false };
  }
}

export async function deleteWritingPromptAction(promptId: string): Promise<WritingPromptFormState> {
  try {
    const initialLength = simulatedWritingPromptsDb.length;
    simulatedWritingPromptsDb = simulatedWritingPromptsDb.filter(p => p.id !== promptId);
    
    if (simulatedWritingPromptsDb.length === initialLength) {
      return { message: "Writing prompt not found for deletion.", isSuccess: false };
    }
    revalidatePath("/admin/ai-content");
    return { message: "Writing prompt deleted successfully!", isSuccess: true };
  } catch (error) {
    console.error("Error deleting writing prompt:", error);
    return { message: "Failed to delete writing prompt.", isSuccess: false };
  }
}
