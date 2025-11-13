import { registerAs } from '@nestjs/config';
import { JwtSignOptions } from '@nestjs/jwt';
import type { StringValue } from "ms";

export default registerAs(
	"refresh-jwt",
	(): JwtSignOptions => ({
		secret: process.env.JWT_SECRET_REFRESH_KEY,
		expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN as StringValue
	})
)