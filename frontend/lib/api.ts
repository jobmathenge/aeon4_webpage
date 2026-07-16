import "server-only";
import type { Copilot, QAByTopic, QAPair, Stat, TickerEvent } from "./types";

const API_URL = process.env.API_URL ?? "http://localhost:4000";

async function getJSON<T>(path: string, revalidate: number): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    next: { revalidate, tags: ["content"] },
  });
  if (!res.ok) {
    throw new Error(`Request to ${path} failed with status ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export function getStats(): Promise<Stat[]> {
  return getJSON<Stat[]>("/api/content/stats", 0);
}

export function getCopilots(): Promise<Copilot[]> {
  return getJSON<Copilot[]>("/api/content/copilots", 0);
}

export function getQA(): Promise<QAByTopic> {
  return getJSON<QAByTopic>("/api/content/qa", 0);
}

export function getQAByTopic(topic: string): Promise<QAPair[]> {
  return getJSON<QAPair[]>(`/api/content/qa/${topic}`, 0);
}

export function getTicker(): Promise<TickerEvent[]> {
  return getJSON<TickerEvent[]>("/api/content/ticker", 0);
}

export async function getLeads(apiKey: string): Promise<any[]> {
  const res = await fetch(`${API_URL}/api/leads`, {
    headers: {
      "x-api-key": apiKey,
    },
    next: { revalidate: 0 },
  });
  if (!res.ok) {
    if (res.status === 401) {
      throw new Error("Unauthorized: Invalid API key");
    }
    throw new Error(`Failed to fetch leads: ${res.statusText}`);
  }
  return res.json() as Promise<any[]>;
}

export async function updateLeadStatus(leadId: string, status: string, apiKey: string): Promise<any> {
  const res = await fetch(`${API_URL}/api/leads/${leadId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    },
    body: JSON.stringify({ status }),
    next: { revalidate: 0 },
  });
  if (!res.ok) {
    throw new Error(`Failed to update status: ${res.statusText}`);
  }
  return res.json();
}
