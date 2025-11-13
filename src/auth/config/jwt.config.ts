import { registerAs } from '@nestjs/config';
import { JwtModuleOptions, JwtSignOptions } from '@nestjs/jwt';
import type { StringValue } from "ms";

export default registerAs(
	"jwt",
	(): JwtModuleOptions => ({
		secret: process.env.JWT_SECRET_ACCESS_KEY,
		signOptions: {
			expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN as StringValue
		}
	})
)