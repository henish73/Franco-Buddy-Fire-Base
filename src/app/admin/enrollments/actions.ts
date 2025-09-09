// src/app/admin/enrollments/actions.ts
"use server";

import { revalidatePath } from 'next/cache';

export type Enrollment = {
  id: string;
  studentId: string;
  fullName: string;
  email: string;
  phone: string;
  courseId: string;
  courseName: string;
  date: string;
  paymentStatus: "Paid" | "Pending" | "Failed" | "Refunded";
  enrollmentStatus: "Active" | "Cancelled" | "Completed";
};

type FormState = {
    message: string;
    isSuccess: boolean;
    data?: Enrollment[] | Enrollment | null;
}

// In-memory store for enrollments, simulating a database
let simulatedEnrollmentsDb: Enrollment[] = [];

// Action to add a new enrollment (called by the public enrollment form)
export async function addEnrollmentAction(enrollmentData: Omit<Enrollment, 'id' | 'paymentStatus' | 'enrollmentStatus'>): Promise<FormState> {
    try {
        const newEnrollment: Enrollment = {
            ...enrollmentData,
            id: `enr_${Date.now()}`,
            paymentStatus: "Pending", // Default status
            enrollmentStatus: "Active", // Default status
        };
        simulatedEnrollmentsDb.push(newEnrollment);
        console.log("[Server Action] New enrollment added:", newEnrollment);
        
        // No revalidation needed here as this is called from public form, but we can if we want to immediately update admin views
        revalidatePath('/admin/enrollments');

        return { message: `Enrollment successful for ${enrollmentData.courseName || 'our program'}! We have received your details and will contact you shortly with payment information and next steps.`, isSuccess: true, data: newEnrollment };
    } catch(e) {
        const error = e as Error;
        console.error("Error adding enrollment:", error);
        return { message: `Enrollment failed: ${error.message}`, isSuccess: false };
    }
}


// Action to get all enrollments for the admin panel
export async function getEnrollmentsAction(): Promise<FormState> {
    try {
        const sortedEnrollments = [...simulatedEnrollmentsDb].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        return {
            message: "Enrollments fetched successfully.",
            isSuccess: true,
            data: JSON.parse(JSON.stringify(sortedEnrollments)),
        };
    } catch (e) {
        const error = e as Error;
        console.error("Error fetching enrollments:", error);
        return { message: "Failed to fetch enrollments.", isSuccess: false, data: [] };
    }
}


// Action to update an enrollment's status
export async function updateEnrollmentStatusAction(enrollmentId: string, newStatus: Enrollment["enrollmentStatus"]): Promise<FormState> {
    try {
        const enrollmentIndex = simulatedEnrollmentsDb.findIndex(e => e.id === enrollmentId);
        if (enrollmentIndex === -1) {
            return { message: "Enrollment not found.", isSuccess: false };
        }
        simulatedEnrollmentsDb[enrollmentIndex].enrollmentStatus = newStatus;
        if(newStatus === 'Active') {
            simulatedEnrollmentsDb[enrollmentIndex].paymentStatus = 'Paid';
        }
        console.log(`[Server Action] Updated enrollment ${enrollmentId} status to ${newStatus}`);
        
        revalidatePath('/admin/enrollments');

        return { message: "Enrollment status updated.", isSuccess: true };
    } catch (e) {
        const error = e as Error;
        console.error("Error updating enrollment status:", error);
        return { message: `Failed to update status: ${error.message}`, isSuccess: false };
    }
}
