import { PartialType } from '@nestjs/mapped-types';
import { CreateRoleDto } from './create-role.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

// export class UpdateRoleDto extends PartialType(CreateRoleDto) {}
export class UpdateRoleDto {
  @ApiProperty({ example: 'Студент' })
  @IsString()
  name: string;
}
