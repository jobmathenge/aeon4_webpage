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
  return getJSON<Stat[]>("/api/content/stats", 3600);
}

export function getCopilots(): Promise<Copilot[]> {
  return getJSON<Copilot[]>("/api/content/copilots", 3600);
}

export function getQA(): Promise<QAByTopic> {
  return getJSON<QAByTopic>("/api/content/qa", 3600);
}

export function getQAByTopic(topic: string): Promise<QAPair[]> {
  return getJSON<QAPair[]>(`/api/content/qa/${topic}`, 3600);
}

export function getTicker(): Promise<TickerEvent[]> {
  return getJSON<TickerEvent[]>("/api/content/ticker", 60);
}
