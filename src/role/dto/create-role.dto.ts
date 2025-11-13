import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateRoleDto {
	@ApiProperty({ example: "Студент" })
	@IsString()
	name: string;
}
