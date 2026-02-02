import { ApiProperty } from '@nestjs/swagger';

export class SetLastReadMessageDto {
  @ApiProperty({ example: '2026-01-28T09:37:23.310Z', required: true })
  lastMessageId: string;
}
