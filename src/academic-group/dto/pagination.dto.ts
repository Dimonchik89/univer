import { IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class PaginationDTO {
  @IsNumber()
  @IsPositive()
  @IsOptional()
  page: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  limit: string;
}
