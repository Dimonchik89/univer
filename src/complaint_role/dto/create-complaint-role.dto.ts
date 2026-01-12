import {
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { User } from '../../user/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { UserAssign } from '../../user/dto/user-assign.dto';

export class CreateComplaintRoleDto {
  @ApiProperty({ example: 'Мовний омбудсмен' })
  @IsString()
  @MinLength(2)
  @MaxLength(150)
  name: string;

  @ApiProperty({
    example: { id: '855eb656-f153-4856-aa53-eda5753b10c8' },
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => UserAssign)
  user?: UserAssign;
}
