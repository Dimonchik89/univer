import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginAuthDto{
	@ApiProperty({ example: "example@gmail.com" })
	@IsString()
	@IsEmail()
	email: string;

	@ApiProperty({ example: 'password123!' })
	@IsString()
	password: string;
}
