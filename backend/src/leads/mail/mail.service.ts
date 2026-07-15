import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Lead } from '@prisma/client';
import * as nodemailer from 'nodemailer';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderRow(label: string, value: string | null | undefined): string {
  return `
    <tr>
      <td style="padding:10px 16px;border-bottom:1px solid #e2e8f0;color:#64748b;font-size:13px;white-space:nowrap;vertical-align:top;">${label}</td>
      <td style="padding:10px 16px;border-bottom:1px solid #e2e8f0;color:#0f172a;font-size:14px;">${escapeHtml(value ?? '—')}</td>
    </tr>`;
}

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(
    private readonly mailerService: MailerService,
    private readonly config: ConfigService,
  ) {}

  async sendLeadNotification(lead: Lead): Promise<void> {
    const to = this.config.get<string>('LEADS_NOTIFY_TO', 'info@aeon4.ai');
    const receivedAt = lead.createdAt.toLocaleString('en-GB', {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: 'UTC',
    });

    const html = `
<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(15,23,42,.08);">
            <tr>
              <td style="background:#03101d;padding:20px 24px;">
                <span style="font-family:Georgia,serif;letter-spacing:.06em;color:#e8f6fa;font-size:16px;">AeOn<b style="color:#22d3ee;font-weight:400;">4</b>.AI</span>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 24px 8px;">
                <h1 style="margin:0 0 4px;font-size:18px;color:#0f172a;">New pilot request</h1>
                <p style="margin:0;font-size:13px;color:#64748b;">Received ${receivedAt} UTC · via aeon4.ai</p>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 8px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;">
                  ${renderRow('Name', lead.name)}
                  ${renderRow('Email', lead.email)}
                  ${renderRow('Company', lead.company)}
                  ${renderRow('Facility type', lead.facilityType)}
                  ${renderRow('Country', lead.country)}
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:8px 24px 24px;">
                <p style="margin:0 0 6px;font-size:13px;color:#64748b;text-transform:uppercase;letter-spacing:.06em;">Message</p>
                <p style="margin:0;font-size:14px;color:#0f172a;white-space:pre-wrap;line-height:1.6;">${escapeHtml(lead.message)}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 24px;background:#f8fafc;border-top:1px solid #e2e8f0;">
                <p style="margin:0;font-size:12px;color:#94a3b8;">Lead ID: ${lead.id} · Reply directly to this email to reach ${escapeHtml(lead.name)} at ${escapeHtml(lead.email)}.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

    const text = [
      `New pilot request from ${lead.name}`,
      `Received: ${receivedAt} UTC`,
      '',
      `Name: ${lead.name}`,
      `Email: ${lead.email}`,
      `Company: ${lead.company ?? '—'}`,
      `Facility type: ${lead.facilityType ?? '—'}`,
      `Country: ${lead.country ?? '—'}`,
      '',
      'Message:',
      lead.message,
    ].join('\n');

    try {
      const info = await this.mailerService.sendMail({
        to,
        replyTo: lead.email,
        subject: `New pilot request from ${lead.name}`,
        text,
        html,
      });
      const previewUrl = nodemailer.getTestMessageUrl(info);
      if (previewUrl) {
        this.logger.log(`Lead notification sent to a test inbox — preview: ${previewUrl}`);
      }
    } catch (error) {
      // The lead is already persisted; a notification failure must not fail the request.
      this.logger.error(`Failed to send lead notification email for lead ${lead.id}`, error as Error);
    }
  }
}
