import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateAcademicGroupDto {
	@ApiProperty({ example: "EМ-24" })
	@IsString()
	name: string;
}
