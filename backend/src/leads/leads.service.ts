import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { MailService } from './mail/mail.service';

@Injectable()
export class LeadsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) {}

  async create(dto: CreateLeadDto) {
    // Honeypot field: bots fill every field, humans never see `website`.
    const isBot = Boolean(dto.website);

    const lead = await this.prisma.lead.create({
      data: {
        name: dto.name,
        email: dto.email,
        company: dto.company,
        facilityType: dto.facilityType,
        message: dto.message,
        country: dto.country,
        status: isBot ? 'spam' : 'new',
      },
    });

    if (!isBot) {
      await this.mailService.sendLeadNotification(lead);
      await this.mailService.sendCustomerConfirmation(lead);
    }

    return { id: lead.id, receivedAt: lead.createdAt.toISOString() };
  }

  findAll() {
    return this.prisma.lead.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async updateStatus(id: string, status: string) {
    return this.prisma.lead.update({
      where: { id },
      data: { status },
    });
  }
}
