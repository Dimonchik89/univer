import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class QueryDto {
	@ApiProperty({ example: "10", required: false })
	@IsOptional()
	limit: string;

	@ApiProperty({ example: "2", required: false })
	@IsOptional()
	page: string
}