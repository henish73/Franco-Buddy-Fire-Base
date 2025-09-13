// src/app/admin/site-management/courses/actions.ts
"use server";

import { revalidatePath } from 'next/cache';
import type { Course } from '@/components/shared/CourseCard';
import { courseFormSchema, type CourseFormData, moduleSchema, whatsIncludedSchema } from './schema';
import { z } from 'zod';
import { coursesData } from '@/app/(public)/courses/mockCoursesData';

// --- Simulated Database for Courses ---
// In a real app, this would be Firestore. For this demo, it's an in-memory array.
let simulatedCoursesDb: Course[] = coursesData;

export type CourseFormState = {
  message: string;
  errors?: Partial<Record<keyof CourseFormData, string[]>>;
  isSuccess: boolean;
  data?: Course[] | Course | null;
};

// --- Server Actions ---
export async function getCoursesAction(): Promise<CourseFormState> {
  try {
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

// Helper to parse JSON fields safely
function parseJsonField(jsonString: string | undefined | null, schema: z.ZodTypeAny) {
    if (!jsonString || jsonString.trim() === "") return [];
    try {
        const parsed = JSON.parse(jsonString);
        return schema.parse(parsed);
    } catch (e) {
        throw new Error(`Invalid JSON format: ${(e as Error).message}`);
    }
}


async function saveCourse(courseData: CourseFormData, id?: string): Promise<Course> {
    const whatsIncluded = parseJsonField(courseData.whatsIncluded, z.array(whatsIncludedSchema));
    const modules = parseJsonField(courseData.modules, z.array(moduleSchema));
    
    const coursePayload = {
        ...courseData,
        isForYou: courseData.isForYou ? courseData.isForYou.split('\n').filter(Boolean) : [],
        whatsIncluded: whatsIncluded as any, // The icon is just a string, client handles mapping
        modules,
    };

    if (id) { // Update existing course
        const courseIndex = simulatedCoursesDb.findIndex(c => c.id === id);
        if (courseIndex === -1) throw new Error("Course not found");
        
        const updatedCourse: Course = {
            ...simulatedCoursesDb[courseIndex],
            ...coursePayload,
            id,
        };
        simulatedCoursesDb[courseIndex] = updatedCourse;
        return updatedCourse;
    } else { // Add new course
        const newCourse: Course = {
            ...coursePayload,
            id: `crs_${Date.now()}`,
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
        revalidatePath('/admin/site-management/courses');
        revalidatePath('/courses');
        return { message: "Course added successfully!", isSuccess: true };
    } catch (e) {
        return { message: (e as Error).message, isSuccess: false };
    }
}

export async function updateCourseAction(prevState: CourseFormState, formData: FormData): Promise<CourseFormState> {
    const id = formData.get('id') as string;
    if (!id) return { message: "Course ID is missing", isSuccess: false };

    const validatedFields = courseFormSchema.safeParse(Object.fromEntries(formData));
    if (!validatedFields.success) {
        return { message: "Validation Failed", errors: validatedFields.error.flatten().fieldErrors, isSuccess: false };
    }
    
    try {
        await saveCourse(validatedFields.data, id);
        revalidatePath('/admin/site-management/courses');
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
    revalidatePath('/admin/site-management/courses');
    revalidatePath('/courses');
    return { message: "Course deleted successfully!", isSuccess: true };
  } catch (e) {
    return { message: (e as Error).message, isSuccess: false };
  }
}
