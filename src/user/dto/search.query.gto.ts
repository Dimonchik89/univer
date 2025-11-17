import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsPositive, IsString } from 'class-validator';

export class SearchQueryDto {
	@ApiProperty({ example: "q=петя", required: true })
	@IsString()
	q: string;

	@ApiProperty({ example: "page=1", required: false })
	@IsOptional()
	@IsInt()
	@IsPositive()
	@Type(() => Number)
	page: number;

	@ApiProperty({ example: "limit=10", required: false })
	@IsOptional()
	@IsInt()
	@IsPositive()
	@Type(() => Number)
	limit: number
}