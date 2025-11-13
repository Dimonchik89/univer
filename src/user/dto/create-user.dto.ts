import {
  IsArray,
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';

import { Type } from 'class-transformer';
import { RoleAssignDto } from '../../role/dto/role-assign.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
	@ApiProperty({ example: "example@gmail.com" })
	@IsString()
	@IsEmail()
	email: string;

	@ApiProperty({ example: 'password123!' })
	@IsString()
	@MinLength(6)
	password: string;

	@ApiProperty({
		example: [{ id: "roleId" }],
		required: false,
		type: [RoleAssignDto],
		description: "Список ролей користувача"
	})
	@IsOptional()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => RoleAssignDto)
	roles?: RoleAssignDto[];

	@ApiProperty({ example: 'Іван', required: false })
	@IsOptional()
	@IsString()
	firstName?: string | null;

	@ApiProperty({ example: 'Іваненко', required: false })
	@IsOptional()
	@IsString()
	lastName?: string | null;

	@ApiProperty({ example: 'https://example.com/logo.jpg', required: false })
	@IsOptional()
	@IsString()
	avatarUrl?: string | null;
}
