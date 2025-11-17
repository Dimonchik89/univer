import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class FindAllQueryDto {
	@ApiProperty({ example: "page=1", required: false })
	@Type(() => Number)
	@IsInt()
	@IsPositive()
	@IsOptional()
	page: number;

	@ApiProperty({ example: "limit=10", required: false })
	@Type(() => Number)
	@IsInt()
	@IsPositive()
	@IsOptional()
	limit: number;

	@ApiProperty({ example: "role=a7uhu7er7weesgj", required: false })
	@IsOptional()
	role: string;

	@ApiProperty({ example: "group=uio789bhd76ghj", required: false })
	@IsString()
	@IsOptional()
	group: string;
}


