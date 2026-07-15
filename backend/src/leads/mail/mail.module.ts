import { MailerModule } from '@nestjs-modules/mailer';
import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { MailService } from './mail.service';

const logger = new Logger('MailModule');

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const host = config.get<string>('SMTP_HOST');
        const from = config.get<string>('SMTP_FROM', 'AeOn4.AI <no-reply@aeon4.ai>');

        if (host) {
          return {
            transport: {
              host,
              port: config.get<number>('SMTP_PORT', 587),
              secure: config.get<string>('SMTP_SECURE', 'false') === 'true',
              auth: config.get<string>('SMTP_USER')
                ? { user: config.get<string>('SMTP_USER'), pass: config.get<string>('SMTP_PASS') }
                : undefined,
            },
            defaults: { from },
          };
        }

        // No SMTP_HOST configured — auto-provision a disposable Ethereal test inbox
        // so lead notifications still actually send over real SMTP (with a
        // shareable preview link logged per message) instead of silently no-oping.
        // Set SMTP_HOST/SMTP_USER/SMTP_PASS in .env to send to a real mailbox instead.
        const testAccount = await nodemailer.createTestAccount();
        logger.warn(
          `SMTP_HOST not set — using a disposable Ethereal test inbox (${testAccount.user}). ` +
            'Emails will NOT reach a real mailbox; set SMTP_HOST/SMTP_USER/SMTP_PASS for production.',
        );
        return {
          transport: {
            host: testAccount.smtp.host,
            port: testAccount.smtp.port,
            secure: testAccount.smtp.secure,
            auth: { user: testAccount.user, pass: testAccount.pass },
          },
          defaults: { from },
        };
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
