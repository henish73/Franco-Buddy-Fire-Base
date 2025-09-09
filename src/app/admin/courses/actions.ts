// src/app/admin/courses/actions.ts
"use server";

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { coursesData as mockCoursesData } from '@/app/(public)/courses/mockCoursesData';
import type { Course, Module, WhatsIncludedItem } from '@/components/shared/CourseCard';
import type { ElementType } from 'react';

// --- Simulated Database for Courses ---
let simulatedCoursesDb: Course[] = JSON.parse(JSON.stringify(mockCoursesData));

// --- Zod Schemas for Validation ---
const whatsIncludedSchema = z.object({
  text: z.string().min(1),
  icon: z.string().min(1),
});

const lessonSchema = z.object({
  id: z.string(),
  title: z.string(),
  keyTopics: z.array(z.string()).optional(),
  order: z.number().optional(),
  description: z.string().optional(),
});

const moduleSchema = z.object({
  id: z.string(),
  order: z.number().optional(),
  title: z.string(),
  description: z.string().optional(),
  lessons: z.array(lessonSchema).optional(),
});

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
  isForYou: z.string().transform(val => val.split('\n').filter(Boolean)).optional(),
  whatsIncluded: z.string().transform((val, ctx) => {
    if (!val) return [];
    try {
      const parsed = JSON.parse(val);
      return z.array(whatsIncludedSchema).parse(parsed);
    } catch (e) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Invalid JSON for What's Included" });
      return z.NEVER;
    }
  }).optional(),
  modules: z.string().transform((val, ctx) => {
    if (!val || val.trim() === "") return [];
    try {
      const parsed = JSON.parse(val);
      return z.array(moduleSchema).parse(parsed);
    } catch (e) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Invalid JSON for Modules" });
      return z.NEVER;
    }
  }).optional(),
});

export type CourseFormData = z.infer<typeof courseFormSchema>;

export type CourseFormState = {
  message: string;
  errors?: Partial<Record<keyof CourseFormData, string[]>>;
  isSuccess: boolean;
  data?: Course[] | Course | null;
};

// --- Server Actions ---
export async function getCoursesAction(): Promise<CourseFormState> {
  try {
    // Icon components are handled on the client-side. We just pass the string names.
    return {
      message: "Courses fetched successfully.",
      isSuccess: true,
      data: JSON.parse(JSON.stringify(simulatedCoursesDb)),
    };
  } catch (error) {
    return { message: "Failed to fetch courses.", isSuccess: false };
  }
}

export async function getCourseCountAction(): Promise<number> {
    return simulatedCoursesDb.filter(c => c.status === 'Active').length;
}


async function saveCourse(courseData: CourseFormData, id?: string): Promise<Course> {
  // The icon is just a string in the data model. The component will map it.
  const whatsIncludedWithStringIcons = courseData.whatsIncluded?.map(item => ({
    ...item,
    icon: item.icon || 'Users'
  }));

  if (id) { // Update existing course
    const courseIndex = simulatedCoursesDb.findIndex(c => c.id === id);
    if (courseIndex === -1) throw new Error("Course not found");
    
    const updatedCourse: Course = {
      ...simulatedCoursesDb[courseIndex],
      ...courseData,
      id, // ensure id is present
      isForYou: courseData.isForYou || [],
      whatsIncluded: whatsIncludedWithStringIcons as any, // Stored as string name in DB
      modules: courseData.modules || [],
    };
    simulatedCoursesDb[courseIndex] = updatedCourse;
    return updatedCourse;
  } else { // Add new course
    const newCourse: Course = {
      ...courseData,
      id: `crs_${Date.now()}`,
      isForYou: courseData.isForYou || [],
      whatsIncluded: whatsIncludedWithStringIcons as any,
      modules: courseData.modules || [],
    };
    simulatedCoursesDb.push(newCourse);
    return newCourse;
  }
}

export async function addCourseAction(prevState: CourseFormState, formData: FormData): Promise<CourseFormState> {
    const validatedFields = courseFormSchema.safeParse(Object.fromEntries(formData));

    if (!validatedFields.success) {
        return { message: "Validation Failed", errors: validatedFields.error.flatten().fieldErrors, isSuccess: false };
    }
    try {
        await saveCourse(validatedFields.data);
        revalidatePath('/admin/courses');
        revalidatePath('/courses');
        return { message: "Course added successfully!", isSuccess: true };
    } catch (e) {
        return { message: (e as Error).message, isSuccess: false };
    }
}

export async function updateCourseAction(prevState: CourseFormState, formData: FormData): Promise<CourseFormState> {
    const validatedFields = courseFormSchema.safeParse(Object.fromEntries(formData));
    const id = formData.get('id') as string;

    if (!id) return { message: "Course ID is missing", isSuccess: false };

    if (!validatedFields.success) {
        return { message: "Validation Failed", errors: validatedFields.error.flatten().fieldErrors, isSuccess: false };
    }
    try {
        const updatedCourse = await saveCourse(validatedFields.data, id);
        revalidatePath('/admin/courses');
        revalidatePath(`/courses/${id}`);
        revalidatePath('/courses');
        return { message: "Course updated successfully!", isSuccess: true };
    } catch (e) {
        return { message: (e as Error).message, isSuccess: false };
    }
}

export async function deleteCourseAction(courseId: string): Promise<CourseFormState> {
  try {
    const initialLength = simulatedCoursesDb.length;
    simulatedCoursesDb = simulatedCoursesDb.filter(c => c.id !== courseId);
    if (simulatedCoursesDb.length === initialLength) {
        throw new Error("Course not found for deletion.");
    }
    revalidatePath('/admin/courses');
    revalidatePath('/courses');
    return { message: "Course deleted successfully!", isSuccess: true };
  } catch (e) {
    return { message: (e as Error).message, isSuccess: false };
  }
}
