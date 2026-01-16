import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';

export class SendComplaintMessageDto {
  @ApiProperty({ example: 'example@gmail.com', required: false })
  @IsString()
  @IsEmail()
  @IsOptional()
  @MaxLength(255)
  senderEmail?: string;

  @ApiProperty({
    example: '3a9985f2-1cbd-40d0-983f-da9d24c9fbac',
    required: true,
  })
  @IsString()
  responsibleRoleId: string;

  @ApiProperty({ example: 'Lorem ipsum', required: true })
  @IsString()
  @MaxLength(2048)
  message: string;
}
