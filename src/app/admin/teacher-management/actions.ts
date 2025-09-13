// src/app/admin/teacher-management/actions.ts
"use server";

import { revalidatePath } from 'next/cache';
import { teacherFormSchema, type Teacher, type TeacherFormState, type TeacherFormData } from './schema';

// --- In-memory DB ---
let simulatedTeachersDb: Teacher[] = [
    { id: 'tchr_1', name: 'Ms. Dubois', email: 'dubois@example.com', phone: '111-222-3333', status: 'Active' }
];

// --- Server Actions ---
export async function getTeachersAction(): Promise<TeacherFormState> {
    try {
        return { message: "Teachers fetched", isSuccess: true, data: JSON.parse(JSON.stringify(simulatedTeachersDb)) };
    } catch(e) {
        return { message: "Failed to fetch teachers", isSuccess: false };
    }
}

export async function addTeacherAction(teacherData: Omit<TeacherFormData, 'id'>): Promise<TeacherFormState> {
    const validatedFields = teacherFormSchema.safeParse(teacherData);

    if (!validatedFields.success) {
        return { message: "Validation Failed", errors: validatedFields.error.flatten().fieldErrors, isSuccess: false };
    }
     if (simulatedTeachersDb.some(t => t.email === validatedFields.data.email)) {
        return { message: "Teacher with this email already exists.", errors: { email: ["Email already in use."] }, isSuccess: false };
    }
     if (!validatedFields.data.password) {
        return { message: "Password is required for new teachers.", errors: { password: ["Password is required."] }, isSuccess: false };
    }

    try {
        const { password, ...newTeacherData } = validatedFields.data;
        const newTeacher: Teacher = {
            ...newTeacherData,
            id: `tchr_${Date.now()}`
        };
        simulatedTeachersDb.push(newTeacher);
        revalidatePath('/admin/teacher-management');
        return { message: "Teacher added successfully!", isSuccess: true, data: newTeacher };
    } catch (e) {
        return { message: "Failed to add teacher.", isSuccess: false };
    }
}


export async function updateTeacherAction(prevState: TeacherFormState, formData: FormData): Promise<TeacherFormState> {
    const validatedFields = teacherFormSchema.safeParse(Object.fromEntries(formData));
    const teacherId = formData.get('id') as string;

    if (!teacherId) return { message: "Teacher ID is missing", isSuccess: false };

    if (!validatedFields.success) {
        return { message: "Validation Failed", errors: validatedFields.error.flatten().fieldErrors, isSuccess: false };
    }
    
    const teacherIndex = simulatedTeachersDb.findIndex(t => t.id === teacherId);
    if (teacherIndex === -1) return { message: "Teacher not found", isSuccess: false };

    if (simulatedTeachersDb.some(t => t.email === validatedFields.data.email && t.id !== teacherId)) {
        return { message: "Email already in use by another teacher.", errors: { email: ["Email already in use."] }, isSuccess: false };
    }

    try {
        const { password, ...teacherData } = validatedFields.data;
        const updatedTeacher: Teacher = {
            ...simulatedTeachersDb[teacherIndex],
            ...teacherData
        };
        simulatedTeachersDb[teacherIndex] = updatedTeacher;
        revalidatePath('/admin/teacher-management');
        return { message: "Teacher updated successfully!", isSuccess: true };
    } catch (e) {
        return { message: "Failed to update teacher.", isSuccess: false };
    }
}

export async function deleteTeacherAction(teacherId: string): Promise<TeacherFormState> {
    try {
        const initialLength = simulatedTeachersDb.length;
        simulatedTeachersDb = simulatedTeachersDb.filter(t => t.id !== teacherId);
        if (simulatedTeachersDb.length === initialLength) {
            return { message: "Teacher not found", isSuccess: false };
        }
        revalidatePath('/admin/teacher-management');
        return { message: "Teacher deleted successfully!", isSuccess: true };
    } catch (e) {
        return { message: "Failed to delete teacher.", isSuccess: false };
    }
}
