import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import jwtConfig from '../config/jwt.config';
import { AuthJwtPayload } from '../types/auth.jwtPayload';
import { Inject, Injectable } from '@nestjs/common';
import { Request } from 'express';

// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy) {
// 	constructor(
// 		@Inject(jwtConfig.KEY) private jwtConfiguration: ConfigType<typeof jwtConfig>
// 	) {
// 		super({
// 			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
// 			// secretOrKey: process.env.JWT_SECRET_ACCESS_KEY
// 			secretOrKey: jwtConfiguration.secret as string,
// 			ignoreExpiration: false
// 		})
// 	}

// 	async validate(payload: AuthJwtPayload) {
// 		return { id: payload.id, roles: payload.roles }
// 	}
// }


const extractJwtFromCookie = (req: Request) => {
	let token = null;

	// отримуэмо токен з cookies автоматично додаванного браузером до запиту (потрiбен cookieParser встановити та пыдклдючити в main.js)
	if(req && req.cookies) {
		token = req.cookies['access_token']
	}
	return token;
}


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		@Inject(jwtConfig.KEY) private jwtConfiguration: ConfigType<typeof jwtConfig>
	) {
		super({
			jwtFromRequest: extractJwtFromCookie,
			// secretOrKey: process.env.JWT_SECRET_ACCESS_KEY
			secretOrKey: jwtConfiguration.secret as string,
			ignoreExpiration: false,
		})
	}

	async validate(payload: AuthJwtPayload) {
		return { id: payload.id, roles: payload.roles }
	}
}