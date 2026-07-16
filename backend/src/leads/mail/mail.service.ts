import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Lead } from '@prisma/client';

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
      <td style="padding:10px 16px;border-bottom:1px solid #e2e8f0;color:#0f172a;font-size:14px;">${escapeHtml(value ?? 'N/A')}</td>
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
                <p style="margin:0;font-size:13px;color:#64748b;">Received ${receivedAt} UTC, via aeon4.ai</p>
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
                <p style="margin:0;font-size:12px;color:#94a3b8;">Lead ID: ${lead.id}, Reply directly to this email to reach ${escapeHtml(lead.name)} at ${escapeHtml(lead.email)}.</p>
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
      `Company: ${lead.company ?? 'N/A'}`,
      `Facility type: ${lead.facilityType ?? 'N/A'}`,
      `Country: ${lead.country ?? 'N/A'}`,
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

      if (info && info.message) {
        this.logger.log(`[Offline Mail] Sent Admin Alert email structure:\n${info.message}`);
      } else {
        this.logger.log(`Admin alert email notification sent for lead ${lead.id}`);
      }
    } catch (error) {
      this.logger.error(`Failed to send lead notification email for lead ${lead.id}`, error as Error);
    }
  }

  async sendCustomerConfirmation(lead: Lead): Promise<void> {
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
                <h1 style="margin:0 0 4px;font-size:18px;color:#0f172a;">Thank you for requesting an AeOn4 pilot</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 24px;">
                <p style="margin:0 0 16px;font-size:14px;color:#334155;line-height:1.6;">
                  Hello ${escapeHtml(lead.name)},
                </p>
                <p style="margin:0 0 16px;font-size:14px;color:#334155;line-height:1.6;">
                  We have successfully received your request for an AeOn4.AI pilot for your facility (<strong>${escapeHtml(lead.facilityType ?? 'N/A')}</strong>) in <strong>${escapeHtml(lead.country ?? 'N/A')}</strong>.
                </p>
                <p style="margin:0 0 16px;font-size:14px;color:#334155;line-height:1.6;">
                  One of our systems engineers will review your telemetry requirements and reach out to you shortly to arrange a demonstration.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 24px;background:#f8fafc;border-top:1px solid #e2e8f0;">
                <p style="margin:0;font-size:12px;color:#94a3b8;">AeOn4.AI operations team, info@aeon4.ai</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

    const text = [
      `Thank you for requesting an AeOn4 pilot, ${lead.name}.`,
      '',
      `We have successfully received your request for a pilot at your ${lead.facilityType ?? 'N/A'} facility in ${lead.country ?? 'N/A'}.`,
      'One of our systems engineers will review your requirements and reach out to you shortly.',
      '',
      'AeOn4.AI operations team, info@aeon4.ai',
    ].join('\n');

    try {
      const info = await this.mailerService.sendMail({
        to: lead.email,
        subject: 'Thank you for requesting an AeOn4 pilot',
        text,
        html,
      });

      if (info && info.message) {
        this.logger.log(`[Offline Mail] Sent Customer Confirmation email structure:\n${info.message}`);
      } else {
        this.logger.log(`Customer confirmation email sent to ${lead.email}`);
      }
    } catch (error) {
      this.logger.error(`Failed to send customer confirmation email to ${lead.email}`, error as Error);
    }
  }
}

