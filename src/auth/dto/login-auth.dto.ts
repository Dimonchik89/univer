import { IsEmail, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginAuthDto {
  @ApiProperty({ example: 'example@gmail.com' })
  @IsString()
  @IsEmail()
  @MaxLength(255)
  email: string;

  @ApiProperty({ example: 'password123!' })
  @IsString()
  @MaxLength(255)
  password: string;
}
