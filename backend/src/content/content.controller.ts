import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { Controller, Get, Header, Param, UseInterceptors } from '@nestjs/common';
import { ContentService } from './content.service';

const HOUR_MS = 60 * 60 * 1000;
const FIVE_MIN_MS = 5 * 60 * 1000;

@Controller('content')
@UseInterceptors(CacheInterceptor)
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Get('stats')
  @CacheTTL(HOUR_MS)
  @Header('Cache-Control', 'public, max-age=3600, stale-while-revalidate=300')
  getStats() {
    return this.contentService.getStats();
  }

  @Get('copilots')
  @CacheTTL(HOUR_MS)
  @Header('Cache-Control', 'public, max-age=3600, stale-while-revalidate=300')
  getCopilots() {
    return this.contentService.getCopilots();
  }

  @Get('qa')
  @CacheTTL(HOUR_MS)
  @Header('Cache-Control', 'public, max-age=3600, stale-while-revalidate=300')
  getQA() {
    return this.contentService.getQA();
  }

  @Get('qa/:topic')
  @CacheTTL(HOUR_MS)
  @Header('Cache-Control', 'public, max-age=3600, stale-while-revalidate=300')
  getQAByTopic(@Param('topic') topic: string) {
    return this.contentService.getQAByTopic(topic);
  }

  @Get('ticker')
  @CacheTTL(FIVE_MIN_MS)
  @Header('Cache-Control', 'public, max-age=300, stale-while-revalidate=300')
  getTicker() {
    return this.contentService.getTicker();
  }
}
