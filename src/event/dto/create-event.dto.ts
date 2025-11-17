import { IsArray, IsDate, IsOptional, IsString, ValidateNested } from 'class-validator'
import { AcademicGroup } from '../../academic-group/entities/academic-group.entity';
import { Role } from '../../role/entities/role.entity';
import { Type } from 'class-transformer';
import { AcademicGroupForCreateMessageDto, RoleForCreateMessageDto } from '../../types/message';

export class CreateEventDto {
	@IsString()
	content: string;

	@IsString()
	title: string;

	@IsOptional()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => AcademicGroupForCreateMessageDto)
	groups: AcademicGroupForCreateMessageDto[]

	@IsOptional()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => RoleForCreateMessageDto)
	roles: RoleForCreateMessageDto[]

	@Type(() => Date)
	@IsDate()
	scheduledAt: Date
}