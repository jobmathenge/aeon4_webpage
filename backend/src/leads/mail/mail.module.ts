import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailService } from './mail.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const host = config.get<string>('SMTP_HOST');
        const transport = host
          ? {
              host,
              port: config.get<number>('SMTP_PORT', 587),
              secure: config.get<string>('SMTP_SECURE', 'false') === 'true',
              auth: config.get<string>('SMTP_USER')
                ? {
                    user: config.get<string>('SMTP_USER'),
                    pass: config.get<string>('SMTP_PASS'),
                  }
                : undefined,
            }
          : { jsonTransport: true };

        return {
          transport,
          defaults: {
            from: config.get<string>('SMTP_FROM', 'AeOn4.AI <no-reply@aeon4.ai>'),
          },
        };
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
