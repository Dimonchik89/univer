import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../user/entities/user.entity';

export class AddUserToChatDto {
  @ApiProperty({
    example: [
      { id: 'b377805b-bfd7-4e6d-a428-abf2a827112a' },
      { id: 'f283539b-5b6c-4574-aa09-e8371336f23a' },
    ],
    required: true,
  })
  users: User[];
}
