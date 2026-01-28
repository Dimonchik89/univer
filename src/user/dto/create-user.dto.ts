import {
  IsArray,
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';

import { Type } from 'class-transformer';
import { RoleAssignDto } from '../../role/dto/role-assign.dto';
import { ApiProperty } from '@nestjs/swagger';
import { AcademicGroupAssign } from '../../academic-group/dto/academic-group-assign.dto';

export class CreateUserDto {
  @ApiProperty({ example: 'example@gmail.com' })
  @IsString()
  @IsEmail()
  @MaxLength(255)
  email: string;

  @ApiProperty({ example: 'password123!' })
  @IsString()
  @MinLength(6)
  @MaxLength(100)
  password: string;

  @ApiProperty({
    example:
      'VIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAp6ei9jgt8s/4+aqliA64jpoDdRppb3qNXny+6GscLl6355v3IsEl0aJntdeRv5XyF/gZe4d1FMO9vpoL2n7u4rq7uUY/IoNqlnesG01VSbof3Mee3tDmIrKkR8gXjm1DJGwmnr6CFSyrIsa8Nk2sZRX7rRCbru26cEDXCJtY4YgTjZT1hLloOjiZpbzZR7K3oeS/3nxRRe+O6oVu1oSxs6g6QBmPermzFu9sGUizFq08+WebmqVKenrK9+tZOtf7xs0VfBvNIvPXYUpZygY6d5aAJmcGTS4zgXBH1JhPk1YnuUsCY1lKWXU3E7t86w8Bf7zLMwR67Uyc42cTx6JlxQIDAQYB',
  })
  @IsString()
  @IsOptional()
  @MinLength(6)
  @MaxLength(2048)
  publicKey?: string;

  @ApiProperty({
    example: [{ id: 'roleId' }],
    required: false,
    type: [RoleAssignDto],
    description: 'Список ролей користувача',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RoleAssignDto)
  roles?: RoleAssignDto[];

  @ApiProperty({
    example: [{ id: 'пкщгзId' }],
    required: false,
    type: [AcademicGroupAssign],
    description: 'Список груп користувача',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AcademicGroupAssign)
  academic_groups?: AcademicGroupAssign[];

  @ApiProperty({ example: 'Іван', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  firstName?: string | null;

  @ApiProperty({ example: 'Іваненко', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  lastName?: string | null;

  @ApiProperty({ example: 'https://example.com/logo.jpg', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(2048)
  avatarUrl?: string | null;
}
