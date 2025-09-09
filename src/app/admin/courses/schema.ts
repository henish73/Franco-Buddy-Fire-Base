// src/app/admin/courses/schema.ts
import { z } from 'zod';

// These schemas are now just for validation within the actions, not for transformation.
export const whatsIncludedSchema = z.object({
  text: z.string().min(1),
  icon: z.string().min(1),
});

export const lessonSchema = z.object({
  id: z.string(),
  title: z.string(),
  keyTopics: z.array(z.string()).optional(),
  order: z.number().optional(),
  description: z.string().optional(),
});

export const moduleSchema = z.object({
  id: z.string(),
  order: z.number().optional(),
  title: z.string(),
  description: z.string().optional(),
  lessons: z.array(lessonSchema).optional(),
});


// Main form schema. JSON fields are treated as strings here.
export const courseFormSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, "Title is required"),
  shortDescription: z.string().min(10, "Short description is required"),
  detailedDescription: z.string().optional(),
  price1on1: z.coerce.number().optional(),
  price1on3: z.coerce.number().optional(),
  targetCLB: z.string().min(1, "Target CLB is required"),
  format: z.string().min(3, "Format is required"),
  duration: z.string().optional(),
  status: z.enum(["Active", "Draft"]),
  imageUrl: z.string().url().optional().or(z.literal('')),
  imageAiHint: z.string().optional(),
  isForYou: z.string().optional(), // Raw string from textarea
  whatsIncluded: z.string().optional(), // Raw JSON string
  modules: z.string().optional(), // Raw JSON string
});

export type CourseFormData = z.infer<typeof courseFormSchema>;