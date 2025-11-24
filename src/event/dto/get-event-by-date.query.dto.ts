import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsDateString, IsOptional, IsString } from 'class-validator';

export class GetEventByDateQueryDto {
	@ApiProperty({ example: "2025-11-21", required: false })
	@IsOptional()
	@IsString()
	@IsDateString({ strict: true, strictSeparator: true })
	date?: string;


	@ApiProperty({ example: "2025-11", required: false })
	@IsOptional()
	@IsString()
	@IsDateString({ strict: true, strictSeparator: true })
	month?: string;
}