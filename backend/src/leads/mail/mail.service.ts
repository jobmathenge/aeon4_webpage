import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Lead } from '@prisma/client';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(
    private readonly mailerService: MailerService,
    private readonly config: ConfigService,
  ) {}

  async sendLeadNotification(lead: Lead): Promise<void> {
    const to = this.config.get<string>('LEADS_NOTIFY_TO', 'hello@aeon4.ai');
    try {
      await this.mailerService.sendMail({
        to,
        subject: `New pilot request from ${lead.name}`,
        text: [
          `Name: ${lead.name}`,
          `Email: ${lead.email}`,
          `Company: ${lead.company ?? '—'}`,
          `Facility type: ${lead.facilityType ?? '—'}`,
          `Country: ${lead.country ?? '—'}`,
          '',
          lead.message,
        ].join('\n'),
      });
    } catch (error) {
      // The lead is already persisted; a notification failure must not fail the request.
      this.logger.error(`Failed to send lead notification email for lead ${lead.id}`, error as Error);
    }
  }
}
