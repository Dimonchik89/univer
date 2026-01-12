import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsPositive, Max, Min } from 'class-validator';

export class QueryDto {
  @ApiProperty({ example: '10', required: false })
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Min(1)
  @Max(999)
  @Type(() => Number)
  limit: number;

  @ApiProperty({ example: '2', required: false })
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Min(1)
  @Type(() => Number)
  page: number;
}
