import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class FindAllQueryDto {
  @ApiProperty({ example: 'page=1', required: false })
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  @IsOptional()
  @Min(1)
  page: number;

  @ApiProperty({ example: 'limit=10', required: false })
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  @IsOptional()
  @Min(1)
  @Max(100)
  limit: number;

  @ApiProperty({ example: 'role=a7uhu7er7weesgj', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  @Matches(/^([0-9a-fA-F-]{36})(,[0-9a-fA-F-]{36})*$/)
  role: string;

  @ApiProperty({ example: 'group=uio789bhd76ghj', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  @Matches(/^([0-9a-fA-F-]{36})(,[0-9a-fA-F-]{36})*$/)
  group: string;
}
