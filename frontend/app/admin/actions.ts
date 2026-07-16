"use server";

import { getLeads, updateLeadStatus } from "@/lib/api";

export async function fetchLeadsAction(apiKey: string) {
  try {
    const leads = await getLeads(apiKey);
    return { success: true, leads };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to fetch leads" };
  }
}

export async function updateLeadStatusAction(leadId: string, status: string, apiKey: string) {
  try {
    const lead = await updateLeadStatus(leadId, status, apiKey);
    return { success: true, lead };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update lead status" };
  }
}
