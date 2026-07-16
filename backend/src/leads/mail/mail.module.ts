import { MailerModule } from '@nestjs-modules/mailer';
import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailService } from './mail.service';

const logger = new Logger('MailModule');

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const host = config.get<string>('SMTP_HOST');
        const from = config.get<string>('SMTP_FROM', 'AeOn4.AI <info@aeon4.ai>');

        if (host) {
          return {
            transport: {
              host,
              port: Number(config.get<number>('SMTP_PORT', 587)),
              secure: config.get<string>('SMTP_SECURE', 'false') === 'true',
              auth: config.get<string>('SMTP_USER')
                ? { user: config.get<string>('SMTP_USER'), pass: config.get<string>('SMTP_PASS') }
                : undefined,
            },
            defaults: { from },
          };
        }

        // Fast offline logging fallback to prevent blocking backend startup in dev mode
        logger.warn(
          'SMTP_HOST not set, using fast offline JSON logging transport. ' +
            'Emails will not reach a real mailbox; configure SMTP settings in .env for production.',
        );
        return {
          transport: {
            jsonTransport: true,
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

