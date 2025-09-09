// src/app/admin/students/actions.ts
"use server";

import { revalidatePath } from 'next/cache';
import { studentFormSchema, type Student, type StudentFormState, type StudentFormData } from './schema';

// --- In-memory DB ---
let simulatedStudentsDb: Student[] = [];

// --- Server Actions ---
export async function getStudentsAction(): Promise<StudentFormState> {
    try {
        return { message: "Students fetched", isSuccess: true, data: JSON.parse(JSON.stringify(simulatedStudentsDb)) };
    } catch(e) {
        return { message: "Failed to fetch students", isSuccess: false };
    }
}

export async function getStudentCountAction(): Promise<number> {
    return simulatedStudentsDb.length;
}

// Action to add student, now accepts an object for easier programmatic use
export async function addStudentAction(studentData: Omit<StudentFormData, 'id'>): Promise<StudentFormState> {
    const validatedFields = studentFormSchema.safeParse(studentData);

    if (!validatedFields.success) {
        return { message: "Validation Failed", errors: validatedFields.error.flatten().fieldErrors, isSuccess: false };
    }
     if (simulatedStudentsDb.some(s => s.email === validatedFields.data.email)) {
        return { message: "Student with this email already exists.", errors: { email: ["Email already in use."] }, isSuccess: false };
    }
     if (!validatedFields.data.password) {
        return { message: "Password is required for new students.", errors: { password: ["Password is required."] }, isSuccess: false };
    }

    try {
        const { password, ...newStudentData } = validatedFields.data;
        // In a real app, hash the password here before saving
        const newStudent: Student = {
            ...newStudentData,
            id: `std_${Date.now()}`
        };
        simulatedStudentsDb.push(newStudent);
        console.log("New student added (password would be hashed):", newStudent);
        revalidatePath('/admin/students');
        return { message: "Student added successfully!", isSuccess: true, data: newStudent };
    } catch (e) {
        return { message: "Failed to add student.", isSuccess: false };
    }
}


export async function updateStudentAction(prevState: StudentFormState, formData: FormData): Promise<StudentFormState> {
    const validatedFields = studentFormSchema.safeParse(Object.fromEntries(formData));
    const studentId = formData.get('id') as string;

    if (!studentId) return { message: "Student ID is missing", isSuccess: false };

    if (!validatedFields.success) {
        return { message: "Validation Failed", errors: validatedFields.error.flatten().fieldErrors, isSuccess: false };
    }
    
    const studentIndex = simulatedStudentsDb.findIndex(s => s.id === studentId);
    if (studentIndex === -1) return { message: "Student not found", isSuccess: false };

    // Check for email conflict
    if (simulatedStudentsDb.some(s => s.email === validatedFields.data.email && s.id !== studentId)) {
        return { message: "Email already in use by another student.", errors: { email: ["Email already in use."] }, isSuccess: false };
    }

    try {
        const { password, ...studentData } = validatedFields.data;
        // Password is not updated here. A separate "change password" flow should exist.
        const updatedStudent: Student = {
            ...simulatedStudentsDb[studentIndex],
            ...studentData
        };
        simulatedStudentsDb[studentIndex] = updatedStudent;
        console.log("Student updated:", updatedStudent);
        revalidatePath('/admin/students');
        return { message: "Student updated successfully!", isSuccess: true };
    } catch (e) {
        return { message: "Failed to update student.", isSuccess: false };
    }
}

export async function deleteStudentAction(studentId: string): Promise<StudentFormState> {
    try {
        const initialLength = simulatedStudentsDb.length;
        simulatedStudentsDb = simulatedStudentsDb.filter(s => s.id !== studentId);
        if (simulatedStudentsDb.length === initialLength) {
            return { message: "Student not found", isSuccess: false };
        }
        revalidatePath('/admin/students');
        return { message: "Student deleted successfully!", isSuccess: true };
    } catch (e) {
        return { message: "Failed to delete student.", isSuccess: false };
    }
}
