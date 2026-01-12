import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class SearchQueryDto {
  @ApiProperty({ example: 'q=петя', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  q: string;

  @ApiProperty({
    example: 'roles=9c23824d-d0bc-4042-a899-b116fac0c145',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  @Matches(/^([0-9a-fA-F-]{36})(,[0-9a-fA-F-]{36})*$/)
  roles?: string;

  @ApiProperty({
    example: 'roles=9c23824d-d0bc-4042-a899-b116fac0c145',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  @Matches(/^([0-9a-fA-F-]{36})(,[0-9a-fA-F-]{36})*$/)
  academic_groups?: string;

  @ApiProperty({ example: 'page=1', required: false })
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Min(1)
  @Type(() => Number)
  page: number;

  @ApiProperty({ example: 'limit=10', required: false })
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  limit: number;
}
