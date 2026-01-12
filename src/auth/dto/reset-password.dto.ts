import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.f53b28e056b34a199f91.74edbb1b8b01',
  })
  @IsString()
  token: string;

  @ApiProperty({ example: 'password123!' })
  @IsString()
  @MaxLength(255)
  newPassword: string;
}
