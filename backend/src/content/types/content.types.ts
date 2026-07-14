export interface StatDto {
  value: string;
  label: string;
}

export interface CopilotDto {
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

export interface QAPairDto {
  question: string;
  answer: string;
}

export type QAByTopicDto = Record<string, QAPairDto[]>;

export interface TickerEventDto {
  category: string;
  message: string;
}

export const CONTENT_TOPICS = ['security', 'bms', 'iot'] as const;
export type ContentTopic = (typeof CONTENT_TOPICS)[number];
