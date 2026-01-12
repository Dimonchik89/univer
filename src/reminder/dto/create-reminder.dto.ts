import { ApiProperty } from '@nestjs/swagger';
import { MaxLength } from 'class-validator';

export class CreateReminderDto {
  @ApiProperty({
    example: '422cf5d1-b51f-44ce-848d-a8b9329167dc',
  })
  eventId: string;

  @ApiProperty({
    example: '2025-12-02T09:00:00Z',
  })
  reminderTime: Date;
}
