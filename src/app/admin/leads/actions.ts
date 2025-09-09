// src/app/admin/leads/actions.ts
"use server";

import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// Define lead types
export type DemoRequestLead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  frenchLevel: string;
  goals: string;
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

// Simulated in-memory database
let simulatedDemoLeadsDb: DemoRequestLead[] = [];
let simulatedContactLeadsDb: ContactLead[] = [];

// Form state for server actions
type LeadsFormState = {
  message: string;
  isSuccess: boolean;
  data?: {
    demoRequests: DemoRequestLead[];
    contactSubmissions: ContactLead[];
  } | DemoRequestLead | ContactLead | null;
};

// Action to add a demo request lead (from public form)
export async function addDemoRequestAction(data: Omit<DemoRequestLead, 'id' | 'submittedAt' | 'status'>): Promise<LeadsFormState> {
  try {
    const newLead: DemoRequestLead = {
      ...data,
      id: `demo_${Date.now()}`,
      submittedAt: new Date().toISOString(),
      status: 'New',
    };
    simulatedDemoLeadsDb.push(newLead);
    console.log("[Server Action] New demo lead added:", newLead);
    revalidatePath('/admin/leads');
    return { message: "Thank you! Your demo request has been submitted.", isSuccess: true };
  } catch (e) {
    return { message: "Failed to submit demo request.", isSuccess: false };
  }
}

// Action to add a contact submission lead (from public form)
export async function addContactSubmissionAction(data: Omit<ContactLead, 'id' | 'submittedAt' | 'status'>): Promise<LeadsFormState> {
    try {
        const newLead: ContactLead = {
        ...data,
        id: `contact_${Date.now()}`,
        submittedAt: new Date().toISOString(),
        status: 'New',
        };
        simulatedContactLeadsDb.push(newLead);
        console.log("[Server Action] New contact lead added:", newLead);
        revalidatePath('/admin/leads');

        // This action redirects, so the return state is for fallback
        // The actual redirect will be handled in the form action itself.
        return { message: "Redirecting to WhatsApp...", isSuccess: true };
    } catch (e) {
        return { message: "Failed to submit contact form.", isSuccess: false };
    }
}


// Action to get all leads for the admin panel
export async function getLeadsAction(): Promise<LeadsFormState> {
  try {
    return {
      message: "Leads fetched successfully.",
      isSuccess: true,
      data: {
        demoRequests: [...simulatedDemoLeadsDb].sort((a,b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()),
        contactSubmissions: [...simulatedContactLeadsDb].sort((a,b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()),
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
            demoRequests: simulatedDemoLeadsDb.filter(l => l.status === 'New').length,
            contactSubmissions: simulatedContactLeadsDb.filter(l => l.status === 'New').length,
        };
    } catch (error) {
        return { demoRequests: 0, contactSubmissions: 0 };
    }
}


// Action to update lead status
export async function updateLeadStatusAction(leadId: string, leadType: 'demo' | 'contact', newStatus: string): Promise<LeadsFormState> {
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
        revalidatePath('/admin/leads');
        return { message: "Lead status updated.", isSuccess: true };
    } catch (error) {
        return { message: "Failed to update lead status.", isSuccess: false };
    }
}
