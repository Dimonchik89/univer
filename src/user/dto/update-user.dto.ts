import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsArray, IsEmail, IsOptional, IsString, MinLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { AcademicGroupAssign } from '../../academic-group/dto/academic-group-assign.dto';
import { ApiProperty } from '@nestjs/swagger';
import { RoleAssignDto } from '../../role/dto/role-assign.dto';

// export class UpdateUserDto extends PartialType(CreateUserDto) {
// 	@ApiProperty({
// 		example: [{ id: "roleId" }],
// 		required: false,
// 		description: "Список академічних груп користувача"
// 	})
// 	@IsOptional()
// 	@IsArray()
// 	@ValidateNested({ each: true })
// 	@Type(() => AcademicGroupAssign)
// 	academic_groups?: AcademicGroupAssign[];
// }
export class UpdateUserDto {
	@ApiProperty({ example: "example@gmail.com" })
	@IsString()
	@IsEmail()
	@IsOptional()
	email?: string;

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

	@ApiProperty({
		example: [{ id: "roleId" }],
		required: false,
		description: "Список академічних груп користувача"
	})
	@IsOptional()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => AcademicGroupAssign)
	academic_groups?: AcademicGroupAssign[];
}
