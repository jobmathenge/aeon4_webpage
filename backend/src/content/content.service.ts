import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CONTENT_TOPICS,
  CopilotDto,
  ContentTopic,
  QAByTopicDto,
  QAPairDto,
  StatDto,
  TickerEventDto,
} from './types/content.types';

@Injectable()
export class ContentService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats(): Promise<StatDto[]> {
    const stats = await this.prisma.stat.findMany({ orderBy: { order: 'asc' } });
    return stats.map(({ value, label }) => ({ value, label }));
  }

  async getCopilots(): Promise<CopilotDto[]> {
    const copilots = await this.prisma.copilot.findMany({
      orderBy: { order: 'asc' },
      include: { features: { orderBy: { order: 'asc' } } },
    });
    return copilots.map((c) => ({
      id: c.id,
      order: c.order,
      tag: c.tag,
      title: c.title,
      cardSubtitle: c.cardSubtitle,
      cardDescription: c.cardDescription,
      heroDescription: c.heroDescription,
      protocolBadge: c.protocolBadge,
      heroWord: c.heroWord,
      chip1Value: c.chip1Value,
      chip1Label: c.chip1Label,
      chip2Value: c.chip2Value,
      chip2Label: c.chip2Label,
      accentColor: c.accentColor,
      icon: c.icon,
      features: c.features.map((f) => f.text),
    }));
  }

  async getQA(): Promise<QAByTopicDto> {
    const entries = await this.prisma.qAEntry.findMany({ orderBy: { order: 'asc' } });
    const byTopic: QAByTopicDto = {};
    for (const topic of CONTENT_TOPICS) byTopic[topic] = [];
    for (const entry of entries) {
      (byTopic[entry.topic] ??= []).push({ question: entry.question, answer: entry.answer });
    }
    return byTopic;
  }

  async getQAByTopic(topic: string): Promise<QAPairDto[]> {
    if (!CONTENT_TOPICS.includes(topic as ContentTopic)) {
      throw new NotFoundException(`Unknown topic "${topic}"`);
    }
    const entries = await this.prisma.qAEntry.findMany({
      where: { topic },
      orderBy: { order: 'asc' },
    });
    return entries.map(({ question, answer }) => ({ question, answer }));
  }

  async getTicker(): Promise<TickerEventDto[]> {
    const events = await this.prisma.tickerEvent.findMany({ orderBy: { order: 'asc' } });
    return events.map(({ category, message }) => ({ category, message }));
  }
}
