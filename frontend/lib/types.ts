export interface Stat {
  value: string;
  label: string;
}

export interface Copilot {
  id: string;
  order: number;
  tag: string;
  title: string;
  cardSubtitle: string;
  cardDescription: string;
  heroDescription: string;
  protocolBadge: string;
  heroWord: string;
  chip1Value: string;
  chip1Label: string;
  chip2Value: string;
  chip2Label: string;
  accentColor: string;
  icon: string;
  features: string[];
}

export interface QAPair {
  question: string;
  answer: string;
}

export type QAByTopic = Record<string, QAPair[]>;

export interface TickerEvent {
  category: string;
  message: string;
}

export interface LeadFormValues {
  name: string;
  email: string;
  company?: string;
  facilityType?: string;
  message: string;
  country?: string;
  website?: string;
}
