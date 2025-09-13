// src/app/admin/finance-management/actions.ts
"use server";

import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// Define lead types
export type DemoRequestLead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  selectedDate: string;
  selectedTime: string;
  submittedAt: string;
  status: 'New' | 'Contacted' | 'Demo Scheduled' | 'Converted' | 'Closed';
  notes?: string;
};

export type ContactLead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  inquiryType: string;
  message: string;
  submittedAt: string;
  status: 'New' | 'Responded' | 'Closed';
  notes?: string;
};

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


// Simulated in-memory database
let simulatedDemoLeadsDb: DemoRequestLead[] = [];
let simulatedContactLeadsDb: ContactLead[] = [];
let simulatedEnrollmentsDb: Enrollment[] = [];

// Form state for server actions
export type FinanceManagementFormState = {
  message: string;
  isSuccess: boolean;
  data?: {
    demoRequests: DemoRequestLead[];
    contactSubmissions: ContactLead[];
    enrollments: Enrollment[];
  } | DemoRequestLead | ContactLead | Enrollment | null;
};

// Zod schema for adding a demo lead, only validates required fields from the form
const addDemoLeadSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  phone: z.string(),
  selectedDate: z.string(),
  selectedTime: z.string(),
});

// Action to add a demo request lead (from public form)
export async function addDemoRequestAction(data: z.infer<typeof addDemoLeadSchema>): Promise<FinanceManagementFormState> {
  const validatedFields = addDemoLeadSchema.safeParse(data);
  if (!validatedFields.success) {
    return { message: "Invalid lead data provided.", isSuccess: false };
  }

  try {
    const newLead: DemoRequestLead = {
      ...validatedFields.data,
      id: `demo_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      submittedAt: new Date().toISOString(),
      status: 'Demo Scheduled', // Set status directly
    };
    simulatedDemoLeadsDb.push(newLead);
    console.log("[Server Action] New demo lead added:", newLead);
    revalidatePath('/admin/finance-management');
    return { message: "Demo request has been submitted.", isSuccess: true, data: newLead };
  } catch (e) {
    const error = e as Error;
    console.error("Error adding demo lead:", error.message);
    return { message: `Failed to submit demo request: ${error.message}`, isSuccess: false };
  }
}


// Action to add a contact submission lead (from public form)
export async function addContactSubmissionAction(data: Omit<ContactLead, 'id' | 'submittedAt' | 'status'>): Promise<FinanceManagementFormState> {
    try {
        const newLead: ContactLead = {
        ...data,
        id: `contact_${Date.now()}`,
        submittedAt: new Date().toISOString(),
        status: 'New',
        };
        simulatedContactLeadsDb.push(newLead);
        console.log("[Server Action] New contact lead added:", newLead);
        revalidatePath('/admin/finance-management');

        return { message: "Redirecting to WhatsApp...", isSuccess: true };
    } catch (e) {
        return { message: "Failed to submit contact form.", isSuccess: false };
    }
}


// Action to get all leads for the admin panel
export async function getLeadsAction(): Promise<FinanceManagementFormState> {
  try {
    return {
      message: "Leads fetched successfully.",
      isSuccess: true,
      data: {
        demoRequests: [...simulatedDemoLeadsDb].sort((a,b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()),
        contactSubmissions: [...simulatedContactLeadsDb].sort((a,b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()),
        enrollments: [], // Not needed for this specific action but part of the type
      },
    };
  } catch (error) {
    return { message: "Failed to fetch leads.", isSuccess: false };
  }
}

// Action to get lead statistics for the dashboard
export async function getLeadStatsAction(): Promise<{ demoRequests: number, contactSubmissions: number }> {
    try {
        return {
            demoRequests: simulatedDemoLeadsDb.filter(l => l.status === 'New' || l.status === 'Demo Scheduled').length,
            contactSubmissions: simulatedContactLeadsDb.filter(l => l.status === 'New').length,
        };
    } catch (error) {
        return { demoRequests: 0, contactSubmissions: 0 };
    }
}


// Action to update lead status
export async function updateLeadStatusAction(leadId: string, leadType: 'demo' | 'contact', newStatus: string): Promise<FinanceManagementFormState> {
    try {
        if (leadType === 'demo') {
            const leadIndex = simulatedDemoLeadsDb.findIndex(l => l.id === leadId);
            if (leadIndex === -1) return { message: "Demo lead not found.", isSuccess: false };
            simulatedDemoLeadsDb[leadIndex].status = newStatus as DemoRequestLead['status'];
        } else {
            const leadIndex = simulatedContactLeadsDb.findIndex(l => l.id === leadId);
            if (leadIndex === -1) return { message: "Contact lead not found.", isSuccess: false };
            simulatedContactLeadsDb[leadIndex].status = newStatus as ContactLead['status'];
        }
        revalidatePath('/admin/finance-management');
        return { message: "Lead status updated.", isSuccess: true };
    } catch (error) {
        return { message: "Failed to update lead status.", isSuccess: false };
    }
}

// --- ENROLLMENT ACTIONS ---

// Action to add a new enrollment (called by the public enrollment form)
export async function addEnrollmentAction(enrollmentData: Omit<Enrollment, 'id' | 'paymentStatus' | 'enrollmentStatus'>): Promise<FinanceManagementFormState> {
    try {
        const newEnrollment: Enrollment = {
            ...enrollmentData,
            id: `enr_${Date.now()}`,
            paymentStatus: "Pending", // Default status
            enrollmentStatus: "Active", // Default status
        };
        simulatedEnrollmentsDb.push(newEnrollment);
        console.log("[Server Action] New enrollment added:", newEnrollment);
        
        revalidatePath('/admin/finance-management');

        return { message: `Enrollment successful! We have received your details and will contact you shortly with payment information and next steps.`, isSuccess: true, data: newEnrollment };
    } catch(e) {
        const error = e as Error;
        console.error("Error adding enrollment:", error);
        return { message: `Enrollment failed: ${error.message}`, isSuccess: false };
    }
}

// Action to get all enrollments for the admin panel
export async function getEnrollmentsAction(): Promise<FinanceManagementFormState> {
    try {
        const sortedEnrollments = [...simulatedEnrollmentsDb].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        return {
            message: "Enrollments fetched successfully.",
            isSuccess: true,
            data: {
              enrollments: JSON.parse(JSON.stringify(sortedEnrollments)),
              demoRequests: [],
              contactSubmissions: []
            },
        };
    } catch (e) {
        const error = e as Error;
        console.error("Error fetching enrollments:", error);
        return { message: "Failed to fetch enrollments.", isSuccess: false, data: { enrollments: [], demoRequests: [], contactSubmissions: [] } };
    }
}


// Action to update an enrollment's status
export async function updateEnrollmentStatusAction(enrollmentId: string, newStatus: Enrollment["enrollmentStatus"]): Promise<FinanceManagementFormState> {
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
        
        revalidatePath('/admin/finance-management');

        return { message: "Enrollment status updated.", isSuccess: true };
    } catch (e) {
        const error = e as Error;
        console.error("Error updating enrollment status:", error);
        return { message: `Failed to update status: ${error.message}`, isSuccess: false };
    }
}
