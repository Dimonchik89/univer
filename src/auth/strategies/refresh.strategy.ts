import { Inject } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt';
import refreshJwtConfig from '../config/refresh-jwt.config';
import { ConfigType } from '@nestjs/config';
import { Request } from 'express';
import * as argon2 from "argon2";
import { AuthService } from '../auth.service';



// export class RefreshJwtStrategy extends PassportStrategy(Strategy, "refresh-jwt") {
// 	constructor(
// 		@Inject(refreshJwtConfig.KEY) private refreshTokenConfig: ConfigType<typeof refreshJwtConfig>,
// 		private authService: AuthService
// 	) {
// 		super({
// 			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
// 			// secretOrKey: process.env.JWT_SECRET_ACCESS_KEY
// 			secretOrKey: refreshTokenConfig.secret as string,
// 			ignoreExpiration: false,
// 			passReqToCallback: true
// 		})
// 	}

// 	async validate(req: Request, payload: { id: string }) {
// 		const refresh_token = req.get("authorization").replace("Bearer", "").trim();
// 		const userId = payload.id;

// 		return await this.authService.validateRefreshToken({ userId, refreshToken: refresh_token });
// 	}
// }

const extractJwtFromCookie = (req: Request) => {
	let token = null;

	// отримуэмо токен з cookies автоматично додаванного браузером до запиту  (потрiбен cookieParser встановити та пыдклдючити в main.js)
	if(req && req.cookies) {
		token = req.cookies['refresh_token']
	}

	return token;
}

export class RefreshJwtStrategy extends PassportStrategy(Strategy, "refresh-jwt") {
	constructor(
		@Inject(refreshJwtConfig.KEY) private refreshTokenConfig: ConfigType<typeof refreshJwtConfig>,
		private authService: AuthService
	) {
		super({
			jwtFromRequest: extractJwtFromCookie,
			// secretOrKey: process.env.JWT_SECRET_ACCESS_KEY
			secretOrKey: refreshTokenConfig.secret as string,
			ignoreExpiration: false,
			passReqToCallback: true
		})
	}

	async validate(req: Request, payload: { id: string }) {
		const { refresh_token } = req.cookies;
		const userId = payload.id;

		return await this.authService.validateRefreshToken({ userId, refreshToken: refresh_token });
	}
}