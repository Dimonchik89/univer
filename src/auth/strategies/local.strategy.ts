import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { ENTER_YOUR_PASSWORD } from '../../common/constants';

@Injectable()
export class LocaleStrategy extends PassportStrategy(Strategy) {
	constructor(private authService: AuthService) {
		super({
			usernameField: "email"
		})
	}

	async validate(email: string, password: string) {
		if(password === "") {
			throw new UnauthorizedException(ENTER_YOUR_PASSWORD);
		}
		return await this.authService.validateUser(email, password);
	}
}