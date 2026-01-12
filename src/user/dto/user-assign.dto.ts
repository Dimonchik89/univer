import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class UserAssign {
  @ApiProperty({ example: '12vhfyr6352', required: false })
  @IsOptional()
  @IsUUID()
  @IsNotEmpty()
  id?: string;
}
