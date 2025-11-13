import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNotEmpty, IsOptional } from 'class-validator';

export class RoleAssignDto {
	@ApiProperty({ example: "asdhashdgahjksdjas", required: false })
	@IsOptional()
    @IsUUID()
    @IsNotEmpty()
    id?: string;

	@ApiProperty({ example: "student", required: false })
	@IsOptional()
	@IsNotEmpty()
	slug?: string
}