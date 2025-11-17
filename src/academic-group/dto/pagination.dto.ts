import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class PaginationDTO {
	@ApiProperty({ example: "page=1", required: false })
	@IsNumber()
	@IsPositive()
	@IsOptional()
	page: string;

	@ApiProperty({ example: "limit=10", required: false })
	@IsNumber()
	@IsPositive()
	@IsOptional()
	limit: string;
}
