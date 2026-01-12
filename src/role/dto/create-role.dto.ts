import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({ example: 'Студент' })
  @IsString()
  @MaxLength(255)
  name: string;
}
