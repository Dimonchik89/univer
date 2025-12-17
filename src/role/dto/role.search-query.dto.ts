import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsPositive } from 'class-validator';

export class FindAllRoleQueryDto {
  @ApiProperty({ example: 'page=1', required: false })
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  @IsOptional()
  page: number;

  @ApiProperty({ example: 'limit=10', required: false })
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  @IsOptional()
  limit: number;
}
