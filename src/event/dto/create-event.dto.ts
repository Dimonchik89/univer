import { IsArray, IsDate, IsOptional, IsString, ValidateNested } from 'class-validator'
import { AcademicGroup } from '../../academic-group/entities/academic-group.entity';
import { Role } from '../../role/entities/role.entity';
import { Type } from 'class-transformer';
import { AcademicGroupForCreateMessageDto, RoleForCreateMessageDto } from '../../types/message';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEventDto {
	@ApiProperty({ example: "Заголовок повiдомлення" })
	@IsString()
	title: string;

	@ApiProperty({ example: "Текст повiдомлення" })
	@IsString()
	content: string;

	@ApiProperty({ example: "Аудиторiя 2", required: false })
	@IsOptional()
	@IsString()
	location: string;

	@ApiProperty({ example: "https://meet.google.com/", required: false })
	@IsOptional()
	@IsString()
	registrationLink: string;

	@ApiProperty({ example: [{ id: "34635f83-0f44-443f-a484-58769af7526c" }], required: false, isArray: true })
	@IsOptional()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => AcademicGroupForCreateMessageDto)
	academic_groups: AcademicGroupForCreateMessageDto[]

	@ApiProperty({ example: [{ id: "3b5cd60b-c7d4-466e-a52a-478a6c15e468" }], required: false, isArray: true })
	@IsOptional()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => RoleForCreateMessageDto)
	roles: RoleForCreateMessageDto[]

	@ApiProperty({ example: "2025-11-28T09:00:00Z" })
	@Type(() => Date)
	@IsDate()
	scheduledAt: Date
}