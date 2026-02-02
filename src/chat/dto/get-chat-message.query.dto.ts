import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class GetChatMessageQuery {
  @ApiProperty({ example: '2026-01-28T09:37:41.203Z', required: false })
  @IsOptional()
  cursor: Date | undefined;

  @ApiProperty({ example: 'before', required: false })
  @IsOptional()
  direction: 'before' | 'after' | undefined;
}
