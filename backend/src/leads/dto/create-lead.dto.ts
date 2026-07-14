import { IsEmail, IsIn, IsOptional, IsString, Length } from 'class-validator';

export class CreateLeadDto {
  @IsString()
  @Length(2, 120)
  name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  @Length(0, 160)
  company?: string;

  @IsOptional()
  @IsIn(['security', 'bms', 'iot', 'other'])
  facilityType?: string;

  @IsString()
  @Length(10, 2000)
  message: string;

  @IsOptional()
  @IsString()
  @Length(0, 80)
  country?: string;

  // Honeypot: real users never see or fill this field. Any non-empty value means a bot.
  @IsOptional()
  @IsString()
  website?: string;
}
